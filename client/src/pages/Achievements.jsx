import React, { useEffect, useState } from 'react';
import { Award, Star, Medal, Download, User, Trophy, Target, Sparkles, Calendar, BookOpen, Clock, AlertCircle } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    // Assuming 'user' would be available from a context or prop in a real application.
    // For this change, we'll define a placeholder user object to make the fetch call syntactically valid.
    // In a real app, you'd get this from authentication context, e.g., const { user } = useAuth();
    const user = { id: 'some_user_id' }; // Placeholder for user object

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/achievements?user_id=${user.id}`);
                const data = await res.json();
                setAchievements(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAchievements();
    }, []);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'badge': return <Star size={32} color="#f59e0b" />;
            case 'certificate': return <Medal size={32} color="#3b82f6" />;
            default: return <Award size={32} color="#dc2626" />;
        }
    };

    return (
        <div className="page-container" style={{ padding: '6rem 5%', minHeight: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h1 style={{ fontSize: '4rem', fontWeight: '900', color: 'white', marginBottom: '1.5rem', textShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                        Student Hall of Fame
                    </h1>
                    <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.7)', maxWidth: '800px', margin: '0 auto' }}>
                        Celebrating the remarkable successes and hard-earned recognitions of our talented members.
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', color: 'white', padding: '4rem' }}>
                        <div className="loading-spinner" style={{ margin: '0 auto 1.5rem', border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid white', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                        <p>Discovering talent...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
                        {achievements.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', border: '2px dashed rgba(255,255,255,0.1)' }}>
                                <Award size={64} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ color: 'white', fontSize: '1.5rem' }}>History in the Making</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)' }}>No student awards recorded yet. Excellence takes time!</p>
                            </div>
                        ) : (
                            achievements.map(item => (
                                <div key={item.id} style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{ height: '120px', background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {getTypeIcon(item.award_type)}
                                    </div>
                                    <div style={{ padding: '2rem', flexGrow: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#dc2626', letterSpacing: '1px' }}>{item.award_type}</span>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(item.achievement_date).toLocaleDateString()}</span>
                                        </div>
                                        <h3 style={{ marginBottom: '1rem', color: '#1e293b', fontSize: '1.5rem', fontWeight: '800' }}>{item.title}</h3>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', padding: '10px', background: '#f1f5f9', borderRadius: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <User size={16} color="#64748b" />
                                            </div>
                                            <span style={{ fontWeight: '700', color: '#1e293b' }}>{item.student_name || 'Alumni'}</span>
                                        </div>

                                        <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1.5rem' }}>{item.description}</p>

                                        {item.file_url && (
                                            <a href={item.file_url} target="_blank" rel="noreferrer" style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                                padding: '12px', background: '#1e293b', color: 'white', borderRadius: '12px',
                                                textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem'
                                            }}>
                                                <Download size={18} /> View Asset / Certificate
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Achievements;
