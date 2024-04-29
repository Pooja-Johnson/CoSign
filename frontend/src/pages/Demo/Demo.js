import React from 'react'
import { useState, useRef } from 'react';
import './Demo.css';
import { purple } from '@mui/material/colors';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import microPhoneIcon from '../../microphone.svg'


function VideoComponent({ videoPath, gloss }) {
  return (
    <div>
      <video key={videoPath} controls>
        <source src={videoPath} type="video/mp4" width="1000"
          height="565" title={gloss} />
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

  const commands = [
    {
      command: "open *",
      callback: (website) => {
        window.open("http://" + website.split(" ").join(""));
      },
    },
    {
      command: "change background colour to *",
      callback: (color) => {
        document.body.style.background = color;
      },
    },
    {
      command: "reset",
      callback: () => {
        handleReset();
      },
    },
    ,
    {
      command: "reset background colour",
      callback: () => {
        document.body.style.background = `rgba(0, 0, 0, 0.8)`;
      },
    },
  ];
  const { transcript, resetTranscript } = useSpeechRecognition({ commands });
  const [isListening, setIsListening] = useState(false);
  const microphoneRef = useRef(null);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return (
      <div className="mircophone-container">
        Browser does not Support Speech Recognition.
      </div>
    );
  }
  const handleListing = () => {
    setIsListening(true);
    microphoneRef.current.classList.add("listening");
    SpeechRecognition.startListening({
      continuous: true,
    });
  };
  const stopHandle = () => {
    setIsListening(false);
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
    setSentence(transcript);
    document.getElementById('custom-css-outlined-input').innerHTML = transcript;
  };
  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

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

      {!videoPath && < iframe
        margin="3"
        width="1000"
        height="565"
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
            onChange={(e) => setSentence(e.target.value)}
            value={sentence} />

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
        <div className="microphone-wrapper">
          <div className="mircophone-container">
            <div
              className="microphone-icon-container"
              ref={microphoneRef}
              onClick={handleListing}
            >
              <img src={microPhoneIcon} className="microphone-icon" />
            </div>
            <div className="microphone-status">
              {isListening ? "Listening..." : "Click to start Listening"}
              {isListening && (
                <Button className='Button' variant="contained" size='large' onClick={stopHandle}
                  sx={{
                    marginLeft: 2,
                    color: purple[700],
                    height: 40,
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: purple[700],
                      color: 'white',
                    },
                  }}>
                  Stop
                </Button>
              )}
            </div>
          </div>
          {transcript && (
            <div>
              <div className='microphone-result-text' >{transcript}</div>
              <Button className='Button' variant="contained" size='large' onClick={handleReset}
                sx={{
                  color: purple[700],
                  height: 40,
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: purple[700],
                    color: 'white',
                  },
                }}>
                Reset
              </Button>
            </div>
          )}
        </div>

      </form>

      {error && <p className="error">{error}</p>}
      {console.log('Video path:', videoPath)}

    </div>
  )
}

export default Demo