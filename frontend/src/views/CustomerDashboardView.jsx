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
  Ship,
  Calendar,
  Check,
  FileCheck,
  X
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

  // Customer Appointments state (persisted in localStorage)
  const [appointments, setAppointments] = useState(() => {
    try {
      const stored = localStorage.getItem('ace_customer_appointments');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentStep, setAppointmentStep] = useState('form');
  const [appointmentData, setAppointmentData] = useState({
    hub: 'Accra Air Cargo Hub (Ghana)',
    purpose: 'Customs Document Clearance & GRA Review',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    timeSlot: '10:00 AM - 10:45 AM GMT',
    fullName: user.name || 'Kwame Mensah',
    phone: '+233 24 555 0192',
    email: user.email || 'k.mensah@goldcoasttrading.com',
    consignmentRef: 'ACE-2T34-79011'
  });
  const [generatedAppointment, setGeneratedAppointment] = useState(null);

  const handleBookAppointment = (e) => {
    e.preventDefault();
    const token = `ACE-APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppt = {
      id: token,
      ...appointmentData,
      assignedOfficer: 'Capt. Kwame Mensah (Airside Controller)',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString()
    };
    const updated = [newAppt, ...appointments];
    setAppointments(updated);
    setGeneratedAppointment(newAppt);
    setAppointmentStep('confirmed');
    try {
      localStorage.setItem('ace_customer_appointments', JSON.stringify(updated));
    } catch (err) {
      console.warn(err);
    }
  };

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
    <div className="ace-dashboard-layout">
      {/* Sidebar Navigation */}
      <Sidebar 
        role={activeRole || 'customer'} 
        currentView="customer-dashboard" 
        setView={setView} 
        setActiveRole={setActiveRole} 
      />

      {/* Main Content Area */}
      <main className="ace-dashboard-main">
        {/* Top Header Greeting */}
        <div className="dashboard-header-flex" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
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

          <div className="dashboard-header-actions" style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { setAppointmentStep('form'); setShowAppointmentModal(true); }}
              className="ace-btn ace-btn-secondary"
            >
              <Calendar size={15} />
              <span>Book Appointment</span>
            </button>

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
        <div className="ace-metrics-grid-2x2" style={{
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
            CONFIRMED OPERATIONAL APPOINTMENTS
            =================================================== */}
        {appointments.length > 0 && (
          <div className="ace-card" style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #CBD5E1',
            borderRadius: '12px',
            padding: '18px 22px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={18} color="#2563EB" />
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary-blue)', margin: 0 }}>
                  Confirmed Facility & Customs Appointments ({appointments.length})
                </h4>
              </div>
              <button
                onClick={() => { setAppointmentStep('form'); setShowAppointmentModal(true); }}
                className="ace-btn ace-btn-secondary ace-btn-sm"
              >
                <PlusCircle size={13} />
                <span>Book Another Slot</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {appointments.map((appt) => (
                <div key={appt.id} style={{
                  backgroundColor: 'var(--color-white)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, color: '#0369A1' }}>{appt.id}</span>
                    <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', padding: '2px 6px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 700 }}>
                      CONFIRMED
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {appt.purpose}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={12} color="var(--color-primary-blue)" />
                    <span>{appt.hub}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{appt.date} • {appt.timeSlot}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

          <div className="dashboard-filter-search-wrap" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Status Tabs */}
            <div className="ace-filter-scroll" style={{ backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '3px', display: 'flex', gap: '2px', maxWidth: '100%', overflowX: 'auto' }}>
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
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="dashboard-search-input-box" style={{ position: 'relative' }}>
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

        {/* ===================================================
            APPOINTMENT BOOKING MODAL
            =================================================== */}
        {showAppointmentModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7, 42, 66, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}>
            <div className="ace-card" style={{
              maxWidth: '540px',
              width: '100%',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: 'var(--shadow-dropdown)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="var(--color-bright-action)" />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-primary-blue)', margin: 0 }}>
                    {appointmentStep === 'form' ? 'Book Operational Appointment' : 'Appointment Confirmed & Pass Issued'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {appointmentStep === 'form' ? (
                <form onSubmit={handleBookAppointment}>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
                    Schedule a private 1-on-1 session with our customs brokerage and warehouse facility controllers.
                  </p>

                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Regional Gateway Station</label>
                    <select
                      className="ace-select"
                      value={appointmentData.hub}
                      onChange={(e) => setAppointmentData({ ...appointmentData, hub: e.target.value })}
                      required
                    >
                      <option value="Accra Air Cargo Hub (Ghana)">🇬🇭 Accra Air Cargo Hub (Ghana Gateway)</option>
                      <option value="London Heathrow Gateway (UK)">🇬🇧 London Heathrow Gateway (UK)</option>
                      <option value="Rotterdam Euro Terminal (Netherlands)">🇳🇱 Rotterdam Euro Terminal (Netherlands)</option>
                      <option value="New York JFK Intermodal (USA)">🇺🇸 New York JFK Intermodal (USA)</option>
                    </select>
                  </div>

                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Appointment Purpose</label>
                    <select
                      className="ace-select"
                      value={appointmentData.purpose}
                      onChange={(e) => setAppointmentData({ ...appointmentData, purpose: e.target.value })}
                      required
                    >
                      <option value="Customs Document Clearance & GRA Review">Customs Document Clearance & Regulatory Review</option>
                      <option value="Bonded Warehouse Cargo Viewing / Physical Inspection">Bonded Warehouse Cargo Viewing & Physical Inspection</option>
                      <option value="Air Charter & Heavy-Lift Route Consultation">Air Charter & Heavy-Lift Route Consultation</option>
                      <option value="Pharmaceutical Cold-Chain Compliance Audit">Pharmaceutical Cold-Chain Compliance Audit</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="ace-form-group">
                      <label className="ace-label ace-label-required">Appointment Date</label>
                      <input
                        type="date"
                        className="ace-input"
                        value={appointmentData.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="ace-form-group">
                      <label className="ace-label ace-label-required">Preferred Time Window</label>
                      <select
                        className="ace-select"
                        value={appointmentData.timeSlot}
                        onChange={(e) => setAppointmentData({ ...appointmentData, timeSlot: e.target.value })}
                        required
                      >
                        <option value="09:00 AM - 09:45 AM">09:00 AM - 09:45 AM (Morning Ramp)</option>
                        <option value="11:30 AM - 12:15 PM">11:30 AM - 12:15 PM (Midday Shift)</option>
                        <option value="02:00 PM - 02:45 PM">02:00 PM - 02:45 PM (Afternoon Intake)</option>
                        <option value="04:30 PM - 05:15 PM">04:30 PM - 05:15 PM (Airside Debrief)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="ace-form-group">
                      <label className="ace-label ace-label-required">Contact Phone</label>
                      <input
                        type="tel"
                        className="ace-input"
                        value={appointmentData.phone}
                        onChange={(e) => setAppointmentData({ ...appointmentData, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="ace-form-group">
                      <label className="ace-label">Tracking / Consignment #</label>
                      <input
                        type="text"
                        className="ace-input"
                        placeholder="e.g. ACE-2T34-79011"
                        value={appointmentData.consignmentRef}
                        onChange={(e) => setAppointmentData({ ...appointmentData, consignmentRef: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setShowAppointmentModal(false)}
                      className="ace-btn ace-btn-secondary"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="ace-btn ace-btn-action"
                    >
                      <FileCheck size={15} />
                      <span>Confirm Appointment Slot</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '2px dashed #94A3B8',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
                      <div>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          ACE LOGISTICS GATE PASS
                        </span>
                        <h4 style={{ fontSize: '18px', color: '#0F172A', fontWeight: 800, margin: '2px 0 0' }}>
                          {generatedAppointment?.id}
                        </h4>
                      </div>
                      <span style={{
                        backgroundColor: '#ECFDF5',
                        color: '#065F46',
                        border: '1px solid #A7F3D0',
                        padding: '3px 8px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Check size={12} /> CONFIRMED
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '12px' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Visitor</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{generatedAppointment?.fullName}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Station</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{generatedAppointment?.hub}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Date</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{generatedAppointment?.date}</strong>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Time</span>
                        <strong style={{ color: 'var(--text-primary)' }}>{generatedAppointment?.timeSlot}</strong>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Purpose</span>
                        <strong style={{ color: 'var(--color-primary-blue)' }}>{generatedAppointment?.purpose}</strong>
                      </div>
                    </div>

                    <div style={{
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '11.5px',
                      color: '#1E40AF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <ShieldCheck size={15} color="#2563EB" style={{ flexShrink: 0 }} />
                      <span>Bring photo ID for security gate access. Assigned Officer: {generatedAppointment?.assignedOfficer}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
                    className="ace-btn ace-btn-action"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <CheckCircle2 size={15} />
                    <span>Done</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <style>{`
          @media (max-width: 640px) {
            .dashboard-header-actions {
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .dashboard-header-actions .ace-btn {
              width: 100%;
              justify-content: center;
            }
            .dashboard-filter-search-wrap {
              width: 100%;
              flex-direction: column;
              align-items: stretch !important;
            }
            .dashboard-search-input-box {
              width: 100%;
            }
            .dashboard-search-input-box input {
              width: 100% !important;
            }
          }
        `}</style>
      </main>
    </div>
  );
}
