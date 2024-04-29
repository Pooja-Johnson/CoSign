import './App.css';
import Homepage from './pages/Homepage/Homepage';
import Demo from './pages/Demo/Demo';
import { BrowserRouter, Route, Routes } from "react-router-dom";

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
          <Route path='/' element={<Homepage />} />
          <Route path='/demo' element={<Demo />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
