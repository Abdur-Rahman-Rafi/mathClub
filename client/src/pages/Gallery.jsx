import React from 'react';

const Gallery = () => {
    // Gallery data with captions
    const galleryItems = [
        { src: 'https://placehold.co/400x300?text=Math+Olympiad+2024', caption: 'Regional Math Olympiad 2024 Winners' },
        { src: 'https://placehold.co/400x300?text=Pi+Day', caption: 'Pi Day Celebration - Pie Eating Contest' },
        { src: 'https://placehold.co/400x300?text=Workshop', caption: 'Graph Theory Workshop with guest speaker' },
        { src: 'https://placehold.co/400x300?text=Prize+Giving', caption: 'Annual Prize Giving Ceremony' },
        { src: 'https://placehold.co/400x300?text=Team+Photo', caption: 'Executive Committee 2024' },
        { src: 'https://placehold.co/400x300?text=Seminar', caption: 'Seminar on "The Beauty of Calculus"' }
    ];

    return (
        <div className="container section">
            <h1 className="text-center" style={{ marginBottom: '1rem' }}>Photo Gallery</h1>
            <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto 3rem', color: 'var(--color-text-light)' }}>
                Capturing moments from our events, workshops, and celebrations.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {galleryItems.map((item, idx) => (
                    <div key={idx} style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-md)',
                        backgroundColor: 'white',
                        transition: 'transform 0.3s ease'
                    }}
                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <img src={item.src} alt={item.caption} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                        <div style={{ padding: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0, fontWeight: 500 }}>{item.caption}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
