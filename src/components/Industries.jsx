import React from 'react';

const Industries = () => {
    const industriesList = [
        "Electronics Assembly",
        "Pharmaceuticals",
        "Food & Beverage",
        "Chemical Manufacturing",
        "Oil & Gas Extraction",
        "Smart Agriculture"
    ];

    return (
        <section id="industries" className="content-section alt-bg">
            <div className="section-container">
                <h2 className="section-title reveal active">Target Industries</h2>
                <div className="grid-3-col">
                    {industriesList.map((industry, index) => (
                        <div key={index} className="card reveal active" style={{ transitionDelay: `${index * 0.05}s`, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', textAlign: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '500' }}>{industry}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Industries;
