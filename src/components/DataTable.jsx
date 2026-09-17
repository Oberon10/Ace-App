import React from 'react';
import StatusBadge from './StatusBadge';
import { 
  Eye, 
  FileText, 
  ArrowUpRight, 
  MapPin, 
  Calendar, 
  Truck, 
  Plane, 
  Ship, 
  Train,
  ArrowRight,
  User
} from 'lucide-react';

export default function DataTable({ 
  shipments = [], 
  onSelectShipment, 
  onViewReceipt,
  emptyMessage = "No shipments found matching the selected criteria." 
}) {
  if (!shipments || shipments.length === 0) {
    return (
      <div className="ace-card" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '15px', marginBottom: '8px' }}>{emptyMessage}</p>
        <span style={{ fontSize: '12px' }}>Adjust your filters or book a new shipment to get started.</span>
      </div>
    );
  }

  const getMethodIcon = (methodStr = '') => {
    const m = methodStr.toLowerCase();
    if (m.includes('ocean') || m.includes('sea')) return Ship;
    if (m.includes('road') || m.includes('truck') || m.includes('fleet')) return Truck;
    if (m.includes('rail')) return Train;
    return Plane;
  };

  return (
    <>
      {/* ===================================================
          1. DESKTOP & TABLET VIEW (> 640px)
          =================================================== */}
      <div className="ace-table-container ace-table-desktop">
        <table className="ace-table">
          <thead>
            <tr>
              <th>Tracking Number</th>
              <th>Customer / Shipper</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Method</th>
              <th>Date Created</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(s => (
              <tr key={s.id}>
                <td>
                  <div 
                    onClick={() => onSelectShipment(s)}
                    style={{ 
                      cursor: 'pointer',
                      fontWeight: 700, 
                      color: 'var(--color-primary-blue)', 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px' 
                    }}
                  >
                    <span>{s.trackingNumber}</span>
                    <ArrowUpRight size={13} color="var(--color-bright-action)" />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    From: {s.origin}
                  </div>
                </td>

                <td>
                  <div style={{ fontWeight: 600 }}>{s.customer || s.sender?.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{s.sender?.company}</div>
                </td>

                <td>
                  <div style={{ fontWeight: 500 }}>{s.destination}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ETA: {s.estimatedDelivery}
                  </div>
                </td>

                <td>
                  <StatusBadge status={s.status} />
                </td>

                <td>
                  <span style={{ 
                    backgroundColor: 'var(--color-very-light-blue)', 
                    border: '1px solid var(--color-border)', 
                    padding: '3px 8px', 
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 500
                  }}>
                    {s.method}
                  </span>
                </td>

                <td style={{ color: 'var(--text-secondary)', fontSize: '12.5px' }}>
                  {s.createdDate}
                </td>

                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => onSelectShipment(s)}
                      className="ace-btn ace-btn-secondary ace-btn-sm"
                      title="View Detailed Tracking"
                    >
                      <Eye size={13} />
                      <span>Track</span>
                    </button>

                    <button
                      onClick={() => onViewReceipt(s)}
                      className="ace-btn ace-btn-ghost ace-btn-sm"
                      title="Generate Receipt / Bill of Lading"
                    >
                      <FileText size={13} />
                      <span>Receipt</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================================================
          2. MOBILE CONSIGNMENT CARDS (<= 640px)
          =================================================== */}
      <div className="ace-table-mobile-cards">
        {shipments.map(s => {
          const MethodIcon = getMethodIcon(s.method || s.methodType);
          return (
            <div key={`mobile-card-${s.id}`} className="ace-mobile-card">
              {/* Header: Tracking Code + Status Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Consignment Ref
                  </span>
                  <div 
                    onClick={() => onSelectShipment(s)}
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: 'var(--color-primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{s.trackingNumber}</span>
                    <ArrowUpRight size={14} color="var(--color-bright-action)" />
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </div>

              {/* Transit Corridor Route: Origin -> Destination */}
              <div style={{
                backgroundColor: 'var(--color-very-light-blue)',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '12.5px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
                  <MapPin size={13} color="var(--color-primary-blue)" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 600 }}>{s.origin}</span>
                  <ArrowRight size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, color: 'var(--color-primary-blue)' }}>{s.destination}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', paddingLeft: '19px' }}>
                  <span>ETA: <strong style={{ color: 'var(--text-primary)' }}>{s.estimatedDelivery}</strong></span>
                  <span>{s.createdDate}</span>
                </div>
              </div>

              {/* Shipper & Transport Method Tags */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '11.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-secondary)' }}>
                  <User size={12} />
                  <span>{s.customer || s.sender?.name}</span>
                </div>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'var(--color-light-blue)',
                  color: 'var(--color-primary-blue)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '11px'
                }}>
                  <MethodIcon size={12} />
                  <span>{s.method}</span>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '2px', paddingTop: '10px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <button
                  onClick={() => onSelectShipment(s)}
                  className="ace-btn ace-btn-secondary ace-btn-sm"
                  style={{ width: '100%', justifyContent: 'center', height: '38px', fontSize: '12.5px' }}
                >
                  <Eye size={14} />
                  <span>Track</span>
                </button>

                <button
                  onClick={() => onViewReceipt(s)}
                  className="ace-btn ace-btn-ghost ace-btn-sm"
                  style={{ width: '100%', justifyContent: 'center', height: '38px', fontSize: '12.5px', border: '1px solid var(--color-border)' }}
                >
                  <FileText size={14} />
                  <span>Receipt</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

