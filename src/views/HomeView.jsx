import React, { useState } from 'react';
import { 
  Search, 
  ArrowRight, 
  Plane, 
  Ship, 
  Truck, 
  Train, 
  ShieldCheck, 
  Clock, 
  Globe2, 
  Package, 
  Award, 
  CheckCircle2, 
  MapPin, 
  TrendingUp,
  FileText,
  Anchor,
  Compass
} from 'lucide-react';

export default function HomeView({ setView, onSearchTracking }) {
  const [trackingInput, setTrackingInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearchTracking(trackingInput.trim());
    }, 350);
  };

  const quickTrack = (number) => {
    setTrackingInput(number);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearchTracking(number);
    }, 250);
  };

  const services = [
    {
      title: "Air Freight Priority",
      desc: "Fast international delivery for time-sensitive cargo with temperature-controlled options and direct charters.",
      icon: Plane,
      image: "/images/air-cargo.jpg",
      transit: "1–3 Days"
    },
    {
      title: "Ocean Container Shipping",
      desc: "FCL and LCL global sea freight forwarding with premier container carriers like ELBSPIRIT.",
      icon: Ship,
      image: "/images/container-ship.jpg",
      transit: "12–25 Days"
    },
    {
      title: "Interstate Road Fleet",
      desc: "Dedicated heavy haulage and express interstate trucking with real-time GPS telemetry and telematics.",
      icon: Truck,
      image: "/images/truck-freight.jpg",
      transit: "24–48 Hours"
    },
    {
      title: "Intermodal Rail Corridors",
      desc: "Cost-effective, low-emission rail cargo routing for bulk raw materials, industrial machinery, and containers.",
      icon: Train,
      image: "/images/freight-train.jpg",
      transit: "3–6 Days"
    },
    {
      title: "Customs & Port Logistics",
      desc: "Licensed customs brokerage, bonded warehousing, dangerous goods compliance, and import clearance.",
      icon: ShieldCheck,
      image: "/images/container-port.jpg",
      transit: "Same Day Clearance"
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-very-light-blue)' }}>
      {/* ===================================================
          HERO SECTION — FEATURING ELBSPIRIT CONTAINER SHIP
          =================================================== */}
      <section style={{
        position: 'relative',
        backgroundColor: 'var(--color-dark-navy)',
        color: '#FFFFFF',
        paddingTop: '48px',
        paddingBottom: '80px',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Ambient background glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22, 131, 216, 0.25) 0%, rgba(7, 59, 92, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="ace-container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Two-Column Hero: Headline + CTAs (Left) & Container Ship Image Showcase (Right) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
            gap: '40px',
            alignItems: 'center',
            marginBottom: '48px'
          }} className="hero-grid">
            {/* Left Column: Headline, Supporting Text & CTAs */}
            <div>
              {/* Trust Pill */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#90CDF4',
                marginBottom: '20px'
              }}>
                <ShieldCheck size={14} color="#38BDF8" />
                <span>Certified International Freight & Supply Chain Carrier</span>
              </div>

              {/* Main Headline (Section 7) */}
              <h1 style={{
                fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                marginBottom: '18px'
              }}>
                Fast, Reliable & Secure Global Logistics
              </h1>

              {/* Supporting Text (Section 7) */}
              <p style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.2rem)',
                color: '#D9E7F0',
                lineHeight: 1.6,
                marginBottom: '28px'
              }}>
                Ship with confidence. Track every shipment from pickup to delivery.
              </p>

              {/* 3 Primary Buttons (Section 7) */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '28px'
              }} className="hero-action-buttons">
                <button
                  onClick={() => setView('track')}
                  className="ace-btn ace-btn-action ace-btn-lg"
                >
                  <Search size={16} />
                  <span>TRACK SHIPMENT</span>
                </button>

                <button
                  onClick={() => setView('new-shipment')}
                  className="ace-btn ace-btn-primary ace-btn-lg"
                  style={{ backgroundColor: '#0e5f94', borderColor: '#1683D8' }}
                >
                  <Package size={16} />
                  <span>SEND A PACKAGE</span>
                </button>

                <button
                  onClick={() => setView('quote')}
                  className="ace-btn ace-btn-secondary ace-btn-lg"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                >
                  <span>GET A QUOTE</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Operational Proof Bullets */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                fontSize: '12.5px',
                color: 'rgba(255, 255, 255, 0.75)',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                paddingTop: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} color="#10B981" />
                  <span>Real-Time Satellite Telemetry</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} color="#10B981" />
                  <span>99.8% On-Time Delivery SLA</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} color="#10B981" />
                  <span>Bonded Customs Clearance</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image Showcase (ELBSPIRIT Container Ship) */}
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.18)'
            }}>
              <img
                src="/images/container-ship.jpg"
                alt="ACE Logistics Container Vessel ELBSPIRIT"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'cover',
                  maxHeight: '440px'
                }}
              />

              {/* Floating Top Telemetry Pill */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                backgroundColor: 'rgba(7, 59, 92, 0.88)',
                color: '#FFFFFF',
                backdropFilter: 'blur(6px)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '11.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                <span>Live Telemetry • Vessel: ELBSPIRIT</span>
              </div>

              {/* Floating Bottom Metadata Overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(7, 42, 66, 0.95) 0%, rgba(7, 59, 92, 0.75) 70%, transparent 100%)',
                padding: '28px 20px 16px',
                color: '#FFFFFF'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#EAF5FC' }}>
                      North Sea Deep-Water Transit Corridor
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#90CDF4', marginTop: '2px' }}>
                      IMO: 9483243 • Capacity: 4,200 TEU • Destination: Rotterdam Port
                    </div>
                  </div>
                  <span style={{
                    backgroundColor: 'var(--color-bright-action)',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: '6px',
                    textTransform: 'uppercase'
                  }}>
                    On Schedule
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================
              SECTION 8: TRACKING COMPONENT (Prominent Card)
              =================================================== */}
          <div style={{ maxWidth: '820px', margin: '0 auto' }}>
            <div className="ace-card" style={{
              backgroundColor: 'var(--color-white)',
              boxShadow: 'var(--shadow-elevated)',
              border: '1px solid var(--color-border)',
              padding: '32px 28px',
              borderRadius: '16px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', color: 'var(--color-primary-blue)', fontWeight: 700, marginBottom: '6px' }}>
                  Track Your Shipment
                </h3>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                  Enter your tracking number to get real-time shipment updates.
                </p>
              </div>

              <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} className="hero-track-form">
                <div style={{ flex: '1 1 280px', position: 'relative' }}>
                  <div className="ace-input-icon">
                    <Search size={18} color="var(--color-primary-blue)" />
                  </div>
                  <input
                    type="text"
                    className="ace-input ace-input-with-icon"
                    placeholder="Enter tracking number (e.g. ACE-2026-8F72K9)"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    style={{ height: '48px', fontSize: '14.5px', fontWeight: 500 }}
                  />
                </div>

                <button
                  type="submit"
                  className="ace-btn ace-btn-action"
                  disabled={isSearching}
                  style={{ height: '48px', padding: '0 28px', fontSize: '15px' }}
                >
                  {isSearching ? 'Searching...' : 'Track'}
                </button>
              </form>

              {/* Quick-fill sample tracking badges for instant testing */}
              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Quick Test:</span>
                <button
                  type="button"
                  onClick={() => quickTrack('ACE-2026-8F72K9')}
                  style={{ background: 'var(--color-light-blue)', border: '1px solid #c2e0f4', color: 'var(--color-primary-blue)', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '11.5px' }}
                >
                  ACE-2026-8F72K9 (In Transit, Ghana)
                </button>
                <button
                  type="button"
                  onClick={() => quickTrack('ACE-2026-3M91L4')}
                  style={{ background: 'var(--color-light-blue)', border: '1px solid #c2e0f4', color: 'var(--color-primary-blue)', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '11.5px' }}
                >
                  ACE-2026-3M91L4 (Delivered, Rotterdam)
                </button>
                <button
                  type="button"
                  onClick={() => quickTrack('ACE-2026-7B42W1')}
                  style={{ background: 'var(--color-light-blue)', border: '1px solid #c2e0f4', color: 'var(--color-primary-blue)', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '11.5px' }}
                >
                  ACE-2026-7B42W1 (Processing, NYC)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          TRUST METRICS COUNTER
          =================================================== */}
      <section style={{ backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-border)', padding: '32px 0' }}>
        <div className="ace-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary-blue)', lineHeight: 1.1 }}>99.8%</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>On-Time Delivery SLA</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary-blue)', lineHeight: 1.1 }}>180+</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>Countries & Territories</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary-blue)', lineHeight: 1.1 }}>2.4M+</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>Annual Shipments Handled</div>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary-blue)', lineHeight: 1.1 }}>100%</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>Verified Telemetry & Traceability</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          SERVICES SECTION (Modern Cards)
          =================================================== */}
      <section style={{ padding: '72px 0', backgroundColor: 'var(--color-very-light-blue)' }}>
        <div className="ace-container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Multi-Modal Logistics
            </span>
            <h2 style={{ fontSize: '28px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '4px', marginBottom: '12px' }}>
              Comprehensive Global Logistics Solutions
            </h2>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
              From priority air freight charters to intercontinental container lines and customs brokerage, ACE delivers complete supply chain certainty.
            </p>
          </div>

          {/* Multi-Modal Services Grid: 3 on top, 2 on bottom resized to fit width of 3 above */}
          <div className="services-multi-grid">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const isBottomRow = idx >= 3;
              return (
                <div 
                  key={idx} 
                  className={`ace-card ace-card-interactive ${isBottomRow ? 'services-card-bottom' : 'services-card-top'}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: 0,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ height: isBottomRow ? '195px' : '165px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={service.image} 
                      alt={service.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(7, 59, 92, 0.85)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '12px',
                      backdropFilter: 'blur(4px)'
                    }}>
                      Transit: {service.transit}
                    </div>
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--color-light-blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-primary-blue)'
                        }}>
                          <Icon size={20} strokeWidth={2.2} />
                        </div>
                        <h3 style={{ fontSize: isBottomRow ? '18px' : '17px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                          {service.title}
                        </h3>
                      </div>

                      <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                        {service.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => setView('services')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-bright-action)',
                        fontWeight: 600,
                        fontSize: '13.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <span>Explore Service Details</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 20: GLOBAL COVERAGE SECTION
          =================================================== */}
      <section style={{
        padding: '72px 0',
        backgroundColor: 'var(--color-white)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="ace-container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Worldwide Connectivity
              </span>
              <h2 style={{ fontSize: '32px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '6px', marginBottom: '16px' }}>
                Global Reach. Local Care.
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                Connecting businesses and people across borders with reliable logistics solutions. Our integrated intermodal infrastructure links manufacturing hubs in Africa, Europe, North America, and Asia with synchronized customs clearance and continuous tracking.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Accra Airport Air Hub</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Rotterdam Euro Port</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>New York JFK Gateway</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#10B981" />
                  <span>Singapore Maritime Yard</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setView('quote')} className="ace-btn ace-btn-action">
                  <span>Calculate Route Quote</span>
                  <ArrowRight size={15} />
                </button>
                <button onClick={() => setView('contact')} className="ace-btn ace-btn-secondary">
                  <span>Locate Local Hub</span>
                </button>
              </div>
            </div>

            {/* Visual Logistics Map / Route Graphic */}
            <div style={{
              backgroundColor: 'var(--color-dark-navy)',
              borderRadius: 'var(--radius-section)',
              padding: '24px',
              border: '1px solid #164e72',
              boxShadow: 'var(--shadow-elevated)',
              color: '#FFFFFF'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Globe2 size={18} color="#38BDF8" />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#EAF5FC' }}>ACE Global Freight Corridors</span>
                </div>
                <span style={{ fontSize: '11px', color: '#90CDF4', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                  Active Network
                </span>
              </div>

              {/* Vector Globe Route Diagram */}
              <div style={{ position: 'relative', height: '240px', backgroundColor: '#0A3757', borderRadius: '10px', overflow: 'hidden' }}>
                <svg width="100%" height="100%" viewBox="0 0 500 240">
                  <defs>
                    <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1683D8" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                  
                  {/* Subtle Grid */}
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#164e72" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#164e72" strokeWidth="0.5" strokeDasharray="4 4" />
                  <line x1="0" y1="180" x2="500" y2="180" stroke="#164e72" strokeWidth="0.5" strokeDasharray="4 4" />

                  {/* Arcs connecting hubs */}
                  <path d="M 80 100 Q 180 30 240 90" fill="none" stroke="url(#routeGrad)" strokeWidth="2.5" strokeDasharray="6 3" />
                  <path d="M 240 90 Q 340 50 420 130" fill="none" stroke="url(#routeGrad)" strokeWidth="2.5" strokeDasharray="6 3" />
                  <path d="M 240 90 Q 230 180 260 210" fill="none" stroke="url(#routeGrad)" strokeWidth="2.5" strokeDasharray="6 3" />
                  <path d="M 80 100 Q 150 160 260 210" fill="none" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="4 4" />

                  {/* Hub Nodes */}
                  <circle cx="80" cy="100" r="6" fill="#FFFFFF" stroke="#1683D8" strokeWidth="2.5" />
                  <text x="80" y="85" fill="#EAF5FC" fontSize="10" fontWeight="600" textAnchor="middle">New York</text>

                  <circle cx="240" cy="90" r="6" fill="#FFFFFF" stroke="#1683D8" strokeWidth="2.5" />
                  <text x="240" y="75" fill="#EAF5FC" fontSize="10" fontWeight="600" textAnchor="middle">Rotterdam / LHR</text>

                  <circle cx="260" cy="210" r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                  <text x="260" y="230" fill="#6EE7B7" fontSize="11" fontWeight="700" textAnchor="middle">Accra Hub</text>

                  <circle cx="420" cy="130" r="6" fill="#FFFFFF" stroke="#1683D8" strokeWidth="2.5" />
                  <text x="420" y="115" fill="#EAF5FC" fontSize="10" fontWeight="600" textAnchor="middle">Singapore</text>
                </svg>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#90CDF4' }}>
                <span>Real-Time Fleet Coordination</span>
                <span>Active Flights: 42 • Active Vessels: 18</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          CALL TO ACTION BANNER
          =================================================== */}
      <section className="ace-cta-banner" style={{
        padding: '54px 0',
        backgroundColor: 'var(--color-primary-blue)',
        color: '#FFFFFF'
      }}>
        <div className="ace-container" style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>
            Ready to Streamline Your Supply Chain?
          </h2>
          <p style={{ fontSize: '15px', color: '#D9E7F0', lineHeight: 1.6, marginBottom: '24px' }}>
            Open an ACE Logistics corporate account today for priority scheduling, volume discounts, and full API integration.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={() => setView('new-shipment')} className="ace-btn ace-btn-action ace-btn-lg">
              <span>Book Your First Shipment</span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => setView('login')} className="ace-btn ace-btn-secondary ace-btn-lg">
              <span>Client Portal Sign In</span>
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .services-multi-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 24px;
        }
        .services-card-top {
          grid-column: span 2;
        }
        .services-card-bottom {
          grid-column: span 3;
        }
        @media (max-width: 960px) {
          .services-multi-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .services-card-top, .services-card-bottom {
            grid-column: span 1 !important;
          }
        }
        @media (max-width: 860px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .services-multi-grid {
            grid-template-columns: 1fr !important;
          }
          .services-card-top, .services-card-bottom {
            grid-column: span 1 !important;
          }
          .hero-action-buttons {
            flex-direction: column !important;
          }
          .hero-action-buttons button {
            width: 100% !important;
            justifyContent: center !important;
          }
          .hero-track-form {
            flex-direction: column !important;
          }
          .hero-track-form input,
          .hero-track-form button {
            width: 100% !important;
            justifyContent: center !important;
          }
        }
      `}</style>
    </div>
  );
}
