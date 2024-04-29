import './App.css';
import Homepage from './pages/Homepage/Homepage';
import Demo from './pages/Demo/Demo';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import VideoScreen from '../../../Video/VideoScreen';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <nav>
            <ul>
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/employee">Employee</Link></li>
              <li><Link to="/customer">Customer</Link></li>
            </ul>
          </nav> */}
        <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/demo' element={<Demo/>}/>
        <Route path='/video' element={<VideoScreen/>}/>
        </Routes>
      </BrowserRouter>
      {/* <header className="App-header">
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
      </header> */}
    </div>

  );
}

export default App;
