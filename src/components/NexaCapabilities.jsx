import React from 'react';

const NexaCapabilities = () => {
    const capabilities = [
        {
            title: "Strategy with a Ship Date",
            desc: "We don't just consult. We architect scalable industrial solutions with precise deployment timelines and guaranteed operational metrics."
        },
        {
            title: "Everything Connected",
            desc: "Unifying legacy machines with modern IoT sensors to create a singular, transparent data lake across your entire production floor."
        },
        {
            title: "Custom Automation",
            desc: "Bespoke robotic integration designed around your unique manufacturing challenges, minimizing human intervention in high-risk zones."
        },
        {
            title: "Artificial Intelligence",
            desc: "Predictive maintenance, computer vision quality control, and adaptive scheduling driven by edge-deployed neural networks."
        }
    ];

    return (
        <section id="nexa-capabilities" className="content-section">
            <div className="section-container">
                <h2 className="section-title reveal active">NEXA Capabilities</h2>
                <div className="grid-2-col" style={{ gap: '2rem' }}>
                    {capabilities.map((cap, index) => (
                        <div key={index} className="card reveal active" style={{ transitionDelay: `${index * 0.1}s` }}>
                            <h3>{cap.title}</h3>
                            <p>{cap.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NexaCapabilities;
