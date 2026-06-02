import React from 'react';

const About = () => {
    return (
        <section id="about" className="about-section">
            <div className="section-container">
                <div className="about-grid">
                    <div className="about-text">
                        <h2 className="section-title reveal active">UNMISTAKABLE CRAFTSMANSHIP</h2>
                        <p className="reveal active" style={{ transitionDelay: '0.1s' }}>
                            Futuric represents the absolute peak of modern enterprise execution. We reject the noise. Our ethos is built upon the foundational principles of clarity, engineering superiority, and breathtaking aesthetic delivery.
                        </p>
                        <p className="reveal active" style={{ transitionDelay: '0.2s' }}>
                            Whether optimizing autonomous robotics floors beneath the NEXA banner, or constructing the framework behind a luxury lifestyle with HardRock, the structural DNA remains identical: We build for the future.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
