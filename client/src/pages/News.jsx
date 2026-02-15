import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Calendar, User, Share2, Check } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

const News = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) { }
        }

        fetch(`${API_BASE_URL}/news/${id}`)
            .then(res => res.json())
            .then(data => {
                setNews(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const copyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return <div className="container section" style={{ textAlign: 'center' }}>Loading...</div>;
    }

    if (!news) {
        return <div className="container section" style={{ textAlign: 'center' }}>News not found</div>;
    }

    const shareUrl = window.location.href;
    const shareTitle = news.title;
    const shareDescription = news.excerpt || news.content.substring(0, 200);
    const shareImage = news.image_url || 'https://placehold.co/1200x630?text=BAFSKMC+Math+Club';

    return (
        <>
            {/* Open Graph Meta Tags for Social Media */}
            <Helmet>
                <title>{news.title} - BAFSKMC Math Club</title>
                <meta name="description" content={shareDescription} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={shareUrl} />
                <meta property="og:title" content={shareTitle} />
                <meta property="og:description" content={shareDescription} />
                <meta property="og:image" content={shareImage} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={shareUrl} />
                <meta property="twitter:title" content={shareTitle} />
                <meta property="twitter:description" content={shareDescription} />
                <meta property="twitter:image" content={shareImage} />
            </Helmet>

            <div className="container section">
                <article style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <Link to="/" style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                            ← Back to Home
                        </Link>
                    </div>

                    {/* Title */}
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>{news.title}</h1>

                    {/* Meta Info */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem', color: '#64748b', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Calendar size={16} />
                            {new Date(news.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        {news.author_name && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={16} />
                                {news.author_name}
                            </div>
                        )}
                        {user && user.role === 'admin' && (
                            <button onClick={copyLink} style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: copied ? '#10b981' : '#3b82f6',
                                color: 'white', border: 'none', padding: '6px 12px',
                                borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem'
                            }}>
                                {copied ? <Check size={14} /> : <Share2 size={14} />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        )}
                    </div>

                    {/* Featured Image */}
                    {news.image_url && (
                        <img src={news.image_url} alt={news.title} style={{ width: '100%', borderRadius: '8px', marginBottom: '2rem' }} />
                    )}

                    {/* Content */}
                    <div style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        color: '#334155',
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        {news.content.split('\n').map((paragraph, idx) => (
                            <p key={idx} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
                        ))}
                    </div>

                    {/* Share Section */}
                    <div style={{ marginTop: '3rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Share this news</h3>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', backgroundColor: '#1877f2', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
                                Facebook
                            </a>
                            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', backgroundColor: '#1da1f2', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
                                Twitter
                            </a>
                            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 20px', backgroundColor: '#0077b5', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
                                LinkedIn
                            </a>
                        </div>
                    </div>
                </article>
            </div>
        </>
    );
};

export default News;
