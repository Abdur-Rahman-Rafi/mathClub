import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/api/contact.php', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setStatus('Message sent successfully!');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('Failed to send message.');
            }
        } catch (error) {
            setStatus('Error sending message.');
        }
    };

    return (
        <div className="container section">
            <h1 className="text-center" style={{ marginBottom: '2rem' }}>Contact Us</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
                <div>
                    <h3 style={{ marginBottom: '1rem' }}>Get in Touch</h3>
                    <p style={{ marginBottom: '2rem' }}>Have questions about the Math Club or want to join? Send us a message or visit us at the college campus.</p>

                    <div style={{ marginBottom: '1rem' }}>
                        <strong>Address:</strong><br />
                        BAF Shaheen College Kurmitola,<br />
                        Dhaka Cantonment, Dhaka-1206
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <strong>Email:</strong><br />
                        info@bafskmcmathclub.com
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                        <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required style={inputStyle} />
                        <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} style={inputStyle} />
                        <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required rows="5" style={inputStyle}></textarea>
                        <button type="submit" className="btn-primary" style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '12px', borderRadius: '4px', border: 'none', fontWeight: 'bold' }}>Send Message</button>
                        {status && <p className="text-center" style={{ marginTop: '1rem', color: status.includes('Success') ? 'green' : 'red' }}>{status}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem'
};

export default Contact;
