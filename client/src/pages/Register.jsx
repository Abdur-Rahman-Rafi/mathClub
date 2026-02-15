import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../apiConfig';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        class_roll: '',
        section: '',
        class_year: '',
        institution: 'BAF Shaheen College Kurmitola',
        address: '',
        mobile: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const text = await res.text();
            try {
                const data = JSON.parse(text);
                if (res.ok) {
                    alert('Registration Successful! Please Login.');
                    navigate('/login');
                } else {
                    setError(data.message || 'Registration failed');
                }
            } catch (jsonError) {
                console.error("Server response:", text);
                setError(`Server Error: ${text.substring(0, 100)}...`);
            }

        } catch (err) {
            console.error(err);
            setError(`Network Error: ${err.message}. Ensure MySQL is running.`);
        }
    };

    return (
        <div className="container section" style={{ maxWidth: '600px', marginTop: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
                <h2 className="text-center" style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Join the Club</h2>

                {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Class Roll</label>
                        <input type="text" name="class_roll" value={formData.class_roll} onChange={handleChange} style={inputStyle} placeholder="e.g. 1234" />
                    </div>

                    <div>
                        <label style={labelStyle}>Section</label>
                        <input type="text" name="section" value={formData.section} onChange={handleChange} style={inputStyle} placeholder="e.g. A, B, Science" />
                    </div>

                    <div>
                        <label style={labelStyle}>Class / Year</label>
                        <input type="text" name="class_year" value={formData.class_year} onChange={handleChange} style={inputStyle} placeholder="e.g. XI, XII" />
                    </div>

                    <div>
                        <label style={labelStyle}>Mobile No</label>
                        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} style={inputStyle} placeholder="017..." />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Institution</label>
                        <input type="text" name="institution" value={formData.institution} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Address</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} style={{ ...inputStyle, height: '80px' }} placeholder="Present Address"></textarea>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} />
                    </div>

                    <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', backgroundColor: 'var(--color-primary)', color: 'white', padding: '12px', borderRadius: '4px', border: 'none', fontWeight: 'bold', marginTop: '1rem' }}>
                        Register Now
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

const labelStyle = { display: 'block', marginBottom: '0.4rem', fontWeight: '500', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' };

export default Register;
