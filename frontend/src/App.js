import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import BarberBooking from './BarberBooking.js';
import Register from './Register';
import CustomerBooking from './CustomerBooking';
import Home from './Home.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/customerBooking" element={<CustomerBooking/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/barberBooking" element={<BarberBooking/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
    </Router>
  );
}

export default App;
