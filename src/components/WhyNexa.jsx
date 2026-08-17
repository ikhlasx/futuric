import React from 'react';

const WhyNexa = () => {
    return (
        <section id="why-nexa" className="content-section">
            <div className="section-container">
                <h2 className="section-title reveal active">Why NEXA</h2>
                <div className="grid-3-col">
                    <div className="card reveal active">
                        <h3>Fully Customised Solutions</h3>
                        <p>We do not sell off-the-shelf software. Every NEXA deployment is bespoke, engineered specifically for your factory's layout, machinery, and production goals.</p>
                    </div>
                    <div className="card reveal active" style={{ transitionDelay: '0.1s' }}>
                        <h3>Technology Agnostic Expertise</h3>
                        <p>We integrate with your existing legacy systems and preferred vendors. Our unified platform bridges the gap between disparate industrial protocols.</p>
                    </div>
                    <div className="card reveal active" style={{ transitionDelay: '0.2s' }}>
                        <h3>End-to-End Partnership</h3>
                        <p>From initial blueprint to post-deployment support. We manage the hardware sourcing, software development, installation, and operator training.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyNexa;
