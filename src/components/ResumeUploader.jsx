import { useState } from 'react';
import axios from 'axios';
import './ResumeUploader.css';  // Correct path for importing the CSS file from the same folder

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [score, setScore] = useState(0);

  const keywords = ['React', 'JavaScript', 'Node.js', 'HTML', 'CSS', 'MongoDB'];

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a resume file");

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExtractedText(res.data.extractedText);
      calculateScore(res.data.extractedText);
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    }
  };

  const calculateScore = (text) => {
    let score = 0;

    keywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        score += 10;
      }
    });

    setScore(score);
  };

  return (
    <div className="container">
      <h2>Upload Your Resume</h2>
      <input 
        type="file" 
        accept=".pdf,.docx" 
        className="input-file" 
        onChange={handleFileChange} 
      />
      <button
        onClick={handleUpload}
        className="button-upload"
      >
        Upload
      </button>

      {extractedText && (
        <div className="extracted-text">
          <h3>Extracted Text:</h3>
          <pre>{extractedText}</pre>
        </div>
      )}

      {score > 0 && (
        <div className="score-section">
          <h3>Resume Score:</h3>
          <p>Your resume scored {score} out of {keywords.length * 10} based on keyword relevance.</p>
        </div>
      )}
    </div>
  );
}
