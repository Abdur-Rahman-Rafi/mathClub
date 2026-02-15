import React, { useState, useEffect } from 'react';
import { User, BookOpen, Trophy, Clock, Medal, Star, LogOut, ChevronRight, Settings } from 'lucide-react';
import API_BASE_URL from '../apiConfig';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [msg, setMsg] = useState('');
    const [stats, setStats] = useState({
        events: 0,
        payments: 0,
        achievements: 0
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.role === 'admin') {
                    // Admin users should not see student dashboard
                    window.location.href = '/admin';
                } else {
                    fetchProfile(parsed.id);
                    fetchStats(parsed.id);
                }
            } catch (e) {
                window.location.href = '/login';
            }
        } else {
            window.location.href = '/login';
        }
    }, []);

    const fetchProfile = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/profile?id=${id}`);
            const data = await res.json();
            setUser(data);
            setFormData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchStats = async (userId) => {
        try {
            const paymentsRes = await fetch(`${API_BASE_URL}/payments?user_id=${userId}`);
            const payments = await paymentsRes.json();

            const [achRes, examsRes] = await Promise.all([
                fetch(`${API_BASE_URL}/achievements?user_id=${userId}`),
                fetch(`${API_BASE_URL}/exams`)
            ]);
            const awards = await achRes.json();

            const lbRes = await fetch(`${API_BASE_URL}/leaderboard`);
            const lb = await lbRes.json();
            const userLb = lb.find(l => l.user_id == userId) || { points: 0, rank_title: 'Novice' };

            setStats({
                events: 3, // Keep as static or fetch from events.php?user_id=... if available
                payments: Array.isArray(payments) ? payments.length : 0,
                achievements: Array.isArray(awards) ? awards.length : 0,
                points: userLb.points,
                rank: userLb.rank_title,
                personalAwards: Array.isArray(awards) ? awards : []
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setMsg('Profile Updated Successfully!');
                setUser(formData);
                setEditMode(false);
                localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user')), ...formData }));
                setTimeout(() => setMsg(''), 3000);
            } else {
                setMsg('Update failed.');
            }
        } catch (err) {
            setMsg('Error updating profile.');
        }
    };

    if (!user) return <div className="container section">Loading Profile...</div>;

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)', padding: '2rem 0' }}>
            <div className="container">
                {/* Welcome Header */}
                <div style={{
                    background: 'rgba(255,255,255,0.95)',
                    padding: '3rem', borderRadius: '24px', marginBottom: '2rem',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    position: 'relative', overflow: 'hidden',
                    backdropFilter: 'blur(20px)'
                }}>
                    <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(102,126,234,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(118,75,162,0.2) 0%, transparent 70%)', borderRadius: '50%' }}></div>

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ marginBottom: '1rem', opacity: 0.8, fontWeight: '800', color: '#667eea', letterSpacing: '2px', fontSize: '1.2rem' }}>BAFSKMC</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Sparkles size={36} color="#667eea" />
                            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Welcome, {user.name?.split(' ')[0]}!
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    <PremiumStatCard icon={<Calendar size={32} />} title="Active Events" value={stats.events} gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" />
                    <PremiumStatCard icon={<CreditCard size={32} />} title="Payments" value={stats.payments} gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" />
                    <PremiumStatCard icon={<Award size={32} />} title="Performance" value={`${stats.points} XP`} gradient="linear-gradient(135deg, #ffd89b 0%, #19547b 100%)" />
                    <PremiumStatCard icon={<Zap size={32} />} title="Current Rank" value={stats.rank || 'Novice'} gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: editMode ? '1fr' : '1.2fr 1fr', gap: '2rem' }}>
                    {/* Profile Card */}
                    <div style={{
                        background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '24px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', backdropFilter: 'blur(20px)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>
                                <User size={24} color="#667eea" /> My Profile
                            </h3>
                            <button onClick={() => setEditMode(!editMode)} style={{
                                padding: '10px 20px', fontSize: '0.95rem', fontWeight: '600',
                                background: editMode ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                            }}>
                                {editMode ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        {msg && <div style={{ marginBottom: '1.5rem', padding: '15px', background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', color: '#065f46', borderRadius: '12px', fontWeight: '700', textAlign: 'center' }}>{msg}</div>}

                        {editMode ? (
                            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <input className="premium-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Name" />
                                <input className="premium-input" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} placeholder="Mobile" />
                                <input className="premium-input" value={formData.institution} onChange={e => setFormData({ ...formData, institution: e.target.value })} placeholder="Institution" />
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                    <input className="premium-input" value={formData.class_year} onChange={e => setFormData({ ...formData, class_year: e.target.value })} placeholder="Class" />
                                    <input className="premium-input" value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} placeholder="Section" />
                                    <input className="premium-input" value={formData.class_roll} onChange={e => setFormData({ ...formData, class_roll: e.target.value })} placeholder="Roll" />
                                </div>
                                <textarea className="premium-input" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Address" rows="3" />
                                <button type="submit" style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    padding: '16px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                                    fontSize: '1.1rem', fontWeight: '700', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                                }}>
                                    <Save size={20} /> Save Changes
                                </button>
                            </form>
                        ) : (
                            <div style={{ lineHeight: '2.2', color: '#475569' }}>
                                <ProfileRow label="Email" value={user.email} />
                                <ProfileRow label="Mobile" value={user.mobile || 'Not provided'} />
                                <ProfileRow label="Institution" value={user.institution} />
                                <ProfileRow label="Class" value={`${user.class_year} - Section ${user.section} - Roll ${user.class_roll}`} />
                                <ProfileRow label="Address" value={user.address || 'Not provided'} />
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    {!editMode && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <PremiumActionCard
                                title="Upcoming Activities"
                                description="Join workshops and competitions"
                                link="/activities"
                                gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                icon={<Activity size={28} />}
                            />
                            <PremiumActionCard
                                title="Make Payment"
                                description="Pay for events and membership"
                                link="/payment"
                                gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                                icon={<CreditCard size={28} />}
                            />
                            <PremiumActionCard
                                title="Study Resources"
                                description="Access exclusive materials"
                                link="/resources"
                                gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                                icon={<BookOpen size={28} />}
                            />
                        </div>
                    )}
                </div>

                {/* Awards & Badges Section */}
                {!editMode && stats.personalAwards?.length > 0 && (
                    <div style={{ marginTop: '3rem' }}>
                        <h3 style={{ color: 'white', fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Award size={32} /> My Awards & Badges
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            {stats.personalAwards.map(award => (
                                <div key={award.id} style={{ background: 'rgba(255,255,255,0.95)', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ width: '60px', height: '60px', background: '#fef3c7', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                                        <Award color="#d97706" size={30} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1e293b' }}>{award.title}</div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#dc2626', textTransform: 'uppercase' }}>{award.award_type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .premium-input {
                    padding: 14px 18px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    width: 100%;
                    font-size: 1rem;
                    transition: all 0.3s;
                    background: white;
                }
                .premium-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

const PremiumStatCard = ({ icon, title, value, gradient }) => (
    <div style={{
        background: gradient,
        padding: '2rem', borderRadius: '20px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
        color: 'white',
        transition: 'transform 0.3s, box-shadow 0.3s',
        position: 'relative',
        overflow: 'hidden'
    }}
        onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.3)';
        }}
        onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
        }}
    >
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: '1rem', opacity: 0.9 }}>{icon}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{title}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>{value}</div>
        </div>
    </div>
);

const ProfileRow = ({ label, value }) => (
    <div style={{ display: 'flex', marginBottom: '1rem', padding: '12px', background: '#f8fafc', borderRadius: '10px' }}>
        <span style={{ fontWeight: '700', minWidth: '130px', color: '#667eea' }}>{label}:</span>
        <span style={{ color: '#1e293b', fontWeight: '500' }}>{value}</span>
    </div>
);

const PremiumActionCard = ({ title, description, link, gradient, icon }) => (
    <Link to={link} style={{ textDecoration: 'none' }}>
        <div style={{
            background: gradient,
            padding: '2rem',
            borderRadius: '20px',
            color: 'white',
            boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
        }}
            onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.3)';
            }}
            onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
            }}
        >
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ marginBottom: '1rem' }}>{icon}</div>
                <h4 style={{ margin: '0 0 0.75rem', fontSize: '1.4rem', fontWeight: '800' }}>{title}</h4>
                <p style={{ margin: 0, opacity: 0.95, fontSize: '1rem', lineHeight: '1.5' }}>{description}</p>
            </div>
        </div>
    </Link>
);

export default StudentDashboard;
