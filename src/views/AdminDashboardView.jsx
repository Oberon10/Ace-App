import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Globe2, 
  DollarSign, 
  Users, 
  Package, 
  Truck, 
  Plane, 
  Ship, 
  Train, 
  Filter, 
  Download, 
  Plus,
  ArrowUpRight,
  AlertTriangle
} from 'lucide-react';

export default function AdminDashboardView({ 
  shipments = [], 
  onSelectShipment, 
  onViewReceipt, 
  setView, 
  setActiveRole 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [filterMode, setFilterMode] = useState('ALL');

  const filteredShipments = shipments.filter(s => {
    if (filterMode === 'ALL') return true;
    return s.method.toLowerCase().includes(filterMode.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', backgroundColor: 'var(--color-very-light-blue)' }}>
      {/* Sidebar */}
      <Sidebar 
        role="admin" 
        currentView="admin-dashboard" 
        setView={setView} 
        setActiveRole={setActiveRole} 
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Enterprise Operations
              </span>
              <span style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
                LIVE TELEMETRY
              </span>
            </div>
            <h1 style={{ fontSize: '26px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '2px' }}>
              Global Logistics Command Center
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setView('analytics')}
              className="ace-btn ace-btn-secondary"
            >
              <BarChart3 size={15} />
              <span>Full Analytics</span>
            </button>

            <button
              onClick={() => setView('new-shipment')}
              className="ace-btn ace-btn-action"
            >
              <Plus size={15} />
              <span>Book Consignment</span>
            </button>
          </div>
        </div>

        {/* ===================================================
            SECTION 12 & 28: ENTERPRISE STATISTICS CARDS
            =================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>
          {/* Active Global Shipments */}
          <div className="ace-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  ACTIVE SHIPMENTS
                </span>
                <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--color-primary-blue)', marginTop: '4px', lineHeight: 1 }}>
                  1,428
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
                <Package size={20} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10B981', marginTop: '12px', fontWeight: 600 }}>
              <TrendingUp size={14} />
              <span>+12.4% vs last month</span>
            </div>
          </div>

          {/* On-Time SLA Rate */}
          <div className="ace-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  ON-TIME DELIVERY SLA
                </span>
                <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--color-bright-action)', marginTop: '4px', lineHeight: 1 }}>
                  99.2%
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
                <ShieldCheck size={20} />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
              Benchmark Target: 98.5%
            </div>
          </div>

          {/* Revenue YTD */}
          <div className="ace-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  GLOBAL FREIGHT REVENUE
                </span>
                <div style={{ fontSize: '30px', fontWeight: 800, color: '#0F766E', marginTop: '4px', lineHeight: 1 }}>
                  $4.82M
                </div>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#CCFBF1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F766E'
              }}>
                <DollarSign size={20} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10B981', marginTop: '12px', fontWeight: 600 }}>
              <TrendingUp size={14} />
              <span>+18.7% fiscal growth</span>
            </div>
          </div>

          {/* Fleet Utilization */}
          <div className="ace-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  FLEET ASSET UTILIZATION
                </span>
                <div style={{ fontSize: '30px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '4px', lineHeight: 1 }}>
                  94.1%
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
                color: 'var(--color-dark-navy)'
              }}>
                <Globe2 size={20} />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px' }}>
              Planes, vessels, trucks & trains
            </div>
          </div>
        </div>

        {/* ===================================================
            MIDDLE SECTION: CHARTS & FREIGHT VOLUME DISTRIBUTION
            =================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
          gap: '24px',
          marginBottom: '28px'
        }} className="admin-charts-grid">
          {/* Monthly Shipment Volume Bar Chart */}
          <div className="ace-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                  Freight Volume Trend (2026)
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Total metric tons dispatched monthly
                </p>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-bright-action)', fontWeight: 600 }}>
                Average: 42,000 MT
              </span>
            </div>

            {/* Custom CSS Bar Chart */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              {[
                { month: 'Apr', value: 58, label: '34k' },
                { month: 'May', value: 66, label: '39k' },
                { month: 'Jun', value: 72, label: '42k' },
                { month: 'Jul', value: 84, label: '49k' },
                { month: 'Aug', value: 92, label: '54k' },
                { month: 'Sep', value: 98, label: '58k' }
              ].map((bar, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>{bar.label}</span>
                  <div 
                    style={{
                      width: '28px',
                      height: `${bar.value}%`,
                      backgroundColor: i === 5 ? 'var(--color-bright-action)' : 'var(--color-primary-blue)',
                      borderRadius: '6px 6px 2px 2px',
                      transition: 'height 0.5s ease'
                    }}
                    title={`${bar.month}: ${bar.label}`}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{bar.month}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-muted)' }}>
              <span>Q2 baseline met</span>
              <span style={{ color: '#10B981', fontWeight: 600 }}>+24% YoY Cargo Increase</span>
            </div>
          </div>

          {/* Transport Mode Distribution */}
          <div className="ace-card">
            <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700, marginBottom: '4px' }}>
              Cargo Volume by Transport Mode
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Modal split across global network
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Ocean */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--color-primary-blue)' }}>
                    <Ship size={14} /> Ocean Container Freight (FCL/LCL)
                  </span>
                  <strong>42%</strong>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '42%', height: '100%', backgroundColor: 'var(--color-primary-blue)' }} />
                </div>
              </div>

              {/* Air */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--color-bright-action)' }}>
                    <Plane size={14} /> Air Freight Express
                  </span>
                  <strong>34%</strong>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '34%', height: '100%', backgroundColor: 'var(--color-bright-action)' }} />
                </div>
              </div>

              {/* Road */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#0F766E' }}>
                    <Truck size={14} /> Interstate Road Haulage
                  </span>
                  <strong>16%</strong>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '16%', height: '100%', backgroundColor: '#0F766E' }} />
                </div>
              </div>

              {/* Rail */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#D97706' }}>
                    <Train size={14} /> Intermodal Rail Corridors
                  </span>
                  <strong>8%</strong>
                </div>
                <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '8%', height: '100%', backgroundColor: '#D97706' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            SECTION 13: MASTER SHIPMENTS DATA TABLE
            =================================================== */}
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
              Live Carrier Dispatches & Manifests
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Comprehensive real-time tracking across all airport terminals, container ports, and rail junctions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ALL', 'Air', 'Ocean', 'Road', 'Rail'].map(m => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: filterMode === m ? 'var(--color-primary-blue)' : 'var(--color-white)',
                  color: filterMode === m ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {m} Freight
              </button>
            ))}
          </div>
        </div>

        {/* Master Table */}
        <DataTable 
          shipments={filteredShipments}
          onSelectShipment={onSelectShipment}
          onViewReceipt={onViewReceipt}
        />
      </main>

      <style>{`
        @media (max-width: 860px) {
          .admin-charts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
