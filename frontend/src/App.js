import './App.css';
import Homepage from './pages/Homepage/Homepage';
import Demo from './pages/Demo/Demo';
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <Link to="/">ABOUT</Link>
          <Link to="/demo">FEATURES</Link>
          <Link to="/demo">EXPLORE</Link>
        </nav>
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/demo' element={<Demo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
