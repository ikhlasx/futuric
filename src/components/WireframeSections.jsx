import React from 'react';

const WireframeSections = () => {
    return (
        <React.Fragment>
            {/* Section 1: Product Spotlight */}
            <section className="wireframe-section">
                <div className="wf-container wf-spotlight">
                    <div className="wf-title wf-orange"></div>
                    <div className="wf-subtitle wf-gray"></div>
                    <div className="wf-dashboard wf-gray wf-box"></div>
                </div>
            </section>

            {/* Section 2: Chat Bubbles */}
            <section className="wireframe-section">
                <div className="wf-container wf-chat-section">
                    <div className="wf-chat-bubble wf-gray"></div>
                    <div className="wf-chat-bubble"></div>
                    <div className="wf-chat-bubble wf-gray"></div>
                </div>
            </section>

            {/* Section 3: Comparison Table */}
            <section className="wireframe-section">
                <div className="wf-container">
                    <div className="wf-comparison-title wf-gray"></div>
                    <div className="wf-comparison-table">
                        <div className="wf-col">
                            <div className="wf-cell wf-gray"></div>
                            <div className="wf-cell wf-gray"></div>
                            <div className="wf-cell wf-gray"></div>
                            <div className="wf-cell wf-gray"></div>
                        </div>
                        <div className="wf-col highlight">
                            <div className="wf-cell wf-orange"></div>
                            <div className="wf-cell wf-orange"></div>
                            <div className="wf-cell wf-orange"></div>
                            <div className="wf-cell wf-orange"></div>
                        </div>
                        <div className="wf-col">
                            <div className="wf-cell wf-gray"></div>
                            <div className="wf-cell wf-gray"></div>
                            <div className="wf-cell wf-gray"></div>
                            <div className="wf-cell wf-gray"></div>
                        </div>
                        <div className="wf-col">
                            <div className="wf-cell wf-gray"></div>
                            <div className="wf-cell wf-gray"></div>
                            <div className="wf-cell wf-gray"></div>
                            <div className="wf-cell wf-gray"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Deep Handle Console */}
            <section className="wireframe-section">
                <div className="wf-container wf-console">
                    <div className="wf-console-left wf-gray wf-box"></div>
                    <div className="wf-console-right wf-gray wf-box"></div>
                </div>
            </section>

            {/* Section 5: Integration */}
            <section className="wireframe-section">
                <div className="wf-container wf-integration">
                    <div className="wf-step wf-gray"></div>
                    <div className="wf-step wf-gray"></div>
                    <div className="wf-step wf-gray"></div>
                </div>
            </section>

            {/* Section 6: Cards */}
            <section className="wireframe-section">
                <div className="wf-container wf-cards">
                    <div className="wf-card wf-gray wf-box"></div>
                    <div className="wf-card wf-gray wf-box"></div>
                    <div className="wf-card wf-gray wf-box"></div>
                    <div className="wf-card wf-gray wf-box"></div>
                </div>
            </section>

            {/* Section 7: FAQ Accordion */}
            <section className="wireframe-section wf-faq-container">
                <div className="wf-container">
                    <div className="wf-faq-box wf-dark">
                        <div className="wf-faq-item"></div>
                        <div className="wf-faq-item"></div>
                        <div className="wf-faq-item"></div>
                        <div className="wf-faq-item"></div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default WireframeSections;
