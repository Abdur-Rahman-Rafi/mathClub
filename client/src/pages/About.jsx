import React from 'react';
import { clubInfo } from '../data/content';

const About = () => {
    return (
        <div className="container section">
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 className="text-center" style={{ marginBottom: '2rem' }}>About Us</h1>

                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--color-secondary)' }}>Our Mission</h2>
                    <p style={{ fontSize: '1.1rem' }}>{clubInfo.mission}</p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ color: 'var(--color-primary)' }}>Our Vision</h2>
                    <p style={{ fontSize: '1.1rem' }}>{clubInfo.vision}</p>
                </div>

                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                    <h2 style={{ color: 'var(--color-accent)' }}>History</h2>
                    <p>{clubInfo.history}</p>
                </div>
            </div>
        </div>
    );
};

export default About;
