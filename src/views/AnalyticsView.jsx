import React from 'react';
import Sidebar from '../components/Sidebar';
import { 
  BarChart3, 
  TrendingUp, 
  Plane, 
  Ship, 
  Truck, 
  Train, 
  Clock, 
  ShieldCheck, 
  Leaf, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

export default function AnalyticsView({ setView, activeRole, setActiveRole }) {
  return (
    <div className="ace-dashboard-layout">
      <Sidebar 
        role={activeRole === 'customer' ? 'customer' : 'admin'} 
        currentView="analytics" 
        setView={setView} 
        setActiveRole={setActiveRole} 
      />

      <main className="ace-dashboard-main">
        {/* Top Header */}
        <div style={{ marginBottom: '28px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Performance Intelligence
          </span>
          <h1 style={{ fontSize: '26px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '2px' }}>
            Global Network Analytics & SLA Compliance
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Real-time analytics across worldwide trade corridors, carrier fleet utilization, and on-time reliability.
          </p>
        </div>

        {/* 4 Analytics KPI Cards */}
        <div className="ace-metrics-grid-2x2" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '20px',
          marginBottom: '28px'
        }}>
          <div className="ace-card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Average Global Transit</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary-blue)', marginTop: '4px' }}>4.2 Days</div>
            <div style={{ fontSize: '12px', color: '#10B981', marginTop: '6px', fontWeight: 600 }}>↓ 18% reduction vs 2025</div>
          </div>

          <div className="ace-card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Customs Clearance Rate</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-bright-action)', marginTop: '4px' }}>99.6%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>First-pass electronic approval</div>
          </div>

          <div className="ace-card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Carbon Offset (SAF / Rail)</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>-34.2%</div>
            <div style={{ fontSize: '12px', color: '#059669', marginTop: '6px', fontWeight: 600 }}>Sustainable logistics initiatives</div>
          </div>

          <div className="ace-card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Claims / Damage Ratio</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-dark-navy)', marginTop: '4px' }}>0.02%</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>Zero-loss cargo certification</div>
          </div>
        </div>

        {/* Lane Efficiency Table */}
        <div className="ace-card" style={{ marginBottom: '28px' }}>
          <h3 style={{ fontSize: '17px', color: 'var(--color-primary-blue)', fontWeight: 700, marginBottom: '6px' }}>
            Trade Lane Velocity & Reliability
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Benchmarking major freight routes by average hours, customs clearance latency, and on-time performance.
          </p>

          <div className="ace-table-container">
            <table className="ace-table">
              <thead>
                <tr>
                  <th>Logistics Trade Lane</th>
                  <th>Primary Mode</th>
                  <th>Avg Transit Time</th>
                  <th>On-Time Compliance</th>
                  <th>Volume (MT)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { lane: 'Accra (ACC) ⇄ London (LHR)', mode: 'Air Freight Priority', transit: '18.4 hrs', onTime: '99.4%', volume: '14,200 MT', status: 'Optimal' },
                  { lane: 'Rotterdam (RTM) ⇄ Hamburg (HAM)', mode: 'Ocean Express', transit: '3.2 days', onTime: '98.9%', volume: '82,400 MT', status: 'Optimal' },
                  { lane: 'New York (JFK) ⇄ Chicago (ORD)', mode: 'Ground Express Fleet', transit: '22.0 hrs', onTime: '99.1%', volume: '28,100 MT', status: 'Optimal' },
                  { lane: 'Frankfurt (FRA) ⇄ Warsaw (WAW)', mode: 'Rail Intermodal', transit: '2.5 days', onTime: '97.8%', volume: '19,500 MT', status: 'Normal' },
                  { lane: 'Singapore (SIN) ⇄ Tokyo (NRT)', mode: 'Air / Sea Multi-modal', transit: '4.8 days', onTime: '99.5%', volume: '56,000 MT', status: 'Optimal' }
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td><strong>{row.lane}</strong></td>
                    <td>{row.mode}</td>
                    <td>{row.transit}</td>
                    <td><strong style={{ color: '#059669' }}>{row.onTime}</strong></td>
                    <td>{row.volume}</td>
                    <td>
                      <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', padding: '3px 8px', borderRadius: '12px', fontSize: '11.5px', fontWeight: 600 }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
