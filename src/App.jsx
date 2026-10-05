import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';
import './styles.css';

export default function App() {
  const [copiedField, setCopiedField] = useState(null);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="page-wrapper">
      {/* Blurred Architectural Background */}
      <div className="bg-backdrop-container" aria-hidden="true">
        <div className="bg-image-blurred" style={{ backgroundImage: "url('/images/2 futuric_reception.jpg')" }} />
        <div className="bg-overlay-gradient" />
        <div className="bg-orb orb-primary" />
        <div className="bg-orb orb-secondary" />
        <div className="bg-noise" />
      </div>

      {/* Navigation Header */}
      <header className="uc-header">
        <div className="header-inner">
          <div className="uc-brand">
            <img 
              src="/images/logo-futuric-transparent.png" 
              alt="Futuric" 
              className="brand-logo"
            />
          </div>

          <div className="header-actions">
            <a 
              href="https://www.nexafuturic.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="header-link nexa-chip"
            >
              <span>NEXA Smart Factory</span>
              <span className="live-indicator">LIVE</span>
              <ArrowUpRight size={14} />
            </a>
            
            <a href="mailto:hello@futuric.com.au" className="header-cta">
              <Mail size={14} />
              <span>Get in Touch</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="uc-main">
        <div className="uc-container">
          
          {/* Status Badge */}
          <div className="status-pill">
            <span className="pulse-dot"></span>
            <span className="pill-text">WEBSITE UNDER CONSTRUCTION</span>
            <span className="pill-separator">•</span>
            <span className="pill-sub">NEW DIGITAL PORTAL LAUNCHING SOON</span>
          </div>

          {/* Hero Typography */}
          <section className="uc-hero">
            <h1 className="uc-title">
              Building the <br />
              <span className="text-gradient">Future of Enterprise.</span>
            </h1>
            <p className="uc-lead">
              Our central corporate experience is currently undergoing an architectural evolution. 
              Futuric drives intelligent industrial ecosystems and high-performance ventures across Australia and globally.
            </p>
          </section>

          {/* NEXA Active Platform Highlight Card */}
          <section className="live-portal-banner">
            <div className="portal-banner-content">
              <div className="portal-badge">
                <Sparkles size={14} />
                <span>FLAGSHIP VENTURE IS ACTIVE</span>
              </div>
              <h3>Explore NEXA by Futuric</h3>
              <p>
                Our industry-leading smart factory transformation platform is fully operational. 
                Experience next-generation industrial AI, IoT, robotics, and connected operations.
              </p>
            </div>
            <div className="portal-banner-action">
              <a 
                href="https://www.nexafuturic.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-nexa-redirect"
              >
                <span>Visit nexafuturic.com</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </section>

          {/* Executive Contact Glassmorphism Card */}
          <section className="contact-card" id="contact">
            <div className="contact-card-header">
              <div className="section-eyebrow">
                <span className="eyebrow-line"></span>
                <span>GET IN TOUCH</span>
              </div>
              <h2 className="contact-title">Let's build something intelligent.</h2>
              <p className="contact-subtitle">
                Ready to transform your factory floor? Our team of engineers and AI architects are ready to help you scale.
              </p>
            </div>

            {/* Office & Direct Contact Details */}
            <div className="contact-details-grid">
              
              {/* Engineering Office Meta Card */}
              <div className="contact-detail-box office-box">
                <div className="detail-icon-wrap">
                  <Building2 size={22} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">OFFICE SPECIFICATION</span>
                  <h4>Engineering Office</h4>
                  <p>Parent group headquarters overseeing industrial intelligence, robotics & software engineering.</p>
                </div>
              </div>

              {/* Email Us */}
              <div className="contact-detail-box">
                <div className="detail-icon-wrap">
                  <Mail size={22} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">DIRECT INQUIRIES</span>
                  <h4>Email us</h4>
                  <a 
                    href="mailto:hello@futuric.com.au" 
                    className="detail-value-link"
                    title="Send an email to hello@futuric.com.au"
                  >
                    hello@futuric.com.au
                  </a>
                </div>
                <button 
                  type="button"
                  className="copy-btn"
                  onClick={() => copyToClipboard('hello@futuric.com.au', 'email')}
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedField === 'email' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Phone (AU) */}
              <div className="contact-detail-box">
                <div className="detail-icon-wrap">
                  <Phone size={22} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">TELEPHONE (AUSTRALIA)</span>
                  <h4>Phone (AU)</h4>
                  <a 
                    href="tel:+61469129200" 
                    className="detail-value-link"
                    title="Call +61 469 129 200"
                  >
                    +61 469 129 200
                  </a>
                </div>
                <button 
                  type="button"
                  className="copy-btn"
                  onClick={() => copyToClipboard('+61 469 129 200', 'phone')}
                  title="Copy phone number"
                  aria-label="Copy phone number"
                >
                  {copiedField === 'phone' ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Head Office */}
              <div className="contact-detail-box">
                <div className="detail-icon-wrap">
                  <MapPin size={22} />
                </div>
                <div className="detail-content">
                  <span className="detail-label">LOCATION</span>
                  <h4>Head Office</h4>
                  <p className="detail-value-text">Perth, Western Australia</p>
                  <span className="location-presence">Global coverage: Australia · UAE · Qatar · KSA · India</span>
                </div>
              </div>

            </div>

            {/* Quick Actions Footer inside Card */}
            <div className="contact-actions-bar">
              <a 
                href="mailto:hello@futuric.com.au?subject=Inquiry%20regarding%20Futuric%20and%20NEXA" 
                className="btn-primary"
              >
                <Mail size={16} />
                <span>Send us an Email</span>
                <ArrowUpRight size={16} />
              </a>

              <a 
                href="tel:+61469129200" 
                className="btn-secondary"
              >
                <Phone size={16} />
                <span>Call +61 469 129 200</span>
              </a>

              <a 
                href="https://www.nexafuturic.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-ghost"
              >
                <span>Launch NEXA Portal</span>
                <ExternalLink size={15} />
              </a>
            </div>

            {copiedField && (
              <div className="toast-notification">
                <Check size={15} />
                <span>Copied {copiedField === 'email' ? 'email address' : 'phone number'} to clipboard</span>
              </div>
            )}
          </section>

        </div>
      </main>

      {/* Minimal Editorial Footer */}
      <footer className="uc-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="f-logo">futuric<span className="accent-dot">.</span></span>
            <span className="f-tagline">Intelligent Industrial Ecosystems</span>
          </div>

          <div className="footer-credentials">
            <span>© {new Date().getFullYear()} Futuric Pty Ltd</span>
            <span className="dot-divider">•</span>
            <span>ABN 27692 201 166</span>
            <span className="dot-divider">•</span>
            <span>ACN 692 201 166</span>
          </div>

          <div className="footer-status">
            <Clock size={13} />
            <span>Systems Upgrading · Perth, WA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
