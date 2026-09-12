import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Search, 
  BarChart3, 
  Settings, 
  LogOut, 
  PlusCircle, 
  FileText, 
  ArrowLeft,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({ 
  role = 'admin', 
  currentView, 
  setView, 
  setActiveRole 
}) {
  // Admin menu: Full enterprise access
  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'admin-shipments', label: 'All Shipments', icon: Package },
    { id: 'admin-customers', label: 'Customers Directory', icon: Users },
    { id: 'track', label: 'Live Tracking', icon: Search },
    { id: 'analytics', label: 'Analytics & SLA', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: ShieldCheck },
    { id: 'admin-settings', label: 'System Settings', icon: Settings },
  ];

  // Staff menu: Strictly Staff Dispatcher and Customer Portal ONLY
  const staffMenuItems = [
    { id: 'staff-dashboard', label: 'Staff Dispatcher', icon: Truck },
    { id: 'customer-dashboard', label: 'Customer Portal View', icon: LayoutDashboard },
    { id: 'admin-shipments', label: 'Consignment Queue', icon: Package },
    { id: 'track', label: 'Terminal Tracker', icon: Search },
    { id: 'new-shipment', label: 'Package Intake', icon: PlusCircle }
  ];

  // Customer menu: Customer Portal only
  const customerMenuItems = [
    { id: 'customer-dashboard', label: 'My Shipments', icon: LayoutDashboard },
    { id: 'new-shipment', label: 'Book Shipment', icon: PlusCircle },
    { id: 'track', label: 'Live Tracking', icon: Search },
    { id: 'quote', label: 'Get a Quote', icon: FileText }
  ];

  let menuItems = customerMenuItems;
  let roleTitle = 'Customer Portal';
  let badgeColor = '#1683D8';

  if (role === 'admin') {
    menuItems = adminMenuItems;
    roleTitle = 'Admin Enterprise Console';
    badgeColor = '#0B4F7C';
  } else if (role === 'staff') {
    menuItems = staffMenuItems;
    roleTitle = 'Staff Operations Console';
    badgeColor = '#0D9488';
  }

  const handleLogout = () => {
    setActiveRole('guest');
    setView('home');
  };

  return (
    <aside style={{
      width: '260px',
      backgroundColor: 'var(--color-white)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: 'calc(100vh - 110px)',
      boxShadow: '1px 0 3px rgba(11, 79, 124, 0.03)'
    }}>
      {/* Brand & Workspace indicator */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div 
          onClick={() => setView('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '12px' }}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
              <path d="M14 44L28 16H36L50 44H41L38 37H26L23 44H14ZM29 30H35L32 23L29 30Z" fill="#FFFFFF"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-blue)', lineHeight: 1.1 }}>
              ACE LOGISTICS
            </div>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>
              Enterprise Platform
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--color-light-blue)',
          borderRadius: '6px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          fontWeight: 600,
          color: 'var(--color-primary-blue)'
        }}>
          <span>{roleTitle}</span>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#10B981'
          }} />
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map(item => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? 'var(--color-light-blue)' : 'transparent',
                color: isActive ? 'var(--color-primary-blue)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13.5px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} color={isActive ? 'var(--color-primary-blue)' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Admin Quick Switcher section: Admin can access Staff Dispatcher & Customer Portal */}
        {role === 'admin' && (
          <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 12px 6px' }}>
              Multi-Console Access
            </div>
            <button
              onClick={() => setView('staff-dashboard')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: currentView === 'staff-dashboard' ? 'var(--color-light-blue)' : 'transparent',
                color: currentView === 'staff-dashboard' ? 'var(--color-primary-blue)' : 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Truck size={15} color="#0D9488" />
              <span>Open Staff Dispatcher</span>
            </button>
            <button
              onClick={() => setView('customer-dashboard')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 14px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: currentView === 'customer-dashboard' ? 'var(--color-light-blue)' : 'transparent',
                color: currentView === 'customer-dashboard' ? 'var(--color-primary-blue)' : 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <LayoutDashboard size={15} color="#1683D8" />
              <span>Open Customer View</span>
            </button>
          </div>
        )}
      </nav>

      {/* Sidebar Footer */}
      <div style={{ padding: '16px 14px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={() => setView('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-white)',
            color: 'var(--text-secondary)',
            fontSize: '12.5px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={15} />
          <span>Public Website</span>
        </button>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '9px 12px',
            borderRadius: '6px',
            border: 'none',
            background: 'transparent',
            color: 'var(--status-cancelled-color)',
            fontSize: '12.5px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
