import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, NavLink as RouterNavLink } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Newspaper } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [news, setNews] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }, [location]);

    // Fetch news for ticker
    useEffect(() => {
        fetch(`${API_BASE_URL}/news?limit=5`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setNews(data);
                }
            })
            .catch(err => console.error('Error fetching news:', err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    // UNIFORM NAVBAR DESIGN
    const renderNewsTicker = () => (
        <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '8px 0',
            borderBottom: '2px solid #667eea',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '0 4rem' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '4px 12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '20px', fontWeight: '800', fontSize: '0.7rem',
                    color: 'white', textTransform: 'uppercase', flexShrink: 0,
                    boxShadow: '0 4px 10px rgba(102, 126, 234, 0.3)'
                }}>
                    <Newspaper size={12} /> LATEST NEWS
                </div>
                <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        animation: 'scroll-news 40s linear infinite',
                        paddingLeft: '100%',
                        fontSize: '0.9rem',
                        color: '#e2e8f0',
                        fontWeight: '500'
                    }}>
                        {news.map((item, idx) => (
                            <Link key={idx} to={`/news/${item.id}`} style={{
                                color: '#e2e8f0', textDecoration: 'none',
                                marginRight: '50px'
                            }}>
                                • {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes scroll-news {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );

    if (!user && location.pathname === '/') {
        // Special case for landing page top
    }

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
            {renderNewsTicker()}
            <nav style={{
                background: 'linear-gradient(to right, #0f172a, #1e293b)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                position: 'relative',
                zIndex: 20
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '80px',
                    padding: '0 4rem',
                    maxWidth: '100%',
                    margin: '0'
                }}>
                    {/* Left Section: Logo and BAFSKMC */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginRight: '2rem' }}>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                            <div style={{ background: 'white', padding: '5px', borderRadius: '50%', height: '40px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src="/logo.png" alt="Logo" style={{ height: '30px' }} onError={(e) => e.target.style.display = 'none'} />
                            </div>
                            <span style={{ fontWeight: 'bold', fontSize: '1.8rem', color: 'white', letterSpacing: '2px' }}>
                                BAFSKMC
                            </span>
                        </Link>
                    </div>

                    {/* Right Section: Desktop Menu & Mobile Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <div className="desktop-menu" style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                            {user && <NavLink to="/">Home</NavLink>}
                            {user ? (
                                <>
                                    <NavLink to="/student-dashboard">Dashboard</NavLink>
                                    <NavLink to="/exams">Exams</NavLink>
                                    <NavLink to="/activities">Activities</NavLink>
                                    <NavLink to="/achievements">Achievements</NavLink>
                                    <NavLink to="/gallery">Gallery</NavLink>
                                    <NavLink to="/resources">Resources</NavLink>
                                    <NavLink to="/payment">Payment</NavLink>
                                    <NavLink to="/alumni">Alumni</NavLink>

                                    {user.role === 'admin' && (
                                        <Link to="/admin" style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            backgroundColor: '#ef4444', color: 'white',
                                            padding: '8px 16px', borderRadius: '20px',
                                            fontSize: '0.9rem', fontWeight: 'bold',
                                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                                            textDecoration: 'none'
                                        }}>
                                            <LayoutDashboard size={16} /> Admin
                                        </Link>
                                    )}

                                    <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '0 5px' }}></div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user.name || 'User'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>{user.role || 'student'}</div>
                                        </div>
                                        <button onClick={handleLogout} style={{
                                            background: 'rgba(255,255,255,0.1)', border: 'none',
                                            color: 'white', padding: '8px', borderRadius: '50%',
                                            cursor: 'pointer', transition: 'background 0.2s'
                                        }}>
                                            <LogOut size={18} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <Link to="/login" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 24px', background: 'white', color: '#1e293b',
                                    borderRadius: '50px', fontWeight: '700', textDecoration: 'none',
                                    boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
                                }}>
                                    Login
                                </Link>
                            )}
                        </div>

                        <button onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'white', display: 'none' }} className="mobile-toggle">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div style={{ backgroundColor: '#1e293b', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <Link to="/" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                        {user && (
                            <>
                                <Link to="/student-dashboard" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                                <Link to="/exams" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none' }}>Exams</Link>
                                <Link to="/activities" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none' }}>Activities</Link>
                                <Link to="/payment" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none' }}>Payment</Link>
                                {user.role === 'admin' && <Link to="/admin" onClick={toggleMenu} style={{ color: '#f87171', textDecoration: 'none' }}>Admin Panel</Link>}
                                <button onClick={() => { handleLogout(); toggleMenu(); }} style={{ background: 'none', border: 'none', color: '#94a3b8', textAlign: 'left', padding: 0, cursor: 'pointer' }}>Logout</button>
                            </>
                        )}
                        {!user && <Link to="/login" onClick={toggleMenu} style={{ color: 'white', textDecoration: 'none' }}>Login</Link>}
                    </div>
                )}
            </nav>
        </header>
    );
};

const NavLink = ({ to, children }) => (
    <RouterNavLink
        to={to}
        end
        style={({ isActive }) => ({
            fontWeight: 500,
            color: isActive ? '#fbbf24' : '#cbd5e1',
            textDecoration: 'none',
            fontSize: '0.95rem',
            transition: 'color 0.2s'
        })}
    >
        {children}
    </RouterNavLink>
);

export default Navbar;
