import React from 'react';
import { X, Printer, Download, ShieldCheck, CheckCircle, Package } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ReceiptModal({ shipment, isOpen, onClose }) {
  if (!isOpen || !shipment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ace-modal-backdrop" onClick={onClose}>
      <div 
        className="ace-modal" 
        style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div style={{
          backgroundColor: 'var(--color-primary-blue)',
          color: '#FFFFFF',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-blue)',
              fontWeight: 800,
              fontSize: '15px'
            }}>
              ACE
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: '#FFFFFF', fontWeight: 700 }}>Official Consignment Note & Bill of Lading</h3>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>ACE Global Logistics Carrier Network</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="ace-btn ace-btn-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
              title="Print Receipt"
            >
              <Printer size={14} />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Printable Body */}
        <div style={{ padding: '24px 28px', backgroundColor: 'var(--color-white)', color: 'var(--text-primary)' }} id="printable-receipt">
          {/* Top Receipt Metadata */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Tracking / Consignment ID</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary-blue)', letterSpacing: '0.05em' }}>
                {shipment.trackingNumber}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Date Issued: {shipment.createdDate || '2026-09-10'} • Mode: {shipment.method}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <StatusBadge status={shipment.status} />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Estimated Delivery: <strong style={{ color: 'var(--text-primary)' }}>{shipment.estimatedDelivery}</strong>
              </div>
            </div>
          </div>

          {/* Shipper & Consignee 2-column box */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary-blue)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Shipper (Consignor)
              </div>
              <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>{shipment.sender?.name || 'Shipper Name'}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{shipment.sender?.company}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {shipment.sender?.address}, {shipment.sender?.city}, {shipment.sender?.country}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Tel: {shipment.sender?.phone}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-primary-blue)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Consignee (Receiver)
              </div>
              <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--text-primary)' }}>{shipment.receiver?.name || 'Receiver Name'}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{shipment.receiver?.company}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {shipment.receiver?.address}, {shipment.receiver?.city}, {shipment.receiver?.country}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Tel: {shipment.receiver?.phone}
              </div>
            </div>
          </div>

          {/* Cargo Specifications */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Cargo Description & Specifications
            </div>
            <table style={{ width: '100%', fontSize: '12.5px', borderCollapse: 'collapse', border: '1px solid var(--color-border)' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-light-blue)', color: 'var(--color-primary-blue)' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left', borderBottom: '1px solid var(--color-border)' }}>Item Description</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>Weight</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>Dimensions</th>
                  <th style={{ padding: '8px 12px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>Declared Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-border)' }}>
                    <strong>{shipment.package?.type || 'Standard General Freight'}</strong>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Security Seal: {shipment.package?.sealNumber || 'N/A'} • {shipment.package?.pieces || 1} package(s)
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
                    {shipment.package?.weightKg || 45} kg
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
                    {shipment.package?.dimensions || 'Standard'}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid var(--color-border)' }}>
                    {shipment.package?.declaredValue || '$5,000.00'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Itemized Charges & Barcode */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
            {/* Barcode simulation */}
            <div style={{ textAlign: 'center', padding: '14px', border: '1px dashed var(--color-border)', borderRadius: '8px' }}>
              <div style={{
                fontFamily: 'monospace',
                letterSpacing: '5px',
                fontSize: '24px',
                fontWeight: 900,
                color: 'var(--text-primary)',
                userSelect: 'none'
              }}>
                ||| | |||| | || |||| || | |||
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', letterSpacing: '0.08em' }}>
                *{shipment.trackingNumber}*
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', color: '#10B981', marginTop: '6px' }}>
                <ShieldCheck size={13} />
                <span>Verified Cryptographic ACE Manifest</span>
              </div>
            </div>

            {/* Charges Breakdown */}
            <div style={{ backgroundColor: 'var(--color-light-blue)', padding: '14px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Base Freight:</span>
                <span style={{ fontWeight: 600 }}>${shipment.charges?.freight?.toFixed(2) || '410.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fuel & Peak Surcharge:</span>
                <span style={{ fontWeight: 600 }}>${shipment.charges?.fuelSurcharge?.toFixed(2) || '45.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Customs Doc & Inspection:</span>
                <span style={{ fontWeight: 600 }}>${shipment.charges?.customsHandling?.toFixed(2) || '30.00'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800, color: 'var(--color-primary-blue)', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                <span>Total Amount:</span>
                <span>${shipment.charges?.total?.toFixed(2) || '485.00'} USD</span>
              </div>
            </div>
          </div>

          {/* Footer Signature & Terms */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)', paddingTop: '14px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <div>
              <span>ACE Logistics Global Operations Hub • Accra • London • Rotterdam • New York</span>
              <div>All carriage subject to ACE Standard Conditions of Carriage & Warsaw/Montreal Convention.</div>
            </div>
            <div style={{ textAlign: 'center', paddingLeft: '16px' }}>
              <div style={{ width: '80px', height: '1px', backgroundColor: '#94A3B8', margin: '0 auto 4px' }} />
              <span>Authorized Carrier Stamp</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{
          backgroundColor: 'var(--color-very-light-blue)',
          padding: '14px 24px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button onClick={onClose} className="ace-btn ace-btn-secondary ace-btn-sm">
            Close
          </button>
          <button onClick={handlePrint} className="ace-btn ace-btn-action ace-btn-sm">
            <Printer size={14} />
            <span>Print Official Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}
