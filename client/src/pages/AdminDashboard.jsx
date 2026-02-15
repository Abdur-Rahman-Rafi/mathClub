import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, FileText, Calendar, Trophy, Image, Settings, LogOut, ChevronRight, Plus, Search, Filter, Mail, Phone, MapPin, DollarSign, Database, Shield, Activity, BarChart2, Bell, MessageSquare, Briefcase, Globe, Award, BookOpen, CheckCircle, Clock } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ users: 0, news: 0, payments: 0, events: 0, pending_payments: 0, exams: 0 });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                if (parsed.role === 'admin') {
                    setUser(parsed);
                    fetchStats();
                } else {
                    window.location.href = '/student-dashboard';
                }
            } catch (e) {
                window.location.href = '/login';
            }
        } else {
            window.location.href = '/login';
        }
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/stats`);
            const data = await res.json();
            if (res.ok) {
                setStats(data);
            }
        } catch (err) {
            console.error("Error fetching admin stats:", err);
        }
    };

    if (!user) return <div className="container section">Loading...</div>;

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)', padding: '2rem 0' }}>
            <div className="container">
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                    padding: '2.5rem', borderRadius: '20px', marginBottom: '2rem', color: 'white',
                    boxShadow: '0 20px 60px rgba(220, 38, 38, 0.4)',
                    position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%', transform: 'translate(30%, -30%)' }}></div>
                    <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', position: 'relative', zIndex: 1 }}>BAFSKMC</h1>
                    <p style={{ margin: '0.5rem 0 0', opacity: 0.95, fontSize: '1.1rem', position: 'relative', zIndex: 1 }}>⚡ Admin Control Center - Complete Management Hub</p>
                </div>

                {/* Stats Overview */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <StatsCard icon={<Users size={32} />} title="Total Users" value={stats.users} color="#3b82f6" trend="Live from DB" />
                        <StatsCard icon={<Newspaper size={32} />} title="Published News" value={stats.news} color="#10b981" trend="Live from DB" />
                        <StatsCard icon={<CreditCard size={32} />} title="Pending Payments" value={stats.pending_payments} color="#f59e0b" trend="Requires verification" />
                        <StatsCard icon={<FileText size={32} />} title="Total Exams" value={stats.exams} color="#ef4444" trend="Active Contests" />
                        <StatsCard icon={<Calendar size={32} />} title="Active Events" value={stats.events} color="#8b5cf6" trend="Live from DB" />
                    </div>
                )}

                {/* Main Content */}
                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
                    {/* Sidebar */}
                    <div style={{
                        background: 'rgba(255,255,255,0.95)', borderRadius: '20px', padding: '2rem',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)', height: 'fit-content',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#1e293b' }}>Management</h3>
                        <AdminTab icon={<BarChart3 size={20} />} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                        <AdminTab icon={<Newspaper size={20} />} label="News" active={activeTab === 'news'} onClick={() => setActiveTab('news')} />
                        <AdminTab icon={<Calendar size={20} />} label="Events" active={activeTab === 'events'} onClick={() => setActiveTab('events')} />
                        <AdminTab icon={<Users size={20} />} label="Committee" active={activeTab === 'committee'} onClick={() => setActiveTab('committee')} />
                        <AdminTab icon={<Image size={20} />} label="Gallery" active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
                        <AdminTab icon={<Award size={20} />} label="Achievements" active={activeTab === 'achievements'} onClick={() => setActiveTab('achievements')} />
                        <AdminTab icon={<TrendingUp size={20} />} label="Leaderboard" active={activeTab === 'leaderboard'} onClick={() => setActiveTab('leaderboard')} />
                        <AdminTab icon={<FileText size={20} />} label="Exams" active={activeTab === 'exams'} onClick={() => setActiveTab('exams')} />
                        <AdminTab icon={<CreditCard size={20} />} label="Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                        <AdminTab icon={<UserCog size={20} />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    </div>

                    {/* Content Area */}
                    <div>
                        {activeTab === 'overview' && <OverviewPanel />}
                        {activeTab === 'news' && <NewsManagement />}
                        {activeTab === 'events' && <EventsManagement />}
                        {activeTab === 'committee' && <CommitteeManagement />}
                        {activeTab === 'gallery' && <GalleryManagement />}
                        {activeTab === 'achievements' && <AchievementsManagement />}
                        {activeTab === 'leaderboard' && <LeaderboardManagement />}
                        {activeTab === 'exams' && <ExamsManagement />}
                        {activeTab === 'payments' && <PaymentsManagement />}
                        {activeTab === 'users' && <UsersManagement />}
                    </div>
                </div>
            </div>

            <style>{`
                .admin-input {
                    width: 100%;
                    padding: 14px;
                    margin-bottom: 1rem;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.2s;
                }
                .admin-input:focus {
                    outline: none;
                    border-color: #dc2626;
                    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
                }
            `}</style>
        </div>
    );
};

const StatsCard = ({ icon, title, value, color, trend }) => (
    <div style={{
        background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)', borderLeft: `5px solid ${color}`,
        transition: 'transform 0.3s, box-shadow 0.3s', backdropFilter: 'blur(10px)'
    }}
        onMouseOver={e => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.25)';
        }}
        onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
            <div style={{ color: color }}>{icon}</div>
            <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</span>
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>{value}</div>
        <div style={{ fontSize: '0.85rem', color: color, fontWeight: '600' }}>↗ {trend}</div>
    </div>
);

const AdminTab = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
        padding: '14px 18px', marginBottom: '10px', border: 'none',
        background: active ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : 'transparent',
        color: active ? 'white' : '#64748b', borderRadius: '12px',
        cursor: 'pointer', fontSize: '0.95rem', fontWeight: '600',
        transition: 'all 0.3s', boxShadow: active ? '0 8px 20px rgba(220, 38, 38, 0.3)' : 'none'
    }}
        onMouseOver={e => {
            if (!active) {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#1e293b';
            }
        }}
        onMouseOut={e => {
            if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#64748b';
            }
        }}
    >
        {icon} {label}
    </button>
);

const OverviewPanel = () => (
    <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}>Dashboard Overview</h2>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
            <QuickAction title="Create News" description="Publish breaking news to the ticker" link="news" color="#10b981" />
            <QuickAction title="Manage Events" description="Add or edit upcoming events" link="events" color="#3b82f6" />
            <QuickAction title="Verify Payments" description="Review pending payment requests" link="payments" color="#f59e0b" />
        </div>
    </div>
);

const QuickAction = ({ title, description, link, color }) => (
    <div style={{
        padding: '1.5rem', borderRadius: '12px', border: `2px solid ${color}20`,
        background: `${color}10`, cursor: 'pointer', transition: 'all 0.3s'
    }}
        onMouseOver={e => {
            e.currentTarget.style.transform = 'translateX(8px)';
            e.currentTarget.style.borderColor = color;
        }}
        onMouseOut={e => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.borderColor = `${color}20`;
        }}
    >
        <h4 style={{ margin: '0 0 0.5rem', color: color, fontSize: '1.2rem' }}>{title}</h4>
        <p style={{ margin: 0, color: '#64748b' }}>{description}</p>
    </div>
);

// NEWS MANAGEMENT (with file upload)
const NewsManagement = () => {
    const [news, setNews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '', excerpt: '', image_url: '', status: 'published' });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/news?admin=true`);
            const data = await res.json();
            setNews(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formDataUpload
            });

            const data = await res.json();
            if (data.success) {
                setFormData({ ...formData, image_url: data.url });
                showSuccess('Image uploaded successfully!');
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (err) {
            alert('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const payload = { ...formData, author_id: user.id };

        try {
            const url = `${API_BASE_URL}/news`;
            const method = editingId ? 'PUT' : 'POST';
            if (editingId) payload.id = editingId;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showSuccess(editingId ? 'News updated successfully!' : 'News created successfully!');
                setShowForm(false);
                setFormData({ title: '', content: '', excerpt: '', image_url: '', status: 'published' });
                setEditingId(null);
                fetchNews();
            }
        } catch (err) {
            alert('Error saving news');
        }
    };

    const handleEdit = (item) => {
        setFormData(item);
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this news?')) return;
        try {
            await fetch(`${API_BASE_URL}/news/${id}`, { method: 'DELETE' });
            showSuccess('News deleted successfully!');
            fetchNews();
        } catch (err) {
            alert('Error deleting news');
        }
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            {successMsg && (
                <div style={{
                    marginBottom: '1.5rem', padding: '15px 20px',
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    color: '#065f46', borderRadius: '12px', fontWeight: '700',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}>
                    <Check size={20} />
                    {successMsg}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>News Management</h2>
                <button onClick={() => setShowForm(!showForm)} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                    fontSize: '1rem', fontWeight: '600', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                }}>
                    <Plus size={20} /> {showForm ? 'Cancel' : 'Add News'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: '16px' }}>
                    <input className="admin-input" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <textarea className="admin-input" placeholder="Content" rows="6" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} required />
                    <input className="admin-input" placeholder="Excerpt (optional)" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />

                    {/* Image Upload Section */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#64748b' }}>News Image</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <label style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '12px 20px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white', borderRadius: '8px', cursor: 'pointer',
                                fontWeight: '600', fontSize: '0.95rem'
                            }}>
                                <Image size={18} />
                                {uploading ? 'Uploading...' : 'Upload Image'}
                                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                            {formData.image_url && (
                                <img src={formData.image_url} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #e2e8f0' }} />
                            )}
                        </div>
                        {formData.image_url && (
                            <input className="admin-input" placeholder="Or paste image URL" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} style={{ marginTop: '0.5rem' }} />
                        )}
                    </div>

                    <select className="admin-input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                    <button type="submit" style={{
                        padding: '14px 28px', background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                        fontSize: '1rem', fontWeight: '700', width: '100%'
                    }}>{editingId ? 'Update' : 'Create'} News</button>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {news.map(item => (
                    <div key={item.id} style={{
                        padding: '1.5rem', border: '2px solid #e2e8f0', borderRadius: '16px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        background: 'white', transition: 'all 0.3s'
                    }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#dc2626'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                            {item.image_url && (
                                <img src={item.image_url} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                            )}
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>{item.title}</h4>
                                <span style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', padding: '4px 12px', backgroundColor: item.status === 'published' ? '#d1fae5' : '#fef3c7', borderRadius: '6px', fontWeight: '600' }}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleEdit(item)} style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                <Edit size={18} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} style={{ padding: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// COMMITTEE MANAGEMENT WITH FULL CRUD
const CommitteeManagement = () => {
    const [activePanel, setActivePanel] = useState('current');

    return (
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}>Committee Management</h2>

            {/* Tab Switcher */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => setActivePanel('current')} style={{
                    padding: '12px 24px', border: 'none', borderRadius: '12px',
                    background: activePanel === 'current' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f1f5f9',
                    color: activePanel === 'current' ? 'white' : '#64748b',
                    fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s'
                }}>
                    Current Committee
                </button>
                <button onClick={() => setActivePanel('alumni')} style={{
                    padding: '12px 24px', border: 'none', borderRadius: '12px',
                    background: activePanel === 'alumni' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f1f5f9',
                    color: activePanel === 'alumni' ? 'white' : '#64748b',
                    fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s'
                }}>
                    Alumni Committee
                </button>
            </div>

            {activePanel === 'current' ? <CurrentCommitteePanel /> : <AlumniCommitteePanel />}
        </div>
    );
};

const CurrentCommitteePanel = () => {
    const [members, setMembers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', role: '', bio: '', image_url: '', display_order: 0 });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/committee`);
            const data = await res.json();
            setMembers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formDataUpload
            });

            const data = await res.json();
            if (data.success) {
                setFormData({ ...formData, image_url: data.url });
                showSuccess('Photo uploaded successfully!');
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (err) {
            alert('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${API_BASE_URL}/committee`;
            const method = editingId ? 'PUT' : 'POST';
            const payload = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showSuccess(editingId ? 'Member updated successfully!' : 'Member added successfully!');
                setShowForm(false);
                setFormData({ name: '', role: '', bio: '', image_url: '', display_order: 0 });
                setEditingId(null);
                fetchMembers();
            }
        } catch (err) {
            alert('Error saving member');
        }
    };

    const handleEdit = (member) => {
        setFormData(member);
        setEditingId(member.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this member?')) return;
        try {
            await fetch(`${API_BASE_URL}/committee/${id}`, { method: 'DELETE' });
            showSuccess('Member deleted successfully!');
            fetchMembers();
        } catch (err) {
            alert('Error deleting member');
        }
    };

    return (
        <>
            {successMsg && (
                <div style={{
                    marginBottom: '1.5rem', padding: '15px 20px',
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    color: '#065f46', borderRadius: '12px', fontWeight: '700',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}>
                    <Check size={20} />
                    {successMsg}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0 }}>Current Committee Members</h3>
                <button onClick={() => setShowForm(!showForm)} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                    fontSize: '1rem', fontWeight: '600', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                }}>
                    <Plus size={20} /> {showForm ? 'Cancel' : 'Add Member'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: '16px' }}>
                    <input className="admin-input" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input className="admin-input" placeholder="Role (e.g., President)" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
                    <textarea className="admin-input" placeholder="Bio (optional)" rows="3" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />

                    {/* Direct Photo Upload */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#64748b' }}>Member Photo</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <label style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '12px 20px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white', borderRadius: '8px', cursor: 'pointer',
                                fontWeight: '600', fontSize: '0.95rem'
                            }}>
                                <Image size={18} />
                                {uploading ? 'Uploading...' : 'Upload from Phone/PC'}
                                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                            {formData.image_url && (
                                <img src={formData.image_url} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #667eea' }} />
                            )}
                        </div>
                    </div>

                    <input className="admin-input" placeholder="Or Image URL" value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
                    <input className="admin-input" type="number" placeholder="Display Order" value={formData.display_order} onChange={e => setFormData({ ...formData, display_order: e.target.value })} />
                    <button type="submit" style={{
                        padding: '14px 28px', background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                        fontSize: '1rem', fontWeight: '700', width: '100%'
                    }}>{editingId ? 'Update' : 'Add'} Member</button>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {members.map(member => (
                    <div key={member.id} style={{
                        padding: '1.5rem', border: '2px solid #e2e8f0', borderRadius: '16px',
                        background: 'white', transition: 'all 0.3s', textAlign: 'center'
                    }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#667eea'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                        <img src={member.image_url || 'https://placehold.co/150x150?text=' + member.name.split(' ')[0]} alt={member.name} style={{
                            width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover',
                            marginBottom: '1rem', border: '3px solid #667eea'
                        }} />
                        <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>{member.name}</h4>
                        <p style={{ color: '#667eea', fontWeight: '700', marginBottom: '1rem' }}>{member.role}</p>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => handleEdit(member)} style={{ padding: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(member.id)} style={{ padding: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

const AlumniCommitteePanel = () => {
    const [alumni, setAlumni] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', role: '', batch: '', current_position: '', institution: '', bio: '', image_url: '', display_order: 0 });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/committee`);
            const data = await res.json();
            setAlumni(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formDataUpload
            });

            const data = await res.json();
            if (data.success) {
                setFormData({ ...formData, image_url: data.url });
                showSuccess('Photo uploaded successfully!');
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (err) {
            alert('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${API_BASE_URL}/committee`;
            const method = editingId ? 'PUT' : 'POST';
            const payload = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showSuccess(editingId ? 'Alumni updated successfully!' : 'Alumni added successfully!');
                setShowForm(false);
                setFormData({ name: '', role: '', batch: '', current_position: '', institution: '', bio: '', image_url: '', display_order: 0 });
                setEditingId(null);
                fetchAlumni();
            }
        } catch (err) {
            alert('Error saving alumni');
        }
    };

    const handleEdit = (alum) => {
        setFormData(alum);
        setEditingId(alum.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this alumni?')) return;
        try {
            await fetch(`${API_BASE_URL}/committee/${id}`, { method: 'DELETE' });
            showSuccess('Alumni deleted successfully!');
            fetchAlumni();
        } catch (err) {
            alert('Error deleting alumni');
        }
    };

    return (
        <>
            {successMsg && (
                <div style={{
                    marginBottom: '1.5rem', padding: '15px 20px',
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    color: '#065f46', borderRadius: '12px', fontWeight: '700',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                }}>
                    <Check size={20} />
                    {successMsg}
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ margin: 0 }}>Alumni Committee Members</h3>
                <button onClick={() => setShowForm(!showForm)} style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                    fontSize: '1rem', fontWeight: '600', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                }}>
                    <Plus size={20} /> {showForm ? 'Cancel' : 'Add Alumni'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '2rem', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input className="admin-input" placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        <input className="admin-input" placeholder="Role (e.g., Ex-President)" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input className="admin-input" placeholder="Batch (e.g., 2020)" value={formData.batch} onChange={e => setFormData({ ...formData, batch: e.target.value })} />
                        <input className="admin-input" placeholder="Current Position" value={formData.current_position} onChange={e => setFormData({ ...formData, current_position: e.target.value })} />
                    </div>
                    <input className="admin-input" placeholder="Institution" value={formData.institution} onChange={e => setFormData({ ...formData, institution: e.target.value })} />
                    <textarea className="admin-input" placeholder="Bio (optional)" rows="3" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />

                    {/* Direct Photo Upload */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#64748b' }}>Profile Photo</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <label style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '12px 20px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white', borderRadius: '8px', cursor: 'pointer',
                                fontWeight: '600', fontSize: '0.95rem'
                            }}>
                                <Image size={18} />
                                {uploading ? 'Uploading...' : 'Upload from Phone/PC'}
                                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                            {formData.image_url && (
                                <img src={formData.image_url} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #667eea' }} />
                            )}
                        </div>
                    </div>

                    <input className="admin-input" placeholder="Or Image URL" value={formData.image_url || ''} onChange={e => setFormData({ ...formData, image_url: e.target.value })} />
                    <input className="admin-input" type="number" placeholder="Display Order" value={formData.display_order} onChange={e => setFormData({ ...formData, display_order: e.target.value })} />
                    <button type="submit" style={{
                        padding: '14px 28px', background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                        fontSize: '1rem', fontWeight: '700', width: '100%'
                    }}>{editingId ? 'Update' : 'Add'} Alumni</button>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {alumni.map(alum => (
                    <div key={alum.id} style={{
                        padding: '1.5rem', border: '2px solid #e2e8f0', borderRadius: '16px',
                        background: 'white', transition: 'all 0.3s', textAlign: 'center'
                    }}
                        onMouseOver={e => e.currentTarget.style.borderColor = '#667eea'}
                        onMouseOut={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                        <img src={alum.image_url || 'https://placehold.co/150x150?text=' + alum.name.split(' ')[0]} alt={alum.name} style={{
                            width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover',
                            marginBottom: '1rem', border: '3px solid #667eea'
                        }} />
                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem' }}>{alum.name}</h4>
                        <p style={{ color: '#667eea', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{alum.role} (Batch {alum.batch})</p>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button onClick={() => handleEdit(alum)} style={{ padding: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                <Edit size={16} />
                            </button>
                            <button onClick={() => handleDelete(alum.id)} style={{ padding: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};


// RESOURCES & GALLERY MANAGEMENT
const ResourcesManagement = () => {
    const [resources, setResources] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [showResForm, setShowResForm] = useState(false);
    const [showGalForm, setShowGalForm] = useState(false);
    const [resData, setResData] = useState({ title: '', file_url: '', file_type: 'pdf' });
    const [galData, setGalData] = useState({ title: '', image_url: '', category: 'General' });
    const [uploading, setUploading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchResources();
        fetchGallery();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/resources.php');
            const data = await res.json();
            setResources(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const fetchGallery = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/gallery.php');
            const data = await res.json();
            setGallery(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_BASE_URL}/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                if (type === 'resource') {
                    setResData({ ...resData, file_url: data.url, file_type: data.type === 'document' ? 'pdf' : 'image' });
                } else {
                    setGalData({ ...galData, image_url: data.url });
                }
                showSuccess('File uploaded successfully!');
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (err) {
            alert('Error uploading file');
        } finally {
            setUploading(false);
        }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleResSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://127.0.0.1:8000/api/resources.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resData)
            });
            if (res.ok) {
                showSuccess('Resource added successfully!');
                setShowResForm(false);
                setResData({ title: '', file_url: '', file_type: 'pdf' });
                fetchResources();
            }
        } catch (err) { alert('Error saving resource'); }
    };

    const handleGalSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://127.0.0.1:8000/api/gallery.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(galData)
            });
            if (res.ok) {
                showSuccess('Gallery item added!');
                setShowGalForm(false);
                setGalData({ title: '', image_url: '', category: 'General' });
                fetchGallery();
            }
        } catch (err) { alert('Error saving gallery item'); }
    };

    const handleDelete = async (id, type) => {
        if (!confirm('Delete this item?')) return;
        try {
            const endpoint = type === 'resource' ? 'resources.php' : 'gallery.php';
            await fetch(`http://127.0.0.1:8000/api/${endpoint}?id=${id}`, { method: 'DELETE' });
            showSuccess('Item deleted!');
            type === 'resource' ? fetchResources() : fetchGallery();
        } catch (err) { alert('Error deleting item'); }
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            {successMsg && (
                <div style={{ padding: '15px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: '700' }}>
                    {successMsg}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* PDF Resources Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>PDF Resources</h3>
                        <button onClick={() => setShowResForm(!showResForm)} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            <Plus size={18} />
                        </button>
                    </div>

                    {showResForm && (
                        <form onSubmit={handleResSubmit} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', marginBottom: '1.5rem' }}>
                            <input className="admin-input" placeholder="Document Title" value={resData.title} onChange={e => setResData({ ...resData, title: e.target.value })} required />
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 15px', background: '#3b82f6', color: 'white',
                                    borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem'
                                }}>
                                    <FileText size={16} />
                                    {uploading ? 'Uploading...' : 'Upload PDF'}
                                    <input type="file" accept=".pdf,.doc,.docx" onChange={e => handleFileUpload(e, 'resource')} style={{ display: 'none' }} />
                                </label>
                                {resData.file_url && <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '5px' }}>File ready: {resData.file_url.split('/').pop()}</p>}
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700' }}>Add Resource</button>
                        </form>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        {resources.map(res => (
                            <div key={res.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FileText size={20} color="#dc2626" />
                                    <span>{res.title}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <a href={res.file_url} target="_blank" rel="noreferrer" style={{ padding: '6px', background: '#64748b', color: 'white', borderRadius: '6px' }}><ArrowRight size={14} /></a>
                                    <button onClick={() => handleDelete(res.id, 'resource')} style={{ padding: '6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px' }}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gallery Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>Image Gallery</h3>
                        <button onClick={() => setShowGalForm(!showGalForm)} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            <Plus size={18} />
                        </button>
                    </div>

                    {showGalForm && (
                        <form onSubmit={handleGalSubmit} style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', marginBottom: '1.5rem' }}>
                            <input className="admin-input" placeholder="Image Title" value={galData.title} onChange={e => setGalData({ ...galData, title: e.target.value })} required />
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 15px', background: '#3b82f6', color: 'white',
                                    borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem'
                                }}>
                                    <Image size={16} />
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                    <input type="file" accept="image/*" onChange={e => handleFileUpload(e, 'gallery')} style={{ display: 'none' }} />
                                </label>
                                {galData.image_url && <img src={galData.image_url} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', marginLeft: '10px', borderRadius: '4px' }} />}
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700' }}>Add to Gallery</button>
                        </form>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px' }}>
                        {gallery.map(img => (
                            <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '80px' }}>
                                <img src={img.image_url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button onClick={() => handleDelete(img.id, 'gallery')} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239, 68, 68, 0.8)', color: 'white', border: 'none', borderRadius: '4px', padding: '2px' }}>
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// PAYMENTS MANAGEMENT
const PaymentsManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/payments.php?all=true');
            const data = await res.json();
            setPayments(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/payments.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                setSuccessMsg(`Payment ${status} successfully!`);
                setTimeout(() => setSuccessMsg(''), 3000);
                fetchPayments();
            }
        } catch (err) {
            alert('Error updating payment status');
        }
    };

    if (loading) return <div>Loading payments...</div>;

    return (
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}>Payment Verification</h2>

            {successMsg && (
                <div style={{ padding: '15px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', marginBottom: '1.5rem', fontWeight: '700' }}>
                    {successMsg}
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                            <th style={{ padding: '1rem' }}>Student / Roll</th>
                            <th style={{ padding: '1rem' }}>Event</th>
                            <th style={{ padding: '1rem' }}>Transaction Details</th>
                            <th style={{ padding: '1rem' }}>Amount</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{p.student_name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Roll: {p.roll} {p.membership_id && `| ID: ${p.membership_id}`}</div>
                                </td>
                                <td style={{ padding: '1.2rem', color: '#334155', fontWeight: '500' }}>{p.event_display_name}</td>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontSize: '0.9rem', color: '#475569' }}><span style={{ fontWeight: '600' }}>{p.payment_method}:</span> {p.transaction_id}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{new Date(p.created_at).toLocaleString()}</div>
                                </td>
                                <td style={{ padding: '1.2rem', fontWeight: '800', color: '#10b981' }}>৳{p.amount}</td>
                                <td style={{ padding: '1.2rem' }}>
                                    <span style={{
                                        padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700',
                                        background: p.status === 'verified' ? '#d1fae5' : p.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                                        color: p.status === 'verified' ? '#065f46' : p.status === 'rejected' ? '#991b1b' : '#92400e'
                                    }}>
                                        {p.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    {p.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handleStatusUpdate(p.id, 'verified')}
                                                style={{ padding: '8px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                title="Verify"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(p.id, 'rejected')}
                                                style={{ padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                                title="Reject"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/users.php');
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleRoleUpdate = async (id, role) => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/users.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, role })
            });
            if (res.ok) {
                showSuccess('User role updated!');
                fetchUsers();
            }
        } catch (err) { alert('Error updating role'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Permanently delete this user?')) return;
        try {
            await fetch(`http://127.0.0.1:8000/api/users.php?id=${id}`, { method: 'DELETE' });
            showSuccess('User deleted!');
            fetchUsers();
        } catch (err) { alert('Error deleting user'); }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            <h2 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}>User Management</h2>
            {successMsg && <div style={{ marginBottom: '1.5rem', padding: '15px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', fontWeight: '700' }}>{successMsg}</div>}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                            <th style={{ padding: '1rem' }}>Name / Member ID</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Contact</th>
                            <th style={{ padding: '1rem' }}>Joined</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1.2rem' }}>
                                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{u.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>@{u.username}</div>
                                </td>
                                <td style={{ padding: '1.2rem' }}>
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleUpdate(u.id, e.target.value)}
                                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', background: u.role === 'admin' ? '#fee2e2' : '#f1f5f9', color: u.role === 'admin' ? '#991b1b' : '#334155', fontWeight: '600' }}
                                    >
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td style={{ padding: '1.2rem', color: '#64748b', fontSize: '0.9rem' }}>{u.email}</td>
                                <td style={{ padding: '1.2rem', color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                                <td style={{ padding: '1.2rem' }}>
                                    <button onClick={() => handleDelete(u.id)} style={{ padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const EventsManagement = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', event_date: '', description: '', fee: 0 });
    const [editingId, setEditingId] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/events.php');
            const data = await res.json();
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingId ? 'PUT' : 'POST';
            const payload = editingId ? { ...formData, id: editingId } : formData;
            const res = await fetch('http://127.0.0.1:8000/api/events.php', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                showSuccess(editingId ? 'Event updated!' : 'Event created!');
                setShowForm(false);
                setFormData({ title: '', event_date: '', description: '', fee: 0 });
                setEditingId(null);
                fetchEvents();
            }
        } catch (err) { alert('Error saving event'); }
    };

    const handleEdit = (event) => {
        setFormData(event);
        setEditingId(event.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this event?')) return;
        try {
            await fetch(`http://127.0.0.1:8000/api/events.php?id=${id}`, { method: 'DELETE' });
            showSuccess('Event deleted!');
            fetchEvents();
        } catch (err) { alert('Error deleting event'); }
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            {successMsg && <div style={{ marginBottom: '1.5rem', padding: '15px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', fontWeight: '700' }}>{successMsg}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>Event Management</h2>
                <button onClick={() => setShowForm(!showForm)} style={{
                    padding: '12px 24px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600'
                }}>
                    <Plus size={20} /> {showForm ? 'Cancel' : 'Add Event'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '2rem', background: '#f8fafc', borderRadius: '16px' }}>
                    <input className="admin-input" placeholder="Event Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <input className="admin-input" type="date" value={formData.event_date} onChange={e => setFormData({ ...formData, event_date: e.target.value })} required />
                    <input className="admin-input" type="number" placeholder="Fee (৳)" value={formData.fee} onChange={e => setFormData({ ...formData, fee: e.target.value })} />
                    <textarea className="admin-input" placeholder="Description" rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    <button type="submit" style={{ width: '100%', padding: '14px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700' }}>
                        {editingId ? 'Update' : 'Create'} Event
                    </button>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {events.map(event => (
                    <div key={event.id} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                        <div>
                            <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem' }}>{event.title}</h4>
                            <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#64748b' }}>
                                <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>
                                <span>💰 ৳{event.fee}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleEdit(event)} style={{ padding: '8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Edit size={16} /></button>
                            <button onClick={() => handleDelete(event.id)} style={{ padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AchievementsManagement = () => {
    const [achievements, setAchievements] = useState([]);
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ user_id: '', title: '', achievement_date: '', description: '', award_type: 'achievement', file_url: '' });
    const [editingId, setEditingId] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchAchievements();
        fetchUsers();
    }, []);

    const fetchAchievements = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/achievements.php');
            const data = await res.json();
            setAchievements(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/users.php');
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: fd });
            const data = await res.json();
            if (data.success) {
                setFormData({ ...formData, file_url: data.url });
                showSuccess('Certificate uploaded!');
            }
        } catch (err) { alert('Upload failed'); }
        finally { setUploading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingId ? 'PUT' : 'POST';
            const payload = editingId ? { ...formData, id: editingId } : formData;
            const res = await fetch('http://127.0.0.1:8000/api/achievements.php', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                showSuccess(editingId ? 'Award updated!' : 'Achievement awarded!');
                setShowForm(false);
                setFormData({ user_id: '', title: '', achievement_date: '', description: '', award_type: 'achievement', file_url: '' });
                setEditingId(null);
                fetchAchievements();
            }
        } catch (err) { alert('Error saving achievement'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Remove this achievement?')) return;
        try {
            await fetch(`http://127.0.0.1:8000/api/achievements.php?id=${id}`, { method: 'DELETE' });
            showSuccess('Achievement removed!');
            fetchAchievements();
        } catch (err) { alert('Error deleting achievement'); }
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            {successMsg && <div style={{ marginBottom: '1.5rem', padding: '15px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', fontWeight: '700' }}>{successMsg}</div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>Student Recognitions</h2>
                <button onClick={() => setShowForm(!showForm)} style={{
                    padding: '12px 24px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600'
                }}>
                    <Plus size={20} /> {showForm ? 'Cancel' : 'Award Student'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '2rem', background: '#fffbeb', borderRadius: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <select className="admin-input" value={formData.user_id} onChange={e => setFormData({ ...formData, user_id: e.target.value })} required>
                            <option value="">Select Student</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name} (@{u.username})</option>)}
                        </select>
                        <select className="admin-input" value={formData.award_type} onChange={e => setFormData({ ...formData, award_type: e.target.value })}>
                            <option value="achievement">General Achievement</option>
                            <option value="badge">Digital Badge</option>
                            <option value="certificate">Official Certificate</option>
                        </select>
                    </div>
                    <input className="admin-input" placeholder="Award Title (e.g. Olympiad Champion)" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    <input className="admin-input" type="date" value={formData.achievement_date} onChange={e => setFormData({ ...formData, achievement_date: e.target.value })} required />
                    <textarea className="admin-input" placeholder="Detailed Description" rows="4" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#3b82f6', color: 'white', borderRadius: '8px', cursor: 'pointer', width: 'fit-content' }}>
                            <FileText size={18} /> {uploading ? 'Uploading...' : 'Upload Certificate/Badge Image'}
                            <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>
                        {formData.file_url && <p style={{ fontSize: '0.8rem', color: '#059669', marginTop: '8px' }}>Asset Ready: {formData.file_url}</p>}
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '14px', background: '#d97706', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700' }}>
                        {editingId ? 'Update' : 'Issue'} Award
                    </button>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {achievements.map(ach => (
                    <div key={ach.id} style={{ padding: '1.5rem', border: '1px solid #fde68a', borderRadius: '16px', background: '#fffef3' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Award color="#d97706" size={24} />
                                <span style={{ padding: '2px 8px', background: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800' }}>{ach.award_type.toUpperCase()}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <button onClick={() => { setFormData(ach); setEditingId(ach.id); setShowForm(true); }} style={{ padding: '6px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Edit size={14} /></button>
                                <button onClick={() => handleDelete(ach.id)} style={{ padding: '6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                            </div>
                        </div>
                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: '#92400e' }}>{ach.title}</h4>
                        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>Student: {ach.student_name || 'Generic'}</p>
                        <p style={{ fontSize: '0.85rem', color: '#b45309', marginBottom: '0.5rem' }}>{new Date(ach.achievement_date).toLocaleDateString()}</p>
                        <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0 }}>{ach.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LeaderboardManagement = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({ user_id: '', points: 0, rank_title: '' });
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchLeaderboard();
        fetchUsers();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/leaderboard.php');
            const data = await res.json();
            setLeaderboard(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/users.php');
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://127.0.0.1:8000/api/leaderboard.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setSuccessMsg('Leaderboard updated!');
                setTimeout(() => setSuccessMsg(''), 3000);
                fetchLeaderboard();
                setFormData({ user_id: '', points: 0, rank_title: '' });
            }
        } catch (err) { alert('Error updating leaderboard'); }
    };

    return (
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            {successMsg && <div style={{ marginBottom: '1.5rem', padding: '15px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', fontWeight: '700' }}>{successMsg}</div>}

            <h2 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}>Leaderboard & Ranking</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: '3rem', padding: '2rem', background: '#f8fafc', borderRadius: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: '600' }}>Select Student</label>
                    <select className="admin-input" style={{ marginBottom: 0 }} value={formData.user_id} onChange={e => setFormData({ ...formData, user_id: e.target.value })} required>
                        <option value="">Select Student</option>
                        {users.map(u => u.role !== 'admin' && <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: '600' }}>Performance Points</label>
                    <input className="admin-input" style={{ marginBottom: 0 }} type="number" placeholder="Points" value={formData.points} onChange={e => setFormData({ ...formData, points: e.target.value })} required />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', fontWeight: '600' }}>Custom Rank (Optional)</label>
                    <input className="admin-input" style={{ marginBottom: 0 }} placeholder="e.g. Math Prodigy" value={formData.rank_title} onChange={e => setFormData({ ...formData, rank_title: e.target.value })} />
                </div>
                <button type="submit" style={{ padding: '14px 28px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Update Rank</button>
            </form>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                            <th style={{ padding: '1rem' }}>Rank</th>
                            <th style={{ padding: '1rem' }}>Student</th>
                            <th style={{ padding: '1rem' }}>Points</th>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>Last Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboard.map((entry, idx) => (
                            <tr key={entry.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem', fontWeight: '900', color: idx < 3 ? '#d97706' : '#64748b' }}>#{idx + 1}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: '700' }}>{entry.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>@{entry.username}</div>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: '800', color: '#10b981' }}>{entry.points} XP</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600' }}>{entry.rank_title}</span>
                                </td>
                                <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(entry.last_updated).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ExamsManagement = () => {
    const [exams, setExams] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', duration_minutes: 60, question_file_url: '', question_link: '', start_time: '', end_time: '', status: 'upcoming' });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [viewSubmissions, setViewSubmissions] = useState(null);
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/exams.php');
            const data = await res.json();
            setExams(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch(`${API_BASE_URL}/upload`, { method: 'POST', body: fd });
            const data = await res.json();
            if (data.success) {
                setFormData({ ...formData, question_file_url: data.url });
                showSuccess('Question file uploaded!');
            }
        } catch (err) { alert('Upload failed'); }
        finally { setUploading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingId ? 'PUT' : 'POST';
            const payload = editingId ? { ...formData, id: editingId } : formData;
            const res = await fetch('http://127.0.0.1:8000/api/exams.php', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                showSuccess(editingId ? 'Exam updated!' : 'Exam created!');
                setShowForm(false);
                setFormData({ title: '', description: '', duration_minutes: 60, question_file_url: '', question_link: '', start_time: '', end_time: '', status: 'upcoming' });
                setEditingId(null);
                fetchExams();
            }
        } catch (err) { alert('Error saving exam'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this exam?')) return;
        try {
            await fetch(`http://127.0.0.1:8000/api/exams.php?id=${id}`, { method: 'DELETE' });
            showSuccess('Exam deleted!');
            fetchExams();
        } catch (err) { alert('Error deleting exam'); }
    };

    const fetchSubmissions = async (exam) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/submissions.php?exam_id=${exam.id}`);
            const data = await res.json();
            setSubmissions(Array.isArray(data) ? data : []);
            setViewSubmissions(exam);
        } catch (err) { console.error(err); }
    };

    if (viewSubmissions) {
        return (
            <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ margin: 0 }}>Submissions: {viewSubmissions.title}</h2>
                    <button onClick={() => setViewSubmissions(null)} style={{ padding: '8px 16px', background: '#64748b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back to Exams</button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                                <th style={{ padding: '1rem' }}>Student</th>
                                <th style={{ padding: '1rem' }}>Answer</th>
                                <th style={{ padding: '1rem' }}>Tab Switches</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '700' }}>{s.student_name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>@{s.username}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {s.submission_file_url ? <a href={s.submission_file_url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontWeight: '600' }}>View File</a> : (s.submission_link ? <a href={s.submission_link} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>Link</a> : 'No file')}
                                    </td>
                                    <td style={{ padding: '1rem', color: s.tab_switches > 0 ? '#ef4444' : '#64748b', fontWeight: s.tab_switches > 0 ? '800' : '400' }}>
                                        {s.tab_switches} switches
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {s.is_terminated ? <span style={{ padding: '4px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>TERMINATED</span> : <span style={{ padding: '4px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' }}>SUBMITTED</span>}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(s.submitted_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2.5rem', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.15)' }}>
            {successMsg && <div style={{ marginBottom: '1.5rem', padding: '15px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', fontWeight: '700' }}>{successMsg}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>Exam Management</h2>
                <button onClick={() => setShowForm(!showForm)} style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
                    <Plus size={20} /> {showForm ? 'Cancel' : 'Create Exam'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '2rem', background: '#f8fafc', borderRadius: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input className="admin-input" placeholder="Exam Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        <input className="admin-input" type="number" placeholder="Duration (Minutes)" value={formData.duration_minutes} onChange={e => setFormData({ ...formData, duration_minutes: e.target.value })} required />
                    </div>
                    <textarea className="admin-input" placeholder="Instructions/Description" rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>Start Time</label>
                            <input className="admin-input" type="datetime-local" value={formData.start_time} onChange={e => setFormData({ ...formData, start_time: e.target.value })} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '5px' }}>End Time</label>
                            <input className="admin-input" type="datetime-local" value={formData.end_time} onChange={e => setFormData({ ...formData, end_time: e.target.value })} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: '#3b82f6', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                <FileText size={16} /> {uploading ? 'Uploading...' : 'Upload Question PDF'}
                                <input type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
                            </label>
                            {formData.question_file_url && <span style={{ fontSize: '0.75rem', color: '#10b981', marginLeft: '10px' }}>Uploaded!</span>}
                        </div>
                        <input className="admin-input" placeholder="Or Question Link" value={formData.question_link} onChange={e => setFormData({ ...formData, question_link: e.target.value })} />
                    </div>

                    <select className="admin-input" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                        <option value="upcoming">Upcoming</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                    </select>

                    <button type="submit" style={{ width: '100%', padding: '14px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700' }}>{editingId ? 'Update' : 'Schedule'} Exam</button>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {exams.map(e => (
                    <div key={e.id} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{e.title}</h4>
                                <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', background: e.status === 'active' ? '#d1fae5' : '#f1f5f9', color: e.status === 'active' ? '#065f46' : '#64748b' }}>{e.status.toUpperCase()}</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '5px' }}>
                                ⏱️ {e.duration_minutes} Min | 📅 {e.start_time ? new Date(e.start_time).toLocaleString() : 'Not set'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => fetchSubmissions(e)} style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>Submissions</button>
                            <button onClick={() => { setFormData(e); setEditingId(e.id); setShowForm(true); }} style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Edit size={18} /></button>
                            <button onClick={() => handleDelete(e.id)} style={{ padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GalleryManagement = ResourcesManagement;

const PlaceholderPanel = ({ title, description }) => (
    <div style={{ background: 'rgba(255,255,255,1)', padding: '3.5rem', borderRadius: '20px', boxShadow: '0 15px 50px rgba(0,0,0,0.1)', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e293b' }}>{title}</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>{description}</p>
        <div style={{ padding: '2.5rem', background: '#f8fafc', borderRadius: '16px', display: 'inline-block' }}>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: '500' }}>🏗️ Full CRUD implementation following in next sub-task...</p>
        </div>
    </div>
);

export default AdminDashboard;
