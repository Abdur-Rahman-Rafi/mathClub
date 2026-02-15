import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, AlertCircle, Play, Trophy, Medal, Star, TrendingUp, User } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const Exams = () => {
    const [activeTab, setActiveTab] = useState('exams');
    const [exams, setExams] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user.id) {
            navigate('/login');
            return;
        }
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [examsRes, lbRes] = await Promise.all([
                fetch(`${API_BASE_URL}/exams`),
                fetch(`${API_BASE_URL}/leaderboard`)
            ]);
            const examsData = await examsRes.json();
            const lbData = await lbRes.json();
            setExams(Array.isArray(examsData) ? examsData : []);
            setLeaderboard(Array.isArray(lbData) ? lbData : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page-container" style={{ textAlign: 'center', padding: '5rem', minHeight: '80vh' }}><h2>Loading Data...</h2></div>;

    return (
        <div className="page-container" style={{ padding: '6rem 5%', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Header section with Tabs */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '1.5rem' }}>BAFSKMC Arena</h1>

                    <div style={{
                        display: 'inline-flex',
                        background: 'rgba(255,255,255,0.7)',
                        padding: '8px',
                        borderRadius: '20px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid white'
                    }}>
                        <button
                            onClick={() => setActiveTab('exams')}
                            style={{
                                padding: '12px 30px',
                                borderRadius: '14px',
                                border: 'none',
                                background: activeTab === 'exams' ? '#1e293b' : 'transparent',
                                color: activeTab === 'exams' ? 'white' : '#64748b',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <FileText size={18} /> Active Exams
                        </button>
                        <button
                            onClick={() => setActiveTab('leaderboard')}
                            style={{
                                padding: '12px 30px',
                                borderRadius: '14px',
                                border: 'none',
                                background: activeTab === 'leaderboard' ? '#d97706' : 'transparent',
                                color: activeTab === 'leaderboard' ? 'white' : '#64748b',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <Trophy size={18} /> Hall of Fame
                        </button>
                    </div>
                </div>

                {activeTab === 'exams' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
                        {exams.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                                <AlertCircle size={64} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
                                <h3 style={{ color: '#1e293b', fontSize: '1.5rem' }}>No active exams right now.</h3>
                                <p style={{ color: '#64748b' }}>Keep practicing, the next challenge is coming soon!</p>
                            </div>
                        ) : (
                            exams.map(exam => (
                                <div key={exam.id} style={{
                                    background: 'white', padding: '2.5rem', borderRadius: '30px',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
                                    transition: 'transform 0.3s ease', cursor: 'default'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-10px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                        <div style={{
                                            padding: '14px', background: exam.status === 'active' ? '#dcfce7' : '#f1f5f9',
                                            borderRadius: '20px', color: exam.status === 'active' ? '#16a34a' : '#64748b'
                                        }}>
                                            <FileText size={28} />
                                        </div>
                                        <span style={{
                                            padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '900',
                                            background: exam.status === 'active' ? '#dcfce7' : (exam.status === 'upcoming' ? '#fef9c3' : '#f1f5f9'),
                                            color: exam.status === 'active' ? '#16a34a' : (exam.status === 'upcoming' ? '#a16207' : '#64748b'),
                                            letterSpacing: '0.5px'
                                        }}>
                                            {exam.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1e293b', marginBottom: '1rem' }}>{exam.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem', lineHeight: '1.6', minHeight: '3.2rem' }}>{exam.description || 'No specific instructions provided.'}</p>

                                    <div style={{ borderTop: '2px solid #f8fafc', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '1rem', fontWeight: '700' }}>
                                            <Clock size={18} color="#3b82f6" />
                                            {exam.duration_minutes} Mins
                                        </div>
                                        <button
                                            disabled={exam.status !== 'active'}
                                            onClick={() => navigate(`/exam/${exam.id}`)}
                                            style={{
                                                padding: '12px 28px', borderRadius: '16px', border: 'none',
                                                background: exam.status === 'active' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#cbd5e1',
                                                color: 'white', fontWeight: '800', cursor: exam.status === 'active' ? 'pointer' : 'not-allowed',
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                boxShadow: exam.status === 'active' ? '0 8px 20px rgba(59, 130, 246, 0.3)' : 'none'
                                            }}
                                        >
                                            <Play size={18} fill="white" /> Enter
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        {/* Podium Section */}
                        {leaderboard.length >= 3 && (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '2rem', marginBottom: '5rem', paddingBottom: '2rem' }}>
                                {/* 2nd Place */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '4px solid #94a3b8' }}>
                                        <User size={40} color="#64748b" />
                                    </div>
                                    <div style={{ background: '#cbd5e1', padding: '1.5rem', borderRadius: '16px 16px 0 0', height: '100px', width: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#334155' }}>2nd</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leaderboard[1].name}</div>
                                    </div>
                                </div>

                                {/* 1st Place */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '100px', height: '100px', background: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem', boxShadow: '0 15px 35px rgba(217, 119, 6, 0.3)', border: '4px solid #d97706', position: 'relative' }}>
                                        <Trophy size={50} color="#d97706" />
                                        <div style={{ position: 'absolute', top: '-15px', right: '-15px', background: '#d97706', color: 'white', padding: '5px', borderRadius: '50%', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}><Star size={20} fill="white" /></div>
                                    </div>
                                    <div style={{ background: '#fef3c7', padding: '2rem', borderRadius: '20px 20px 0 0', height: '140px', width: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 10px 25px rgba(217, 119, 6, 0.15)', border: '1px solid #fde68a' }}>
                                        <div style={{ fontSize: '2rem', fontWeight: '900', color: '#92400e' }}>1st</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leaderboard[0].name}</div>
                                    </div>
                                </div>

                                {/* 3rd Place */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1rem', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '4px solid #b45309' }}>
                                        <User size={40} color="#b45309" />
                                    </div>
                                    <div style={{ background: '#ffedd5', padding: '1.5rem', borderRadius: '16px 16px 0 0', height: '80px', width: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#9a3412' }}>3rd</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leaderboard[2].name}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Leaderboard Table List */}
                        <div style={{ background: 'white', borderRadius: '30px', padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 150px', padding: '1.5rem', borderBottom: '2px solid #f1f5f9', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                <span>Rank</span>
                                <span>Student</span>
                                <span>Points</span>
                                <span>Badge/Title</span>
                            </div>

                            {leaderboard.length === 0 ? (
                                <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                                    <TrendingUp size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p>Leaderboard registration is ongoing. Check back soon!</p>
                                </div>
                            ) : (
                                leaderboard.map((entry, idx) => (
                                    <div key={entry.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px 150px', padding: '1.5rem', alignItems: 'center', borderBottom: idx === leaderboard.length - 1 ? 'none' : '1px solid #f1f5f9', transition: 'background 0.2s' }}
                                        onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                                        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <span style={{ fontSize: '1.2rem', fontWeight: '900', color: idx < 3 ? '#d97706' : '#94a3b8' }}>#{idx + 1}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <User size={20} color="#64748b" />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '800', color: '#1e293b' }}>{entry.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>@{entry.username}</div>
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: '900', color: '#10b981', fontSize: '1.1rem' }}>{entry.points} XP</span>
                                        <div>
                                            <span style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', color: '#1e293b' }}>
                                                {entry.rank_title}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Exams;
