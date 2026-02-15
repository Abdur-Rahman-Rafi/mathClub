import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Activities from './pages/Activities';
import Login from './pages/Login';
import Register from './pages/Register';
import Payment from './pages/Payment';
import Achievements from './pages/Achievements';
import Committee from './pages/Committee';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import Gallery from './pages/Gallery';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Alumni from './pages/Alumni';
import News from './pages/News';
import Exams from './pages/Exams';
import ExamPortal from './pages/ExamPortal';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/news/:id" element={<News />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/exam/:id" element={<ExamPortal />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
