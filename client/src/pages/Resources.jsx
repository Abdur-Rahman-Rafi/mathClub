import React from 'react';

const Resources = () => {
    return (
        <div className="container section">
            <h1 className="text-center" style={{ marginBottom: '1rem' }}>Learning Resources</h1>
            <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto 3rem', color: 'var(--color-text-light)' }}>
                Access our curated collection of problem sets, lecture notes, and recommended reading to sharpen your mathematical prowess.
            </p>

            <div style={{ display: 'grid', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>

                <div className="resource-category">
                    <h3 style={{ borderBottom: '2px solid var(--color-secondary)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Problem Sets</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {[
                            { title: 'Algebra Problem Set 1', level: 'Beginner' },
                            { title: 'Geometry Classics', level: 'Intermediate' },
                            { title: 'Number Theory Basics', level: 'Beginner' }
                        ].map((item, index) => (
                            <div key={index} style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', display: 'block' }}>{item.title}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#666', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{item.level}</span>
                                </div>
                                <button style={{ color: 'var(--color-primary)', background: 'none', border: '1px solid var(--color-primary)', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>Download</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="resource-category">
                    <h3 style={{ borderBottom: '2px solid var(--color-accent)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Past Papers</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ fontWeight: 'bold', display: 'block' }}>Intra-College Olympiad 2023</span>
                                <span style={{ fontSize: '0.8rem', color: '#666', backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' }}>All Categories</span>
                            </div>
                            <button style={{ color: 'var(--color-primary)', background: 'none', border: '1px solid var(--color-primary)', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>Download</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Resources;
