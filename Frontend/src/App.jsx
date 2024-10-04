import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import ResultsPage from './ResultsPage';
import './App.css';

function MainApp() {
  const [file, setFile] = useState(null);
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !keywords) {
      alert('Please select a file and enter keywords');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('zipFile', file);
    formData.append('keywords', keywords);

    try {
      const response = await fetch('http://localhost:5000/parse-resumes', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      console.log('API Response:', data); // Add this line
      navigate('/results', { state: data });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing the resumes');
    } finally {
      setLoading(false);
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
        <h1>Resume Insight Advisor</h1>
        <h2>AI-Powered Resume Analysis</h2>
      </header>
      <main className="App-main">
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="zipFile">Upload ZIP file containing PDFs, DOCXs, and TXT files:</label>
              <input 
                type="file" 
                id="zipFile" 
                accept=".zip" 
                onChange={handleFileChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="keywords">Enter keywords (comma-separated):</label>
              <input 
                type="text" 
                id="keywords" 
                value={keywords} 
                onChange={handleKeywordsChange} 
                placeholder="e.g., JavaScript, React, Node.js" 
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Parse Resumes'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
