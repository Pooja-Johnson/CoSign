import React, { useState } from 'react';

function VideoScreen() {
  // State to store the URL of the selected video
  const [videoUrl, setVideoUrl] = useState('');

  // State to store the text entered by the user
  const [userText, setUserText] = useState('');

  // Function to handle changes in the text input
  const handleTextChange = (event) => {
    setUserText(event.target.value);
  };

  // Function to handle selecting a video
  const handleVideoSelect = () => {
    const sentence = userText;
    const words=sentence.split(' ');
    
    // You can implement logic here to select a video
    // For simplicity, I'm just hardcoding a YouTube video URL
    setVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  };

  return (
    <div>
      <div>
        <iframe
          width="1000"
          height="600"
          src={videoUrl}
          title="Selected Video"
          allowFullScreen
        ></iframe>
        <br />
        <textarea
          value={userText}
          onChange={handleTextChange}
          placeholder="Enter text to translate ;)"
          rows="4"
          cols="50"
        ></textarea>
        <button onClick={handleVideoSelect}>Translate</button>
      </div>
    </div>
  );
}

export default VideoScreen;
