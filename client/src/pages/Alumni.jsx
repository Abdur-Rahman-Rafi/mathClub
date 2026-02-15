import React, { useEffect, useState } from 'react';
import { Users, Mail, MapPin, Award, GraduationCap, Github, Linkedin, ExternalLink } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const Alumni = () => {
    const [alumni, setAlumni] = useState([]);

    useEffect(() => {
        const fetchAlumni = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/committee`);
                const data = await response.json();
                setAlumni(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAlumni();
    }, []);

    return (
        <div className="container section">
            <h1 className="text-center" style={{ marginBottom: '1rem' }}>Our Alumni</h1>
            <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto 3rem', color: 'var(--color-text-light)' }}>
                Celebrating the brilliant minds who laid the foundation of BAFSKMC Math Club.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                {alumni.map((alum, idx) => (
                    <div key={idx} style={{
                        backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', paddingBottom: '1.5rem',
                        transition: 'transform 0.3s, box-shadow 0.3s'
                    }}
                        onMouseOver={e => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                        }}
                    >
                        <div style={{ height: '120px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}></div>
                        <img src={alum.image_url || alum.img} alt={alum.name} style={{
                            width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover',
                            border: '5px solid white', marginTop: '-60px', marginBottom: '1rem',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                        }} />
                        <h3 style={{ marginBottom: '0.3rem', fontSize: '1.3rem' }}>{alum.name}</h3>
                        <p style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            {alum.role} (Batch {alum.batch})
                        </p>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', padding: '0 1rem' }}>
                            <strong>{alum.current_position}</strong><br />
                            {alum.institution}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Alumni;
