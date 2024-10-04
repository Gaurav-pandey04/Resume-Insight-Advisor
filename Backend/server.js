const express = require('express');
const cors = require('cors');
const multer = require('multer');
const AdmZip = require('adm-zip');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const docxParser = require('docx-parser');
const mammoth = require('mammoth');
const natural = require('natural');
const nlp = require('compromise');
const nodemailer = require('nodemailer');
require('dotenv').config();
const _ = require('lodash');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/zip' || file.originalname.toLowerCase().endsWith('.zip')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only ZIP files are allowed.'));
    }
  }
});

const resumeStorage = path.join(__dirname, 'resumes');

// Ensure the resume storage directory exists
if (!fs.existsSync(resumeStorage)) {
  fs.mkdirSync(resumeStorage, { recursive: true });
}

app.use('/resumes', express.static(resumeStorage));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the ATS Web App API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function parseFile(file, fileName) {
  let text = '';
  
  if (fileName.endsWith('.pdf')) {
    const pdfData = await pdfParse(file);
    text = pdfData.text;
  } else if (fileName.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer: file });
    text = result.value;
  } else if (fileName.endsWith('.txt')) {
    text = file.toString('utf8');
  } else {
    throw new Error('Unsupported file format');
  }

  return text;
}

function analyzeResume(text, jobKeywords) {
  // Convert text to lowercase for easier processing
  const lowerText = text.toLowerCase();

  // Use compromise for named entity recognition
  const doc = nlp(text);
  const names = doc.people().out('array');
  const name = names.length > 0 ? names[0] : 'N/A';

  // Extract email using regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = lowerText.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : 'N/A';

  // Use natural for keyword extraction
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();
  tfidf.addDocument(lowerText);
  const extractedKeywords = tfidf.listTerms(0).slice(0, 10).map(item => item.term);

  // Basic skill detection
  const skills = ['javascript', 'python', 'java', 'c++', 'react', 'node.js', 'sql', 'machine learning'];
  const detectedSkills = skills.filter(skill => lowerText.includes(skill));

  // Basic education detection
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree'];
  const education = educationKeywords.some(keyword => lowerText.includes(keyword)) ? 'Higher Education Detected' : 'No Higher Education Detected';

  // Basic experience calculation
  const experienceMatch = lowerText.match(/(\d+)\s*(?:year|yr)s?\s*(?:of)?\s*experience/);
  const yearsOfExperience = experienceMatch ? parseInt(experienceMatch[1]) : 'Not specified';

  // Calculate score based on various factors
  let score = 0;
  
  // Score based on matched keywords
  const matchedKeywords = jobKeywords.filter(keyword => lowerText.includes(keyword.toLowerCase()));
  score += matchedKeywords.length * 10;

  // Score based on education
  if (education.toLowerCase().includes('phd')) score += 30;
  else if (education.toLowerCase().includes('master')) score += 20;
  else if (education.toLowerCase().includes('bachelor')) score += 10;

  // Score based on years of experience
  if (typeof yearsOfExperience === 'number') {
    score += Math.min(yearsOfExperience * 5, 50); // Cap at 50 points
  }

  // Score based on skills
  score += detectedSkills.length * 5;

  // Normalize score to be out of 100
  score = Math.min(Math.round(score), 100);

  return {
    name,
    email,
    topKeywords: extractedKeywords,
    skills: detectedSkills,
    education,
    yearsOfExperience,
    score,
    matchedKeywords
  };
}

app.post('/parse-resumes', upload.single('zipFile'), async (req, res) => {
  try {
    const zipFile = req.file;
    const keywords = req.body.keywords.split(',').map(k => k.trim().toLowerCase());

    const zip = new AdmZip(zipFile.path);
    const zipEntries = zip.getEntries();

    const results = [];
    const skillsCount = {};
    const educationLevels = {};

    for (const entry of zipEntries) {
      if (entry.entryName.endsWith('.pdf') || entry.entryName.endsWith('.docx') || entry.entryName.endsWith('.txt')) {
        const fileContent = zip.readFile(entry);
        try {
          const text = await parseFile(fileContent, entry.entryName);
          const lowerCaseText = text.toLowerCase();

          const matchedKeywords = keywords.filter(keyword => lowerCaseText.includes(keyword));

          if (matchedKeywords.length > 0) {
            const analysis = analyzeResume(text, keywords);

            // Count skills
            analysis.skills.forEach(skill => {
              skillsCount[skill] = (skillsCount[skill] || 0) + 1;
            });

            // Count education levels
            educationLevels[analysis.education] = (educationLevels[analysis.education] || 0) + 1;

            // Save the file
            const fileName = `${Date.now()}_${entry.entryName}`;
            const filePath = path.join(resumeStorage, fileName);
            fs.writeFileSync(filePath, fileContent);

            results.push({
              ...analysis,
              matchedKeywords,
              resumeLink: `/resumes/${fileName}`
            });
          }
        } catch (error) {
          console.error(`Error processing ${entry.entryName}:`, error);
          // We're not adding errored files to the results
        }
      }
    }

    // Sort results by score in descending order
    results.sort((a, b) => b.score - a.score);

    // Get top 10 skills
    const topSkills = Object.entries(skillsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    // Prepare education data
    const educationData = Object.entries(educationLevels)
      .map(([level, count]) => ({ level, count }));

    res.json({
      results,
      visualizationData: {
        topSkills,
        educationLevels: educationData
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the resumes' });
  }
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-emails', async (req, res) => {
  const { emails, content } = req.body;

  try {
    for (const email of emails) {
      await transporter.sendMail({
        from: `"Your ATS System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Response to Your Application',
        text: content,
      });
    }
    res.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

// ... (keep existing routes and server setup code)