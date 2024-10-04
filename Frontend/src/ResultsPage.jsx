import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import VisualizationCharts from './VisualizationCharts';

function ResultsPage() {
  const location = useLocation();
  console.log('Location State:', location.state); // Add this line
  const { results, visualizationData } = location.state || {};
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [activeTab, setActiveTab] = useState('results');

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50'; // Green for high scores
    if (score >= 60) return '#FFC107'; // Yellow for medium scores
    return '#FF5722'; // Red for low scores
  };

  const handleSendEmail = async () => {
    setShowEmailModal(false);
    try {
      const response = await fetch('http://localhost:5000/send-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: results.map(result => result.email),
          content: emailContent
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send emails');
      }

      alert('Emails sent successfully!');
    } catch (error) {
      console.error('Error sending emails:', error);
      alert('Failed to send emails. Please try again.');
    } finally {
      setEmailContent('');
    }
  };

  return (
    <div className="App">
      <div className="background-animation">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <header className="App-header">
        <h1>Resume Insight Advisor - Results</h1>
      </header>
      <main className="results-main">
        <Link to="/" className="back-button">Back to Upload</Link>
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Parsed Resumes
          </button>
          <div className="tab-separator"></div>
          <button 
            className={`tab-button ${activeTab === 'visualization' ? 'active' : ''}`}
            onClick={() => setActiveTab('visualization')}
          >
            Data Visualization
          </button>
        </div>
        
        {activeTab === 'results' && (
          <>
            <h2 className="parsed-resumes-heading">Parsed Resumes</h2>
            <button onClick={() => setShowEmailModal(true)} className="send-email-btn">
              Send Email to All
            </button>
            <div className="results-grid">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className="result-card"
                >
                  <div className="score-badge" style={{backgroundColor: getScoreColor(result.score)}}>
                    {result.score}
                  </div>
                  <h2>{result.name}</h2>
                  <p><strong>Email:</strong> {result.email}</p>
                  <p><strong>Top Keywords:</strong> {result.topKeywords.join(', ')}</p>
                  <p><strong>Skills:</strong> {result.skills.join(', ')}</p>
                  <p><strong>Education:</strong> {result.education}</p>
                  <p><strong>Years of Experience:</strong> {result.yearsOfExperience}</p>
                  <p><strong>Matched Keywords:</strong> {result.matchedKeywords.join(', ')}</p>
                  <a href={`http://localhost:5000${result.resumeLink}`} target="_blank" rel="noopener noreferrer" className="download-link">Download Resume</a>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'visualization' && (
          <VisualizationCharts 
            topSkills={visualizationData.topSkills} 
            educationLevels={visualizationData.educationLevels} 
          />
        )}
      </main>

      {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Compose Email</h2>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Enter your email content here..."
              rows="10"
            ></textarea>
            <div className="modal-buttons">
              <button onClick={handleSendEmail}>Send</button>
              <button onClick={() => setShowEmailModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsPage;
