import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2, MapPin, Plane, Ship, Truck, Train } from 'lucide-react';
import StatusBadge from './StatusBadge';

// Authentic High-Density Vector Barcode Generator (Code 128 / Code 39 Style)
function BarcodeSvg({ value = 'ACE-2026-8F72K9' }) {
  const str = String(value).toUpperCase();
  const barWidths = [2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2, 4];
  
  const elements = [];
  let posX = 8;
  
  // Start guard bars
  elements.push({ x: posX, w: 2.2, isBar: true }); posX += 2.2;
  elements.push({ x: posX, w: 1.5, isBar: false }); posX += 1.5;
  elements.push({ x: posX, w: 2.2, isBar: true }); posX += 2.2;
  elements.push({ x: posX, w: 2.0, isBar: false }); posX += 2.0;

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    const w1 = barWidths[(charCode + i) % barWidths.length];
    const s1 = barWidths[(charCode * 2 + i) % 5] + 1;
    const w2 = barWidths[(charCode * 3 + i) % barWidths.length];
    const s2 = barWidths[(charCode + 4) % 4] + 1;

    elements.push({ x: posX, w: w1 * 1.05, isBar: true }); posX += w1 * 1.05;
    elements.push({ x: posX, w: s1 * 0.95, isBar: false }); posX += s1 * 0.95;
    elements.push({ x: posX, w: w2 * 0.95, isBar: true }); posX += w2 * 0.95;
    elements.push({ x: posX, w: s2 * 0.95, isBar: false }); posX += s2 * 0.95;
  }

  // End guard bars
  elements.push({ x: posX, w: 2.2, isBar: true }); posX += 2.2;
  elements.push({ x: posX, w: 1.5, isBar: false }); posX += 1.5;
  elements.push({ x: posX, w: 3.2, isBar: true }); posX += 3.2;
  
  const totalWidth = posX + 8;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        width="210"
        height="40"
        viewBox={`0 0 ${totalWidth} 40`}
        style={{ display: 'block', maxWidth: '100%' }}
        aria-label={`Barcode for ${value}`}
      >
        <rect x="0" y="0" width={totalWidth} height="40" fill="#FFFFFF" />
        {elements.filter(e => e.isBar).map((bar, idx) => (
          <rect
            key={idx}
            x={bar.x}
            y="0"
            width={bar.w}
            height="40"
            fill="#0F172A"
          />
        ))}
      </svg>
      <div style={{
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '2.5px',
        color: '#0F172A',
        marginTop: '2px'
      }}>
        *{value}*
      </div>
    </div>
  );
}

