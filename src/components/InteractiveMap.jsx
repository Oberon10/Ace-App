import React from 'react';
import { MapPin, Navigation, Compass, Plane, Ship, Truck, Train } from 'lucide-react';

export default function InteractiveMap({ shipment }) {
  if (!shipment) return null;

  const origin = shipment.origin || 'Accra, Ghana';
  const destination = shipment.destination || 'London Heathrow, UK';
  const current = shipment.currentLocation || 'In Transit';
  const methodType = shipment.methodType || 'air';

  let TransportIcon = Plane;
  if (methodType === 'ocean') TransportIcon = Ship;
  else if (methodType === 'road') TransportIcon = Truck;
  else if (methodType === 'rail') TransportIcon = Train;

  const isDelivered = shipment.status === 'DELIVERED';
  const progressPercent = isDelivered ? 100 : shipment.status === 'PENDING' ? 15 : 62;

  return (
    <div style={{
      backgroundColor: '#072A42',
      borderRadius: 'var(--radius-card)',
      border: '1px solid #164e72',
      padding: '20px',
      color: '#FFFFFF',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.3), var(--shadow-subtle)'
    }}>
      {/* Top HUD Controls */}
      <div className="ace-map-hud" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '14px', 
        position: 'relative', 
        zIndex: 2 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 8px #10B981', flexShrink: 0 }} />
          <span style={{ fontSize: '11.5px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#90CDF4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Satellite Telemetry • Live Feed
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#A0AEC0', flexShrink: 0 }}>
          <span>GPS FIX: ACCURATE</span>
          <Compass size={14} color="#63B3ED" />
        </div>
      </div>

      {/* SVG Map Canvas with stylized oceanic map grid and route */}
      <div style={{ position: 'relative', height: '210px', width: '100%', borderRadius: '10px', backgroundColor: '#0A3757', overflow: 'hidden' }}>
        {/* World Grid Lines */}
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.25 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#63B3ED" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Simplified Global Continents Outline */}
        <svg viewBox="0 0 800 240" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: 0.35 }}>
          <path d="M 120 40 Q 180 30 220 80 Q 200 140 130 150 Z" fill="#1A537C" />
          <path d="M 150 160 Q 210 180 200 220 Q 140 230 130 190 Z" fill="#1A537C" />
          <path d="M 370 30 Q 480 30 460 110 Q 380 120 360 80 Z" fill="#1A537C" />
          <path d="M 380 120 Q 450 140 430 220 Q 370 210 360 150 Z" fill="#1A537C" />
          <path d="M 520 40 Q 680 50 670 140 Q 560 140 510 90 Z" fill="#1A537C" />
        </svg>

        {/* Flight / Transit Trajectory Curve */}
        <svg viewBox="0 0 800 240" preserveAspectRatio="none" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          {/* Background route track */}
          <path
            d="M 160 160 Q 400 40 640 110"
            fill="none"
            stroke="#1B4D73"
            strokeWidth="3"
            strokeDasharray="6 4"
          />

          {/* Active progress track */}
          <path
            d="M 160 160 Q 400 40 640 110"
            fill="none"
            stroke="#1683D8"
            strokeWidth="3.5"
            strokeDasharray="800"
            strokeDashoffset={800 - (800 * (progressPercent / 100))}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />

          {/* Origin Node */}
          <circle cx="160" cy="160" r="7" fill="#FFFFFF" stroke="#0B4F7C" strokeWidth="3" />
          <text x="160" y="185" fill="#EAF5FC" fontSize="11" fontWeight="600" textAnchor="middle">Origin</text>

          {/* Destination Node */}
          <circle cx="640" cy="110" r="7" fill={isDelivered ? "#10B981" : "#FFFFFF"} stroke="#0B4F7C" strokeWidth="3" />
          <text x="640" y="135" fill="#EAF5FC" fontSize="11" fontWeight="600" textAnchor="middle">Destination</text>

          {/* Active Carrier Waypoint Node */}
          {!isDelivered && (
            <g transform="translate(420, 80)">
              {/* Radar pulse ripple */}
              <circle cx="0" cy="0" r="16" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.6">
                <animate attributeName="r" values="10;26;36" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.3;0" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="14" fill="#1683D8" stroke="#FFFFFF" strokeWidth="2.5" />
            </g>
          )}
        </svg>

        {/* Carrier Icon centered at active coordinates */}
        {!isDelivered && (
          <div style={{
            position: 'absolute',
            left: '52.5%',
            top: '33.3%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <TransportIcon size={16} strokeWidth={2.4} style={{ transform: 'rotate(15deg)' }} />
          </div>
        )}
      </div>

      {/* Bottom Route Summary Bar */}
      <div className="ace-map-summary-grid" style={{
        marginTop: '16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '10px',
        backgroundColor: '#093655',
        borderRadius: '8px',
        padding: '12px 14px',
        border: '1px solid #174c72'
      }}>
        <div>
          <div style={{ fontSize: '10.5px', color: '#90CDF4', textTransform: 'uppercase', fontWeight: 600 }}>Departure Origin</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '2px', wordBreak: 'break-word' }}>{origin}</div>
        </div>

        <div>
          <div style={{ fontSize: '10.5px', color: '#90CDF4', textTransform: 'uppercase', fontWeight: 600 }}>Active Waypoint</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#38BDF8', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', wordBreak: 'break-word' }}>
            <Navigation size={12} style={{ flexShrink: 0 }} />
            <span>{current}</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10.5px', color: '#90CDF4', textTransform: 'uppercase', fontWeight: 600 }}>Final Destination</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginTop: '2px', wordBreak: 'break-word' }}>{destination}</div>
        </div>
      </div>
    </div>
  );
}
