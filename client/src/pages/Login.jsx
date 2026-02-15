import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Call PHP Login API
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const text = await res.text();
            try {
                const data = JSON.parse(text);
                if (res.ok) {
                    alert('Login Successful!');
                    // Save user to context/localstorage
                    localStorage.setItem('user', JSON.stringify(data.user));
                    navigate('/');
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (error) {
                console.error("Server Response:", text);
                alert('Server Error: ' + text.substring(0, 100));
            }

        } catch (err) {
            console.error(err);
            alert(`Network Error: ${err.message}. Ensure MySQL is running.`);
        }
    };

    return (
        <div className="container section" style={{ maxWidth: '400px' }}>
            <h2 className="text-center" style={{ marginBottom: '1.5rem' }}>Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>
                <button type="submit" className="btn-primary" style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '12px', borderRadius: '4px', border: 'none' }}>
                    Login
                </button>
                <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                    <Link to="/forgot-password" style={{ color: 'var(--color-text-light)' }}>Forgot Password?</Link>
                </div>
            </form>
            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--color-secondary)' }}>Register here</Link>
            </p>
        </div>
    );
};

export default Login;
