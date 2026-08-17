import React from 'react';

const DeliveryProcess = () => {
    const steps = [
        { title: "1. Discovery & Assessment", desc: "Deep audit of existing floor layout and operational bottlenecks." },
        { title: "2. Roadmap & Proposal", desc: "Detailed technical architecture and ROI timeline." },
        { title: "3. Pilot & Validation", desc: "Controlled environment testing of core AI and robotics systems." },
        { title: "4. Build & Deploy", desc: "Full-scale implementation during planned operational downtime." },
        { title: "5. Launch & Training", desc: "System activation and comprehensive workforce upskilling." },
        { title: "6. Maintenance & Aftercare", desc: "24/7 monitoring, predictive maintenance, and continuous optimization." }
    ];

    return (
        <section id="delivery-process" className="content-section">
            <div className="section-container">
                <h2 className="section-title reveal active">Delivery Process</h2>
                <div className="grid-3-col">
                    {steps.map((step, index) => (
                        <div key={index} className="card reveal active" style={{ transitionDelay: `${index * 0.1}s`, borderLeft: '3px solid var(--color-brand-accent)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                            <p style={{ fontSize: '0.9rem' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DeliveryProcess;
