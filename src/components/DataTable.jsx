import React from 'react';
import StatusBadge from './StatusBadge';
import { Eye, FileText, ArrowUpRight } from 'lucide-react';

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

  return (
    <div className="ace-table-container">
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
  );
}
