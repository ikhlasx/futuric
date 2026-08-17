import React from 'react';

const Footer = () => {
    return (
        <footer id="footer" className="footer">
            <div className="section-container">
                <div className="footer-grid">
                    <div className="footer-brand" style={{ maxWidth: '300px' }}>
                        <h2>Futuric.</h2>
                        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                            Onyx Tower, Dubai, UAE <br/>
                            Company Registration Number: 123456789
                        </p>
                    </div>
                    <div className="footer-links" style={{ display: 'flex', gap: '4rem' }}>
                        <div>
                            <h4>Navigation</h4>
                            <a href="#businesses">Ventures</a>
                            <a href="#nexa-flagship">NEXA</a>
                            <a href="#about">About</a>
                            <a href="#leadership">Leadership</a>
                        </div>
                        <div>
                            <h4>Locations</h4>
                            <a href="#">Australia</a>
                            <a href="#">UAE</a>
                            <a href="#">India</a>
                        </div>
                        <div>
                            <h4>Inquiries</h4>
                            <a href="mailto:contact@futuric.biz">contact@futuric.biz</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
