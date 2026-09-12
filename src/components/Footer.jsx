import React from 'react';
import { ShieldCheck, Clock, Award, Globe, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ setView }) {
  const handleNav = (v) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: 'var(--color-dark-navy)',
      color: 'rgba(255, 255, 255, 0.85)',
      paddingTop: '64px',
      paddingBottom: '32px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <div className="ace-container">
        {/* Main 4-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          {/* Col 1: ACE Logistics */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-bright-action)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
                  <path d="M14 44L28 16H36L50 44H41L38 37H26L23 44H14ZM29 30H35L32 23L29 30Z" fill="#FFFFFF"/>
                </svg>
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                ACE LOGISTICS
              </span>
            </div>

            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13.5px', lineHeight: 1.6, marginBottom: '20px' }}>
              Connecting businesses and global supply chains with end-to-end multi-modal freight services.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.9)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={15} color="#38BDF8" />
                <span>Global Logistics Network</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={15} color="#38BDF8" />
                <span>Secure & On-Time Guaranteed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={15} color="#38BDF8" />
                <span>Reliable Customs Brokerage</span>
              </div>
            </div>
          </div>

          {/* Col 2: Company */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, marginBottom: '18px', letterSpacing: '0.02em' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li>
                <button onClick={() => handleNav('about')} style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.75)', cursor: 'pointer', padding: 0 }}>
                  About ACE Logistics
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('services')} style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.75)', cursor: 'pointer', padding: 0 }}>
                  Freight Services & Fleet
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.75)', cursor: 'pointer', padding: 0 }}>
                  Contact Global Hubs
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('analytics')} style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.75)', cursor: 'pointer', padding: 0 }}>
                  Global Network Analytics
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, marginBottom: '18px', letterSpacing: '0.02em' }}>
              Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
              <li>
                <button onClick={() => handleNav('track')} style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.75)', cursor: 'pointer', padding: 0 }}>
                  Track Shipment
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('quote')} style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.75)', cursor: 'pointer', padding: 0 }}>
                  Get a Rate Quote
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('new-shipment')} style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.75)', cursor: 'pointer', padding: 0 }}>
                  Send a Package
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.75)', cursor: 'pointer', padding: 0 }}>
                  24/7 Cargo Help Center
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Operations & Contact */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, marginBottom: '18px', letterSpacing: '0.02em' }}>
              Worldwide Hubs
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="#38BDF8" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Accra • London • Rotterdam • New York • Singapore • Dubai</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#38BDF8" style={{ flexShrink: 0 }} />
                <span>+233 (0) 302 770 990 / +44 20 7946 0912</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#38BDF8" style={{ flexShrink: 0 }} />
                <span>dispatch@acelogistics.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tagline & Copyright */}
        <div style={{
          paddingTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.65)'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#EAF5FC' }}>
            "Moving the World, One Shipment at a Time"
          </div>

          <div>
            © 2026 ACE Logistics Global Ltd. All rights reserved. Registered IATA & FIATA Cargo Agent.
          </div>
        </div>
      </div>
    </footer>
  );
}
