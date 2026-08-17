import React from 'react';

const Performance = () => {
    const metrics = [
        { label: "OEE Improvement", value: "+34%" },
        { label: "Cycle Time Reduction", value: "-22%" },
        { label: "First Pass Yield", value: "99.8%" },
        { label: "Machine Uptime", value: "99.9%" },
        { label: "Scrap Reduction", value: "-60%" },
        { label: "Quality Incidents", value: "Near Zero" }
    ];

    return (
        <section id="performance" className="content-section alt-bg">
            <div className="section-container">
                <h2 className="section-title reveal active">Target Performance Metrics</h2>
                <div className="grid-3-col">
                    {metrics.map((metric, index) => (
                        <div key={index} className="stat-card reveal active" style={{ transitionDelay: `${index * 0.1}s` }}>
                            <div className="stat-value">{metric.value}</div>
                            <div className="stat-label">{metric.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Performance;
