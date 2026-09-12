import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { isShipmentForCustomer } from '../data/shipments';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  FileText, 
  Search, 
  Clock, 
  ArrowRight,
  TrendingUp,
  MapPin,
  ShieldCheck,
  Lock,
  UserCheck,
  AlertCircle,
  Plane,
  Ship
} from 'lucide-react';

export default function CustomerDashboardView({ 
  shipments = [], 
  onSelectShipment, 
  onViewReceipt, 
  setView, 
  user = { name: 'Kwame Mensah', company: 'Gold Coast Trading Ltd', email: 'k.mensah@goldcoasttrading.com' },
  activeRole = 'customer',
  setActiveRole
}) {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminCustomerFilter, setAdminCustomerFilter] = useState('ALL');

  // Strict Customer Delivery Isolation:
  // When activeRole is 'customer', the user can ONLY view records pertaining to their deliveries!
  // All other users' consignments are strictly filtered out.
  const customerShipments = (activeRole === 'customer')
    ? shipments.filter(s => isShipmentForCustomer(s, user))
    : (adminCustomerFilter === 'ALL'
        ? shipments
        : shipments.filter(s => isShipmentForCustomer(s, { name: adminCustomerFilter, company: adminCustomerFilter, email: adminCustomerFilter })));

  // Dynamic Stats calculations derived strictly from the customer's records
  const totalShipments = customerShipments.length;
  const inTransitCount = customerShipments.filter(s => s.status === 'IN TRANSIT').length;
  const deliveredCount = customerShipments.filter(s => s.status === 'DELIVERED').length;
  const cancelledCount = customerShipments.filter(s => s.status === 'CANCELLED').length;

  // Active in-transit shipment belonging strictly to this customer
  const activeInTransitShipment = customerShipments.find(s => s.status === 'IN TRANSIT') || null;

  // Table filtering and search within this customer's records
  const filteredShipments = customerShipments.filter(s => {
    const matchesFilter = filterStatus === 'ALL' || s.status === filterStatus;
    const matchesSearch = !searchTerm || 
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.package?.type && s.package.type.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', backgroundColor: 'var(--color-very-light-blue)' }}>
      {/* Sidebar Navigation */}
      <Sidebar 
        role={activeRole || 'customer'} 
        currentView="customer-dashboard" 
        setView={setView} 
        setActiveRole={setActiveRole} 
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        {/* Top Header Greeting */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '5px', 
                backgroundColor: 'var(--color-light-blue)', 
                color: 'var(--color-primary-blue)', 
                padding: '3px 10px', 
                borderRadius: '6px', 
                fontSize: '11.5px', 
                fontWeight: 700,
                letterSpacing: '0.03em',
                textTransform: 'uppercase'
              }}>
                <Lock size={12} color="var(--color-bright-action)" />
                <span>Verified Private Account</span>
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {user.email || 'Authenticated Shipper'}
              </span>
            </div>

            <h1 style={{ fontSize: '26px', color: 'var(--color-primary-blue)', fontWeight: 800 }}>
              Welcome back, {user.name}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {user.company || 'Enterprise Account'} • Showing your personal deliveries only
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setView('quote')}
              className="ace-btn ace-btn-secondary"
            >
              <FileText size={15} />
              <span>Get Rate Quote</span>
            </button>

            <button
              onClick={() => setView('new-shipment')}
              className="ace-btn ace-btn-action"
            >
              <PlusCircle size={15} />
              <span>Book New Shipment</span>
            </button>
          </div>
        </div>

        {/* ===================================================
            ADMIN INSPECTION BAR (Only visible if Admin is viewing Customer Portal)
            =================================================== */}
        {activeRole === 'admin' && (
          <div style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '10px',
            padding: '12px 18px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#1E40AF', fontWeight: 600 }}>
              <ShieldCheck size={18} color="#2563EB" />
              <span>Administrator Audit View: You have permission to inspect customer delivery isolation</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Inspect Customer:</span>
              <select
                value={adminCustomerFilter}
                onChange={(e) => setAdminCustomerFilter(e.target.value)}
                className="ace-input"
                style={{ height: '34px', padding: '0 10px', fontSize: '12.5px', width: 'auto', backgroundColor: 'var(--color-white)' }}
              >
                <option value="ALL">All Platform Deliveries ({shipments.length})</option>
                <option value="Kwame Mensah">Kwame Mensah (Gold Coast Trading Ltd)</option>
                <option value="Jan De Vries">Jan De Vries (Maersk Logistics BV)</option>
                <option value="Marcus Cole">Marcus Cole (Apex Retail Solutions)</option>
              </select>
            </div>
          </div>
        )}

        {/* ===================================================
            SECTION 11 & 28: DASHBOARD STATS CARDS (DYNAMICALLY CALCULATED)
            =================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>
          {/* TOTAL SHIPMENTS */}
          <div className="ace-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  TOTAL SHIPMENTS
                </span>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-primary-blue)', marginTop: '4px', lineHeight: 1 }}>
                  {totalShipments}
                </div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-light-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary-blue)'
              }}>
                <Package size={20} strokeWidth={2.2} />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
              {activeRole === 'customer' ? 'Your active & completed consignments' : 'Filtered customer consignments'}
            </div>
          </div>

          {/* IN TRANSIT */}
          <div className="ace-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  IN TRANSIT
                </span>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-bright-action)', marginTop: '4px', lineHeight: 1 }}>
                  {inTransitCount}
                </div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#E0F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-bright-action)'
              }}>
                <Truck size={20} strokeWidth={2.2} />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '12px', fontWeight: 500 }}>
              Active live carrier telemetry
            </div>
          </div>

          {/* DELIVERED */}
          <div className="ace-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  DELIVERED
                </span>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#10B981', marginTop: '4px', lineHeight: 1 }}>
                  {deliveredCount}
                </div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10B981'
              }}>
                <CheckCircle2 size={20} strokeWidth={2.2} />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#059669', marginTop: '12px', fontWeight: 500 }}>
              100% verified POD receipts
            </div>
          </div>

          {/* CANCELLED */}
          <div className="ace-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  CANCELLED
                </span>
                <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--status-cancelled-color)', marginTop: '4px', lineHeight: 1 }}>
                  {cancelledCount}
                </div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--status-cancelled-color)'
              }}>
                <XCircle size={20} strokeWidth={2.2} />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px' }}>
              Refunded / voided
            </div>
          </div>
        </div>

        {/* ===================================================
            ACTIVE IN-TRANSIT HIGHLIGHT (Only shown if THIS customer has an in-transit consignment!)
            =================================================== */}
        {activeInTransitShipment ? (
          <div className="ace-card" style={{ marginBottom: '28px', backgroundColor: 'var(--color-light-blue)', border: '1px solid #c9e3f5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1683D8', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary-blue)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  Your Active Consignment En Route
                </span>
              </div>
              <StatusBadge status={activeInTransitShipment.status} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-blue)' }}>
                  {activeInTransitShipment.trackingNumber}
                </div>
                <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                  Route: <strong>{activeInTransitShipment.origin}</strong> → <strong>{activeInTransitShipment.destination}</strong> ({activeInTransitShipment.method})
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-bright-action)', marginTop: '3px', fontWeight: 500 }}>
                  Current Position: {activeInTransitShipment.currentLocation} • ETA: {activeInTransitShipment.estimatedDelivery}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onSelectShipment(activeInTransitShipment)}
                  className="ace-btn ace-btn-primary ace-btn-sm"
                >
                  <span>Open Live Radar & Details</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Reassuring status notice when no packages are in transit */
          customerShipments.length > 0 && (
            <div style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              borderRadius: '10px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={20} color="#10B981" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary-blue)' }}>
                    All current consignments delivered or scheduled
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    You have no active freight flights or vessels currently in motion.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setView('new-shipment')}
                className="ace-btn ace-btn-secondary ace-btn-sm"
              >
                <PlusCircle size={14} />
                <span>Book Another Shipment</span>
              </button>
            </div>
          )
        )}

        {/* ===================================================
            DATA TABLE FILTER & SEARCH BAR
            =================================================== */}
        <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
              Your Delivery Records
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Consignments registered to {user.name} ({user.company || 'Personal Account'}). Other users' data is strictly isolated.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Status Tabs */}
            <div style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '3px', display: 'flex', gap: '2px' }}>
              {['ALL', 'IN TRANSIT', 'DELIVERED', 'PENDING'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: filterStatus === status ? 700 : 500,
                    backgroundColor: filterStatus === status ? 'var(--color-light-blue)' : 'transparent',
                    color: filterStatus === status ? 'var(--color-primary-blue)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <div className="ace-input-icon">
                <Search size={15} />
              </div>
              <input
                type="text"
                className="ace-input ace-input-with-icon"
                placeholder="Search your tracking or route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '240px', height: '36px', fontSize: '13px' }}
              />
            </div>
          </div>
        </div>

        {/* If customer has 0 shipments at all, show clear dedicated empty state */}
        {customerShipments.length === 0 ? (
          <div className="ace-card" style={{ textAlign: 'center', padding: '56px 28px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-light-blue)',
              color: 'var(--color-primary-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px'
            }}>
              <Package size={30} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-primary-blue)', marginBottom: '8px' }}>
              No Deliveries on Record
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.5 }}>
              There are currently no shipments or deliveries registered under <strong>{user.name}</strong> ({user.email || 'this account'}). 
              Only packages booked by you or dispatched to your address will be displayed here.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setView('new-shipment')}
                className="ace-btn ace-btn-action"
              >
                <PlusCircle size={15} />
                <span>Book Your First Shipment</span>
              </button>
              <button
                onClick={() => setView('quote')}
                className="ace-btn ace-btn-secondary"
              >
                <FileText size={15} />
                <span>Get a Rate Quote</span>
              </button>
            </div>
          </div>
        ) : (
          /* Reusable Data Table containing only this customer's filtered deliveries */
          <DataTable
            shipments={filteredShipments}
            onSelectShipment={onSelectShipment}
            onViewReceipt={onViewReceipt}
            emptyMessage={`No shipments found matching status "${filterStatus}" or search term.`}
          />
        )}
      </main>
    </div>
  );
}
