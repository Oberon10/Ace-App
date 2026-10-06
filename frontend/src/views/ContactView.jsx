import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Globe2, 
  Radio,
  Zap,
  Calendar,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  AlertTriangle,
  Plane,
  Ship,
  UserCheck,
  X,
  Sparkles,
  Navigation,
  Compass,
  FileCheck,
  Check,
  QrCode
} from 'lucide-react';

export default function ContactView({ setView, currentUser, activeRole }) {
  // Real-time ticking clock for global hub timezones
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Hub Telemetry Switcher
  const [selectedHubId, setSelectedHubId] = useState('acc');
  const [showGatePassInfo, setShowGatePassInfo] = useState(false);

  // Priority Callback Console state
  const [callbackUrgency, setCallbackUrgency] = useState('AOG / Medical Urgent');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackStatus, setCallbackStatus] = useState('idle'); // 'idle' | 'connecting' | 'connected'
  const [callbackCountdown, setCallbackCountdown] = useState(8);
  const [callbackToken, setCallbackToken] = useState('');

  // Appointment Modal state
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentStep, setAppointmentStep] = useState('form'); // 'form' | 'confirmed'
  const [appointmentData, setAppointmentData] = useState({
    hub: 'Accra Air Cargo Hub (Ghana)',
    purpose: 'Customs Document Clearance & GRA Review',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '10:00 AM - 10:45 AM GMT',
    fullName: currentUser?.name || 'Kwame Mensah',
    phone: '+233 24 555 0192',
    email: currentUser?.email || 'k.mensah@goldcoasttrading.com',
    consignmentRef: 'ACE-2T34-79011'
  });
  const [generatedAppointment, setGeneratedAppointment] = useState(null);

  const hubs = [
    {
      id: 'acc',
      code: 'ACC',
      flag: '🇬🇭',
      city: 'Accra Air Cargo Hub',
      country: 'Ghana (West Africa Gateway)',
      timeZone: 'Africa/Accra',
      tzLabel: 'GMT',
      address: 'Plot 14, Ring Road Central & Kotoka International Cargo Village',
      phone: '+233 24 555 0192',
      phoneDisplay: '+233 24 555 0192 / +233 (0) 302 770 990',
      whatsapp: '233245550192',
      email: 'accra.ops@acelogistics.com',
      hours: '24/7 Air Cargo Operations',
      clearance: 'Licensed Ghana Revenue Authority Bonded Brokerage',
      officer: 'Capt. Kwame Mensah',
      officerRole: 'Senior Airside Ramp & Flight Controller',
      gatePass: 'Kotoka Air Cargo Gate 3 • Biometric Visitor Clearance Required',
      gateCoordinates: '5.6052° N, 0.1668° W',
      status: 'Runway Intake Open • All Shifts Active',
      sla: '14-min avg GRA ICUMS clearance',
      urgencySupport: 'AOG & Cold-Chain Express Active'
    },
    {
      id: 'lhr',
      code: 'LHR',
      flag: '🇬🇧',
      city: 'London Heathrow Gateway',
      country: 'United Kingdom (European Hub)',
      timeZone: 'Europe/London',
      tzLabel: 'BST / GMT',
      address: 'Building 521, Heathrow World Cargo Centre, Hounslow TW6 3SQ',
      phone: '+44 20 7946 0912',
      phoneDisplay: '+44 20 7946 0912',
      whatsapp: '442079460912',
      email: 'lhr.ops@acelogistics.com',
      hours: '06:00 - 22:00 GMT (AOG 24/7 Hotline)',
      clearance: 'HMRC Customs CDS System Direct Link',
      officer: 'Insp. Sarah Jenkins',
      officerRole: 'Heathrow World Cargo Center Duty Controller',
      gatePass: 'Heathrow South Perimeter Cargo Gate • Consignor Pass Required',
      gateCoordinates: '51.4700° N, 0.4543° W',
      status: 'Airside Tarmac Transfer • Normal Flow',
      sla: 'HMRC CDS Green Lane Direct Feed',
      urgencySupport: 'European Same-Day Air Connection'
    },
    {
      id: 'rtm',
      code: 'RTM',
      flag: '🇳🇱',
      city: 'Rotterdam Euro Terminal',
      country: 'Netherlands (Maritime Deep-Water Hub)',
      timeZone: 'Europe/Amsterdam',
      tzLabel: 'CEST / CET',
      address: 'Maasvlakte II, Haven 8200, 3199 LK Rotterdam',
      phone: '+31 10 400 1200',
      phoneDisplay: '+31 10 400 1200',
      whatsapp: '31104001200',
      email: 'rtm.ops@acelogistics.com',
      hours: '24/7 Container Stevedoring & Drayage',
      clearance: 'EU Single Window Customs Certified',
      officer: 'Maarten van Dijk',
      officerRole: 'Deepsea Quay & Automated Terminal Supervisor',
      gatePass: 'Maasvlakte Gate 4A • Automated Biometric Drayage Lane',
      gateCoordinates: '51.9566° N, 4.0289° E',
      status: 'Automated Container Gantries Active',
      sla: 'Portbase Automated Green Lane Clearance',
      urgencySupport: 'Intermodal Rail & Barge Feeder Link'
    },
    {
      id: 'jfk',
      code: 'JFK',
      flag: '🇺🇸',
      city: 'New York JFK Intermodal Hub',
      country: 'United States (North America)',
      timeZone: 'America/New_York',
      tzLabel: 'EDT / EST',
      address: 'Cargo Building 75, North Boundary Road, Jamaica, NY 11430',
      phone: '+1 212 555 4910',
      phoneDisplay: '+1 212 555 4910',
      whatsapp: '12125554910',
      email: 'jfk.ops@acelogistics.com',
      hours: '24/7 Intermodal Air & Road Dispatch',
      clearance: 'US CBP Automated Commercial Environment (ACE)',
      officer: 'Marcus Vance',
      officerRole: 'JFK Gate 75 Intermodal Dispatch Officer',
      gatePass: 'Cargo Building 75 Security Intake • TSA STA Clearance Required',
      gateCoordinates: '40.6413° N, 73.7781° W',
      status: 'Intermodal Ramp & Air Express Active',
      sla: 'US CBP ACE Manifest Direct Port Feed',
      urgencySupport: 'Coast-to-Coast Dedicated Hotshot Drayage'
    }
  ];

  const currentHub = hubs.find(h => h.id === selectedHubId) || hubs[0];

  // Formats time in specified timezone
  const getHubTime = (timeZone) => {
    try {
      return new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(currentTime);
    } catch {
      return currentTime.toLocaleTimeString();
    }
  };

  // Handle Priority Callback trigger
  const handleTriggerCallback = (e) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;

    setCallbackStatus('connecting');
    setCallbackCountdown(5);
    const token = `ACE-PRIO-${Math.floor(1000 + Math.random() * 9000)}`;
    setCallbackToken(token);

    const interval = setInterval(() => {
      setCallbackCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCallbackStatus('connected');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle Appointment Booking Submission
  const handleConfirmAppointment = (e) => {
    e.preventDefault();
    const token = `ACE-APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment = {
      id: token,
      ...appointmentData,
      assignedOfficer: currentHub.officer,
      hubAddress: currentHub.address,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };

    setGeneratedAppointment(newAppointment);
    setAppointmentStep('confirmed');

    // Persist to localStorage for customer portal retrieval
    try {
      const stored = localStorage.getItem('ace_customer_appointments');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(newAppointment);
      localStorage.setItem('ace_customer_appointments', JSON.stringify(list));
    } catch (err) {
      console.warn('Could not persist appointment:', err);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-very-light-blue)' }}>
      {/* ===================================================
          HERO BANNER — 24/7 GLOBAL OPERATIONS COMMAND CENTER
          =================================================== */}
      <section className="ace-page-hero-banner" style={{
        backgroundImage: "linear-gradient(135deg, rgba(7, 42, 66, 0.94) 0%, rgba(7, 28, 44, 0.88) 100%), url('/images/contact-operations-center.jpg')",
        padding: '52px 0 56px'
      }}>
        <div className="ace-container" style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#90CDF4',
            marginBottom: '16px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            <Radio size={14} color="#38BDF8" className="animate-pulse" style={{ flexShrink: 0 }} />
            <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>24/7 Global Cargo Operations & Dispatch Desk</span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5.5vw, 38px)', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px', letterSpacing: '-0.02em', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            Contact ACE Logistics Hubs
          </h1>
          <p style={{ fontSize: 'clamp(14px, 2.5vw, 15.5px)', color: '#D9E7F0', lineHeight: 1.6, maxWidth: '660px', margin: '0 auto 24px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            Direct coordination with our international dispatch desks, chartered flight coordinators, maritime logistics controllers, and certified customs clearance agents.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '12.5px', color: 'rgba(255,255,255,0.85)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0 }} /> 4 Intercontinental Gateways
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0 }} /> 12-Minute Average SLA Response
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0 }} /> Licensed Customs Brokerage
            </span>
          </div>
        </div>
      </section>

      <div className="ace-container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {/* 3 Quick Help Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <a 
            href="tel:+233245550192" 
            className="ace-card hover-lift" 
            style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit', minWidth: 0, padding: '20px 18px', overflow: 'hidden' }}
          >
            <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '12px', backgroundColor: 'var(--color-light-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-blue)', flexShrink: 0 }}>
              <Phone size={24} />
            </div>
            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Emergency Cargo Hotline</div>
              <div style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>+233 24 555 0192</div>
              <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 600 }}>24/7 Priority Dispatch</div>
            </div>
          </a>

          <a 
            href="https://wa.me/233245550192?text=Hello%20ACE%20Logistics%20Dispatch%20Desk,%20I%20have%20an%20urgent%20cargo%20inquiry." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="ace-card hover-lift" 
            style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit', minWidth: 0, padding: '20px 18px', overflow: 'hidden' }}
          >
            <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '12px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', flexShrink: 0 }}>
              <MessageSquare size={24} />
            </div>
            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>WhatsApp Dispatch Desk</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>+233 24 555 0192</div>
              <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 600 }}>Live Duty Agent • ~2 min</div>
            </div>
          </a>

          <a 
            href="mailto:dispatch@acelogistics.com?subject=Priority%20Air%20Cargo%20Dispatch" 
            className="ace-card hover-lift" 
            style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit', minWidth: 0, padding: '20px 18px', overflow: 'hidden' }}
          >
            <div style={{ width: '48px', height: '48px', minWidth: '48px', borderRadius: '12px', backgroundColor: 'var(--color-light-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F766E', flexShrink: 0 }}>
              <ShieldCheck size={24} />
            </div>
            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Central Dispatch Email</div>
              <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>dispatch@acelogistics.com</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>IATA & WCO Accredited</div>
            </div>
          </a>
        </div>

        {/* Two-Column Grid: Worldwide Hubs Directory (Left) & Priority Operations Command Desk (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.15fr)',
          gap: '32px',
          alignItems: 'start'
        }} className="contact-grid">
          
          {/* ===================================================
              LEFT COLUMN: WORLDWIDE STATIONS & TELEMETRY
              =================================================== */}
          <div style={{ minWidth: 0 }}>
            {/* Visual Operations Center Showcase Card */}
            <div className="ace-card" style={{ padding: 0, overflow: 'hidden', marginBottom: '24px', border: '1px solid var(--color-border)' }}>
              <div style={{ position: 'relative', width: '100%', height: 'clamp(180px, 24vw, 240px)', overflow: 'hidden' }}>
                <img
                  src="/images/contact-operations-center.jpg"
                  alt="ACE Logistics Global Operations Command Center"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  zIndex: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(7, 42, 66, 0.90)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#38BDF8',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  maxWidth: 'calc(100% - 24px)',
                  boxSizing: 'border-box'
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981', flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Command Hub • 24/7 Radar</span>
                </div>
              </div>

              <div style={{ padding: '18px 20px', backgroundColor: 'var(--color-surface)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Operational Command Hub
                    </span>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#10B981',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      padding: '3px 8px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} /> Live System Active
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16.5px', color: 'var(--color-primary-blue)', fontWeight: 700, margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: 1.35 }}>
                    24/7 Global Telemetry & Flight Dispatch Control Desk
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  Real-time flight tracking, container vessel monitoring, and automated EDI customs clearance across all continental gateway hubs.
                </p>
              </div>
            </div>

            <h2 style={{ fontSize: '22px', color: 'var(--color-primary-blue)', fontWeight: 800, marginBottom: '20px' }}>
              Global Station Network
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {hubs.map((hub) => (
                <div 
                  key={hub.id} 
                  className={`ace-card contact-hub-card ${selectedHubId === hub.id ? 'active-hub-card' : ''}`}
                  onClick={() => setSelectedHubId(hub.id)}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: selectedHubId === hub.id ? '2px solid var(--color-bright-action)' : '1px solid var(--color-border)',
                    boxShadow: selectedHubId === hub.id ? '0 4px 16px rgba(22, 131, 216, 0.12)' : 'var(--shadow-subtle)',
                    minWidth: 0,
                    overflow: 'hidden',
                    padding: '20px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: '1 1 auto' }}>
                      <span style={{ fontSize: '20px', flexShrink: 0 }}>{hub.flag}</span>
                      <h3 style={{ fontSize: '17px', color: 'var(--color-primary-blue)', fontWeight: 700, margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {hub.city}
                      </h3>
                    </div>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      padding: '3px 8px', 
                      borderRadius: '12px',
                      backgroundColor: selectedHubId === hub.id ? '#E0F2FE' : 'var(--color-light-blue)',
                      color: selectedHubId === hub.id ? '#0284C7' : 'var(--color-bright-action)',
                      flexShrink: 0
                    }}>
                      {hub.code} • {hub.country.split(' ')[0]}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', minWidth: 0 }}>
                    <MapPin size={15} color="var(--color-primary-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{hub.address}</span>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '6px', 
                    fontSize: '12.5px', 
                    color: 'var(--text-muted)', 
                    borderTop: '1px solid var(--color-border-subtle)', 
                    paddingTop: '10px' 
                  }}>
                    <div style={{ minWidth: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Direct Tel: </strong>
                      <a href={`tel:${hub.phone}`} style={{ color: 'var(--color-bright-action)', textDecoration: 'none', fontWeight: 600, wordBreak: 'break-word' }}>
                        {hub.phoneDisplay}
                      </a>
                    </div>
                    <div style={{ minWidth: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Email: </strong>
                      <a href={`mailto:${hub.email}`} style={{ color: 'var(--color-bright-action)', textDecoration: 'none', wordBreak: 'break-all' }}>
                        {hub.email}
                      </a>
                    </div>
                    <div style={{ color: 'var(--color-primary-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, marginTop: '2px' }}>
                      <CheckCircle2 size={13} color="#10B981" style={{ flexShrink: 0 }} />
                      <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{hub.clearance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===================================================
              RIGHT COLUMN: "SOMETHING FANTASTIC"
              24/7 PRIORITY OPERATIONS COMMAND DESK & APPOINTMENT HUB
              =================================================== */}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* CARD 1: REAL-TIME HUB TELEMETRY & LIVE DISPATCH COMMAND CONSOLE */}
            <div className="ace-card contact-station-card" style={{
              background: 'linear-gradient(145deg, #072A42 0%, #061D2D 100%)',
              color: '#FFFFFF',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              boxShadow: '0 12px 36px rgba(7, 42, 66, 0.25)',
              padding: '24px'
            }}>
              {/* Header Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    backgroundColor: 'rgba(16, 185, 129, 0.15)', 
                    border: '1px solid rgba(16, 185, 129, 0.35)', 
                    color: '#34D399', 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '11px', 
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ wordBreak: 'break-word' }}>LIVE TELEMETRY RADAR</span>
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>24/7 Uplink</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#38BDF8', fontWeight: 600, fontFamily: 'monospace' }}>
                  <Clock size={13} color="#38BDF8" style={{ flexShrink: 0 }} />
                  <span>{getHubTime(currentHub.timeZone)} {currentHub.tzLabel}</span>
                </div>
              </div>

              {/* Station Switcher Tabs */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                padding: '4px',
                borderRadius: '10px',
                marginBottom: '20px'
              }}>
                {hubs.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setSelectedHubId(h.id)}
                    style={{
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 2px',
                      backgroundColor: selectedHubId === h.id ? 'rgba(56, 189, 248, 0.22)' : 'transparent',
                      color: selectedHubId === h.id ? '#38BDF8' : '#94A3B8',
                      fontWeight: selectedHubId === h.id ? 700 : 500,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      transition: 'all 0.15s ease',
                      borderBottom: selectedHubId === h.id ? '2px solid #38BDF8' : '2px solid transparent',
                      minWidth: 0,
                      overflow: 'hidden'
                    }}
                  >
                    <span style={{ fontSize: '14px', flexShrink: 0 }}>{h.flag}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.code}</span>
                  </button>
                ))}
              </div>

              {/* Active Hub Deep Dive Card */}
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '18px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      color: '#38BDF8',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      maxWidth: '100%',
                      boxSizing: 'border-box'
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#38BDF8', display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ wordBreak: 'break-word' }}>{currentHub.status}</span>
                    </span>

                    <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                      {currentHub.code} GATEWAY
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: 1.3 }}>
                      {currentHub.city}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      {currentHub.country} • Local Time: <strong style={{ color: '#E2E8F0' }}>{getHubTime(currentHub.timeZone)} ({currentHub.tzLabel})</strong>
                    </div>
                  </div>
                </div>

                <div className="contact-telemetry-metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '12px', marginTop: '14px' }}>
                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '10px 12px', borderRadius: '8px', minWidth: 0 }}>
                    <div style={{ color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Duty Watch Controller</div>
                    <div style={{ color: '#F1F5F9', fontWeight: 700, marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{currentHub.officer}</div>
                    <div style={{ color: '#64748B', fontSize: '11px', marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{currentHub.officerRole}</div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', padding: '10px 12px', borderRadius: '8px', minWidth: 0 }}>
                    <div style={{ color: '#94A3B8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Customs & EDI SLA</div>
                    <div style={{ color: '#34D399', fontWeight: 700, marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{currentHub.sla}</div>
                    <div style={{ color: '#64748B', fontSize: '11px', marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{currentHub.urgencySupport}</div>
                  </div>
                </div>

                {/* Gate Directions Accordion */}
                {showGatePassInfo && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '8px',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    fontSize: '12px',
                    color: '#CBD5E1',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}>
                    <div style={{ fontWeight: 700, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Navigation size={13} style={{ flexShrink: 0 }} /> Station Coordinates & Gate Pass:
                    </div>
                    <div style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{currentHub.gatePass}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>GPS: {currentHub.gateCoordinates}</div>
                  </div>
                )}

                {/* Quick Interactive Station Action Buttons */}
                <div className="contact-station-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '14px' }}>
                  <a
                    href={`tel:${currentHub.phone}`}
                    className="ace-btn"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontSize: '12px',
                      padding: '8px 12px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      minWidth: 0
                    }}
                  >
                    <Phone size={14} color="#38BDF8" style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Call {currentHub.code} Desk</span>
                  </a>

                  <a
                    href={`https://wa.me/${currentHub.whatsapp}?text=Hello%20ACE%20${currentHub.code}%20Operations%20Desk,%20I%20have%20an%20urgent%20cargo%20inquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ace-btn"
                    style={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      padding: '8px 12px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontWeight: 600,
                      minWidth: 0
                    }}
                  >
                    <MessageSquare size={14} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>WhatsApp {currentHub.code}</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGatePassInfo(!showGatePassInfo)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    marginTop: '10px',
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Navigation size={12} color="#38BDF8" style={{ flexShrink: 0 }} />
                  <span>{showGatePassInfo ? 'Hide Gate Pass & GPS Navigation' : 'Show Station Gate Pass & GPS Coordinates'}</span>
                </button>
              </div>

              {/* Instant Urgent Priority Callback Launcher */}
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <AlertTriangle size={16} color="#F87171" style={{ flexShrink: 0 }} />
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#FECACA', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    Emergency Cargo & AOG 60-Second Priority Callback
                  </h4>
                </div>
                <p style={{ fontSize: '12px', color: '#E2E8F0', marginBottom: '12px', lineHeight: 1.4, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  Aircraft On Ground (AOG), life-science cold-chain transit, or urgent airfreight release? Dispatch controller will place an immediate direct call to your line.
                </p>

                {callbackStatus === 'idle' && (
                  <form onSubmit={handleTriggerCallback}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {['AOG / Medical Urgent', 'Express Air Charter', 'Customs Release Hold'].map((urgency) => (
                        <button
                          key={urgency}
                          type="button"
                          onClick={() => setCallbackUrgency(urgency)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: callbackUrgency === urgency ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.15)',
                            backgroundColor: callbackUrgency === urgency ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                            color: callbackUrgency === urgency ? '#38BDF8' : '#CBD5E1',
                            flex: '1 1 auto',
                            textAlign: 'center'
                          }}
                        >
                          {urgency}
                        </button>
                      ))}
                    </div>

                    <div className="contact-callback-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <input
                        type="tel"
                        placeholder="Enter phone or WhatsApp (e.g. +233 24 555 0192)"
                        value={callbackPhone}
                        onChange={(e) => setCallbackPhone(e.target.value)}
                        required
                        style={{
                          flex: '1 1 200px',
                          minWidth: 0,
                          width: '100%',
                          height: '40px',
                          backgroundColor: 'rgba(0, 0, 0, 0.35)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          padding: '0 12px',
                          color: '#FFFFFF',
                          fontSize: '12.5px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="submit"
                        className="ace-btn contact-callback-btn"
                        style={{
                          backgroundColor: '#EF4444',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '12px',
                          padding: '0 16px',
                          height: '40px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}
                      >
                        <Zap size={14} />
                        <span>Request Ring</span>
                      </button>
                    </div>
                  </form>
                )}

                {callbackStatus === 'connecting' && (
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    padding: '14px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    border: '1px dashed #38BDF8'
                  }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#38BDF8', fontWeight: 700, fontSize: '13px' }}>
                      <Radio size={16} className="animate-pulse" />
                      <span>Engaging Automated Priority Switchboard Trunk...</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
                      Connecting to {currentHub.officer} on watch. Ringing line {callbackPhone} in {callbackCountdown}s.
                    </p>
                  </div>
                )}

                {callbackStatus === 'connected' && (
                  <div style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    padding: '14px',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34D399', fontWeight: 700, fontSize: '13px' }}>
                      <CheckCircle2 size={16} color="#10B981" />
                      <span>Priority Call Initiated ({callbackToken})</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#D1FAE5', marginTop: '4px', lineHeight: 1.4 }}>
                      Line opened to <strong>{callbackPhone}</strong>. If line is busy, duty dispatcher will attempt WhatsApp voice call within 60 seconds.
                    </p>
                    <button
                      type="button"
                      onClick={() => { setCallbackStatus('idle'); setCallbackPhone(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#93C5FD',
                        fontSize: '11.5px',
                        cursor: 'pointer',
                        padding: 0,
                        marginTop: '8px',
                        textDecoration: 'underline'
                      }}
                    >
                      Reset Emergency Call Simulator
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 2: BOOK IN-PERSON APPOINTMENT & CUSTOMER PORTAL FAST-TRACK */}
            <div className="ace-card contact-appointment-card" style={{
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              boxShadow: 'var(--shadow-card)',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Customer Services & Facility Access
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: '#ECFDF5',
                    color: '#065F46',
                    border: '1px solid #A7F3D0',
                    padding: '3px 8px',
                    borderRadius: '12px'
                  }}>
                    Slots Open Today
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    minWidth: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Calendar size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)', fontWeight: 800, margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    Schedule Hub Appointment
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                Skip the inquiry waiting queue. Customers can reserve a guaranteed 1-on-1 operational appointment for customs clearance documents, bonded warehouse cargo inspection, or air charter manifests.
              </p>

              <div className="contact-appointment-specs" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 170px), 1fr))',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-very-light-blue)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '12px',
                  minWidth: 0
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} color="#10B981" style={{ flexShrink: 0 }} />
                    <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>Customs Broker Session</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    GRA / HMRC import document audit
                  </div>
                </div>

                <div style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-very-light-blue)',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '12px',
                  minWidth: 0
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building2 size={14} color="var(--color-bright-action)" style={{ flexShrink: 0 }} />
                    <span style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>Bonded Warehouse Tour</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '11.5px', marginTop: '2px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    Escorted airside facility inspection
                  </div>
                </div>
              </div>

              {/* Action Buttons for Appointment */}
              <div className="contact-appointment-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAppointmentStep('form');
                    setShowAppointmentModal(true);
                  }}
                  className="ace-btn ace-btn-action"
                  style={{ flex: '1 1 min(100%, 180px)', height: '42px', fontSize: '13.5px', justifyContent: 'center', minWidth: 0 }}
                >
                  <Calendar size={15} style={{ flexShrink: 0 }} />
                  <span>Book Appointment Slot</span>
                </button>

                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => setView && setView('customer-dashboard')}
                    className="ace-btn ace-btn-secondary"
                    style={{ height: '42px', fontSize: '13px', padding: '0 16px', flex: '1 1 min(100%, 140px)', justifyContent: 'center', minWidth: 0 }}
                  >
                    <UserCheck size={15} style={{ flexShrink: 0 }} />
                    <span>Customer Portal</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setView && setView('login')}
                    className="ace-btn ace-btn-secondary"
                    style={{ height: '42px', fontSize: '13px', padding: '0 16px', flex: '1 1 min(100%, 140px)', justifyContent: 'center', minWidth: 0 }}
                  >
                    <UserCheck size={15} style={{ flexShrink: 0 }} />
                    <span>Portal Sign In</span>
                  </button>
                )}
              </div>

              {currentUser && (
                <div style={{
                  marginTop: '12px',
                  fontSize: '11.5px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', flexShrink: 0 }} />
                  <span>Authenticated as <strong>{currentUser.name}</strong> ({currentUser.company || 'Enterprise Account'})</span>
                </div>
              )}
            </div>

            {/* CARD 3: MULTI-CHANNEL DIRECT DISPATCH TILES */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
              gap: '12px'
            }}>
              <a
                href="https://wa.me/233245550192?text=Hello%20ACE%20Logistics,%20I%20would%20like%20to%20inquire%20about%20cargo%20dispatch."
                target="_blank"
                rel="noopener noreferrer"
                className="ace-card hover-lift"
                style={{
                  padding: '16px',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  border: '1px solid #A7F3D0',
                  backgroundColor: '#F0FDF4',
                  minWidth: 0,
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <MessageSquare size={20} color="#10B981" />
                  <ArrowRight size={14} color="#10B981" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#065F46', marginTop: '4px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>WhatsApp Desk</div>
                <div style={{ fontSize: '11px', color: '#047857', wordBreak: 'break-word', overflowWrap: 'break-word' }}>Instant controller reply</div>
              </a>

              <a
                href="tel:+233245550192"
                className="ace-card hover-lift"
                style={{
                  padding: '16px',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  border: '1px solid #BAE6FD',
                  backgroundColor: '#F0F9FF',
                  minWidth: 0,
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Phone size={20} color="#0284C7" />
                  <ArrowRight size={14} color="#0284C7" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0369A1', marginTop: '4px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>Airside Voice Line</div>
                <div style={{ fontSize: '11px', color: '#0284C7', wordBreak: 'break-word', overflowWrap: 'break-word' }}>Direct ramp trunk</div>
              </a>

              <a
                href="mailto:dispatch@acelogistics.com?subject=Priority%20Air%20Cargo%20Dispatch"
                className="ace-card hover-lift"
                style={{
                  padding: '16px',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  minWidth: 0,
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Mail size={20} color="var(--color-primary-blue)" />
                  <ArrowRight size={14} color="var(--color-primary-blue)" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-primary-blue)', marginTop: '4px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>Dispatch Mail</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>Formal documentation</div>
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ===================================================
          INTERACTIVE APPOINTMENT BOOKING MODAL
          =================================================== */}
      {showAppointmentModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(7, 42, 66, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="ace-card appointment-modal-card" style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: 'var(--shadow-dropdown)',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <Calendar size={20} color="var(--color-bright-action)" style={{ flexShrink: 0 }} />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-blue)', margin: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  {appointmentStep === 'form' ? 'Book In-Person Facility Appointment' : 'Appointment Confirmed & Pass Issued'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAppointmentModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  flexShrink: 0
                }}
              >
                <X size={20} />
              </button>
            </div>

            {appointmentStep === 'form' ? (
              <form onSubmit={handleConfirmAppointment}>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  Select your regional station and consultation purpose. Our facility manager will assign an authorized gate pass for your visit.
                </p>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Regional Gateway Station</label>
                  <select
                    className="ace-select"
                    value={appointmentData.hub}
                    onChange={(e) => setAppointmentData({ ...appointmentData, hub: e.target.value })}
                    required
                  >
                    {hubs.map(h => (
                      <option key={h.id} value={`${h.city} (${h.country.split(' ')[0]})`}>
                        {h.flag} {h.city} — {h.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Appointment Purpose</label>
                  <select
                    className="ace-select"
                    value={appointmentData.purpose}
                    onChange={(e) => setAppointmentData({ ...appointmentData, purpose: e.target.value })}
                    required
                  >
                    <option value="Customs Document Clearance & GRA/HMRC Review">Customs Document Clearance & Regulatory Review</option>
                    <option value="Bonded Warehouse Cargo Viewing / Physical Inspection">Bonded Warehouse Cargo Viewing & Physical Inspection</option>
                    <option value="Air Charter & Heavy-Lift Route Consultation">Air Charter & Heavy-Lift Route Consultation</option>
                    <option value="Pharmaceutical Cold-Chain Compliance Audit">Pharmaceutical Cold-Chain Compliance Audit</option>
                    <option value="Corporate Account Management & Freight SLA Review">Corporate Account Management & Freight SLA Review</option>
                  </select>
                </div>

                <div className="appointment-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Appointment Date</label>
                    <input
                      type="date"
                      className="ace-input"
                      value={appointmentData.date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Preferred Time Window</label>
                    <select
                      className="ace-select"
                      value={appointmentData.timeSlot}
                      onChange={(e) => setAppointmentData({ ...appointmentData, timeSlot: e.target.value })}
                      required
                    >
                      <option value="09:00 AM - 09:45 AM">09:00 AM - 09:45 AM (Morning Ramp)</option>
                      <option value="11:30 AM - 12:15 PM">11:30 AM - 12:15 PM (Midday Shift)</option>
                      <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM (Afternoon Intake)</option>
                      <option value="04:30 PM - 05:15 PM">04:30 PM - 05:15 PM (Airside Debrief)</option>
                    </select>
                  </div>
                </div>

                <div className="appointment-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Full Name</label>
                    <input
                      type="text"
                      className="ace-input"
                      value={appointmentData.fullName}
                      onChange={(e) => setAppointmentData({ ...appointmentData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      className="ace-input"
                      value={appointmentData.phone}
                      onChange={(e) => setAppointmentData({ ...appointmentData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="appointment-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '12px' }}>
                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Business Email</label>
                    <input
                      type="email"
                      className="ace-input"
                      value={appointmentData.email}
                      onChange={(e) => setAppointmentData({ ...appointmentData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="ace-form-group">
                    <label className="ace-label">Consignment / Tracking # (Optional)</label>
                    <input
                      type="text"
                      className="ace-input"
                      placeholder="e.g. ACE-2T34-79011"
                      value={appointmentData.consignmentRef}
                      onChange={(e) => setAppointmentData({ ...appointmentData, consignmentRef: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
                    className="ace-btn ace-btn-secondary"
                    style={{ flex: '0 1 auto' }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="ace-btn ace-btn-action"
                    style={{ padding: '0 20px', flex: '0 1 auto' }}
                  >
                    <FileCheck size={16} />
                    <span>Confirm & Generate Gate Pass</span>
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {/* Official Appointment Confirmation Gate Pass */}
                <div style={{
                  backgroundColor: '#F8FAFC',
                  border: '2px dashed #94A3B8',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        ACE LOGISTICS OFFICIAL GATE PASS
                      </span>
                      <h4 style={{ fontSize: '18px', color: '#0F172A', fontWeight: 800, margin: '2px 0 0', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {generatedAppointment?.id}
                      </h4>
                    </div>
                    <span style={{
                      backgroundColor: '#ECFDF5',
                      color: '#065F46',
                      border: '1px solid #A7F3D0',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexShrink: 0
                    }}>
                      <Check size={13} /> RESERVATION CONFIRMED
                    </span>
                  </div>

                  <div className="appointment-pass-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px', fontSize: '12.5px', marginBottom: '14px' }}>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Visitor Name</span>
                      <strong style={{ color: 'var(--text-primary)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{generatedAppointment?.fullName}</strong>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Facility Station</span>
                      <strong style={{ color: 'var(--text-primary)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{generatedAppointment?.hub}</strong>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Scheduled Date</span>
                      <strong style={{ color: 'var(--text-primary)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{generatedAppointment?.date}</strong>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Time Slot</span>
                      <strong style={{ color: 'var(--text-primary)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{generatedAppointment?.timeSlot}</strong>
                    </div>
                    <div style={{ gridColumn: '1 / -1', minWidth: 0 }}>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Purpose / Consultation</span>
                      <strong style={{ color: 'var(--color-primary-blue)', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{generatedAppointment?.purpose}</strong>
                    </div>
                    {generatedAppointment?.consignmentRef && (
                      <div style={{ gridColumn: '1 / -1', minWidth: 0 }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Associated Consignment</span>
                        <strong style={{ color: '#0369A1', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{generatedAppointment?.consignmentRef}</strong>
                      </div>
                    )}
                  </div>

                  <div style={{
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '12px',
                    color: '#1E40AF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                  }}>
                    <ShieldCheck size={16} color="#2563EB" style={{ flexShrink: 0 }} />
                    <span>Please present a government-issued photo ID at Gate Security upon arrival. Your pass has been logged with the Duty Controller.</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (setView && currentUser) {
                        setShowAppointmentModal(false);
                        setView('customer-dashboard');
                      } else if (setView) {
                        setShowAppointmentModal(false);
                        setView('login');
                      } else {
                        setShowAppointmentModal(false);
                      }
                    }}
                    className="ace-btn ace-btn-secondary"
                    style={{ flex: '1 1 min(100%, 200px)', justifyContent: 'center' }}
                  >
                    <UserCheck size={15} />
                    <span>View in Customer Portal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
                    className="ace-btn ace-btn-action"
                    style={{ flex: '1 1 min(100%, 160px)', justifyContent: 'center' }}
                  >
                    <CheckCircle2 size={15} />
                    <span>Done & Close</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 980px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .contact-station-card {
            padding: 18px 14px !important;
          }
          .contact-hub-card {
            padding: 16px 14px !important;
          }
          .contact-telemetry-metrics {
            grid-template-columns: 1fr !important;
          }
          .contact-station-actions {
            grid-template-columns: 1fr !important;
          }
          .contact-callback-row {
            flex-direction: column !important;
          }
          .contact-callback-btn {
            width: 100% !important;
            justify-content: center !important;
          }
          .contact-appointment-card {
            padding: 18px 14px !important;
          }
          .contact-appointment-specs {
            grid-template-columns: 1fr !important;
          }
          .contact-appointment-actions {
            flex-direction: column !important;
          }
          .contact-appointment-actions button {
            width: 100% !important;
          }
        }
        @media (max-width: 500px) {
          .appointment-modal-card {
            padding: 18px 14px !important;
          }
          .appointment-form-grid {
            grid-template-columns: 1fr !important;
          }
          .appointment-pass-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 380px) {
          .contact-station-card,
          .contact-hub-card,
          .contact-appointment-card {
            padding: 14px 10px !important;
          }
          .contact-station-actions button,
          .contact-appointment-actions button {
            font-size: 12px !important;
            padding: 8px 10px !important;
          }
        }
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-elevated);
        }
      `}</style>
    </div>
  );
}
