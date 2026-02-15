import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../apiConfig';

const Payment = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        student_name: '',
        roll: '',
        event_name: 'General Fund',
        amount: '',
        network: 'bKash',
        transaction_id: '',
        membership_id: ''
    });
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            // Auto-fill some data
            setFormData(prev => ({
                ...prev,
                student_name: storedUser.name,
                roll: storedUser.class_roll || '',
                // If we had membership_id in user update, we'd add it here
            }));
            fetchHistory(storedUser.id);
        }
    }, []);

    const fetchHistory = async (userId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/payments/student/${userId}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setHistory(data);
            }
        } catch (err) {
            console.error("Failed to fetch history", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setMessage('Please login first.');
            return;
        }

        const payload = {
            ...formData,
            user_id: user.id
        };

        try {
            const res = await fetch(`${API_BASE_URL}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                setMessage('Payment submitted! Refreshing history...');
                setFormData(prev => ({ ...prev, transaction_id: '', amount: '' }));
                setTimeout(() => {
                    setMessage('');
                    fetchHistory(user.id);
                }, 2000);
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (err) {
            setMessage('Network error.');
        }
    };

    const inputStyle = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '1rem' };
    const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' };

    return (
        <div className="container section">
            <h2 className="text-center" style={{ marginBottom: '2rem', color: 'var(--color-primary)' }}>Make a Payment</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                {/* Form Section */}
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    {message && (
                        <div style={{
                            padding: '12px 20px',
                            backgroundColor: message.includes('Error') ? '#fee2e2' : '#dcfce7',
                            color: message.includes('Error') ? '#991b1b' : '#166534',
                            marginBottom: '1.5rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            borderLeft: `5px solid ${message.includes('Error') ? '#ef4444' : '#22c55e'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            {message.includes('Error') ? '❌' : '✅'} {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* ... existing form fields ... */}
                        <label style={labelStyle}>Student Name</label>
                        <input name="student_name" value={formData.student_name} onChange={handleChange} required style={inputStyle} />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Class Roll</label>
                                <input name="roll" value={formData.roll} onChange={handleChange} required style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Membership ID (Optional)</label>
                                <input name="membership_id" value={formData.membership_id} onChange={handleChange} style={inputStyle} placeholder="If applicable" />
                            </div>
                        </div>

                        <label style={labelStyle}>Event / Purpose</label>
                        <select name="event_name" value={formData.event_name} onChange={handleChange} style={inputStyle}>
                            <option value="General Fund">General Fund</option>
                            <option value="Membership Fee">Membership Fee</option>
                            <option value="Math Olympiad 2024">Math Olympiad 2024</option>
                            <option value="Workshop Registration">Workshop Registration</option>
                            <option value="Other">Other</option>
                        </select>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Amount (BDT)</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} required style={inputStyle} placeholder="500" />
                            </div>
                            <div>
                                <label style={labelStyle}>Payment Method</label>
                                <select name="network" value={formData.network} onChange={handleChange} style={inputStyle}>
                                    <option value="bKash">bKash</option>
                                    <option value="Nagad">Nagad</option>
                                    <option value="Rocket">Rocket</option>
                                </select>
                            </div>
                        </div>

                        <label style={labelStyle}>Transaction ID (TrxID)</label>
                        <input name="transaction_id" value={formData.transaction_id} onChange={handleChange} required style={inputStyle} placeholder="8JSD83K..." />

                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Payment & Notify Admin</button>
                    </form>
                </div>

                {/* History Section */}
                <div>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        📊 Your Payment History
                    </h3>
                    {history.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
                            <p style={{ color: '#64748b', margin: 0 }}>No payments registered yet.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {history.map((pay) => (
                                <div key={pay.id} style={{
                                    backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: `6px solid ${pay.status === 'verified' ? '#10b981' : '#f59e0b'}`,
                                    transition: 'transform 0.2s'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1e293b' }}>{pay.event_display_name || pay.event_name}</span>
                                        <span style={{ fontWeight: '800', color: 'var(--color-primary)' }}>{parseFloat(pay.amount).toFixed(2)} BDT</span>
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#64748b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>TrxID: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{pay.transaction_id}</code></span>
                                        <span style={{
                                            textTransform: 'uppercase', fontSize: '0.7rem', padding: '4px 10px', borderRadius: '20px',
                                            fontWeight: '800',
                                            backgroundColor: pay.status === 'verified' ? '#dcfce7' : '#fef3c7',
                                            color: pay.status === 'verified' ? '#166534' : '#92400e'
                                        }}>
                                            {pay.status}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>{pay.payment_method}</span>
                                        <span>{new Date(pay.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Payment;
