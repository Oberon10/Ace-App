'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  X,
  Home
} from 'lucide-react';

export default function Sidebar({ 
  role = 'admin', 
  currentView, 
  setView, 
  setActiveRole 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Admin menu: Full enterprise access with real route hrefs
  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { id: 'admin-shipments', label: 'All Shipments', icon: Package, href: '/admin/shipments' },
    { id: 'admin-customers', label: 'Customers Directory', icon: Users, href: '/admin/customers' },
    { id: 'track', label: 'Live Tracking', icon: Search, href: '/tracking' },
    { id: 'analytics', label: 'Analytics & SLA', icon: BarChart3, href: '/admin/analytics' },
    { id: 'users', label: 'User Management', icon: ShieldCheck, href: '/admin/users' },
    { id: 'admin-settings', label: 'System Settings', icon: Settings, href: '/admin/settings' },
  ];

  // Staff menu: Strictly Staff Dispatcher console operations
  const staffMenuItems = [
    { id: 'staff-dashboard', label: 'Staff Dispatcher', icon: Truck, href: '/staff/dashboard' },
    { id: 'admin-shipments', label: 'Consignment Queue', icon: Package, href: '/admin/shipments' },
    { id: 'track', label: 'Terminal Tracker', icon: Search, href: '/tracking' },
    { id: 'new-shipment', label: 'Package Intake', icon: PlusCircle, href: '/new-shipment' }
  ];

  // Customer menu: Customer Portal only
  const customerMenuItems = [
    { id: 'customer-dashboard', label: 'My Shipments', icon: LayoutDashboard, href: '/customer/dashboard' },
    { id: 'new-shipment', label: 'Book Shipment', icon: PlusCircle, href: '/new-shipment' },
    { id: 'track', label: 'Live Tracking', icon: Search, href: '/tracking' },
    { id: 'quote', label: 'Get a Quote', icon: FileText, href: '/quote' }
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
    if (setActiveRole) setActiveRole('guest');
    try {
      localStorage.removeItem('ace_auth_role');
      localStorage.removeItem('ace_current_user');
    } catch {
      // ignore
    }
    if (setView) setView('home');
  };

  const handleMobileNav = (item) => {
    if (setView) setView(item.href || item.id);
    setMobileMenuOpen(false);
  };

  const activeItemLabel = menuItems.find(m => m.id === currentView || m.href === pathname)?.label || roleTitle;

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
              const isActive = currentView === item.id || pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.id}
                  href={item.href || '#'}
                  onClick={() => handleMobileNav(item)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'var(--color-light-blue)' : 'transparent',
                    color: isActive ? 'var(--color-primary-blue)' : 'var(--text-primary)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13.5px',
                    textDecoration: 'none',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={16} color={isActive ? 'var(--color-primary-blue)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Quick Exit Links */}
            <div style={{ marginTop: '10px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '10px', display: 'flex', gap: '8px' }}>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-light-blue)',
                  color: 'var(--color-primary-blue)',
                  fontSize: '12.5px',
                  textDecoration: 'none',
                  fontWeight: 700
                }}
              >
                <ArrowLeft size={14} />
                <span>Back to Website</span>
              </Link>

              <button
                type="button"
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
        minHeight: 'calc(100vh - 60px)',
        boxShadow: '1px 0 3px rgba(11, 79, 124, 0.03)',
        flexShrink: 0
      }}>
        {/* Brand & Workspace indicator */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <Link 
            href={role === 'admin' ? '/admin/dashboard' : '/'} 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '12px' }}
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
              <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-primary-blue)', letterSpacing: '-0.01em', display: 'block', lineHeight: 1.2 }}>
                ACE LOGISTICS
              </span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
                {roleTitle}
              </span>
            </div>
          </Link>

          {/* Role Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 9px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-light-blue)',
            border: '1px solid var(--color-border)',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--color-primary-blue)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
            <span>Authenticated: {role.toUpperCase()}</span>
          </div>
        </div>

        {/* Navigation List */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map(item => {
            const isActive = currentView === item.id || pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href || '#'}
                onClick={() => {
                  if (setView) setView(item.href || item.id);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'var(--color-light-blue)' : 'transparent',
                  color: isActive ? 'var(--color-primary-blue)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13.5px',
                  textDecoration: 'none',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} color={isActive ? 'var(--color-primary-blue)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Admin Multi-Console Switcher section */}
          {role === 'admin' && (
            <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '4px 12px 6px' }}>
                Multi-Console Access
              </div>
              <Link
                href="/staff/dashboard"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 14px',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <Truck size={15} color="#0D9488" />
                <span>Open Staff Dispatcher</span>
              </Link>
              <Link
                href="/customer/dashboard"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 14px',
                  borderRadius: '6px',
                  color: 'var(--text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <LayoutDashboard size={15} color="#1683D8" />
                <span>Open Customer View</span>
              </Link>
            </div>
          )}
        </nav>

        {/* ===================================================
            SIDEBAR FOOTER: CLEAR "BACK TO WEBSITE" & LOGOUT
            =================================================== */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* CLEAR PROMINENT "BACK TO WEBSITE" LINK */}
          <Link
            href="/"
            className="sidebar-back-website-link"
            id="sidebar-back-to-website-link"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-very-light-blue)',
              color: 'var(--color-primary-blue)',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={16} />
            <span>← Back to Website</span>
          </Link>

          <button
            type="button"
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
        .sidebar-back-website-link:hover {
          background-color: var(--color-light-blue) !important;
          transform: translateX(-2px);
        }
      `}</style>
    </>
  );
}
