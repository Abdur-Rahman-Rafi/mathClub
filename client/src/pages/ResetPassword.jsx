import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus("Passwords do not match!");
            return;
        }

        try {
            const res = await fetch('http://localhost:8000/auth/reset_password.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, new_password: password }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Password reset successful! Please login.");
                navigate('/login');
            } else {
                setStatus(data.message || 'Error occurred.');
            }
        } catch (err) {
            setStatus('Network error.');
        }
    };

    if (!token) {
        return (
            <div className="container section text-center" style={{ marginTop: '4rem' }}>
                <h3>Invalid Request</h3>
                <p>Missing reset token.</p>
                <Link to="/login">Go to Login</Link>
            </div>
        );
    }

    return (
        <div className="container section" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <h2 className="text-center" style={{ marginBottom: '1.5rem' }}>Reset Password</h2>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' }}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '10px' }}>Reset Password</button>
                </form>
                {status && <div style={{ marginTop: '1rem', padding: '10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '0.9rem' }}>{status}</div>}
            </div>
        </div>
    );
};

export default ResetPassword;