// Circular Certified Carrier Stamp Component
function CertifiedCarrierStamp({ date = '2026-09-10', trackingNumber = 'ACE-2026-8F72K9' }) {
  return (
    <div style={{
      width: '84px',
      height: '84px',
      borderRadius: '50%',
      border: '2px dashed #0369A1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px',
      color: '#0369A1',
      textAlign: 'center',
      transform: 'rotate(-6deg)',
      userSelect: 'none',
      backgroundColor: 'rgba(240, 249, 255, 0.6)',
      boxShadow: 'inset 0 0 0 1px #BAE6FD'
    }}>
      <div style={{ fontSize: '7.5px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        ★ ACE CARRIER ★
      </div>
      <div style={{ fontSize: '8.5px', fontWeight: 800, margin: '1px 0', color: '#0284C7' }}>
        CERTIFIED
      </div>
      <div style={{ fontSize: '7.5px', fontWeight: 700 }}>
        {date}
      </div>
      <div style={{ fontSize: '6.5px', fontWeight: 600, color: '#64748B' }}>
        {trackingNumber.slice(-6)}
      </div>
    </div>
  );
}

export default function ReceiptModal({ shipment, isOpen, onClose }) {
  if (!isOpen || !shipment) return null;

  const handlePrint = () => {
    window.print();
  };

  // Extract or synthesize itemized list
  const items = (shipment.items && shipment.items.length > 0)
    ? shipment.items
    : [
        {
          id: 1,
          description: shipment.package?.type || "Standard Commercial Cargo & Freight",
          hsCode: "HS 8471.60",
          qty: shipment.package?.pieces || 1,
          weightKg: shipment.package?.weightKg || 45,
          dimensions: shipment.package?.dimensions || "60 × 45 × 40 cm",
          declaredValue: shipment.package?.declaredValue || "$5,000.00"
        }
      ];

  const totalPieces = items.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
  const totalWeight = shipment.package?.weightKg || items.reduce((sum, item) => sum + (Number(item.weightKg) || 0), 0);

  // Determine Transport Icon
  const getModeIcon = () => {
    const mode = (shipment.methodType || shipment.method || '').toLowerCase();
    if (mode.includes('ocean') || mode.includes('sea') || mode.includes('ship')) return <Ship size={13} />;
    if (mode.includes('truck') || mode.includes('road')) return <Truck size={13} />;
    if (mode.includes('rail') || mode.includes('train')) return <Train size={13} />;
    return <Plane size={13} />;
  };

  return (
    <div className="ace-modal-backdrop" onClick={onClose}>
      <div 
        className="ace-modal" 
        style={{ 
          maxWidth: '780px', 
          maxHeight: '94vh', 
          overflowY: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar (Screen Only) */}
        <div className="no-print" style={{
          backgroundColor: 'var(--color-primary-blue)',
          color: '#FFFFFF',
          padding: '14px 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-blue)',
              fontWeight: 800,
              fontSize: '14px'
            }}>
              ACE
            </div>
            <div>
              <h3 style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 700, margin: 0, lineHeight: 1.2 }}>
                Official Consignment Note & Bill of Lading
              </h3>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                Print-ready single-page official carrier document
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="ace-btn ace-btn-sm"
              style={{ 
                backgroundColor: 'var(--color-bright-action)', 
                color: '#FFFFFF', 
                border: 'none',
                padding: '6px 14px',
                fontWeight: 600
              }}
              title="Print 1-Page Document / Save as PDF"
            >
              <Printer size={14} />
              <span>Print 1-Page Receipt / PDF</span>
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
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ===================================================
            OFFICIAL 1-PAGE PRINTABLE RECEIPT CONTAINER
            =================================================== */}
        <div id="printable-receipt" style={{
          padding: '24px 28px',
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        }}>
          {/* SECTION 1: HEADER & CARRIER INFORMATION */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: '12px',
            borderBottom: '2px solid #0A2540',
            marginBottom: '12px'
          }}>
            {/* Left: Brand & Legal Title */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{
                  backgroundColor: '#0A2540',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '13px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.05em'
                }}>
                  ACE LOGISTICS
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  GLOBAL CARRIER NETWORK
                </span>
              </div>
              <h1 style={{
                fontSize: '17px',
                fontWeight: 800,
                color: '#0A2540',
                margin: '0 0 2px 0',
                letterSpacing: '-0.01em',
                lineHeight: 1.2
              }}>
                OFFICIAL CONSIGNMENT NOTE & BILL OF LADING
              </h1>
              <div style={{ fontSize: '9.5px', color: '#64748B', letterSpacing: '0.02em' }}>
                Original Carrier Copy • Non-Negotiable Air / Sea / Surface Waybill • IATA Reg #08-2-9104
              </div>
            </div>

            {/* Right: Waybill Number & Status Badge */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                Waybill / Tracking No.
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#0A2540',
                letterSpacing: '0.04em',
                fontFamily: "'Courier New', Courier, monospace"
              }}>
                {shipment.trackingNumber}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', marginTop: '3px' }}>
                <StatusBadge status={shipment.status} />
              </div>
            </div>
          </div>

          {/* SECTION 2: BARCODE & ROUTING SUMMARY STRIP */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '18px',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            padding: '10px 14px',
            marginBottom: '12px'
          }}>
            {/* Barcode Element */}
            <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '16px' }}>
              <BarcodeSvg value={shipment.trackingNumber} />
            </div>

            {/* Routing Specs Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              fontSize: '11px'
            }}>
              <div>
                <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Origin Terminal</div>
                <div style={{ fontWeight: 700, color: '#0A2540', marginTop: '1px' }}>{shipment.origin}</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Issued: {shipment.createdDate || '2026-09-10'}</div>
              </div>

              <div>
                <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Destination Hub</div>
                <div style={{ fontWeight: 700, color: '#0A2540', marginTop: '1px' }}>{shipment.destination}</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>ETA: {shipment.estimatedDelivery}</div>
              </div>

              <div>
                <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Service Tier / Mode</div>
                <div style={{ fontWeight: 700, color: '#0369A1', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                  {getModeIcon()}
                  <span>{shipment.method}</span>
                </div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Priority Freight Lane</div>
              </div>

              <div>
                <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Master Tamper Seal</div>
                <div style={{ fontWeight: 700, color: '#0A2540', marginTop: '1px' }}>{shipment.package?.sealNumber || 'ACE-SL-90812'}</div>
                <div style={{ fontSize: '10px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <CheckCircle2 size={10} />
                  <span>Screened & Intact</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SHIPPER & CONSIGNEE DETAILS (2-COLUMN GRID) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '12px'
          }}>
            {/* Shipper (Consignor) Box */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '10px 12px'
            }}>
              <div style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#0A2540',
                textTransform: 'uppercase',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '4px',
                marginBottom: '6px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>1. Shipper (Consignor)</span>
                <span style={{ color: '#64748B', fontWeight: 500 }}>Origin Port</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0F172A' }}>
                {shipment.sender?.name || 'Shipper Name'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#0369A1', fontWeight: 600 }}>
                {shipment.sender?.company || 'Commercial Entity'}
              </div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '3px', lineHeight: 1.35 }}>
                {shipment.sender?.address}, {shipment.sender?.city}, {shipment.sender?.country}
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '4px', display: 'flex', gap: '10px' }}>
                <span><strong>Tel:</strong> {shipment.sender?.phone}</span>
                <span><strong>Email:</strong> {shipment.sender?.email}</span>
              </div>
            </div>

            {/* Consignee (Receiver) Box */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '6px',
              padding: '10px 12px'
            }}>
              <div style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#0A2540',
                textTransform: 'uppercase',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '4px',
                marginBottom: '6px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>2. Consignee (Receiver)</span>
                <span style={{ color: '#64748B', fontWeight: 500 }}>Destination Hub</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0F172A' }}>
                {shipment.receiver?.name || 'Receiver Name'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#0369A1', fontWeight: 600 }}>
                {shipment.receiver?.company || 'Commercial Entity'}
              </div>
              <div style={{ fontSize: '11px', color: '#475569', marginTop: '3px', lineHeight: 1.35 }}>
                {shipment.receiver?.address}, {shipment.receiver?.city}, {shipment.receiver?.country}
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '4px', display: 'flex', gap: '10px' }}>
                <span><strong>Tel:</strong> {shipment.receiver?.phone}</span>
                <span><strong>Email:</strong> {shipment.receiver?.email}</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: ITEMIZED CARGO & MANIFEST TABLE */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              fontSize: '10.5px',
              fontWeight: 800,
              color: '#0A2540',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>3. Itemized Cargo Manifest & Goods Description</span>
              <span style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 600 }}>
                Declared Insurance: {shipment.package?.insurance || 'ACE Comprehensive Cargo Protection'}
              </span>
            </div>

            <table style={{
              width: '100%',
              fontSize: '11px',
              borderCollapse: 'collapse',
              border: '1px solid #CBD5E1'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', color: '#0A2540' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'center', width: '32px', borderBottom: '1px solid #CBD5E1' }}>#</th>
                  <th style={{ padding: '6px 10px', textAlign: 'left', borderBottom: '1px solid #CBD5E1' }}>Item Description / Commodity</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center', width: '85px', borderBottom: '1px solid #CBD5E1' }}>HS Code</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center', width: '65px', borderBottom: '1px solid #CBD5E1' }}>Quantity</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center', width: '75px', borderBottom: '1px solid #CBD5E1' }}>Weight</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center', width: '105px', borderBottom: '1px solid #CBD5E1' }}>Dimensions</th>
                  <th style={{ padding: '6px 10px', textAlign: 'right', width: '95px', borderBottom: '1px solid #CBD5E1' }}>Declared Value</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id || index} style={{
                    backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                    borderBottom: '1px solid #E2E8F0'
                  }}>
                    <td style={{ padding: '7px 8px', textAlign: 'center', fontWeight: 600, color: '#64748B' }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: '7px 10px' }}>
                      <strong style={{ color: '#0F172A' }}>{item.description || item.name}</strong>
                    </td>
                    <td style={{ padding: '7px 8px', textAlign: 'center', color: '#64748B', fontFamily: 'monospace', fontSize: '10px' }}>
                      {item.hsCode || item.sku || 'HS 8471.60'}
                    </td>
                    <td style={{ padding: '7px 8px', textAlign: 'center', fontWeight: 700, color: '#0A2540' }}>
                      {item.qty} {item.qty === 1 ? 'Pkg' : 'Pkgs'}
                    </td>
                    <td style={{ padding: '7px 8px', textAlign: 'center', color: '#0F172A' }}>
                      {item.weightKg} kg
                    </td>
                    <td style={{ padding: '7px 8px', textAlign: 'center', color: '#475569', fontSize: '10.5px' }}>
                      {item.dimensions}
                    </td>
                    <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>
                      {item.declaredValue}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#E2E8F0', fontWeight: 700, color: '#0A2540' }}>
                  <td colSpan={3} style={{ padding: '6px 10px', textAlign: 'left' }}>
                    TOTAL CONSIGNMENT MANIFEST
                  </td>
                  <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                    {totalPieces} Pkgs
                  </td>
                  <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                    {totalWeight} kg
                  </td>
                  <td style={{ padding: '6px 8px', textAlign: 'center', fontSize: '10px', color: '#475569' }}>
                    Verified Tare
                  </td>
                  <td style={{ padding: '6px 10px', textAlign: 'right' }}>
                    {shipment.package?.declaredValue || '$12,450.00'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* SECTION 5: CHARGES BREAKDOWN & OFFICIAL STAMP */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1fr',
            gap: '14px',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '6px',
            padding: '10px 14px',
            marginBottom: '12px'
          }}>
            {/* Left: Financial Invoicing Summary */}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#0A2540', textTransform: 'uppercase', marginBottom: '6px' }}>
                4. Invoiced Freight Charges & Account Clearance
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px', marginBottom: '6px' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '9.5px' }}>Base Freight:</span>
                  <strong style={{ color: '#0F172A' }}>${shipment.charges?.freight?.toFixed(2) || '410.00'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '9.5px' }}>Fuel / Peak:</span>
                  <strong style={{ color: '#0F172A' }}>${shipment.charges?.fuelSurcharge?.toFixed(2) || '45.00'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '9.5px' }}>Customs & Port:</span>
                  <strong style={{ color: '#0F172A' }}>${shipment.charges?.customsHandling?.toFixed(2) || '30.00'}</strong>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #CBD5E1',
                paddingTop: '6px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#0A2540' }}>Total Invoiced:</span>
                  <span style={{ fontSize: '15px', fontWeight: 900, color: '#0A2540' }}>
                    ${shipment.charges?.total?.toFixed(2) || '485.00'} USD
                  </span>
                </div>
                <div style={{
                  backgroundColor: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  color: '#15803D',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={11} />
                  <span>PREPAID — OFFICIAL RECEIPT</span>
                </div>
              </div>
            </div>

            {/* Right: Certified Carrier Stamp */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <CertifiedCarrierStamp date={shipment.createdDate || '2026-09-10'} trackingNumber={shipment.trackingNumber} />
              <div style={{ fontSize: '9.5px', color: '#475569', lineHeight: 1.3 }}>
                <strong style={{ color: '#0A2540', display: 'block' }}>Authorized Carrier Endorsement</strong>
                All carriage subject to ACE Logistics Standard Terms & Conditions. Warsaw/Montreal Convention applicable.
              </div>
            </div>
          </div>

          {/* SECTION 6: AUTHORIZATION SIGNATURES & LEGAL FOOTER */}
          <div style={{
            borderTop: '1px solid #CBD5E1',
            paddingTop: '10px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            fontSize: '10px',
            color: '#475569'
          }}>
            <div>
              <div style={{ borderBottom: '1px solid #94A3B8', height: '24px', marginBottom: '3px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Shipper / Agent Signature</strong></span>
                <span>Date: {shipment.createdDate || '2026-09-10'}</span>
              </div>
            </div>

            <div>
              <div style={{ borderBottom: '1px solid #94A3B8', height: '24px', marginBottom: '3px' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>Authorized Carrier Dispatch Officer</strong></span>
                <span>Stamp Ref: ACE-HQ-{shipment.trackingNumber.slice(-4)}</span>
              </div>
            </div>
          </div>

          {/* Micro Legal Footer */}
          <div style={{
            fontSize: '8.5px',
            color: '#94A3B8',
            textAlign: 'center',
            marginTop: '8px',
            borderTop: '1px dotted #E2E8F0',
            paddingTop: '4px'
          }}>
            ACE Logistics Global Operational Hubs: Accra • London • Rotterdam • Singapore • New York • Dubai • 24/7 Desk: +233 24 555 0192 / dispatch@acelogistics.com
          </div>
        </div>

        {/* Modal Actions Footer Bar (Screen Only) */}
        <div className="no-print" style={{
          backgroundColor: '#F8FAFC',
          padding: '12px 24px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button onClick={onClose} className="ace-btn ace-btn-secondary ace-btn-sm">
            Close
          </button>
          <button 
            onClick={handlePrint} 
            className="ace-btn ace-btn-action ace-btn-sm"
            style={{ fontWeight: 600 }}
          >
            <Printer size={14} />
            <span>Print 1-Page Document / PDF</span>
          </button>
        </div>
      </div>

      {/* COMPONENT-LEVEL PRINT ISOLATION RULES */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 6mm 8mm;
        }

        @media print {
          /* 1. Hide the entire application DOM */
          body > * {
            visibility: hidden !important;
          }

          /* 2. Show only the printable receipt */
          #printable-receipt,
          #printable-receipt * {
            visibility: visible !important;
          }

          /* 3. Position the receipt at the top left of the single page */
          #printable-receipt {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 8px 12px !important;
            background: #FFFFFF !important;
            color: #0F172A !important;
            box-shadow: none !important;
            border: none !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* 4. Reset modal backdrops and containers */
          .ace-modal-backdrop {
            position: static !important;
            background: transparent !important;
            padding: 0 !important;
            inset: auto !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }

          .ace-modal {
            box-shadow: none !important;
            border: none !important;
            max-height: none !important;
            max-width: 100% !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
          }

          /* 5. Explicitly hide all screen-only action bars */
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
