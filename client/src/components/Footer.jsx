import React from 'react';
import { Mail, Phone, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white', paddingTop: '3rem', paddingBottom: '1rem' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <h3>BAFSKMC Math Club</h3>
                        <p style={{ color: 'var(--color-text-light)', marginTop: '0.5rem' }}>
                            Inspiring minds to solve the unsolved.
                        </p>
                    </div>

                    <div>
                        <h4>Quick Links</h4>
                        <ul style={{ listStyle: 'none', marginTop: '0.5rem' }}>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/events">Upcoming Events</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4>Contact</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} /> mathclub@bafskmc.edu.bd</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} /> +880 1234 567890</div>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>
                    © {new Date().getFullYear()} BAF Shaheen College Kurmitola Math Club. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
