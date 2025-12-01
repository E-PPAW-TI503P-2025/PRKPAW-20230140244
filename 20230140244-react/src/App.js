import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import ReportPage from './components/ReportPage';
import AttendancePage from './components/PresensiPage';
import Navbar from './components/Navbar'; // <-- Import Navbar

function App() {
  return (
    <Router>
      <div>
        {/* Hapus navigasi lama jika ada, dan ganti dengan Navbar */}
        {/* <nav className="p-4 bg-gray-100">
          <Link to="/login" className="mr-4">Login</Link>
          <Link to="/register">Register</Link>
        </nav> */}
        
        {/* Tampilkan Navbar di luar Routes */}
        <Navbar /> 
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/" element={<LoginPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}
export default App;