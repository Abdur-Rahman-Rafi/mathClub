import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [devLink, setDevLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        setDevLink('');
        try {
            const res = await fetch('http://localhost:8000/auth/forgot_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setStatus(data.message);
                if (data.dev_link) setDevLink(data.dev_link);
            } else {
                setStatus(data.message || 'Error occurred.');
            }
        } catch (err) {
            setStatus('Network error.');
        }
    };

    return (
        <div className="container section" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <h2 className="text-center" style={{ marginBottom: '1.5rem' }}>Forgot Password</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
                <p style={{ marginBottom: '1.5rem', color: '#666' }}>Enter your email address and we'll send you a link to reset your password.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
                    />
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px' }}>Send Reset Link</button>
                </form>
                {status && <div style={{ marginTop: '1rem', padding: '10px', backgroundColor: '#f0f9ff', color: '#0369a1', borderRadius: '4px', fontSize: '0.9rem' }}>{status}</div>}
                {devLink && (
                    <div style={{ marginTop: '1rem', wordBreak: 'break-all', fontSize: '0.8rem', color: '#dc2626' }}>
                        <strong>[Dev Only]</strong> Local link: <a href={devLink}>{devLink}</a>
                    </div>
                )}
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link to="/login" style={{ color: 'var(--color-primary)', fontSize: '0.9rem' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
