
import React, { useState} from "react";
import './App.css';

function App() {
  const [sentence, setSentence] = useState('');
  const [processedSentence, setProcessedSentence] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sentence })
      });
      const data = await response.json();
      setProcessedSentence(data.processed_sentence);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Text to Gloss</h1>
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
        {processedSentence && (
          <div>
            <h2>Gloss Sequence:</h2>
            <p>{processedSentence.join(' ')}</p>
          </div>
        )}
      </header>
    </div>
   
  );
}

export default App;
