import React, { useEffect, useRef } from 'react';

const Hero = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                    const parallaxDistance = rect.top * 0.2;
                    const img = heroRef.current.querySelector('.hero-video');
                    if (img) {
                        img.style.transform = `scale(1.05) translateY(${parallaxDistance}px)`;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="hero" id="home" ref={heroRef}>
            <div className="video-container parallax-img">
                <img className="hero-video" src="/images/2 futuric_reception.jpg" alt="Futuric Corporate Reception" />
                <div className="video-overlay"></div>
            </div>

            <div className="hero-content">
                <div className="hero-text-main reveal active">
                    <h1>Building the Future<br/>of Enterprise.</h1>
                </div>
                <div className="hero-text-sub reveal active" style={{ transitionDelay: '0.1s' }}>
                    <p>A premium strategic parent brand driving intelligent industrial ecosystems and high-end services.</p>
                    <div className="hero-actions">
                        <a href="#businesses" className="btn-primary">Explore Ventures</a>
                        <a href="#contact-cta" className="btn-secondary">Contact Us</a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Hero;
