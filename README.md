# Resume Insight Advisor

Resume Insight Advisor is an AI-powered resume parsing and analysis tool built with React and Node.js. It helps recruiters and hiring managers quickly process multiple resumes, extract key information, and visualize data from parsed resumes.

## Features

- Parse multiple resumes in PDF, DOCX, and TXT formats
- Extract key information such as name, email, skills, education, and experience
- Score candidates based on parsed information and job requirements
- Visualize data from parsed resumes (top skills and education levels)
- Send bulk emails to candidates
- Responsive design for use on various devices

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express.js
- Data Visualization: Chart.js
- PDF Parsing: pdf-parse
- DOCX Parsing: mammoth
- Natural Language Processing: compromise, natural
- Styling: CSS3 with Flexbox and Grid

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/resume-insight-advisor.git
   ```

2. Navigate to the project directory:
   ```
   cd resume-insight-advisor
   ```

3. Install backend dependencies:
   ```
   cd Backend
   npm install
   ```

4. Install frontend dependencies:
   ```
   cd ../Frontend
   npm install
   ```

## Configuration

1. In the `Backend` directory, create a `.env` file with the following content:
   ```
   PORT=5000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```
   Replace `your-email@gmail.com` and `your-email-password` with your actual Gmail credentials.

2. If you're using Gmail, you might need to enable "Less secure app access" in your Google Account settings, or use an "App Password" if you have 2-factor authentication enabled.

## Usage

1. Start the backend server:
   ```
   cd Backend
   node server.js
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd Frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to use the application.

## How to Use

1. On the home page, upload a ZIP file containing resumes (PDF, DOCX, or TXT formats).
2. Enter keywords relevant to the job position.
3. Click "Parse Resumes" to process the files.
4. View the results, including parsed information and candidate scores.
5. Use the "Data Visualization" tab to see charts of top skills and education levels.
6. Use the "Send Email to All" button to send bulk emails to candidates.

## Contributing

Contributions to Resume Insight Advisor are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## License

This project uses the following license: [MIT License](https://opensource.org/licenses/MIT).

## Contact

If you want to contact me, you can reach me at <your-email@example.com>.

## Acknowledgements

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Chart.js](https://www.chartjs.org/)
- [pdf-parse](https://www.npmjs.com/package/pdf-parse)
- [mammoth](https://www.npmjs.com/package/mammoth)
- [compromise](https://github.com/spencermountain/compromise)
- [natural](https://github.com/NaturalNode/natural)
