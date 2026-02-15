import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Trophy, Calendar, BookOpen, Sparkles, TrendingUp, Newspaper } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const Home = () => {
    const [news, setNews] = useState([]);
    const [committee, setCommittee] = useState([]);

    useEffect(() => {
        // Fetch latest news
        fetch(`${API_BASE_URL}/news?limit=3`)
            .then(res => res.json())
            .then(data => setNews(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));

        // Fetch committee
        fetch(`${API_BASE_URL}/committee`)
            .then(res => res.json())
            .then(data => setCommittee(Array.isArray(data) ? data.slice(0, 3) : []))
            .catch(err => console.error(err));
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '8rem 0 6rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background Elements */}
                <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 6s ease-in-out infinite' }}></div>
                <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 8s ease-in-out infinite' }}></div>

                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    {/* Club Logo */}
                    <img src="/logo.png" alt="BAFSKMC Math Club" style={{
                        width: '120px', height: '120px', marginBottom: '2rem',
                        filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))',
                        animation: 'float 4s ease-in-out infinite'
                    }} />

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', padding: '10px 20px', background: 'rgba(255,255,255,0.2)', borderRadius: '50px', backdropFilter: 'blur(10px)' }}>
                        <Sparkles size={20} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>BAF Shaheen College Kurmitola Math Club</span>
                    </div>

                    <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', fontWeight: '900', lineHeight: '1.2', textShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                        Where Mathematics<br />Meets Excellence
                    </h1>

                    <p style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto 3rem', opacity: 0.95, lineHeight: '1.6' }}>
                        Join the premier mathematics club at BAF Shaheen College Kurmitola. Explore, compete, and excel in the world of numbers.
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            padding: '16px 32px', background: 'white', color: '#667eea',
                            borderRadius: '50px', fontWeight: '700', fontSize: '1.1rem',
                            textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            transition: 'transform 0.3s, box-shadow 0.3s'
                        }}
                            onMouseOver={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                            }}
                        >
                            Join the Club <ArrowRight size={20} />
                        </Link>

                        <Link to="/about" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '10px',
                            padding: '16px 32px', background: 'rgba(255,255,255,0.2)',
                            color: 'white', borderRadius: '50px', fontWeight: '700',
                            fontSize: '1.1rem', textDecoration: 'none', border: '2px solid white',
                            backdropFilter: 'blur(10px)', transition: 'all 0.3s'
                        }}
                            onMouseOver={e => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#667eea';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                e.currentTarget.style.color = 'white';
                            }}
                        >
                            Learn More
                        </Link>
                    </div>
                </div>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                `}</style>
            </section>


            {/* Stats Section */}
            <section className="container" style={{ marginTop: '4rem', marginBottom: '4rem', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    <StatCard icon={<Users size={32} />} value="200+" label="Active Members" color="#667eea" />
                    <StatCard icon={<Trophy size={32} />} value="50+" label="Awards Won" color="#f59e0b" />
                    <StatCard icon={<Calendar size={32} />} value="30+" label="Events Yearly" color="#10b981" />
                    <StatCard icon={<TrendingUp size={32} />} value="95%" label="Success Rate" color="#ef4444" />
                </div>
            </section>

            {/* Latest News */}
            {news.length > 0 && (
                <section className="container section">
                    <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', fontWeight: '800' }}>Featured News</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {news.map(item => (
                            <Link key={item.id} to={`/news/${item.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    background: 'white', borderRadius: '16px', overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transition: 'transform 0.3s, box-shadow 0.3s',
                                    height: '100%'
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
                                    {item.image_url && (
                                        <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                    )}
                                    <div style={{ padding: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem', color: '#1e293b' }}>{item.title}</h3>
                                        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.excerpt}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Committee Preview */}
            {committee.length > 0 && (
                <section className="container section" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', padding: '4rem 0', borderRadius: '24px' }}>
                    <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem', fontWeight: '800' }}>Meet Our Leaders</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                        {committee.map(member => (
                            <div key={member.id} style={{ textAlign: 'center' }}>
                                <img src={member.image_url || 'https://placehold.co/200x200?text=' + member.name.split(' ')[0]} alt={member.name} style={{
                                    width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover',
                                    border: '5px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', marginBottom: '1rem'
                                }} />
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{member.name}</h4>
                                <p style={{ color: '#667eea', fontWeight: '700' }}>{member.role}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <Link to="/committee" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white', borderRadius: '50px', fontWeight: '700',
                            textDecoration: 'none', boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                        }}>
                            View Full Committee <ArrowRight size={18} />
                        </Link>
                    </div>
                </section>
            )}

            {/* Quick Links */}
            <section className="container section">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <QuickLinkCard
                        icon={<Calendar size={40} />}
                        title="Upcoming Activities"
                        description="Join our workshops, competitions, and Olympiad prep sessions"
                        link="/activities"
                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />
                    <QuickLinkCard
                        icon={<Trophy size={40} />}
                        title="Achievements"
                        description="Celebrate the success of our brilliant mathletes"
                        link="/achievements"
                        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    />
                    <QuickLinkCard
                        icon={<BookOpen size={40} />}
                        title="Resources"
                        description="Access exclusive study materials and problem sets"
                        link="/resources"
                        gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    />
                </div>
            </section>
        </>
    );
};

const StatCard = ({ icon, value, label, color }) => (
    <div style={{
        background: 'white', padding: '2rem', borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center',
        transition: 'transform 0.3s'
    }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-8px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
        <div style={{ color: color, marginBottom: '1rem' }}>{icon}</div>
        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>{value}</div>
        <div style={{ color: '#64748b', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>{label}</div>
    </div>
);

const QuickLinkCard = ({ icon, title, description, link, gradient }) => (
    <Link to={link} style={{ textDecoration: 'none' }}>
        <div style={{
            background: gradient, padding: '2.5rem', borderRadius: '20px',
            color: 'white', boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s, box-shadow 0.3s', height: '100%'
        }}
            onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 60px rgba(0,0,0,0.3)';
            }}
            onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.2)';
            }}
        >
            <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '800' }}>{title}</h3>
            <p style={{ opacity: 0.95, lineHeight: '1.6' }}>{description}</p>
        </div>
    </Link>
);

export default Home;
