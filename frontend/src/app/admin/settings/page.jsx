'use client';

import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import { useApp } from '../../../context/AppContext';
import { 
  Settings, 
  ShieldCheck, 
  Bell, 
  Server, 
  Globe2, 
  Key, 
  Save, 
  CheckCircle2, 
  RefreshCw,
  Sliders,
  Database
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { navigate, setActiveRole } = useApp();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings state
  const [apiPort, setApiPort] = useState('5000');
  const [telemetryInterval, setTelemetryInterval] = useState('15');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [autoFallback, setAutoFallback] = useState(true);
  const [environment, setEnvironment] = useState('production');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="ace-dashboard-layout">
      {/* Sidebar */}
      <Sidebar 
        role="admin" 
        currentView="admin-settings" 
        setView={navigate} 
        setActiveRole={setActiveRole} 
      />

      {/* Main Content Area */}
      <main className="ace-dashboard-main">
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System Configuration
            </span>
            <span style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '10px' }}>
              LEVEL-5 AUTHORIZED
            </span>
          </div>
          <h1 style={{ fontSize: '26px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '4px' }}>
            Enterprise Platform Settings
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Configure server connectivity, real-time GPS telemetry polling rates, and security enforcement parameters.
          </p>
        </div>

        {savedSuccess && (
          <div style={{
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
            fontWeight: 600
          }}>
            <CheckCircle2 size={18} color="#10B981" />
            <span>System configuration parameters updated and synchronized successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '24px', marginBottom: '24px' }}>
            
            {/* Card 1: API & Server Infrastructure */}
            <div className="ace-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '12px' }}>
                <Server size={18} color="var(--color-bright-action)" />
                <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700, margin: 0 }}>
                  Backend Server Infrastructure
                </h3>
              </div>

              <div className="ace-form-group">
                <label className="ace-label">Primary Server Port</label>
                <input 
                  type="number" 
                  className="ace-input" 
                  value={apiPort} 
                  onChange={(e) => setApiPort(e.target.value)} 
                  placeholder="5000"
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Default backend Express listener port (auto-switches in 5000-5020 range if occupied).
                </span>
              </div>

              <div className="ace-form-group">
                <label className="ace-label">Cluster Environment</label>
                <select 
                  className="ace-select" 
                  value={environment} 
                  onChange={(e) => setEnvironment(e.target.value)}
                  style={{ height: '40px', appearance: 'auto' }}
                >
                  <option value="production">Production (Vercel + Atlas Sharded)</option>
                  <option value="staging">Staging (Integration Cluster)</option>
                  <option value="development">Development (Localhost 5000-5020)</option>
                </select>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '14px', fontSize: '13px' }}>
                <input 
                  type="checkbox" 
                  checked={autoFallback} 
                  onChange={(e) => setAutoFallback(e.target.checked)} 
                  style={{ width: '16px', height: '16px', accentColor: 'var(--color-bright-action)' }}
                />
                <span style={{ fontWeight: 600 }}>Enable Automatic Port Fallback (EADDRINUSE safe)</span>
              </label>
            </div>

            {/* Card 2: Telemetry & Monitoring */}
            <div className="ace-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '12px' }}>
                <Sliders size={18} color="var(--color-bright-action)" />
                <h3 style={{ fontSize: '16px', color: 'var(--color-primary-blue)', fontWeight: 700, margin: 0 }}>
                  Telemetry & Dispatch Rates
                </h3>
              </div>

              <div className="ace-form-group">
                <label className="ace-label">Live Telemetry Poll Frequency (seconds)</label>
                <input 
                  type="number" 
                  className="ace-input" 
                  value={telemetryInterval} 
                  onChange={(e) => setTelemetryInterval(e.target.value)} 
                  placeholder="15"
                />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Frequency for querying GPS tracking milestones from air and maritime vessels.
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    checked={emailAlerts} 
                    onChange={(e) => setEmailAlerts(e.target.checked)} 
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-bright-action)' }}
                  />
                  <span style={{ fontWeight: 600 }}>Automatic SLA Breach Email Notifications</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    checked={smsAlerts} 
                    onChange={(e) => setSmsAlerts(e.target.checked)} 
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-bright-action)' }}
                  />
                  <span style={{ fontWeight: 600 }}>SMS Urgent Customs Delay Dispatch</span>
                </label>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="submit" 
              className="ace-btn ace-btn-action"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', fontSize: '14px' }}
            >
              <Save size={16} />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
