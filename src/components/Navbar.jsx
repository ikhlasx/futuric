import React from 'react';

const Navbar = () => {
    return (
        <nav className="navbar" id="navbar">
            <div className="nav-container">
                <a href="#" className="logo">
                    <img src="/images/logo-futuric-transparent.png" alt="Futuric Logo" />
                </a>
                <div className="nav-links">
                    <a href="#businesses">Ventures</a>
                    <a href="#nexa-flagship">NEXA</a>
                    <a href="#about">About</a>
                    <a href="#leadership">Leadership</a>
                </div>
                <div className="nav-actions">
                    <a href="#contact-cta" className="btn-primary" style={{ padding: '0.6rem 1.5rem' }}>Connect</a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
