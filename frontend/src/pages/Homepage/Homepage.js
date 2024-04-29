import React from 'react'
import './Homepage.css'
import Button from '@mui/material/Button';
import SignLanguage from '@mui/icons-material/SignLanguage'
import { purple } from '@mui/material/colors';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const Homepage = () => {

  const navigate = useNavigate()
  const gotToNewPage = () => {
    navigate("/demo");
  }

  return (
    <div>
      <div className='landing_main_page'>
        <h1 className='landing-header'>CoSign</h1>
        <span className='heading'>CoSign </span>
        <p className='heading-caption'>Bridging Words to Motion. Transforming Text into Sign Language</p>
        {/* <p className='cap2'>CoSign effortlessly translates your thoughts into expressive sign language, enabling seamless communication with loved ones and peers.</p> */}
        <Button className='Button' onClick={() => gotToNewPage()} variant="contained" size='large' endIcon={<SignLanguage />}
          sx={{
            margin: 25,
            height: 50,
            width: 300,
            backgroundColor: purple[400],
            '&:hover': {
              backgroundColor: purple[700],
            },
          }}>
          Explore
        </Button>
      </div>
      {/* <button> Explore </button> */}
      <div className='second-part'>
        <p className='explain'>Whether you're sending a message, sharing a story, or engaging in conversation, CoSign ensures your words are understood and embraced by all.</p>
        <div className='card-container'>
          <Card
            sx={{
              maxWidth: 345, margin: 4,
            }}>
            <CardActionArea>
              <CardMedia
                sx={{ height: 300 }}
                component="img"
                height="140"
                src="./static/isl.jpg"
                alt="ISL"
              />

              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  English to ISL
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Convert english text to ISLRTC approved Indian Sign Language (ISL)
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              maxWidth: 345, margin: 4,
            }}>
            <CardActionArea>
              {/* <CardMedia
          component="img"
          height="140"
          image="/static/
          alt="green iguana"
        /> */}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Audio and Text input
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CoSign accepts your audio and textual input to be converted
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card
            sx={{
              maxWidth: 345, margin: 4
            }}>
            <CardActionArea>
              {/* <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
        /> */}
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  You have the control
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  CoSign gives the user the sign language video playback controls
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>

      </div>
      <footer className="footer">
        <h1 className="landing-header">CoSign </h1>
        <p className='footer-text'>Made with love by Group A10, CSA 2024</p>
      </footer>
    </div>
  )
}

export default Homepage