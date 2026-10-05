import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Globe2, 
  Award, 
  CheckCircle2, 
  Send 
} from 'lucide-react';

export default function AboutContactView({ tab = 'about', setView }) {
  const [activeTab, setActiveTab] = useState(tab);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const hubs = [
    { city: 'Accra Air Cargo Hub', country: 'Ghana', address: 'Plot 14, Ring Road Central & Kotoka Cargo Village', phone: '+233 24 555 0192', email: 'accra.ops@acelogistics.com' },
    { city: 'London Heathrow Gateway', country: 'United Kingdom', address: 'Building 521, Heathrow World Cargo Centre', phone: '+44 20 7946 0912', email: 'lhr.ops@acelogistics.com' },
    { city: 'Rotterdam Port Terminal', country: 'Netherlands', address: 'Maasvlakte II, Haven 8200', phone: '+31 10 400 1200', email: 'rtm.ops@acelogistics.com' },
    { city: 'New York JFK Intermodal', country: 'United States', address: 'Cargo Building 75, North Boundary Road', phone: '+1 212 555 4910', email: 'jfk.ops@acelogistics.com' }
  ];

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '48px 0 80px' }}>
      <div className="ace-container">
        {/* Sub-navigation Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
          <button
            onClick={() => setActiveTab('about')}
            className={`ace-btn ${activeTab === 'about' ? 'ace-btn-primary' : 'ace-btn-secondary'}`}
          >
            About ACE Logistics
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`ace-btn ${activeTab === 'contact' ? 'ace-btn-primary' : 'ace-btn-secondary'}`}
          >
            Global Contact & Hubs
          </button>
        </div>

        {activeTab === 'about' ? (
          <div>
            {/* Mission Section */}
            <div className="ace-card" style={{ padding: '40px', marginBottom: '32px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Corporate Overview
              </span>
              <h1 style={{ fontSize: '32px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '4px', marginBottom: '16px' }}>
                Moving the World, One Shipment at a Time
              </h1>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
                Founded with a mission to deliver world-class freight reliability across African, European, Asian, and American trade corridors, ACE Logistics has grown into a premier international logistics carrier. We unify multimodal air, sea, road, and rail transport with real-time satellite telemetry, automated customs brokerage, and bonded warehousing.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: 'var(--color-light-blue)', padding: '20px', borderRadius: '10px' }}>
                  <ShieldCheck size={24} color="var(--color-primary-blue)" style={{ marginBottom: '8px' }} />
                  <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Strict Regulatory Compliance</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Full IATA, FIATA, and WCO SAFE framework accredited with dedicated bonded customs terminals.
                  </p>
                </div>

                <div style={{ backgroundColor: 'var(--color-light-blue)', padding: '20px', borderRadius: '10px' }}>
                  <Clock size={24} color="var(--color-primary-blue)" style={{ marginBottom: '8px' }} />
                  <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>99.8% On-Time SLA</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Rigorous SLA guarantees across both express flight charters and ocean container voyages.
                  </p>
                </div>

                <div style={{ backgroundColor: 'var(--color-light-blue)', padding: '20px', borderRadius: '10px' }}>
                  <Globe2 size={24} color="var(--color-primary-blue)" style={{ marginBottom: '8px' }} />
                  <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Global Multi-Modal Fleet</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Dedicated fleet spanning container vessels, cargo jets, interstate trailers, and electric rail.
                  </p>
                </div>
              </div>
            </div>

            {/* Logistics Infrastructure Showcase */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div className="ace-card" style={{ padding: 0, overflow: 'hidden' }}>
                <img src="/images/container-port.jpg" alt="Port" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>High-Capacity Marine Terminals</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Direct quay access with automated gantry cranes handling over 1.2M TEU annually.
                  </p>
                </div>
              </div>

              <div className="ace-card" style={{ padding: 0, overflow: 'hidden' }}>
                <img src="/images/truck-freight.jpg" alt="Truck" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Modern Interstate Road Fleet</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Heavy-duty aerodynamic Freightliner tractors equipped with satellite telematics and dashcams.
                  </p>
                </div>
              </div>

              <div className="ace-card" style={{ padding: 0, overflow: 'hidden' }}>
                <img src="/images/air-cargo.jpg" alt="Air Cargo" style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>Priority Air Express Cargo</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Scheduled air connections linking West Africa, Europe, North America, and the Middle East.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Contact & Hubs Section */
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
              gap: '32px'
            }} className="contact-grid">
              {/* Hub Directory */}
              <div>
                <h2 style={{ fontSize: '24px', color: 'var(--color-primary-blue)', fontWeight: 800, marginBottom: '20px' }}>
                  Regional Logistics Centers
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {hubs.map((hub, i) => (
                    <div key={i} className="ace-card" style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>{hub.city}</h3>
                        <span style={{ fontSize: '12px', color: 'var(--color-bright-action)', fontWeight: 600 }}>{hub.country}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <MapPin size={14} color="var(--color-primary-blue)" />
                        <span>{hub.address}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span>Tel: {hub.phone}</span>
                        <span>•</span>
                        <span>{hub.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inquiry Form */}
              <div className="ace-card" style={{ padding: '32px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)', fontWeight: 700, marginBottom: '8px' }}>
                  Submit Operational Inquiry
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  Our 24/7 global dispatch team will respond within 30 minutes.
                </p>

                {formSubmitted ? (
                  <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                    <CheckCircle2 size={24} color="#10B981" style={{ margin: '0 auto 8px' }} />
                    <div style={{ fontWeight: 700 }}>Inquiry Dispatched Successfully</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Ticket #ACE-INQ-941 generated. A freight specialist is reviewing your request.</div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit}>
                    <div className="ace-form-group">
                      <label className="ace-label ace-label-required">Your Name</label>
                      <input type="text" className="ace-input" placeholder="Kwame Mensah" required />
                    </div>

                    <div className="ace-form-group">
                      <label className="ace-label ace-label-required">Company Email</label>
                      <input type="email" className="ace-input" placeholder="name@company.com" required />
                    </div>

                    <div className="ace-form-group">
                      <label className="ace-label ace-label-required">Subject / Nature of Shipment</label>
                      <input type="text" className="ace-input" placeholder="e.g. Air Freight charter quote Accra to London" required />
                    </div>

                    <div className="ace-form-group">
                      <label className="ace-label ace-label-required">Message</label>
                      <textarea rows="4" className="ace-textarea" placeholder="Detail your cargo volume, origin, destination, and timeline..." required />
                    </div>

                    <button type="submit" className="ace-btn ace-btn-action" style={{ width: '100%', height: '44px' }}>
                      <Send size={15} />
                      <span>Send Dispatch Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 820px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
