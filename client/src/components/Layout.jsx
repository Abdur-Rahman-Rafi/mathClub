import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, position: 'relative' }}>
                <div className="math-bg"></div>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
