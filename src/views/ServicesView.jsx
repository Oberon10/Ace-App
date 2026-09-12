import React from 'react';
import { 
  Plane, 
  Ship, 
  Truck, 
  Train, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Globe2, 
  Package, 
  Box, 
  Anchor, 
  Layers
} from 'lucide-react';

export default function ServicesView({ setView }) {
  const servicesList = [
    {
      id: 'air',
      title: 'Air Freight Priority',
      tagline: 'Time-Critical & High-Value Global Express',
      image: '/images/air-cargo.jpg',
      icon: Plane,
      transitTime: '1–3 Business Days',
      capacity: 'Up to 100 Tons / Direct Charters',
      desc: 'Our priority air cargo network delivers fast, secure transportation for urgent, temperature-sensitive, and high-value consignments connecting Africa, Europe, the Americas, and Asia.',
      features: [
        'Dedicated daily scheduled flights linking Accra, London, Frankfurt & JFK',
        'Temperature-controlled pharmaceutical & perishable cargo (Cold Chain)',
        'Full and part charter options for oversized industrial machinery',
        'End-to-end IATA electronic airway bill and priority tarmac clearance'
      ],
      pricingNote: 'From $8.50 / kg with customs priority dispatch'
    },
    {
      id: 'ocean',
      title: 'Ocean Container Shipping (FCL & LCL)',
      tagline: 'Cost-Effective Intercontinental Maritime Freight',
      image: '/images/container-ship.jpg',
      icon: Ship,
      transitTime: '12–25 Days',
      capacity: 'Full Container Load (FCL) & Less than Container (LCL)',
      desc: 'Partnered with premier vessel operators like ELBSPIRIT, ACE Logistics coordinates reliable ocean transport from major deep-water ports with streamlined container stuffing, drayage, and customs clearance.',
      features: [
        'Weekly sailings between Rotterdam, Hamburg, Tema, Singapore & New York',
        'Standard 20ft/40ft, High Cube, Open Top, and Flat Rack containers',
        'Reefer container monitoring with automated temperature telemetry',
        'Bonded marine port warehousing and priority berth discharge'
      ],
      pricingNote: 'From $2.50 / kg (Economical bulk ocean tier)'
    },
    {
      id: 'road',
      title: 'Interstate Road Freight Fleet',
      tagline: 'Flexible Door-to-Door Overland Transport',
      image: '/images/truck-freight.jpg',
      icon: Truck,
      transitTime: '24–48 Hours Regional',
      capacity: 'Dedicated 53ft Air-Ride Dry Vans & Flatbeds',
      desc: 'Equipped with heavy-duty Freightliner tractors, our regional road network connects ports, airports, distribution centers, and commercial hubs with live GPS tracking and professional drivers.',
      features: [
        'Satellite-tracked aerodynamic Freightliner fleet with twin-axle trailers',
        'Direct door-to-door delivery with lift-gate and residential options',
        'Hazmat and dangerous goods certified transportation',
        'Real-time telematics with continuous temperature and speed monitoring'
      ],
      pricingNote: 'From $3.80 / kg with door delivery included'
    },
    {
      id: 'rail',
      title: 'Intermodal Rail Express Corridors',
      tagline: 'Sustainable, High-Tonnage Continental Rail',
      image: '/images/freight-train.jpg',
      icon: Train,
      transitTime: '3–6 Days',
      capacity: 'Heavy Bulk & Intermodal Container Railcars',
      desc: 'Linking inland industrial zones with maritime seaports, our electrified Vectron train corridors offer a high-volume, cost-efficient, and low-carbon alternative for bulk materials and cargo.',
      features: [
        '65% lower CO2 carbon emissions compared to long-haul trucking',
        'Direct rail sidings into major European and inland distribution yards',
        'High-capacity transport for metals, machinery, automotive, and chemicals',
        'Synchronized rail-to-truck transfer hubs with zero demurrage delays'
      ],
      pricingNote: 'From $4.20 / kg (Eco-friendly corridor tier)'
    },
    {
      id: 'customs',
      title: 'Customs Brokerage & Bonded Warehousing',
      tagline: 'Seamless Global Regulatory Clearance',
      image: '/images/container-port.jpg',
      icon: ShieldCheck,
      transitTime: 'Same-Day Clearance',
      capacity: 'Over 250,000 sq ft Secure Warehousing',
      desc: 'Navigate complex international trade laws effortlessly. Our licensed customs brokers handle import/export declarations, duties, HS code classification, and bonded port storage.',
      features: [
        'Licensed customs brokerage at Kotoka, Heathrow, and Rotterdam',
        'Duty & tax calculation, tariff classification, and trade compliance',
        'Secure 24/7 guarded bonded warehouse facilities with CCTV',
        'Automated EDI integration with national customs authorities'
      ],
      pricingNote: 'Transparent flat-fee customs documentation'
    }
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '48px 0 80px' }}>
      <div className="ace-container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Multi-Modal Solutions
          </span>
          <h1 style={{ fontSize: '36px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '4px', marginBottom: '12px' }}>
            Comprehensive Logistics & Freight Services
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Connecting your business to global markets with synchronized air, sea, road, and rail transportation, underpinned by proprietary real-time telemetry.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button onClick={() => setView('quote')} className="ace-btn ace-btn-action">
              <span>Calculate Instant Rate</span>
              <ArrowRight size={15} />
            </button>
            <button onClick={() => setView('new-shipment')} className="ace-btn ace-btn-secondary">
              <span>Book Consignment</span>
            </button>
          </div>
        </div>

        {/* Services List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
          {servicesList.map((svc, idx) => {
            const Icon = svc.icon;
            const isReversed = idx % 2 === 1;

            return (
              <div 
                key={svc.id} 
                className="ace-card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  display: 'grid',
                  gridTemplateColumns: isReversed ? '1fr 1.15fr' : '1.15fr 1fr',
                  gap: 0,
                  alignItems: 'stretch'
                }}
              >
                {/* Image side */}
                <div style={{
                  position: 'relative',
                  minHeight: '280px',
                  order: isReversed ? 2 : 1
                }}>
                  <img 
                    src={svc.image} 
                    alt={svc.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    backgroundColor: 'rgba(7, 59, 92, 0.9)',
                    color: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Clock size={13} color="#38BDF8" />
                    <span>Estimated Transit: {svc.transitTime}</span>
                  </div>
                </div>

                {/* Content side */}
                <div style={{
                  padding: '36px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  order: isReversed ? 1 : 2
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--color-light-blue)',
                        color: 'var(--color-primary-blue)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={20} strokeWidth={2.2} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase' }}>
                        {svc.tagline}
                      </span>
                    </div>

                    <h2 style={{ fontSize: '22px', color: 'var(--color-primary-blue)', fontWeight: 800, marginBottom: '10px' }}>
                      {svc.title}
                    </h2>

                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
                      {svc.desc}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                      {svc.features.map((feat, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: 'var(--text-primary)' }}>
                          <CheckCircle2 size={15} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: '16px',
                    marginTop: '8px'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary-blue)' }}>
                      {svc.pricingNote}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setView('quote')}
                        className="ace-btn ace-btn-secondary ace-btn-sm"
                      >
                        <span>Get Quote</span>
                      </button>
                      <button
                        onClick={() => setView('new-shipment')}
                        className="ace-btn ace-btn-action ace-btn-sm"
                      >
                        <span>Book Now</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Assurance Callout */}
        <div style={{
          marginTop: '48px',
          backgroundColor: 'var(--color-dark-navy)',
          color: '#FFFFFF',
          borderRadius: 'var(--radius-card)',
          padding: '36px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px' }}>
            Need Custom Multi-Modal Supply Chain Coordination?
          </h3>
          <p style={{ fontSize: '14px', color: '#D9E7F0', maxWidth: '640px', margin: '0 auto 20px' }}>
            Our enterprise logistics engineers design end-to-end bespoke routing, combined sea-air transit, and dedicated warehouse distribution networks.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button onClick={() => setView('contact')} className="ace-btn ace-btn-action">
              <span>Speak with Cargo Dispatcher</span>
            </button>
            <button onClick={() => setView('quote')} className="ace-btn ace-btn-secondary">
              <span>Calculate Custom Route</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .ace-card {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
