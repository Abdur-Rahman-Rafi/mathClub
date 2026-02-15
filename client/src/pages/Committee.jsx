import React, { useEffect, useState } from 'react';

const Committee = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/committee.php')
            .then(res => res.json())
            .then(data => setMembers(Array.isArray(data) ? data : []))
            .catch(() => setMembers([
                { id: 1, name: 'Taimur Shahriar', role: 'President', image_url: 'https://placehold.co/300x300', bio: 'Math enthusiast and Olympiad winner.' },
                { id: 2, name: 'Sadia Islam', role: 'Vice President', image_url: 'https://placehold.co/300x300', bio: 'Passionate about geometry and teaching.' },
                { id: 3, name: 'Rahim Khan', role: 'General Secretary', image_url: 'https://placehold.co/300x300', bio: 'Organizer of the annual Math Fair.' }
            ]));
    }, []);

    return (
        <div className="container section">
            <h1 className="text-center" style={{ marginBottom: '1rem' }}>Executive Committee</h1>
            <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto 3rem', color: 'var(--color-text-light)' }}>
                The brilliant minds leading the BAFSKMC Math Club towards excellence.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {members.map(member => (
                    <div key={member.id} style={{ textAlign: 'center', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                        <img
                            src={member.image_url || 'https://placehold.co/300x300'}
                            alt={member.name}
                            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem', border: '3px solid var(--color-primary)' }}
                        />
                        <h3 style={{ color: 'var(--color-primary)' }}>{member.name}</h3>
                        <div style={{ color: 'var(--color-accent)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{member.role}</div>
                        <p style={{ fontSize: '0.9rem' }}>{member.bio}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Committee;
