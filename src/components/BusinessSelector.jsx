import React, { useState } from 'react';

const BusinessSelector = () => {
    const [activeTab, setActiveTab] = useState('nexa');

    const businesses = [
        { id: 'nexa', title: 'NEXA', subtitle: 'Smart Factory Transformation' },
        { id: 'augmind', title: 'AugMind', subtitle: 'Secure Intelligence Platform' },
        { id: 'forma', title: 'Forma', subtitle: 'Premium Digital Products' },
        { id: 'hardrock', title: 'HardRock', subtitle: 'Luxury Home Automation' },
        { id: 'oryx', title: 'Oryx Visa', subtitle: 'Global Mobility Services' }
    ];

    const panels = {
        nexa: {
            title: 'NEXA by Futuric',
            desc: 'A premium Industry 4.0 platform driving smart factory transformation and connected operations. We integrate AI, IoT, robotics, and computer vision to deliver unprecedented operational visibility and industrial intelligence.',
            image: '/images/nexa.png'
        },
        augmind: {
            title: 'AugMind',
            desc: 'A secure AI workflow and documentation intelligence platform. Providing structured enterprise support for high-complexity environments with a focus on governance and uncompromising quality.',
            image: '/images/augmind.png'
        },
        forma: {
            title: 'Forma',
            desc: 'Our premium software development wing. Building custom digital products, scalable platforms, and modern enterprise systems defined by elegant execution and scalable architecture.',
            image: '/images/forma.png'
        },
        hardrock: {
            title: 'HardRock',
            desc: 'The ultimate premium home automation brand. Uniting luxury smart living through seamless control of lighting, security, climate, and connected lifestyle systems.',
            image: '/images/hardrock.png'
        },
        oryx: {
            title: 'Oryx Visa',
            desc: 'A premium visa support service delivering clarity, guidance, and confidence. We provide a trusted pathway through complex applications and international documentation.',
            image: '/images/oryx.png'
        }
    };

    return (
        <section id="businesses" className="business-section">
            <div className="section-container">
                <div className="business-layout">
                    {/* Left Panel: Selector */}
                    <div className="business-selector">
                        <h2 className="section-title reveal active">UNAPOLOGETIC IN PRESENCE</h2>
                        <ul className="business-list">
                            {businesses.map((biz) => (
                                <li 
                                    key={biz.id}
                                    className={`business-item ${activeTab === biz.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(biz.id)}
                                >
                                    <h3>{biz.title}</h3>
                                    <p>{biz.subtitle}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Right Panel: Display */}
                    <div className="business-display">
                        {Object.keys(panels).map((key) => {
                            const panel = panels[key];
                            return (
                                <div key={key} className={`business-panel ${activeTab === key ? 'active' : ''}`} id={key}>
                                    <div className="panel-image" style={{ backgroundImage: `url('${panel.image}')` }}></div>
                                    <div className="panel-content">
                                        <h2>{panel.title}</h2>
                                        <p className="panel-desc">{panel.desc}</p>
                                        <div className="panel-actions">
                                            <a href="#" className="btn-primary">Visit Website</a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusinessSelector;
