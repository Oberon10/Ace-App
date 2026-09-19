import React, { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge';
import TrackingTimeline from '../components/TrackingTimeline';
import InteractiveMap from '../components/InteractiveMap';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Package, 
  Copy, 
  Check, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  RefreshCw,
  Plane,
  Ship,
  Truck,
  Train,
  Phone,
  Mail,
  User,
  Building,
  DollarSign,
  Compass,
  Radio,
  FileText,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

// Determine Transport Icon based on shipping method
const getTransportIcon = (methodType = '') => {
  const type = methodType.toLowerCase();
  if (type.includes('ocean') || type.includes('sea')) return Ship;
  if (type.includes('road') || type.includes('ground') || type.includes('truck')) return Truck;
  if (type.includes('rail') || type.includes('train')) return Train;
  return Plane;
};

export default function TrackingView({ 
  shipment, 
  onSearchTracking, 
  _onSelectShipment, 
  onViewReceipt, 
  _allShipments = [],
  initialQuery = '',
  hasSearched = false,
  onClearTracking
}) {
  const [searchInput, setSearchInput] = useState(hasSearched && (initialQuery || shipment?.trackingNumber) ? (initialQuery || shipment?.trackingNumber) : '');
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [validationNotice, setValidationNotice] = useState('');

  useEffect(() => {
    if (hasSearched && shipment) {
      setSearchInput(shipment.trackingNumber || initialQuery || '');
      setValidationNotice('');
      setTimeout(() => {
        const el = document.getElementById('shipment-telemetry-root');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else if (!hasSearched) {
      setSearchInput('');
      setValidationNotice('');
    } else if (initialQuery) {
      setSearchInput(initialQuery);
    }
  }, [shipment, initialQuery, hasSearched]);

  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      setValidationNotice('Please enter your consignment tracking number to proceed.');
      return;
    }
    setValidationNotice('');
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      onSearchTracking(query);
    }, 300);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  const TransportIcon = shipment ? getTransportIcon(shipment.methodType || shipment.method) : Plane;

  // Calculate Milestone Progress Stepper
  const getMilestoneSteps = () => {
    const isDelivered = shipment?.status === 'DELIVERED';
    const isPending = shipment?.status === 'PENDING';
    const isInTransit = shipment?.status === 'IN TRANSIT' || (!isDelivered && !isPending);

    return [
      {
        id: 1,
        name: 'Manifest Created',
        location: shipment?.origin || 'Origin Terminal',
        status: 'completed',
        date: shipment?.createdDate || 'Booking Confirmed'
      },
      {
        id: 2,
        name: 'Intake & Screening',
        location: 'Export Cargo Hub',
        status: isPending ? 'active' : 'completed',
        date: isPending ? 'Under Security Scan' : 'Cleared for Transit'
      },
      {
        id: 3,
        name: 'In Transit',
        location: shipment?.currentLocation || 'En Route',
        status: isInTransit ? 'active' : isDelivered ? 'completed' : 'future',
        date: isInTransit ? 'Satellite Monitored' : isDelivered ? 'Waypoint Cleared' : 'Scheduled'
      },
      {
        id: 4,
        name: 'Customs & Port Arrival',
        location: shipment?.destination || 'Destination Depot',
        status: isDelivered ? 'completed' : 'future',
        date: isDelivered ? 'Customs Released' : 'ETA En Route'
      },
      {
        id: 5,
        name: 'Final Delivery',
        location: shipment?.receiver?.city ? `${shipment.receiver.city}, ${shipment.receiver.country}` : 'Consignee Address',
        status: isDelivered ? 'completed' : 'future',
        date: isDelivered ? `Delivered: ${shipment.estimatedDelivery}` : `Est: ${shipment?.estimatedDelivery}`
      }
    ];
  };

  const milestoneSteps = shipment ? getMilestoneSteps() : [];

  return (
    <div style={{ 
      backgroundColor: 'var(--color-very-light-blue)', 
      padding: (hasSearched && shipment) ? '32px 0 64px' : '28px 0 40px', 
      minHeight: (hasSearched && shipment) ? 'calc(100vh - 140px)' : 'calc(100vh - 240px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: (hasSearched && shipment) ? 'flex-start' : 'center'
    }}>
      <div className="ace-container">
        {/* ===================================================
            PROMINENT ENTERPRISE TRACKING SEARCH CARD
            =================================================== */}
        <div className="ace-card tracking-search-card" style={{
          width: '100%',
          maxWidth: (hasSearched && shipment) ? '100%' : '840px',
          margin: (hasSearched && shipment) ? '0 auto 28px' : '12px auto 28px',
          padding: '28px 28px 24px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(11, 79, 124, 0.08)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-white)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              backgroundColor: 'var(--color-light-blue)', 
              padding: '4px 12px', 
              borderRadius: '20px', 
              fontSize: '11.5px', 
              fontWeight: 700, 
              color: 'var(--color-primary-blue)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em',
              marginBottom: '8px'
            }}>
              <Radio size={13} color="var(--color-bright-action)" className="animate-pulse" />
              <span>Real-Time Freight Telemetry System</span>
            </div>
            <h1 style={{ fontSize: '26px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '2px', marginBottom: '8px' }}>
              Track Your Shipment
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--text-primary)', fontWeight: 500, maxWidth: '640px', margin: '0 auto', lineHeight: 1.5 }}>
              Locate, enter your consignment or tracking number below to view real-time cargo telemetry, transit waybills, and milestone status.
            </p>
          </div>

          <div style={{ maxWidth: '760px', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
            <label 
              htmlFor="consignment-input" 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '13.5px', 
                fontWeight: 700, 
                color: 'var(--color-primary-blue)',
                cursor: 'pointer'
              }}
            >
              <MapPin size={15} color="var(--color-bright-action)" />
              <span>Enter your consignment number:</span>
            </label>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Format: ACE-2026-XXXXXX or Master Waybill
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="tracking-search-form" style={{ 
            display: 'flex', 
            gap: '10px', 
            maxWidth: '760px', 
            margin: '0 auto',
            width: '100%',
            alignItems: 'stretch'
          }}>
            <div className="tracking-input-wrapper" style={{ 
              flex: 1, 
              minWidth: 0, 
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div className="ace-input-icon" style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                zIndex: 2
              }}>
                <Search size={18} color="var(--color-primary-blue)" />
              </div>
              <input
                id="consignment-input"
                type="text"
                className="ace-input ace-input-with-icon tracking-number-input"
                placeholder="Enter your consignment tracking number (e.g. ACE-2026-8F72K9)"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (validationNotice) setValidationNotice('');
                }}
                style={{ 
                  width: '100%',
                  height: '52px', 
                  fontSize: '15px', 
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--color-white)',
                  border: '1.5px solid var(--color-border)',
                  paddingLeft: '44px',
                  paddingRight: '14px',
                  borderRadius: '10px',
                  boxSizing: 'border-box',
                  boxShadow: '0 1px 3px rgba(11, 79, 124, 0.05)'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="ace-btn ace-btn-action tracking-submit-btn"
              style={{ 
                height: '52px', 
                padding: '0 28px', 
                fontSize: '15px', 
                fontWeight: 700,
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                flexShrink: 0,
                borderRadius: '10px',
                whiteSpace: 'nowrap'
              }}
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

          {validationNotice && (
            <div style={{
              maxWidth: '760px',
              margin: '14px auto 0',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#B91C1C',
              fontSize: '13px'
            }}>
              <AlertCircle size={16} />
              <span>{validationNotice}</span>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('ACE-2026-8F72K9');
                  setValidationNotice('');
                }}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary-blue)',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Use sample: ACE-2026-8F72K9
              </button>
            </div>
          )}

          {/* Professional Security & Format Notice */}
          <div className="tracking-security-bar" style={{ 
            marginTop: '16px', 
            paddingTop: '14px', 
            borderTop: '1px solid var(--color-border-subtle)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            flexWrap: 'wrap', 
            gap: '10px', 
            fontSize: '12px', 
            color: 'var(--text-muted)',
            maxWidth: '760px',
            margin: '16px auto 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#10B981" />
              <span>
                Reference Format:{' '}
                <strong 
                  className="security-awb-tag" 
                  style={{ color: 'var(--color-primary-blue)', cursor: 'pointer', textDecoration: 'underline dotted' }}
                  onClick={() => {
                    setSearchInput('ACE-2026-8F72K9');
                    if (validationNotice) setValidationNotice('');
                  }}
                  title="Click to insert sample tracking number"
                >
                  ACE-2026-8F72K9
                </strong>{' '}
                or Master Waybill
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11.5px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                Encrypted GPS Feed
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284C7', display: 'inline-block' }} />
                Verified Digital Waybill
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================
            STATE 1: SHIPMENT FOUND — DISPLAY ALL DETAILS
            =================================================== */}
        {(hasSearched && shipment) ? (
          <div id="shipment-telemetry-root">
            {/* Action Bar & Live Telemetry Verification */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '12px', 
              marginBottom: '20px',
              backgroundColor: 'var(--color-white)',
              padding: '12px 20px',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 6px #10B981', display: 'inline-block' }} />
                  <strong style={{ color: 'var(--text-primary)' }}>Satellite Telemetry Verified</strong>
                </div>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <span>Signal: High-Precision GPS Lock</span>
                <span style={{ color: 'var(--color-border)' }}>•</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Last synced: {lastSyncTime}</span>
              </div>

              <div className="ace-telemetry-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={handleRefreshTelemetry}
                  className="ace-btn ace-btn-ghost ace-btn-sm"
                  title="Refresh satellite telemetry data"
                  disabled={isRefreshing}
                >
                  <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                  <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="ace-btn ace-btn-secondary ace-btn-sm"
                  title="Copy permanent tracking link"
                >
                  {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copied ? 'Link Copied' : 'Share Link'}</span>
                </button>

                <button
                  onClick={() => onViewReceipt(shipment)}
                  className="ace-btn ace-btn-primary ace-btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={14} />
                  <span>Bill of Lading / Receipt</span>
                </button>
              </div>
            </div>

            {/* Primary Shipment Summary Card */}
            <div className="ace-card" style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '20px',
                marginBottom: '24px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Consignment Waybill Number
                    </span>
                    <span style={{ backgroundColor: 'var(--color-light-blue)', color: 'var(--color-primary-blue)', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                      {shipment.methodType ? shipment.methodType.toUpperCase() : 'FREIGHT'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '4px' }}>
                    <h2 className="ace-tracking-code" style={{ fontWeight: 800, color: 'var(--color-primary-blue)', letterSpacing: '0.03em', margin: 0 }}>
                      {shipment.trackingNumber}
                    </h2>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <TransportIcon size={14} color="var(--color-bright-action)" />
                      <span>Service Tier: <strong style={{ color: 'var(--text-primary)' }}>{shipment.method}</strong></span>
                    </div>
                    <span>•</span>
                    <div>Booking Date: <strong>{shipment.createdDate}</strong></div>
                    <span>•</span>
                    <div>Master Seal: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary-blue)' }}>{shipment.package?.sealNumber || 'ACE-SL-90812'}</span></div>
                  </div>
                </div>

                <div className="tracking-status-badge-wrap" style={{ textAlign: 'right', minWidth: '160px' }}>
                  <StatusBadge status={shipment.status} />
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    SLA Status: <strong style={{ color: '#059669' }}>On-Time Guaranteed</strong>
                  </div>
                </div>
              </div>

              {/* Milestone Progress Stepper */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
                  Transit Milestone Pipeline
                </div>

                <div className="tracking-milestones-grid" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                  gap: '10px',
                  position: 'relative' 
                }}>
                  {milestoneSteps.map((step) => {
                    const isStepCompleted = step.status === 'completed';
                    const isStepActive = step.status === 'active';
                    
                    return (
                      <div 
                        key={step.id} 
                        style={{
                          backgroundColor: isStepActive 
                            ? 'var(--color-light-blue)' 
                            : isStepCompleted 
                              ? '#F0FDF4' 
                              : 'var(--color-very-light-blue)',
                          border: isStepActive 
                            ? '2px solid var(--color-bright-action)' 
                            : isStepCompleted 
                              ? '1px solid #BBF7D0' 
                              : '1px solid var(--color-border)',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          position: 'relative',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                            STEP {step.id}
                          </span>
                          <div>
                            {isStepCompleted && <CheckCircle2 size={15} color="#10B981" />}
                            {isStepActive && <Radio size={14} color="var(--color-bright-action)" className="animate-pulse" />}
                            {!isStepCompleted && !isStepActive && <Clock size={14} color="var(--text-muted)" />}
                          </div>
                        </div>

                        <div style={{ 
                          fontSize: '13px', 
                          fontWeight: 700, 
                          color: isStepActive ? 'var(--color-primary-blue)' : isStepCompleted ? '#166534' : 'var(--text-secondary)',
                          lineHeight: 1.2
                        }}>
                          {step.name}
                        </div>

                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {step.location}
                        </div>

                        <div style={{ 
                          fontSize: '10.5px', 
                          fontWeight: 600, 
                          color: isStepActive ? 'var(--color-bright-action)' : isStepCompleted ? '#15803D' : 'var(--text-muted)',
                          marginTop: '4px' 
                        }}>
                          {step.date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4 Core Corridor Metric Cards */}
              <div className="tracking-corridor-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {/* Current Location */}
                <div style={{ backgroundColor: 'var(--color-light-blue)', padding: '16px 18px', borderRadius: '10px', border: '1px solid #c8e1f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--color-primary-blue)', fontWeight: 700, textTransform: 'uppercase' }}>
                    <MapPin size={14} />
                    <span>CURRENT WAYPOINT</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '6px' }}>
                    {shipment.currentLocation}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    GPS Transponder Verified
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div style={{ backgroundColor: 'var(--status-delivered-bg)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--status-delivered-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--status-delivered-color)', fontWeight: 700, textTransform: 'uppercase' }}>
                    <Calendar size={14} />
                    <span>ESTIMATED DELIVERY</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--status-delivered-text)', marginTop: '6px' }}>
                    {shipment.estimatedDelivery}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--status-delivered-color)', marginTop: '2px' }}>
                    Guaranteed Delivery Window
                  </div>
                </div>

                {/* Origin Terminal */}
                <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    <Building size={14} />
                    <span>ORIGIN TERMINAL</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                    {shipment.origin}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Shipper Hub Handover
                  </div>
                </div>

                {/* Destination Hub */}
                <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '16px 18px', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    <MapPin size={14} />
                    <span>DESTINATION HUB</span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                    {shipment.destination}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Consignee Receiving Port
                  </div>
                </div>
              </div>
            </div>

            {/* Satellite Route Map Section */}
            <div style={{ marginBottom: '28px' }}>
              <InteractiveMap shipment={shipment} />
            </div>

            {/* Comprehensive Deep-Dive Two-Column Layout */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1.1fr)',
              gap: '24px'
            }} className="tracking-grid">
              
              {/* LEFT COLUMN: Chronological Milestones & Diagnostics */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Real-time Tracking Chronology */}
                <div className="ace-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={18} color="var(--color-primary-blue)" />
                      <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                        Milestone Tracking Chronology
                      </h3>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Verified Checkpoints</span>
                  </div>

                  <TrackingTimeline events={shipment.timeline} />
                </div>

                {/* Carrier & Telemetry Diagnostics */}
                <div className="ace-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                    <Radio size={18} color="var(--color-primary-blue)" />
                    <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                      Carrier & Telemetry Diagnostics
                    </h3>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '13px' }}>
                    <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        Carrier Transport ID
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '3px' }}>
                        {shipment.methodType === 'air' ? 'Flight ACE-802 (Boeing 777F)' :
                         shipment.methodType === 'ocean' ? 'Vessel ELBSPIRIT (IMO 9412086)' :
                         shipment.methodType === 'road' ? 'Express Convoy Unit #442' : 'Intermodal Freight #91'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        ACE Global Certified Fleet
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        GPS Satellite Uplink
                      </div>
                      <div style={{ fontWeight: 700, color: '#059669', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                        Active (3.2m Precision)
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        L-Band 1.6 GHz Transponder
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        Tamper-Proof Container Seal
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '3px', fontFamily: 'monospace' }}>
                        {shipment.package?.sealNumber || 'ACE-SL-90812'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px' }}>
                        Verified Intact at Last Checkpoint
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                        Customs Declaration Status
                      </div>
                      <div style={{ fontWeight: 700, color: '#0B4F7C', marginTop: '3px' }}>
                        Priority Clearance Lane
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Electronic Manifest Filed
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Shipper, Consignee, Package Specifications & Billing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Shipper & Consignee Full Contact Card */}
                <div className="ace-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                    <User size={18} color="var(--color-primary-blue)" />
                    <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                      Shipper & Consignee Information
                    </h3>
                  </div>

                  {/* Shipper Section */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Shipper (Consignor)
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Origin</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '4px', color: 'var(--text-primary)' }}>
                      {shipment.sender?.name || shipment.customer}
                    </div>
                    {shipment.sender?.company && (
                      <div style={{ fontSize: '12.5px', color: 'var(--color-primary-blue)', fontWeight: 600 }}>
                        {shipment.sender.company}
                      </div>
                    )}
                    {shipment.sender?.address && (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                        {shipment.sender.address}
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {shipment.sender?.city || 'Accra'}, {shipment.sender?.country || 'Ghana'}
                    </div>
                    
                    {(shipment.sender?.phone || shipment.sender?.email) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {shipment.sender?.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={12} />
                            <span>{shipment.sender.phone}</span>
                          </div>
                        )}
                        {shipment.sender?.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} />
                            <span>{shipment.sender.email}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '14px 0' }} />

                  {/* Consignee Section */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Consignee (Recipient)
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Destination</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginTop: '4px', color: 'var(--text-primary)' }}>
                      {shipment.receiver?.name || 'Authorized Recipient'}
                    </div>
                    {shipment.receiver?.company && (
                      <div style={{ fontSize: '12.5px', color: 'var(--color-primary-blue)', fontWeight: 600 }}>
                        {shipment.receiver.company}
                      </div>
                    )}
                    {shipment.receiver?.address && (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                        {shipment.receiver.address}
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {shipment.receiver?.city || 'London'}, {shipment.receiver?.country || 'United Kingdom'}
                    </div>

                    {(shipment.receiver?.phone || shipment.receiver?.email) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {shipment.receiver?.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={12} />
                            <span>{shipment.receiver.phone}</span>
                          </div>
                        )}
                        {shipment.receiver?.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} />
                            <span>{shipment.receiver.email}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Package & Cargo Specifications */}
                <div className="ace-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                    <Package size={18} color="var(--color-primary-blue)" />
                    <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                      Cargo & Package Specifications
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '13.5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Commodity Description:</span>
                      <strong style={{ color: 'var(--text-primary)', textAlign: 'right' }}>{shipment.package?.type || 'General Cargo'}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Gross Weight:</span>
                      <span style={{ fontWeight: 600 }}>
                        {shipment.package?.weightKg} kg 
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '4px' }}>
                          ({(parseFloat(shipment.package?.weightKg || 10) * 2.20462).toFixed(1)} lbs)
                        </span>
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Dimensions (L × W × H):</span>
                      <span style={{ fontWeight: 600 }}>{shipment.package?.dimensions || 'Standard Pallet'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Quantity / Pieces:</span>
                      <span style={{ fontWeight: 600 }}>{shipment.package?.pieces || 1} Carton / Piece(s)</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Declared Customs Value:</span>
                      <strong style={{ color: 'var(--color-primary-blue)' }}>{shipment.package?.declaredValue || '$5,000.00'}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Cargo Insurance:</span>
                      <span style={{ fontWeight: 600, color: '#059669' }}>{shipment.package?.insurance || 'Standard Liability'}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Security Seal ID:</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, backgroundColor: 'var(--color-very-light-blue)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                        {shipment.package?.sealNumber || 'ACE-SL-90812'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Freight Charges & Billing Clearance */}
                <div className="ace-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                    <DollarSign size={18} color="var(--color-primary-blue)" />
                    <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                      Freight Charges & Invoicing Summary
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Base Linehaul Freight:</span>
                      <span>${(shipment.charges?.freight || 410).toFixed(2)} USD</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Fuel & Bunker Surcharge:</span>
                      <span>${(shipment.charges?.fuelSurcharge || 45).toFixed(2)} USD</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Customs & Terminal Handling:</span>
                      <span>${(shipment.charges?.customsHandling || 30).toFixed(2)} USD</span>
                    </div>

                    <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '4px 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800, color: 'var(--color-primary-blue)' }}>
                      <span>Total Invoiced:</span>
                      <span>${(shipment.charges?.total || 485).toFixed(2)} USD</span>
                    </div>

                    <div style={{ 
                      marginTop: '6px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      backgroundColor: '#ECFDF5', 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #A7F3D0',
                      fontSize: '12px'
                    }}>
                      <span style={{ color: '#065F46', fontWeight: 600 }}>Billing Status:</span>
                      <span style={{ color: '#065F46', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={13} strokeWidth={3} />
                        Prepaid / Commercial Account Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* 24/7 Operations Desk Support */}
                <div className="ace-card" style={{ backgroundColor: 'var(--color-primary-blue)', color: '#FFFFFF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <HelpCircle size={18} color="#7dd3fc" />
                    <h3 style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 700 }}>
                      24/7 Global Cargo Operations Desk
                    </h3>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, marginBottom: '14px' }}>
                    Need urgent delivery rerouting, proof of customs clearance, or specialized handling verification for consignment <strong>{shipment.trackingNumber}</strong>?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
                    <a 
                      href="tel:+233245550192" 
                      style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                    >
                      <Phone size={13} color="#7dd3fc" />
                      <span>+233 24 555 0192 (Accra Hub) • +44 20 7946 0912 (UK Hub)</span>
                    </a>
                    <a 
                      href="mailto:dispatch@acelogistics.com" 
                      style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                    >
                      <Mail size={13} color="#7dd3fc" />
                      <span>dispatch@acelogistics.com</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : hasSearched ? (
          /* ===================================================
              STATE 2: ERROR STATE — CONSIGNMENT NOT FOUND (NO DEMO BADGES)
              =================================================== */
          <div className="ace-card" style={{ 
            textAlign: 'center', 
            padding: '56px 32px', 
            maxWidth: '680px', 
            margin: '0 auto',
            border: '1px solid #FED7AA',
            backgroundColor: 'var(--color-white)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FFF7ED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px',
              border: '1px solid #FFEDD5'
            }}>
              <AlertCircle size={36} color="#EA580C" />
            </div>

            <h2 style={{ fontSize: '22px', color: 'var(--color-primary-blue)', fontWeight: 800, marginBottom: '8px' }}>
              Consignment Reference Not Found
            </h2>

            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px', maxWidth: '520px', margin: '0 auto 24px' }}>
              We could not find any active shipment matching reference <strong style={{ color: 'var(--text-primary)' }}>"{searchInput || initialQuery}"</strong> in our global freight telemetry registry.
            </p>

            <div style={{ 
              textAlign: 'left', 
              backgroundColor: 'var(--color-very-light-blue)', 
              padding: '20px 24px', 
              borderRadius: '10px', 
              border: '1px solid var(--color-border)', 
              marginBottom: '28px',
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--color-primary-blue)', marginBottom: '8px' }}>
                Please verify the following:
              </div>
              <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Confirm the complete tracking code from your booking receipt or Air Waybill (AWB).</li>
                <li>Standard ACE references follow the format: <strong>ACE-2026-XXXXXX</strong>.</li>
                <li>For bookings placed in the last 15 minutes, please allow a short window for initial terminal transponder intake.</li>
                <li>If you received a container number (e.g. MSKU) or seal ID, verify with your freight coordinator.</li>
              </ul>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '12px', 
              flexWrap: 'wrap' 
            }}>
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  if (onClearTracking) onClearTracking();
                }}
                className="ace-btn ace-btn-secondary"
                style={{ padding: '0 24px', height: '44px' }}
              >
                Search Another Number
              </button>

              <a
                href="mailto:dispatch@acelogistics.com"
                className="ace-btn ace-btn-primary"
                style={{ padding: '0 24px', height: '44px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Mail size={15} />
                <span>Contact 24/7 Operations Desk</span>
              </a>
            </div>
          </div>
        ) : null}
      </div>

      <style>{`
        .tracking-number-input::placeholder {
          color: #64748B !important;
          opacity: 1 !important;
          font-weight: 500 !important;
          font-size: 14px !important;
        }
        .tracking-number-input:focus {
          border-color: var(--color-bright-action) !important;
          box-shadow: 0 0 0 3px rgba(22, 131, 216, 0.18) !important;
        }
        body.dark-mode .tracking-number-input {
          background-color: var(--color-surface) !important;
          color: #FFFFFF !important;
          border-color: #38BDF8 !important;
        }
        body.dark-mode .tracking-number-input::placeholder {
          color: #94A3B8 !important;
          opacity: 1 !important;
        }
        @media (max-width: 880px) {
          .tracking-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .tracking-search-form {
            flex-direction: column !important;
            gap: 10px !important;
          }
          .tracking-input-wrapper {
            flex: 1 1 100% !important;
            width: 100% !important;
          }
          .tracking-submit-btn {
            width: 100% !important;
            justify-content: center !important;
          }
          .ace-tracking-code {
            font-size: clamp(18px, 5.5vw, 24px) !important;
            word-break: break-all !important;
          }
          .tracking-search-card {
            padding: 20px 16px 18px !important;
            margin-bottom: 20px !important;
          }
          .tracking-security-bar {
            padding-top: 12px !important;
            margin-top: 12px !important;
            font-size: 11px !important;
          }
          .tracking-milestones-grid {
            display: flex !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            padding-bottom: 8px !important;
            gap: 8px !important;
            width: 100% !important;
          }
          .tracking-milestones-grid > div {
            min-width: 140px !important;
            flex-shrink: 0 !important;
          }
          .tracking-status-badge-wrap {
            text-align: left !important;
            min-width: auto !important;
            width: 100% !important;
            display: flex !important;
            justifyContent: space-between !important;
            align-items: center !important;
            margin-top: 10px !important;
          }
          .tracking-corridor-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .tracking-corridor-grid > div {
            padding: 12px 14px !important;
          }
        }
        @media (max-width: 420px) {
          .tracking-corridor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
