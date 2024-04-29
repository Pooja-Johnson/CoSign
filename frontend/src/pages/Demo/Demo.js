import React from 'react'
import { useState } from 'react';
import './Demo.css';
import { purple } from '@mui/material/colors';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';


function VideoComponent({ videoPath, gloss }) {
  return (
    <div>
      <video key={videoPath} controls>
        <source src={videoPath} type="video/mp4" width="1000"
          height="600" title={gloss} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#FFFFFF',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#FFFFFF',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#FFFFFF',
    },
    '&:hover fieldset': {
      borderColor: '#FFFFFF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFFFFF',
    },
  },
});

const Demo = () => {
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
    <div className='demo-main'>
    
      {/* <header className="App-header"> */}
      {/* <h1 className='landing-header'>CoSign</h1> */}
      <br/> 
      {!videoPath && < iframe
        margin="3"
        width="1000"
        height="600"
        src={videoPath}
        title="Selected Video"
        allowFullScreen
      ></iframe>}

      {videoPath && < VideoComponent videoPath={videoPath} gloss={gloss} />}

      {/* <h1 className='heading-demo'>Enter text to be converted</h1> */}
      <form onSubmit={handleSubmit}>
        <div className='demo-row'>
          {/* <p className='explain-demo'>Input: </p> */}

          <CssTextField label="Enter text to translate :)"
            id="custom-css-outlined-input"
            sx={{ margin: 2, width: 800 }}
            onChange={(e) => setSentence(e.target.value)} />

          <Button type='submit' className='Button' variant="contained" size='large'
            sx={{
              margin: 2,
              color: purple[700],
              height: 55,
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: purple[700],
                color: 'white',
              },
            }}>
            Explore
          </Button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      {console.log('Video path:', videoPath)}
       
      {/* </header> */}
    </div>
  )
}

export default Demo