import React, { useEffect, useState } from 'react';

const Activities = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch events from PHP API
    useEffect(() => {
        fetch('http://localhost:8000/api/events.php') // Assuming PHP server runs on 8000 or similar
            .then(res => res.json())
            .then(data => {
                setEvents(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch events", err);
                setLoading(false);
                // Fallback or empty state
            });
    }, []);

    return (
        <div className="container section">
            <h1 className="text-center" style={{ marginBottom: '2rem' }}>Activities & Events</h1>

            {loading ? (
                <p className="text-center">Loading events...</p>
            ) : events.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {events.map(event => (
                        <div key={event.id} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--color-primary)' }}>
                            <div style={{ padding: '1.5rem' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                                    {new Date(event.event_date).toLocaleDateString()}
                                </div>
                                <h3 style={{ marginBottom: '1rem' }}>{event.title}</h3>
                                <p style={{ marginBottom: '1rem' }}>{event.description}</p>
                                {/* Manual Payment Link */}
                                <a href="/payment" style={{ display: 'block', textAlign: 'center', backgroundColor: 'var(--color-secondary)', color: 'white', padding: '10px', borderRadius: '4px', textDecoration: 'none' }}>
                                    Register / Pay Fee (TK {event.fee})
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center">
                    <p>No upcoming events at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default Activities;
