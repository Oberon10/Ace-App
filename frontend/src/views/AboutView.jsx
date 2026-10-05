import React from 'react';
import { 
  ShieldCheck, 
  Globe2, 
  CheckCircle2, 
  ArrowRight, 
  Anchor, 
  Plane, 
  Truck, 
  Train 
} from 'lucide-react';

export default function AboutView({ setView }) {
  return (
    <div style={{ backgroundColor: 'var(--color-very-light-blue)' }}>
      {/* ===================================================
          HERO SECTION — HIGH-IMPACT SHOWCASE & CORPORATE WRITE-UP
          =================================================== */}
      <section className="ace-about-hero-section" style={{
        background: 'linear-gradient(135deg, #072A42 0%, #0B4F7C 55%, #061F33 100%)',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        padding: '56px 0 64px'
      }}>
        {/* Ambient background glow accents */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 0, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="ace-container">
          <div className="about-hero-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
            gap: '44px',
            alignItems: 'center'
          }}>
            {/* Left Column: The Comprehensive Write-Up */}
            <div>
              {/* Category Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.28)',
                padding: '6px 14px',
                borderRadius: '24px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#38BDF8',
                marginBottom: '16px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}>
                <Globe2 size={14} color="#38BDF8" />
                <span>Corporate Infrastructure & Global Network</span>
              </div>

              {/* Main Headline */}
              <h1 style={{
                fontSize: 'clamp(28px, 4.5vw, 42px)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.18,
                marginBottom: '16px',
                letterSpacing: '-0.025em'
              }}>
                About ACE Logistics Global
              </h1>

              {/* Lead Paragraph */}
              <p style={{
                fontSize: '16px',
                color: '#E0EDF6',
                lineHeight: 1.7,
                marginBottom: '16px',
                fontWeight: 400
              }}>
                Leading international freight forwarding, bonded container logistics, and multimodal supply chain infrastructure connecting developing industrial hubs with worldwide commerce.
              </p>

              {/* Secondary Detail Paragraph */}
              <p style={{
                fontSize: '14px',
                color: '#94A3B8',
                lineHeight: 1.65,
                marginBottom: '28px'
              }}>
                Operating across 180+ global destinations, ACE Logistics combines certified carrier assets—container ships, cargo jets, interstate tractors, and freight rail—with proprietary satellite tracking to deliver unmatched operational reliability.
              </p>

              {/* Key Capabilities / Metric Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '32px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  backdropFilter: 'blur(6px)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '15px' }}>
                    <CheckCircle2 size={16} color="#10B981" />
                    <span>40+ Terminal Hubs</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#90CDF4', marginTop: '4px' }}>
                    Bonded multi-modal gateways
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  backdropFilter: 'blur(6px)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '15px' }}>
                    <CheckCircle2 size={16} color="#10B981" />
                    <span>99.8% On-Time SLA</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#90CDF4', marginTop: '4px' }}>
                    Guaranteed transit timetables
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.14)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  backdropFilter: 'blur(6px)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 700, fontSize: '15px' }}>
                    <CheckCircle2 size={16} color="#10B981" />
                    <span>180+ Destinations</span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#90CDF4', marginTop: '4px' }}>
                    Across 4 continents worldwide
                  </div>
                </div>
              </div>

              {/* Call-to-Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => setView('quote')} 
                  className="ace-btn ace-btn-action"
                  style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 700 }}
                >
                  <span>Request Freight Quote</span>
                  <ArrowRight size={15} />
                </button>
                <button 
                  onClick={() => setView('contact')} 
                  className="ace-btn ace-btn-secondary"
                  style={{
                    padding: '12px 22px',
                    fontSize: '14px',
                    fontWeight: 600,
                    backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                    color: '#FFFFFF'
                  }}
                >
                  <span>Contact Stations</span>
                </button>
              </div>
            </div>

            {/* Right Column: Prominent, High-Visibility Hero Picture Showcase */}
            <div>
              <div className="about-hero-image-frame" style={{
                position: 'relative',
                borderRadius: '18px',
                overflow: 'hidden',
                border: '2px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(56, 189, 248, 0.3)',
                backgroundColor: '#072A42'
              }}>
                {/* Live Operations Badge */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  zIndex: 3,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(7, 42, 66, 0.88)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    boxShadow: '0 0 10px #10B981',
                    display: 'inline-block'
                  }} />
                  <span>Operations Hub • 24/7 Dispatch</span>
                </div>

                {/* Highly Visible Hero Picture - 100% Crisp & Un-obscured */}
                <img 
                  src="/images/corporate-logistics-hub.jpg" 
                  alt="ACE Logistics Global Corporate Hub & Operations Terminal" 
                  style={{
                    width: '100%',
                    height: '380px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  className="about-hero-showcase-img"
                />

                {/* Bottom Overlay Information Bar with Frost Glass */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(7, 42, 66, 0.95) 0%, rgba(7, 42, 66, 0.72) 60%, rgba(7, 42, 66, 0) 100%)',
                  padding: '24px 20px 18px',
                  color: '#FFFFFF',
                  zIndex: 2
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                        Global Operations Campus & Fleet Terminal
                      </div>
                      <div style={{ fontSize: '12px', color: '#90CDF4', marginTop: '2px' }}>
                        Central coordination center managing intercontinental logistics
                      </div>
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: 'rgba(56, 189, 248, 0.2)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#38BDF8'
                    }}>
                      <ShieldCheck size={13} color="#38BDF8" />
                      <span>ISO 9001 Certified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ace-container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* Vision Card */}
        <div className="ace-card about-vision-card" style={{ padding: '40px', marginBottom: '40px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
            gap: '36px',
            alignItems: 'center'
          }} className="about-split">
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-blue)', textTransform: 'uppercase' }}>
                Our Mission & Foundation
              </span>
              <h2 style={{ fontSize: 'clamp(20px, 5vw, 26px)', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '4px', marginBottom: '16px' }}>
                "Moving the World, One Shipment at a Time"
              </h2>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
                ACE Logistics was established to solve cross-border supply chain friction through technology, certified carrier infrastructure, and unyielding adherence to delivery SLAs. Operating across four continents, our bonded terminals and proprietary satellite tracking ensure every container, pallet, and priority parcel arrives intact and on schedule.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>IATA Cargo Agent Accredited</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>FIATA Multimodal Licensed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>WCO Authorized Economic Operator</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>ISO 9001:2015 Certified Fleet</span>
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
              <img src="/images/global-logistics-network.jpg" alt="ACE Logistics Global Supply Chain Network" style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(7, 42, 66, 0.92) 0%, rgba(7, 42, 66, 0.2) 70%, transparent 100%)',
                padding: '12px 16px',
                color: '#FFFFFF'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>Global Supply Chain & Intercontinental Network</div>
                <div style={{ fontSize: '11px', color: '#90CDF4' }}>Connecting African industrial hubs with worldwide commercial trade lanes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Transport Fleet Grid */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '24px', color: 'var(--color-primary-blue)', fontWeight: 800, textAlign: 'center', marginBottom: '32px' }}>
            Integrated Multimodal Fleet Assets
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '24px' }}>
            <div className="ace-card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src="/images/container-ship.jpg" alt="ELBSPIRIT Container Ship" style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-blue)', marginBottom: '4px' }}>
                  <Anchor size={16} />
                  <strong style={{ fontSize: '15px' }}>Marine Vessel Fleet</strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Long-haul container vessels including ELBSPIRIT providing reliable deep-sea links between Europe, Africa, and North America.
                </p>
              </div>
            </div>

            <div className="ace-card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src="/images/truck-freight.jpg" alt="Gordon Trucking Tractor" style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-blue)', marginBottom: '4px' }}>
                  <Truck size={16} />
                  <strong style={{ fontSize: '15px' }}>Overland Tractor Units</strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Heavy haulage Freightliner tractors with aerodynamic fairings and real-time electronic logging devices.
                </p>
              </div>
            </div>

            <div className="ace-card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src="/images/air-cargo.jpg" alt="Air Cargo Jet" style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-blue)', marginBottom: '4px' }}>
                  <Plane size={16} />
                  <strong style={{ fontSize: '15px' }}>Air Freight Charters</strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Dedicated cargo jets operating daily priority routes into London Heathrow, Kotoka Accra, and Frankfurt.
                </p>
              </div>
            </div>

            <div className="ace-card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src="/images/freight-train.jpg" alt="Vectron Rail" style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-blue)', marginBottom: '4px' }}>
                  <Train size={16} />
                  <strong style={{ fontSize: '15px' }}>Electric Rail Freight</strong>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Vectron 6193 intermodal electric trains moving high-tonnage containers across central European corridors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="ace-cta-banner" style={{
          color: '#FFFFFF',
          borderRadius: 'var(--radius-card)',
          padding: '36px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
            Ready to Partner with ACE Logistics?
          </h3>
          <p style={{ fontSize: '14.5px', color: '#D9E7F0', maxWidth: '600px', margin: '0 auto 24px' }}>
            Contact our operations command center to open a corporate account or book freight.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => setView('quote')} className="ace-btn ace-btn-action">
              <span>Calculate Shipping Quote</span>
              <ArrowRight size={15} />
            </button>
            <button onClick={() => setView('contact')} className="ace-btn ace-btn-secondary">
              <span>Contact Stations</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .about-hero-image-frame {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .about-hero-image-frame:hover {
          transform: translateY(-3px);
          box-shadow: 0 28px 60px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(56, 189, 248, 0.45) !important;
        }
        .about-hero-showcase-img {
          transition: transform 0.6s ease;
        }
        .about-hero-image-frame:hover .about-hero-showcase-img {
          transform: scale(1.03);
        }
        @media (max-width: 960px) {
          .about-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .about-hero-showcase-img {
            height: 320px !important;
          }
        }
        @media (max-width: 820px) {
          .about-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .ace-about-hero-section {
            padding: 36px 0 44px !important;
          }
          .about-hero-showcase-img {
            height: 260px !important;
          }
          .about-vision-card {
            padding: 20px 16px !important;
          }
        }
        @media (max-width: 480px) {
          .about-vision-card {
            padding: 16px 14px !important;
          }
          .ace-cta-banner {
            padding: 24px 16px !important;
          }
          .ace-cta-banner .ace-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
