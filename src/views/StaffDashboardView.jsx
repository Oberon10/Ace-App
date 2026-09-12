import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { 
  Truck, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  MapPin, 
  Package, 
  Clock, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function StaffDashboardView({ 
  shipments = [], 
  onUpdateShipmentStatus, 
  onSelectShipment, 
  setView, 
  activeRole = 'staff',
  setActiveRole 
}) {
  const [selectedTracking, setSelectedTracking] = useState('ACE-2026-8F72K9');
  const [scanSimulating, setScanSimulating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [statusUpdateVal, setStatusUpdateVal] = useState('IN TRANSIT');
  const [newLocationVal, setNewLocationVal] = useState('');
  const [newNoteVal, setNewNoteVal] = useState('');

  const activeShipment = shipments.find(s => s.trackingNumber === selectedTracking) || shipments[0];

  const handleSimulateScan = () => {
    setScanSimulating(true);
    setTimeout(() => {
      setScanSimulating(false);
      setSuccessMessage(`Package ${activeShipment?.trackingNumber} verified and manifest scanned at terminal gate.`);
      setTimeout(() => setSuccessMessage(''), 4000);
    }, 700);
  };

  const handleApplyStatusChange = (e) => {
    e.preventDefault();
    if (!activeShipment) return;

    onUpdateShipmentStatus(activeShipment.id, {
      status: statusUpdateVal,
      currentLocation: newLocationVal || activeShipment.currentLocation,
      note: newNoteVal || `Status updated to ${statusUpdateVal} by dispatcher console.`
    });

    setSuccessMessage(`Shipment ${activeShipment.trackingNumber} status updated to [${statusUpdateVal}].`);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', backgroundColor: 'var(--color-very-light-blue)' }}>
      {/* Sidebar */}
      <Sidebar 
        role={activeRole === 'admin' ? 'admin' : 'staff'} 
        currentView="staff-dashboard" 
        setView={setView} 
        setActiveRole={setActiveRole} 
      />

      {/* Main Staff Console */}
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#0D9488', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Terminal Dispatch & Field Operations
              </span>
              <span style={{ backgroundColor: '#CCFBF1', color: '#0F766E', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                STATION ID: ACC-T1
              </span>
            </div>
            <h1 style={{ fontSize: '26px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '2px' }}>
              Dispatcher Control & Status Manager
            </h1>
          </div>

          <button
            onClick={handleSimulateScan}
            disabled={scanSimulating}
            className="ace-btn ace-btn-action"
          >
            <QrCode size={16} />
            <span>{scanSimulating ? 'Scanning Barcode...' : 'Simulate Handheld Scan'}</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '12px 18px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: 600
          }}>
            <CheckCircle2 size={18} color="#10B981" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Two-Column Layout: Status Update Control (Left) & Current Consignment Info (Right) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '24px',
          marginBottom: '32px'
        }} className="staff-grid">
          {/* LEFT: STATUS UPDATE FORM */}
          <div className="ace-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <RefreshCw size={18} color="var(--color-primary-blue)" />
              <h3 style={{ fontSize: '17px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                Advance Consignment Status
              </h3>
            </div>

            <form onSubmit={handleApplyStatusChange}>
              <div className="ace-form-group">
                <label className="ace-label ace-label-required">Select Consignment to Update</label>
                <select
                  className="ace-select"
                  value={selectedTracking}
                  onChange={(e) => setSelectedTracking(e.target.value)}
                >
                  {shipments.map(s => (
                    <option key={s.id} value={s.trackingNumber}>
                      {s.trackingNumber} — {s.sender?.company || s.sender?.name} ({s.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="ace-form-group">
                <label className="ace-label ace-label-required">Set New Milestone Status</label>
                <select
                  className="ace-select"
                  value={statusUpdateVal}
                  onChange={(e) => setStatusUpdateVal(e.target.value)}
                >
                  <option value="IN TRANSIT">IN TRANSIT (Active Courier / Flight)</option>
                  <option value="DELIVERED">DELIVERED (Final Consignee Signed)</option>
                  <option value="PENDING">PENDING (Warehouse Intake / Staging)</option>
                  <option value="CANCELLED">CANCELLED (Shipper Voided)</option>
                </select>
              </div>

              <div className="ace-form-group">
                <label className="ace-label">Current Waypoint / Hub Location</label>
                <input
                  type="text"
                  className="ace-input"
                  placeholder={activeShipment?.currentLocation || "e.g. Accra Air Cargo Hub, Bay 4"}
                  value={newLocationVal}
                  onChange={(e) => setNewLocationVal(e.target.value)}
                />
              </div>

              <div className="ace-form-group">
                <label className="ace-label">Dispatcher Notes / Event Log Entry</label>
                <input
                  type="text"
                  className="ace-input"
                  placeholder="e.g. Cleared customs screening, loaded on flight ACE-802"
                  value={newNoteVal}
                  onChange={(e) => setNewNoteVal(e.target.value)}
                />
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  className="ace-btn ace-btn-primary"
                  style={{ flex: 1, height: '44px' }}
                >
                  <CheckCircle2 size={16} />
                  <span>Commit Status Change</span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: SELECTED SHIPMENT SNAPSHOT */}
          {activeShipment && (
            <div className="ace-card" style={{ backgroundColor: 'var(--color-white)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-blue)', textTransform: 'uppercase' }}>
                  Target Consignment Spec
                </div>
                <StatusBadge status={activeShipment.status} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary-blue)' }}>
                  {activeShipment.trackingNumber}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {activeShipment.method} • ETA: {activeShipment.estimatedDelivery}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', backgroundColor: 'var(--color-very-light-blue)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Origin:</span>
                  <strong>{activeShipment.origin}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Destination:</span>
                  <strong>{activeShipment.destination}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current Location:</span>
                  <strong style={{ color: 'var(--color-bright-action)' }}>{activeShipment.currentLocation}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Cargo Weight:</span>
                  <strong>{activeShipment.package?.weightKg} kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Security Seal:</span>
                  <strong style={{ fontFamily: 'monospace' }}>{activeShipment.package?.sealNumber}</strong>
                </div>
              </div>

              <div style={{ marginTop: '18px' }}>
                <button
                  onClick={() => onSelectShipment(activeShipment)}
                  className="ace-btn ace-btn-secondary ace-btn-sm"
                  style={{ width: '100%' }}
                >
                  <span>View Full Customer Tracking View</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dispatch Queue Table */}
        <div className="ace-card">
          <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700, marginBottom: '14px' }}>
            Station Intake & Dispatch Queue
          </h3>
          <div className="ace-table-container">
            <table className="ace-table">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Shipper</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Method</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map(s => (
                  <tr key={s.id}>
                    <td>
                      <strong style={{ color: 'var(--color-primary-blue)' }}>{s.trackingNumber}</strong>
                    </td>
                    <td>{s.sender?.company || s.sender?.name}</td>
                    <td>{s.origin} → {s.destination}</td>
                    <td><StatusBadge status={s.status} /></td>
                    <td>{s.method}</td>
                    <td>
                      <button
                        onClick={() => setSelectedTracking(s.trackingNumber)}
                        className="ace-btn ace-btn-ghost ace-btn-sm"
                        style={{ color: 'var(--color-bright-action)', fontWeight: 600 }}
                      >
                        Select for Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 860px) {
          .staff-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
