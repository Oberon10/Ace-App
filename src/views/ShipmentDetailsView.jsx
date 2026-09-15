import React, { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import TrackingTimeline from '../components/TrackingTimeline';
import InteractiveMap from '../components/InteractiveMap';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Package, 
  User, 
  Printer, 
  Share2, 
  Check, 
  Copy, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Search
} from 'lucide-react';

export default function ShipmentDetailsView({ 
  shipment, 
  onBack, 
  onViewReceipt,
  onSearchNewTracking
}) {
  const [searchInput, setSearchInput] = useState('');
  const [copied, setCopied] = useState(false);

  if (!shipment) {
    return (
      <div className="ace-container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <div className="ace-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '40px' }}>
          <AlertCircle size={48} color="var(--status-pending-color)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '22px', color: 'var(--color-primary-blue)', marginBottom: '8px' }}>
            Tracking Number Not Found
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            We could not find any active shipment matching the requested reference. Please verify your tracking number.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              className="ace-input"
              placeholder="Enter tracking number (e.g. ACE-2026-XXXXXX)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button 
              onClick={() => onSearchNewTracking(searchInput)} 
              className="ace-btn ace-btn-action"
            >
              Search
            </button>
          </div>
          <button onClick={onBack} className="ace-btn ace-btn-secondary" style={{ width: '100%' }}>
            Return to Tracking Center
          </button>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '36px 0 64px' }}>
      <div className="ace-container">
        {/* Navigation Breadcrumb & Back Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={onBack}
            className="ace-btn ace-btn-ghost ace-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Shipments</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleCopyLink}
              className="ace-btn ace-btn-secondary ace-btn-sm"
              title="Copy tracking link"
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copied ? 'Link Copied' : 'Share Link'}</span>
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

        {/* ===================================================
            SECTION 15: TOP SUMMARY CARD
            =================================================== */}
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
              <div style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 800, color: 'var(--color-primary-blue)', letterSpacing: '0.04em', marginTop: '2px' }}>
                {shipment.trackingNumber}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Service Tier: <strong style={{ color: 'var(--text-primary)' }}>{shipment.method}</strong> • Created: {shipment.createdDate}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <StatusBadge status={shipment.status} />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Carrier Seal: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{shipment.package?.sealNumber || 'ACE-VERIFIED'}</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Pills: Location, ETA, Origin/Destination */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {/* Current Location */}
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

            {/* Estimated Delivery */}
            <div style={{ backgroundColor: 'var(--status-delivered-bg)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--status-delivered-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--status-delivered-color)', fontWeight: 700, textTransform: 'uppercase' }}>
                <Calendar size={14} />
                <span>ESTIMATED DELIVERY</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--status-delivered-text)', marginTop: '4px' }}>
                {shipment.estimatedDelivery}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--status-delivered-color)', marginTop: '2px' }}>
                On-Schedule Guarantee
              </div>
            </div>

            {/* Route Lane */}
            <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                <Clock size={14} />
                <span>ROUTING LANE</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {shipment.origin} → {shipment.destination}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Mode: {shipment.method}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            SECTION 19: INTERACTIVE SATELLITE ROUTE MAP
            =================================================== */}
        <div style={{ marginBottom: '24px' }}>
          <InteractiveMap shipment={shipment} />
        </div>

        {/* Two-Column Grid: Timeline (Left) & Package/Parties (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '24px'
        }} className="details-grid">
          {/* LEFT: SECTION 14: TRACKING TIMELINE */}
          <div className="ace-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="var(--color-primary-blue)" />
                <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                  Tracking Timeline
                </h3>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Live Chronology</span>
            </div>

            <TrackingTimeline events={shipment.timeline} />
          </div>

          {/* RIGHT: PACKAGE DETAILS & SENDER/RECEIVER CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Package Details Card */}
            <div className="ace-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <Package size={18} color="var(--color-primary-blue)" />
                <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                  Package Details
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Cargo Type:</span>
                  <span style={{ fontWeight: 600 }}>{shipment.package?.type || 'Standard Freight'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Weight:</span>
                  <span style={{ fontWeight: 600 }}>{shipment.package?.weightKg} kg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Dimensions:</span>
                  <span style={{ fontWeight: 600 }}>{shipment.package?.dimensions}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Package Count:</span>
                  <span style={{ fontWeight: 600 }}>{shipment.package?.pieces || 1} piece(s)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Declared Value:</span>
                  <span style={{ fontWeight: 600 }}>{shipment.package?.declaredValue}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Transit Insurance:</span>
                  <span style={{ fontWeight: 600, color: '#059669' }}>{shipment.package?.insurance}</span>
                </div>
              </div>
            </div>

            {/* Sender & Receiver Card */}
            <div className="ace-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <User size={18} color="var(--color-primary-blue)" />
                <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                  Consignor & Consignee
                </h3>
              </div>

              {/* Sender info */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Sender (Origin)
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{shipment.sender?.name}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{shipment.sender?.company}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{shipment.sender?.address}, {shipment.sender?.city}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tel: {shipment.sender?.phone}</div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '14px 0' }} />

              {/* Receiver info */}
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Receiver (Destination)
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{shipment.receiver?.name}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{shipment.receiver?.company}</div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{shipment.receiver?.address}, {shipment.receiver?.city}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tel: {shipment.receiver?.phone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
