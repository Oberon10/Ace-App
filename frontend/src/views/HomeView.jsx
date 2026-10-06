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
  Compass,
  RefreshCw,
  Radio
} from 'lucide-react';
import TestimonialsSection from '../components/TestimonialsSection';

export default function HomeView({ 
  setView, 
  onSearchTracking, 
  activeRole = 'guest', 
  onSendPackageClick 
}) {
  const [trackingInput, setTrackingInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleTrackSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = trackingInput.trim();
    if (!query) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearchTracking(query);
    }, 300);
  };

  const handleSendPackage = () => {
    if (onSendPackageClick) {
      onSendPackageClick();
    } else if (activeRole === 'guest') {
      setView('login');
    } else {
      setView('new-shipment');
    }
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
          STREAMLINED DAYLIGHT HERO SECTION — CONNECTING BUSINESSES. MOVING THE WORLD.
          =================================================== */}
      <section className="ace-daylight-hero" id="home-primary-hero">
        <div className="ace-container" style={{ width: '100%' }}>
          <div className="daylight-hero-content">
            {/* Kicker / Subtitle */}
            <div className="daylight-hero-kicker">
              <span>GLOBAL LOGISTICS</span>
              <span className="kicker-dot">•</span>
              <span>FREIGHT</span>
              <span className="kicker-dot">•</span>
              <span>DELIVERY</span>
            </div>

            {/* Main Headline (Razor-Sharp Vector Typography) */}
            <h1 className="daylight-hero-title">
              <span className="title-navy">Connecting Businesses.</span>
              <br />
              <span className="title-orange">Moving the World.</span>
            </h1>

            {/* Supporting Description */}
            <p className="daylight-hero-desc">
              Seamless logistics solutions built to move your cargo safely, efficiently, and on time—across cities, borders, and continents.
            </p>

            {/* Action Buttons (100% Native, Highly Responsive & Accessible) */}
            <div className="daylight-hero-actions">
              <button
                onClick={() => {
                  if (setView) {
                    setView('quote');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (onSendPackageClick) {
                    onSendPackageClick();
                  }
                }}
                className="daylight-quote-btn"
                id="hero-primary-quote-btn"
                aria-label="Get an instant freight quote"
              >
                <span>Get a Quote</span>
                <span className="btn-arrow">→</span>
              </button>

              <button
                onClick={() => {
                  const trackEl = document.getElementById('home-consignment-input') || document.getElementById('shipment-telemetry-root');
                  if (trackEl) {
                    trackEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => trackEl.focus(), 320);
                  } else if (setView) {
                    setView('track');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="daylight-track-btn"
                id="hero-secondary-track-btn"
                aria-label="Track your shipment in real time"
              >
                <MapPin size={18} />
                <span>Track Your Shipment</span>
              </button>
            </div>

            {/* 3 Value Prop Feature Badges */}
            <div className="daylight-hero-badges">
              <div 
                className="daylight-badge-item"
                onClick={() => { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                title="Priority Express Air & Fleet Delivery"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
              >
                <div className="badge-icon-wrap">
                  <Truck size={18} strokeWidth={2.2} />
                </div>
                <span>Fast Delivery</span>
              </div>

              <div 
                className="daylight-badge-item"
                onClick={() => { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                title="Worldwide Multimodal Corridors Across 190+ Countries"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
              >
                <div className="badge-icon-wrap">
                  <Globe2 size={18} strokeWidth={2.2} />
                </div>
                <span>Global Reach</span>
              </div>

              <div 
                className="daylight-badge-item"
                onClick={() => { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                title="Licensed Port Customs & Real-Time Satellite Telemetry"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') { setView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
              >
                <div className="badge-icon-wrap">
                  <ShieldCheck size={18} strokeWidth={2.2} />
                </div>
                <span>Reliable Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          SECTION 8: TRACKING COMPONENT (Prominent Card)
          =================================================== */}
      <section className="home-quick-track-section" style={{
        padding: '56px 0 32px',
        backgroundColor: 'var(--color-very-light-blue)'
      }}>
        <div className="ace-container">
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div className="ace-card home-tracking-card" style={{
              backgroundImage: "linear-gradient(145deg, rgba(5, 20, 36, 0.94) 0%, rgba(7, 38, 62, 0.90) 100%), url('/images/container-port.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              padding: '24px 28px 20px',
              borderRadius: '16px',
              color: '#FFFFFF'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  backgroundColor: 'rgba(56, 189, 248, 0.15)', 
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '3px 12px', 
                  borderRadius: '20px', 
                  fontSize: '11px', 
                  fontWeight: 700, 
                  color: '#38BDF8', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em',
                  marginBottom: '6px'
                }}>
                  <Radio size={12} color="#38BDF8" className="animate-pulse" />
                  <span>Real-Time Satellite Freight Telemetry</span>
                </div>
                <h3 style={{ fontSize: '24px', color: '#FFFFFF', fontWeight: 800, margin: '2px 0 4px', letterSpacing: '-0.01em' }}>
                  Track Your Shipment
                </h3>
                <p style={{ fontSize: '13.5px', color: '#CBD5E1', margin: '0 auto', maxWidth: '640px', lineHeight: 1.45 }}>
                  Locate, enter your consignment or tracking number to get real-time GPS telemetry, waypoint logs, and estimated arrival.
                </p>
              </div>

              <div style={{ width: '100%', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <label 
                  htmlFor="home-consignment-input" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '7px', 
                    fontSize: '14px', 
                    fontWeight: 700, 
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                  className="consignment-tracking-label"
                >
                  <MapPin size={16} color="#FF6B00" />
                  <span>Enter your consignment tracking number:</span>
                </label>
                <span style={{ fontSize: '12px', color: '#90CDF4', fontWeight: 500 }}>
                  Format: ACE-XXXX-XXXXX (e.g. ACE-2T34-79011)
                </span>
              </div>

              <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }} className="hero-track-form">
                <div style={{ flex: '1 1 280px', minWidth: 0, position: 'relative' }}>
                  <div className="ace-input-icon">
                    <Search size={18} color="#0284C7" />
                  </div>
                  <input
                    id="home-consignment-input"
                    type="text"
                    className="ace-input ace-input-with-icon"
                    placeholder="Enter your registered tracking number (e.g. ACE-2T34-79011)"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    style={{ 
                      height: '52px', 
                      fontSize: 'clamp(13.5px, 1.1vw, 15px)', 
                      fontWeight: 500, 
                      width: '100%',
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #38BDF8',
                      color: '#0F172A',
                      borderRadius: '10px',
                      paddingLeft: '44px',
                      paddingRight: '14px'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="ace-btn ace-btn-action"
                  disabled={isSearching}
                  style={{ height: '48px', padding: '0 28px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {isSearching ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search size={16} />
                      <span>Track Shipment</span>
                    </>
                  )}
                </button>
              </form>

              {/* Professional format guidance & real-time telemetry security indicators */}
              <div className="home-tracking-security-bar" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#10B981" />
                  <span>Standard AWB / Bill of Lading format (e.g. <strong className="security-awb-tag" style={{ color: 'var(--color-primary-blue)' }}>ACE-2T34-79011</strong>)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11.5px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                    24/7 Satellite Telemetry
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284C7', display: 'inline-block' }} />
                    Tamper-Evident Security Seal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          TRUST METRICS COUNTER
          =================================================== */}
      <section className="home-trust-metrics-section" style={{ backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-border)', padding: '32px 0' }}>
        <div className="ace-container">
          <div className="home-metrics-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
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
          <div className="home-global-reach-grid">
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

              <div className="home-hubs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>Accra Airport Air Hub</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>Rotterdam Euro Port</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>New York JFK Gateway</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <CheckCircle2 size={16} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>Singapore Maritime Yard</span>
                </div>
              </div>

              <div className="home-global-reach-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
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
              <div className="home-vector-map-canvas" style={{ position: 'relative', height: '240px', backgroundColor: '#0A3757', borderRadius: '10px', overflow: 'hidden' }}>
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
          CUSTOMER TESTIMONIALS SECTION
          =================================================== */}
      <TestimonialsSection />

      {/* ===================================================
          CALL TO ACTION BANNER
          =================================================== */}
      <section className="ace-cta-banner">
        <div className="ace-container" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', color: '#FFFFFF', fontWeight: 800, marginBottom: '12px' }}>
            Ready to Streamline Your Supply Chain?
          </h2>
          <p style={{ fontSize: '15px', color: '#D9E7F0', lineHeight: 1.6, marginBottom: '24px' }}>
            Open an ACE Logistics corporate account today for priority scheduling, volume discounts, and full API integration.
          </p>
          <div className="cta-banner-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={handleSendPackage} className="ace-btn ace-btn-action ace-btn-lg">
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
        /* ===================================================
           SWEET & CLEAR DAYLIGHT HERO SECTION (RAZOR-SHARP TEXT)
           =================================================== */
        .ace-daylight-hero {
          position: relative;
          width: 100%;
          min-height: calc(100vh - 86px);
          display: flex;
          align-items: center;
          background-color: #F8FAFC;
          background-image: 
            linear-gradient(
              90deg, 
              rgba(255, 255, 255, 0.98) 0%, 
              rgba(255, 255, 255, 0.94) 36%, 
              rgba(255, 255, 255, 0.72) 50%, 
              rgba(255, 255, 255, 0.25) 66%, 
              rgba(255, 255, 255, 0) 84%
            ),
            url('/images/hero-logistics-daylight.jpg');
          background-size: cover;
          background-position: right center;
          background-repeat: no-repeat;
          padding: clamp(48px, 7vh, 80px) 0;
          box-sizing: border-box;
          overflow: hidden;
          border-bottom: 1px solid var(--color-border);
        }

        .daylight-hero-content {
          max-width: 660px;
          position: relative;
          z-index: 5;
          animation: daylightHeroFadeIn 0.45s ease-out;
        }

        @keyframes daylightHeroFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 1. Kicker / Subtitle */
        .daylight-hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          font-weight: 700;
          color: #1E293B;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .kicker-dot {
          color: #FF6B00;
          font-weight: 900;
          font-size: 15px;
        }

        /* 2. Main Title (Crystal-Clear Typography) */
        .daylight-hero-title {
          font-size: clamp(2.5rem, 5.2vw, 4.3rem);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.035em;
          margin: 0 0 20px 0;
        }
        .title-navy {
          color: #0A2540;
        }
        .title-orange {
          color: #FF6B00;
          background: linear-gradient(135deg, #FF6B00 0%, #EA580C 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }

        /* 3. Supporting Description */
        .daylight-hero-desc {
          font-size: clamp(15.5px, 1.25vw, 18px);
          color: #334155;
          line-height: 1.62;
          margin: 0 0 34px 0;
          max-width: 580px;
          font-weight: 450;
        }

        /* 4. Action Buttons (Native, Generous Click Targets) */
        .daylight-hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 38px;
          flex-wrap: wrap;
        }

        .daylight-quote-btn {
          background-color: #FF6B00;
          background-image: linear-gradient(135deg, #FF6B00 0%, #EA580C 100%);
          color: #FFFFFF;
          border: none;
          padding: 15px 36px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.01em;
          box-shadow: 0 10px 28px rgba(255, 107, 0, 0.42);
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .daylight-quote-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px rgba(255, 107, 0, 0.55);
          background-image: linear-gradient(135deg, #FF7817 0%, #F06010 100%);
        }
        .daylight-quote-btn:active {
          transform: translateY(0);
        }
        .daylight-quote-btn .btn-arrow {
          font-size: 18px;
          transition: transform 0.2s ease;
          display: inline-block;
        }
        .daylight-quote-btn:hover .btn-arrow {
          transform: translateX(4px);
        }

        .daylight-track-btn {
          background-color: #FFFFFF;
          color: #0A2540;
          border: 1.5px solid #0A2540;
          padding: 14.5px 32px;
          border-radius: 50px;
          font-size: 15.5px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(10, 37, 64, 0.08);
        }
        .daylight-track-btn:hover {
          background-color: #0A2540;
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(10, 37, 64, 0.18);
        }
        .daylight-track-btn:active {
          transform: translateY(0);
        }

        /* 5. Feature Badges */
        .daylight-hero-badges {
          display: flex;
          align-items: center;
          gap: 28px;
          flex-wrap: wrap;
        }

        .daylight-badge-item {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          font-size: 14px;
          font-weight: 700;
          color: #1E293B;
          cursor: pointer;
          transition: color 0.18s ease, transform 0.18s ease;
          user-select: none;
        }
        .daylight-badge-item:hover {
          color: #FF6B00;
          transform: translateY(-1px);
        }
        .badge-icon-wrap {
          color: #0B4F7C;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.18s ease;
        }
        .daylight-badge-item:hover .badge-icon-wrap {
          color: #FF6B00;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .ace-daylight-hero {
            background-image: 
              linear-gradient(
                90deg, 
                rgba(255, 255, 255, 0.98) 0%, 
                rgba(255, 255, 255, 0.95) 50%, 
                rgba(255, 255, 255, 0.75) 70%, 
                rgba(255, 255, 255, 0.20) 100%
              ),
              url('/images/hero-logistics-daylight.jpg');
            background-position: 72% center;
            padding: 48px 0;
            min-height: auto;
          }
          .daylight-hero-content {
            max-width: 580px;
          }
        }

        @media (max-width: 768px) {
          .ace-daylight-hero {
            background-image: 
              linear-gradient(
                180deg, 
                rgba(255, 255, 255, 0.98) 0%, 
                rgba(255, 255, 255, 0.95) 60%, 
                rgba(255, 255, 255, 0.88) 100%
              ),
              url('/images/hero-logistics-daylight.jpg');
            background-position: center;
            padding: 40px 0 36px;
          }
          .daylight-hero-content {
            max-width: 100%;
          }
          .daylight-hero-title {
            font-size: clamp(2.1rem, 7.5vw, 3rem);
          }
          .daylight-hero-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            width: 100%;
            max-width: 360px;
          }
          .daylight-quote-btn,
          .daylight-track-btn {
            width: 100%;
            justify-content: center;
            padding: 14px 24px;
          }
          .daylight-hero-badges {
            gap: 16px;
          }
        }

        /* ===================================================
           DARK MODE SUPPORT FOR HERO SECTION
           =================================================== */
        [data-theme="dark"] .ace-daylight-hero,
        body.dark-mode .ace-daylight-hero {
          background-color: #06111D;
          background-image: 
            linear-gradient(
              90deg, 
              rgba(6, 17, 29, 0.97) 0%, 
              rgba(7, 22, 38, 0.93) 38%, 
              rgba(8, 28, 48, 0.72) 54%, 
              rgba(9, 34, 58, 0.35) 70%, 
              rgba(6, 17, 29, 0.15) 86%
            ),
            url('/images/hero-logistics-daylight.jpg');
          border-bottom-color: #1E3851;
        }

        [data-theme="dark"] .daylight-hero-desc,
        body.dark-mode .daylight-hero-desc {
          color: #E2E8F0 !important;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
          font-weight: 450;
        }

        [data-theme="dark"] .title-navy,
        body.dark-mode .title-navy {
          color: #FFFFFF !important;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
        }

        [data-theme="dark"] .daylight-hero-kicker,
        body.dark-mode .daylight-hero-kicker {
          color: #94A3B8 !important;
        }

        [data-theme="dark"] .daylight-track-btn,
        body.dark-mode .daylight-track-btn {
          background-color: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.45);
          color: #FFFFFF !important;
          backdrop-filter: blur(8px);
        }

        [data-theme="dark"] .daylight-track-btn:hover,
        body.dark-mode .daylight-track-btn:hover {
          background-color: rgba(255, 255, 255, 0.22);
          border-color: #FFFFFF;
          color: #FFFFFF !important;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
        }

        [data-theme="dark"] .daylight-badge-item,
        body.dark-mode .daylight-badge-item {
          color: #E2E8F0 !important;
        }

        [data-theme="dark"] .daylight-badge-item .badge-icon-wrap,
        body.dark-mode .daylight-badge-item .badge-icon-wrap {
          color: #38BDF8 !important;
        }

        [data-theme="dark"] .daylight-badge-item:hover,
        body.dark-mode .daylight-badge-item:hover {
          color: #FF6B00 !important;
        }

        [data-theme="dark"] .daylight-badge-item:hover .badge-icon-wrap,
        body.dark-mode .daylight-badge-item:hover .badge-icon-wrap {
          color: #FF6B00 !important;
        }

        @media (max-width: 1024px) {
          [data-theme="dark"] .ace-daylight-hero,
          body.dark-mode .ace-daylight-hero {
            background-image: 
              linear-gradient(
                90deg, 
                rgba(6, 17, 29, 0.98) 0%, 
                rgba(7, 22, 38, 0.94) 50%, 
                rgba(8, 28, 48, 0.75) 70%, 
                rgba(9, 34, 58, 0.30) 100%
              ),
              url('/images/hero-logistics-daylight.jpg');
          }
        }

        @media (max-width: 768px) {
          [data-theme="dark"] .ace-daylight-hero,
          body.dark-mode .ace-daylight-hero {
            background-image: 
              linear-gradient(
                180deg, 
                rgba(6, 17, 29, 0.98) 0%, 
                rgba(7, 22, 38, 0.95) 60%, 
                rgba(8, 28, 48, 0.90) 100%
              ),
              url('/images/hero-logistics-daylight.jpg');
          }
        }

        .tracking-card-visual-banner {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 22px;
          border: 1px solid rgba(14, 76, 119, 0.15);
          box-shadow: 0 4px 18px rgba(7, 42, 66, 0.12);
        }
        .tracking-card-visual-banner img {
          width: 100%;
          height: 190px;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .tracking-card-visual-banner:hover img {
          transform: scale(1.02);
        }
        .tracking-card-visual-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(7, 42, 66, 0.92) 0%, rgba(7, 42, 66, 0.35) 55%, transparent 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px 20px;
        }
        .consignment-tracking-label {
          color: var(--color-primary-blue);
          transition: color 0.2s ease;
        }
        body.dark-mode .consignment-tracking-label,
        [data-theme="dark"] .consignment-tracking-label {
          color: #90CDF4 !important;
        }
        .home-tracking-card .ace-input::placeholder {
          font-size: clamp(12px, 1vw, 14px) !important;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
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
        .home-global-reach-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
          gap: 40px;
          align-items: center;
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
          .home-global-reach-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
        @media (max-width: 640px) {
          .home-hero-section {
            padding-top: 36px !important;
            padding-bottom: 24px !important;
          }
          .home-tracking-card {
            background: linear-gradient(155deg, #092c45 0%, #061e30 100%) !important;
            border: 1px solid rgba(56, 189, 248, 0.35) !important;
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.45) !important;
            padding: 16px 14px 14px !important;
          }
          .home-tracking-card h3 {
            color: #FFFFFF !important;
            font-size: 20px !important;
          }
          .home-tracking-card p {
            color: #CBD5E1 !important;
            font-size: 12.5px !important;
          }
          .home-tracking-card .ace-input {
            background-color: #FFFFFF;
            border: 1.5px solid #38BDF8;
            color: #0F172A;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          }
          [data-theme="dark"] .home-tracking-card .ace-input,
          body.dark-mode .home-tracking-card .ace-input {
            background-color: #0A131F !important;
            border-color: var(--color-border) !important;
            color: #FFFFFF !important;
          }
          .home-tracking-security-bar {
            color: #94A3B8 !important;
            border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
            padding-top: 10px !important;
            margin-top: 10px !important;
            font-size: 11px !important;
          }
          .home-tracking-security-bar .security-awb-tag {
            color: #38BDF8 !important;
          }
          .home-trust-metrics-section {
            background-color: #F8FAFC;
            padding: 20px 0 !important;
          }
          [data-theme="dark"] .home-trust-metrics-section,
          body.dark-mode .home-trust-metrics-section {
            background-color: var(--color-white) !important;
          }
          .tracking-card-visual-banner {
            margin-bottom: 14px !important;
          }
          .tracking-card-visual-banner img {
            height: 145px !important;
          }
          .tracking-card-visual-overlay {
            padding: 10px 12px !important;
          }
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
            justify-content: center !important;
          }
          .hero-track-form {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .hero-track-form input,
          .hero-track-form button {
            width: 100% !important;
            justify-content: center !important;
          }
          .home-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 14px 12px !important;
          }
          .home-metrics-grid > div > div:first-child {
            font-size: 24px !important;
          }
          .home-hubs-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .home-global-reach-buttons {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .home-global-reach-buttons button {
            width: 100% !important;
            justify-content: center !important;
          }
          .cta-banner-buttons {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .cta-banner-buttons button {
            width: 100% !important;
            justify-content: center !important;
          }
          .home-vector-map-canvas {
            height: 190px !important;
          }
        }
        @media (max-width: 480px) {
          .hero-trust-pill {
            font-size: 11px !important;
            padding: 5px 10px !important;
          }
          .hero-proof-bullets {
            flex-direction: column !important;
            gap: 10px !important;
          }
        }
        @media (max-width: 360px) {
          .home-metrics-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .home-metrics-grid > div > div:first-child {
            font-size: 20px !important;
          }
          .home-metrics-grid > div > div:last-child {
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
}
