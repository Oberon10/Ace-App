import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Globe2, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Anchor, 
  Plane, 
  Truck, 
  Train 
} from 'lucide-react';

export default function AboutView({ setView }) {
  return (
    <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '48px 0 80px' }}>
      <div className="ace-container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Corporate Profile & Fleet
          </span>
          <h1 style={{ fontSize: 'clamp(24px, 6vw, 36px)', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '4px', marginBottom: '12px' }}>
            About ACE Logistics Global
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Leading international freight forwarding, bonded container logistics, and multimodal supply chain infrastructure connecting developing industrial hubs with global commerce.
          </p>
        </div>

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

            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <img src="/images/container-port.jpg" alt="Port Operations" style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
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
          backgroundColor: 'var(--color-primary-blue)',
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
        @media (max-width: 820px) {
          .about-split {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
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
