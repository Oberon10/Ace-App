'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Clock, 
  Award, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  Search, 
  FileText,
  Package
} from 'lucide-react';

export default function Footer({ setView }) {
  return (
    <footer style={{
      backgroundColor: 'var(--color-dark-navy)',
      color: 'rgba(255, 255, 255, 0.85)',
      paddingTop: '56px',
      paddingBottom: '32px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)'
    }} className="ace-footer">
      <div className="ace-container">
        
        {/* ===================================================
            DESKTOP FOOTER (Visible on > 860px)
            =================================================== */}
        <div className="footer-desktop-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '40px',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)'
        }}>
          {/* Col 1: ACE Logistics */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', textDecoration: 'none' }}>
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
            </Link>

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
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', padding: 0 }}>
              <li>
                <Link href="/about" style={{ textDecoration: 'none', color: 'rgba(255, 255, 255, 0.75)' }}>
                  About ACE Logistics
                </Link>
              </li>
              <li>
                <Link href="/services" style={{ textDecoration: 'none', color: 'rgba(255, 255, 255, 0.75)' }}>
                  Freight Services & Fleet
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ textDecoration: 'none', color: 'rgba(255, 255, 255, 0.75)' }}>
                  Contact Global Hubs
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" style={{ textDecoration: 'none', color: 'rgba(255, 255, 255, 0.75)' }}>
                  Global Network Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, marginBottom: '18px', letterSpacing: '0.02em' }}>
              Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', padding: 0 }}>
              <li>
                <Link href="/tracking" style={{ textDecoration: 'none', color: 'rgba(255, 255, 255, 0.75)' }}>
                  Track Shipment
                </Link>
              </li>
              <li>
                <Link href="/quote" style={{ textDecoration: 'none', color: 'rgba(255, 255, 255, 0.75)' }}>
                  Get a Rate Quote
                </Link>
              </li>
              <li>
                <Link href="/new-shipment" style={{ textDecoration: 'none', color: 'rgba(255, 255, 255, 0.75)' }}>
                  Send a Package
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ textDecoration: 'none', color: 'rgba(255, 255, 255, 0.75)' }}>
                  24/7 Cargo Help Center
                </Link>
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

        {/* ===================================================
            MOBILE FOOTER (Visible on <= 860px)
            Clean, structured, well-spaced, and organized
            =================================================== */}
        <div className="footer-mobile-container" style={{ display: 'none', flexDirection: 'column', gap: '24px', paddingBottom: '28px' }}>
          
          {/* 1. Mobile Brand Header */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', textDecoration: 'none' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-bright-action)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
                  <path d="M14 44L28 16H36L50 44H41L38 37H26L23 44H14ZM29 30H35L32 23L29 30Z" fill="#FFFFFF"/>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  ACE LOGISTICS
                </span>
                <div style={{ fontSize: '10px', color: '#90CDF4', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Global Multi-Modal Freight
                </div>
              </div>
            </Link>

            <p style={{ color: 'rgba(255, 255, 255, 0.72)', fontSize: '13px', lineHeight: 1.55, marginBottom: '14px' }}>
              Connecting businesses and global supply chains with real-time satellite tracking and customs certainty.
            </p>

            {/* Trust Badges in a compact mobile pill row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                color: '#E0F2FE'
              }}>
                <ShieldCheck size={13} color="#38BDF8" />
                <span>IATA & FIATA Certified</span>
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                color: '#E0F2FE'
              }}>
                <Clock size={13} color="#38BDF8" />
                <span>24/7 Satellite Telemetry</span>
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                color: '#E0F2FE'
              }}>
                <Award size={13} color="#38BDF8" />
                <span>99.8% On-Time SLA</span>
              </div>
            </div>
          </div>

          {/* 2. Mobile Quick Actions Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px'
          }}>
            <Link
              href="/tracking"
              className="ace-btn ace-btn-action"
              style={{
                width: '100%',
                height: '42px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <Search size={14} />
              <span>Track Cargo</span>
            </Link>

            <Link
              href="/quote"
              className="ace-btn ace-btn-secondary"
              style={{
                width: '100%',
                height: '42px',
                fontSize: '13px',
                fontWeight: 700,
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textDecoration: 'none'
              }}
            >
              <FileText size={14} />
              <span>Rate Quote</span>
            </Link>
          </div>

          {/* 3. Organized 2-Column Links Navigation */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '16px 14px',
            border: '1px solid rgba(255, 255, 255, 0.07)'
          }}>
            {/* Col A: Company & Fleet */}
            <div>
              <div style={{
                color: '#38BDF8',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px'
              }}>
                Company
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                <li>
                  <Link 
                    href="/about" 
                    style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '13px', display: 'block' }}
                  >
                    About ACE Logistics
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/services" 
                    style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '13px', display: 'block' }}
                  >
                    Freight & Fleet
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/analytics" 
                    style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '13px', display: 'block' }}
                  >
                    Global Analytics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col B: Support & Consignments */}
            <div>
              <div style={{
                color: '#38BDF8',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px'
              }}>
                Support
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0 }}>
                <li>
                  <Link 
                    href="/tracking" 
                    style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '13px', display: 'block' }}
                  >
                    Track Shipment
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/new-shipment" 
                    style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '13px', display: 'block' }}
                  >
                    Send a Package
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none', fontSize: '13px', display: 'block' }}
                  >
                    24/7 Cargo Help
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 4. Global Hubs & Dispatch Card */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Globe size={15} color="#38BDF8" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Global Hubs & Operations Desk
              </span>
            </div>

            {/* Worldwide Hub Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {['Accra Hub', 'London LHR', 'Rotterdam Port', 'New York JFK', 'Singapore Yard'].map((hub, i) => (
                <span key={i} style={{
                  fontSize: '10.5px',
                  backgroundColor: 'rgba(7, 59, 92, 0.8)',
                  color: '#BAE6FD',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(56, 189, 248, 0.2)'
                }}>
                  {hub}
                </span>
              ))}
            </div>

            {/* Direct Contact Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <a 
                href="tel:+233302770990" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#F0F9FF',
                  textDecoration: 'none',
                  flexWrap: 'wrap'
                }}
              >
                <Phone size={13} color="#38BDF8" style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>+233 (0) 302 770 990 • +44 20 7946 0912</span>
              </a>

              <a 
                href="mailto:dispatch@acelogistics.com" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#F0F9FF',
                  textDecoration: 'none',
                  flexWrap: 'wrap'
                }}
              >
                <Mail size={13} color="#38BDF8" style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>dispatch@acelogistics.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* ===================================================
            COMMON BOTTOM TAGLINE & COPYRIGHT
            =================================================== */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.65)'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#EAF5FC', fontStyle: 'italic' }}>
            "Moving the World, One Shipment at a Time"
          </div>

          <div style={{ fontSize: '11.5px', lineHeight: 1.4 }}>
            © 2026 ACE Logistics Global Ltd. Registered IATA & FIATA Cargo Agent.
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .footer-desktop-grid {
            display: none !important;
          }
          .footer-mobile-container {
            display: flex !important;
          }
          .ace-footer {
            padding-top: 36px !important;
            padding-bottom: 24px !important;
          }
        }
      `}</style>
    </footer>
  );
}
