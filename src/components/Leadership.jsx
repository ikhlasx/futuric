import React from 'react';

const Leadership = () => {
    const leaders = [
        { name: "Dr Ashique Ahmed" },
        { name: "Mohammed Sehil Elayoden" },
        { name: "Yogesh Ravichandran" },
        { name: "Sohaj Elayodan" },
        { name: "Ikhlas Pv" }
    ];

    return (
        <section id="leadership" className="content-section alt-bg">
            <div className="section-container">
                <h2 className="section-title reveal active">Leadership</h2>
                <div className="grid-3-col">
                    {leaders.map((leader, index) => (
                        <div key={index} className="card reveal active" style={{ transitionDelay: `${index * 0.1}s`, textAlign: 'center', padding: '3rem 1rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-border)', margin: '0 auto 1.5rem auto' }}></div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0' }}>{leader.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Leadership;
