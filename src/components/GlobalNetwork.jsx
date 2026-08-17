import React from 'react';

const GlobalNetwork = () => {
    const locations = [
        "Perth", "Melbourne", "Dubai", "Sharjah", "Abu Dhabi", "Doha", "Riyadh", "Bangalore"
    ];

    return (
        <section id="global-network" className="content-section">
            <div className="section-container">
                <h2 className="section-title reveal active">Global Network</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    {locations.map((loc, index) => (
                        <div key={index} className="reveal active" style={{ transitionDelay: `${index * 0.05}s`, padding: '1rem 2rem', border: '1px solid var(--color-border)', borderRadius: '30px', color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                            {loc}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GlobalNetwork;
