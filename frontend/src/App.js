
import React, { useState } from "react";
import './App.css';

function VideoComponent({ videoPath, gloss }) {
  return (
    <div>
      <p>Gloss: {gloss}</p>
      <h2>Pose Video:</h2>
      <video key={videoPath} controls>
        <source src={videoPath} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

function App() {
  const [sentence, setSentence] = useState('');
  const [gloss, setGloss] = useState('');
  const [videoPath, setVideoPath] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch('/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sentence })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to process sentence');
        }
        return response.json();
      })
      .then(data => {
        setVideoPath(data.videoPath);
        setGloss(data.gloss)
        setError('');
      })
      .catch(error => {
        console.error('Error:', error);
        setVideoPath('');
        setError('Failed to process sentence. Please try again.');
      });
  };
  console.log('Component re-rendered. Video path:', videoPath);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Text to Video</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Enter a Sentence:
            <input
              type="text"
              value={sentence}
              onChange={(e) => setSentence(e.target.value)}
            />
          </label>
          <button type="submit">Process</button>
        </form>
        {error && <p className="error">{error}</p>}
        {console.log('Video path:', videoPath)}

        {videoPath && < VideoComponent videoPath={videoPath} gloss={gloss} />}
      </header>
    </div>

  );
}

export default App;
