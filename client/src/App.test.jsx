import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

const TestPage = () => (
    <div style={{ padding: '2rem' }}>
        <h1>Testing Navbar Component</h1>
        <p>If you see the ticker above, Navbar is working!</p>
    </div>
);

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="*" element={<TestPage />} />
            </Routes>
        </Router>
    );
}

export default App;
