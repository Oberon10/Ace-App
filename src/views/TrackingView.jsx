import React, { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import TrackingTimeline from '../components/TrackingTimeline';
import InteractiveMap from '../components/InteractiveMap';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Package, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  ArrowLeft, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

export default function TrackingView({ 
  shipment, 
  onSearchTracking, 
  onSelectShipment, 
  onViewReceipt, 
  allShipments = [] 
}) {
  const [searchInput, setSearchInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearchTracking(searchInput.trim());
    }, 350);
  };

  const handleQuickClick = (trackId) => {
    setSearchInput(trackId);
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearchTracking(trackId);
    }, 250);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '40px 0 80px', minHeight: 'calc(100vh - 140px)' }}>
      <div className="ace-container">
        {/* ===================================================
            SECTION 8: PROMINENT TRACKING COMPONENT CARD
            =================================================== */}
        <div className="ace-card" style={{
          maxWidth: '780px',
          margin: '0 auto 36px',
          padding: '36px 32px',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--color-border)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Real-Time Freight Telemetry
            </span>
            <h1 style={{ fontSize: '26px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '2px', marginBottom: '6px' }}>
              Track Your Shipment
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Enter your tracking number to get real-time shipment updates.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <div className="ace-input-icon">
                <Search size={18} color="var(--color-primary-blue)" />
              </div>
              <input
                type="text"
                className="ace-input ace-input-with-icon"
                placeholder="Enter tracking number (e.g. ACE-2026-8F72K9)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ height: '48px', fontSize: '15px', fontWeight: 500 }}
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="ace-btn ace-btn-action"
              style={{ height: '48px', padding: '0 28px', fontSize: '15px' }}
            >
              {isSearching ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Quick-fill sample tracking badges */}
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Quick Test Samples:</span>
            {allShipments.slice(0, 4).map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleQuickClick(s.trackingNumber)}
                style={{
                  background: shipment?.id === s.id ? 'var(--color-primary-blue)' : 'var(--color-light-blue)',
                  color: shipment?.id === s.id ? '#FFFFFF' : 'var(--color-primary-blue)',
                  border: '1px solid var(--color-border)',
                  padding: '3px 9px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '11.5px',
                  transition: 'all 0.15s ease'
                }}
              >
                {s.trackingNumber} ({s.status})
              </button>
            ))}
          </div>
        </div>

        {/* ===================================================
            SECTION 15 & 31: RESULTS OR ERROR OR EMPTY LIST
            =================================================== */}
        {shipment ? (
          <div>
            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Check size={16} color="#10B981" />
                <span>Live Telemetry Verified • Satellite Transponder Online</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleCopyLink}
                  className="ace-btn ace-btn-secondary ace-btn-sm"
                >
                  {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Share Link'}</span>
                </button>

                <button
                  onClick={() => onViewReceipt(shipment)}
                  className="ace-btn ace-btn-primary ace-btn-sm"
                >
                  <Printer size={14} />
                  <span>Bill of Lading / Receipt</span>
                </button>
              </div>
            </div>

            {/* Top Shipment Summary Card */}
            <div className="ace-card" style={{ marginBottom: '24px', padding: '28px' }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '20px',
                marginBottom: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tracking Number
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-primary-blue)', letterSpacing: '0.04em', marginTop: '2px' }}>
                    {shipment.trackingNumber}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Service Tier: <strong style={{ color: 'var(--text-primary)' }}>{shipment.method}</strong> • Created: {shipment.createdDate}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={shipment.status} />
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Security Seal: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{shipment.package?.sealNumber || 'ACE-VERIFIED'}</span>
                  </div>
                </div>
              </div>

              {/* 3 Metric Pills: Location, ETA, Routing */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px'
              }}>
                <div style={{ backgroundColor: 'var(--color-light-blue)', padding: '16px 18px', borderRadius: '10px', border: '1px solid #d0e4f2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--color-primary-blue)', fontWeight: 700, textTransform: 'uppercase' }}>
                    <MapPin size={14} />
                    <span>CURRENT LOCATION</span>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '4px' }}>
                    {shipment.currentLocation}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    GPS verified waypoint
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--status-delivered-bg)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--status-delivered-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--status-delivered-color)', fontWeight: 700, textTransform: 'uppercase' }}>
                    <Calendar size={14} />
                    <span>ESTIMATED DELIVERY</span>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--status-delivered-text)', marginTop: '4px' }}>
                    {shipment.estimatedDelivery}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--status-delivered-color)', marginTop: '2px' }}>
                    On-Schedule Guaranteed
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    <Clock size={14} />
                    <span>ROUTING CORRIDOR</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {shipment.origin} → {shipment.destination}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Transit Mode: {shipment.method}
                  </div>
                </div>
              </div>
            </div>

            {/* Satellite Map */}
            <div style={{ marginBottom: '24px' }}>
              <InteractiveMap shipment={shipment} />
            </div>

            {/* Grid: Timeline & Packages */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
              gap: '24px'
            }} className="tracking-grid">
              {/* Vertical Timeline */}
              <div className="ace-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color="var(--color-primary-blue)" />
                    <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                      Tracking Timeline
                    </h3>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-Time Milestone Log</span>
                </div>

                <TrackingTimeline events={shipment.timeline} />
              </div>

              {/* Package & Parties */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="ace-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                    <Package size={18} color="var(--color-primary-blue)" />
                    <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                      Package Specifications
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Cargo Type:</span>
                      <span style={{ fontWeight: 600 }}>{shipment.package?.type}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Weight:</span>
                      <span style={{ fontWeight: 600 }}>{shipment.package?.weightKg} kg</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Dimensions:</span>
                      <span style={{ fontWeight: 600 }}>{shipment.package?.dimensions}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Insurance:</span>
                      <span style={{ fontWeight: 600, color: '#059669' }}>{shipment.package?.insurance}</span>
                    </div>
                  </div>
                </div>

                <div className="ace-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                    <ShieldCheck size={18} color="var(--color-primary-blue)" />
                    <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                      Shipper & Consignee
                    </h3>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase' }}>Shipper (Origin)</div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', marginTop: '2px' }}>{shipment.sender?.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{shipment.sender?.company} • {shipment.sender?.city}, {shipment.sender?.country}</div>
                  </div>

                  <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '12px 0' }} />

                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase' }}>Consignee (Destination)</div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', marginTop: '2px' }}>{shipment.receiver?.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{shipment.receiver?.company} • {shipment.receiver?.city}, {shipment.receiver?.country}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* SECTION 31: ERROR OR INITIAL STATE */
          <div className="ace-card" style={{ textAlign: 'center', padding: '48px 24px', maxWidth: '640px', margin: '0 auto' }}>
            <AlertCircle size={44} color="var(--status-pending-color)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', color: 'var(--color-primary-blue)', fontWeight: 700, marginBottom: '8px' }}>
              Tracking Number Not Found
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Please check the tracking number and try again. You can try one of our active demo consignments below.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {allShipments.map(s => (
                <div
                  key={s.id}
                  onClick={() => onSelectShipment(s)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    backgroundColor: 'var(--color-very-light-blue)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <strong style={{ color: 'var(--color-primary-blue)' }}>{s.trackingNumber}</strong>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.origin} → {s.destination} ({s.method})</div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 840px) {
          .tracking-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
