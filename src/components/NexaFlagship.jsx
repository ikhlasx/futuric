import React from 'react';

const NexaFlagship = () => {
    return (
        <section id="nexa-flagship" className="content-section alt-bg">
            <div className="section-container">
                <div className="grid-2-col">
                    <div className="text-block">
                        <h2 className="reveal active">Tomorrow's Factory.<br/>Built Today.</h2>
                        <p className="reveal active" style={{ transitionDelay: '0.1s' }}>
                            NEXA by Futuric represents the pinnacle of Industry 4.0 evolution. We integrate advanced robotics, artificial intelligence, and edge computing to construct fully autonomous manufacturing ecosystems.
                        </p>
                        <div className="reveal active" style={{ transitionDelay: '0.2s', marginTop: '2rem' }}>
                            <a href="https://nexafuturic.com" target="_blank" rel="noopener noreferrer" className="btn-primary">
                                Enter NEXA Platform
                            </a>
                        </div>
                    </div>
                    <div className="image-block reveal active" style={{ transitionDelay: '0.3s' }}>
                        <img src="/images/nexa.png" alt="NEXA Factory Integration" style={{ width: '100%', borderRadius: '4px', border: '1px solid var(--color-border)' }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NexaFlagship;
