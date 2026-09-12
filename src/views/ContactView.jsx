import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Headphones,
  Globe2
} from 'lucide-react';

export default function ContactView() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Kwame Mensah',
    email: 'k.mensah@goldcoasttrading.com',
    phone: '+233 24 555 0192',
    hub: 'Accra Air Cargo Hub (Ghana)',
    subject: 'Air Freight Express Charter to London',
    message: 'We require scheduled cargo space for 45kg electronic telemetry sensors leaving Accra to London Heathrow next Tuesday.'
  });

  const hubs = [
    {
      city: 'Accra Air Cargo Hub',
      country: 'Ghana (West Africa Gateway)',
      address: 'Plot 14, Ring Road Central & Kotoka International Cargo Village',
      phone: '+233 24 555 0192 / +233 (0) 302 770 990',
      email: 'accra.ops@acelogistics.com',
      hours: '24/7 Air Cargo Operations',
      clearance: 'Licensed Ghana Revenue Authority Bonded Brokerage'
    },
    {
      city: 'London Heathrow Gateway',
      country: 'United Kingdom (European Hub)',
      address: 'Building 521, Heathrow World Cargo Centre, Hounslow TW6 3SQ',
      phone: '+44 20 7946 0912',
      email: 'lhr.ops@acelogistics.com',
      hours: '06:00 - 22:00 GMT (AOG 24/7 Hotline)',
      clearance: 'HMRC Customs CDS System Direct Link'
    },
    {
      city: 'Rotterdam Euro Terminal',
      country: 'Netherlands (Maritime Deep-Water Hub)',
      address: 'Maasvlakte II, Haven 8200, 3199 LK Rotterdam',
      phone: '+31 10 400 1200',
      email: 'rtm.ops@acelogistics.com',
      hours: '24/7 Container Stevedoring & Drayage',
      clearance: 'EU Single Window Customs Certified'
    },
    {
      city: 'New York JFK Intermodal Hub',
      country: 'United States (North America)',
      address: 'Cargo Building 75, North Boundary Road, Jamaica, NY 11430',
      phone: '+1 212 555 4910',
      email: 'jfk.ops@acelogistics.com',
      hours: '24/7 Intermodal Air & Road Dispatch',
      clearance: 'US CBP Automated Commercial Environment (ACE)'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '48px 0 80px' }}>
      <div className="ace-container">
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            24/7 Global Cargo Support
          </span>
          <h1 style={{ fontSize: '36px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '4px', marginBottom: '12px' }}>
            Contact ACE Logistics Hubs
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
            Connect with our international dispatch offices, flight coordinators, and certified customs agents.
          </p>
        </div>

        {/* 3 Quick Help Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div className="ace-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-light-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-blue)' }}>
              <Phone size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Emergency Cargo Hotline</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '2px' }}>+233 24 555 0192</div>
              <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 600 }}>24/7 Priority Dispatch</div>
            </div>
          </div>

          <div className="ace-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-light-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-bright-action)' }}>
              <Mail size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Central Booking Email</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '2px' }}>dispatch@acelogistics.com</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Avg response: 15 mins</div>
            </div>
          </div>

          <div className="ace-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--color-light-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F766E' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Customs & Compliance</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '2px' }}>customs@acelogistics.com</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>IATA & WCO Accredited</div>
            </div>
          </div>
        </div>

        {/* Two-Column: Hubs List (Left) & Inquiry Form (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
          gap: '32px'
        }} className="contact-grid">
          {/* LEFT: WORLDWIDE HUBS DIRECTORY */}
          <div>
            <h2 style={{ fontSize: '22px', color: 'var(--color-primary-blue)', fontWeight: 800, marginBottom: '20px' }}>
              Global Station Network
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {hubs.map((hub, idx) => (
                <div key={idx} className="ace-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '17px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                      {hub.city}
                    </h3>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-bright-action)' }}>
                      {hub.country}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <MapPin size={15} color="var(--color-primary-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{hub.address}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Tel:</strong> {hub.phone}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>Email:</strong> {hub.email}
                    </div>
                    <div style={{ gridColumn: '1 / -1', color: 'var(--color-primary-blue)', fontWeight: 500 }}>
                      ✓ {hub.clearance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: INQUIRY FORM */}
          <div className="ace-card" style={{ padding: '32px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--color-primary-blue)', fontWeight: 700, marginBottom: '6px' }}>
              Send Operational Message
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Submit shipment booking requirements, charter requests, or clearance documents directly to our dispatch desk.
            </p>

            {submitted ? (
              <div style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '10px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={36} color="#10B981" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '16px', color: '#065F46', fontWeight: 700 }}>
                  Inquiry Dispatched Successfully
                </h4>
                <p style={{ fontSize: '13px', color: '#065F46', marginTop: '6px', lineHeight: 1.5 }}>
                  Reference ticket <strong>#ACE-MSG-892</strong> has been issued. Our duty dispatcher has been notified and will contact you via email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="ace-btn ace-btn-secondary ace-btn-sm"
                  style={{ marginTop: '16px' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Full Name</label>
                  <input
                    type="text"
                    className="ace-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Business Email</label>
                  <input
                    type="email"
                    className="ace-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Target Regional Hub</label>
                  <select
                    className="ace-select"
                    value={formData.hub}
                    onChange={(e) => setFormData({ ...formData, hub: e.target.value })}
                  >
                    <option value="Accra Air Cargo Hub (Ghana)">Accra Air Cargo Hub (Ghana)</option>
                    <option value="London Heathrow Gateway (UK)">London Heathrow Gateway (UK)</option>
                    <option value="Rotterdam Euro Terminal (Netherlands)">Rotterdam Euro Terminal (Netherlands)</option>
                    <option value="New York JFK Intermodal (USA)">New York JFK Intermodal (USA)</option>
                  </select>
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Consignment Subject</label>
                  <input
                    type="text"
                    className="ace-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Detailed Cargo Specifications & Requirements</label>
                  <textarea
                    rows="4"
                    className="ace-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="ace-btn ace-btn-action"
                  style={{ width: '100%', height: '46px', fontSize: '15px', marginTop: '12px' }}
                >
                  <Send size={16} />
                  <span>Transmit to Dispatch Console</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
