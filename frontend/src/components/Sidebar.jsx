import React, { useState } from 'react';
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
  ExternalLink,
  Menu,
  ChevronDown,
  X
} from 'lucide-react';

export default function Sidebar({ 
  role = 'admin', 
  currentView, 
  setView, 
  setActiveRole 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Staff menu: Strictly Staff Dispatcher console operations
  const staffMenuItems = [
    { id: 'staff-dashboard', label: 'Staff Dispatcher', icon: Truck },
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

  const handleMobileNav = (viewId) => {
    setView(viewId);
    setMobileMenuOpen(false);
  };

  const activeItemLabel = menuItems.find(m => m.id === currentView)?.label || roleTitle;

  return (
    <>
      {/* ===================================================
          MOBILE DASHBOARD TOPBAR (Screens <= 860px)
          =================================================== */}
      <div className="ace-sidebar-mobile" style={{
        backgroundColor: 'var(--color-white)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-subtle)',
        width: '100%',
        zIndex: 50
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              backgroundColor: badgeColor,
              color: '#FFFFFF',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '10.5px',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              {role}
            </span>
            <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--color-primary-blue)' }}>
              {activeItemLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-light-blue)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-primary-blue)',
              cursor: 'pointer'
            }}
          >
            {mobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            <span>Console Menu</span>
            <ChevronDown size={12} style={{ transform: mobileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div style={{
            borderTop: '1px solid var(--color-border-subtle)',
            padding: '12px 14px 16px',
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            animation: 'aceSlideUp 0.15s ease'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>
              Navigation Menu
            </div>

            {menuItems.map(item => {
              const isActive = currentView === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMobileNav(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--color-light-blue)' : 'transparent',
                    color: isActive ? 'var(--color-primary-blue)' : 'var(--text-primary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={16} color={isActive ? 'var(--color-primary-blue)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admin Multi-Console Switcher on Mobile */}
            {role === 'admin' && (
              <div style={{ marginTop: '8px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 8px' }}>
                  Multi-Console Switcher
                </div>
                <button
                  onClick={() => handleMobileNav('staff-dashboard')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Truck size={15} color="#0D9488" />
                  <span>Staff Dispatcher Console</span>
                </button>
                <button
                  onClick={() => handleMobileNav('customer-dashboard')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <LayoutDashboard size={15} color="#1683D8" />
                  <span>Customer Portal View</span>
                </button>
              </div>
            )}

            {/* Quick Exit Links */}
            <div style={{ marginTop: '8px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleMobileNav('home')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-white)',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <ArrowLeft size={14} />
                <span>Public Site</span>
              </button>

              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 10px',
                  borderRadius: '6px',
                  border: '1px solid #FECACA',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================
          DESKTOP SIDEBAR (Screens > 860px)
          =================================================== */}
      <aside className="ace-sidebar-desktop" style={{
        width: '260px',
        backgroundColor: 'var(--color-white)',
        borderRight: '1px solid var(--color-border)',
        flexDirection: 'column',
        height: '100%',
        minHeight: 'calc(100vh - 110px)',
        boxShadow: '1px 0 3px rgba(11, 79, 124, 0.03)',
        flexShrink: 0
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

          {/* Admin Quick Switcher section */}
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

      <style>{`
        @media (min-width: 861px) {
          .ace-sidebar-desktop { display: flex !important; }
          .ace-sidebar-mobile { display: none !important; }
        }
        @media (max-width: 860px) {
          .ace-sidebar-desktop { display: none !important; }
          .ace-sidebar-mobile { display: block !important; width: 100% !important; }
        }
      `}</style>
    </>
  );
}
