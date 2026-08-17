import React from 'react';

const ContactCTA = () => {
    return (
        <section id="contact-cta" className="content-section alt-bg" style={{ textAlign: 'center', padding: '12rem 0' }}>
            <div className="section-container">
                <h2 className="reveal active" style={{ fontSize: '4rem', fontWeight: '300', marginBottom: '3rem', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                    Let's build the factory<br/>you've imagined...
                </h2>
                <div className="reveal active" style={{ transitionDelay: '0.1s' }}>
                    <a href="mailto:contact@futuric.biz" className="btn-primary" style={{ fontSize: '1.2rem', padding: '1.2rem 3rem' }}>
                        Initiate Discussion
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ContactCTA;
