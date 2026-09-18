import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Shield, 
  ChevronDown, 
  Package, 
  UserCheck, 
  LayoutDashboard, 
  Truck, 
  ArrowRight,
  LogOut,
  User,
  PhoneCall,
  Lightbulb
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setView, 
  activeRole, 
  setActiveRole, 
  currentUser, 
  onLogout,
  theme = 'light',
  toggleTheme,
  setLoginPortal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'track', label: 'Track' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (viewId) => {
    setView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      setActiveRole('guest');
      setView('home');
    }
    setRoleDropdownOpen(false);
  };

  // Define authorized workspaces depending on role
  // Admin: full access to Admin, Staff, and Customer
  // Staff: access to Staff Dispatcher and Customer Portal ONLY
  // Customer: access to Customer Portal ONLY
  const getAuthorizedWorkspaces = () => {
    if (activeRole === 'admin') {
      return [
        { id: 'admin-dashboard', label: 'Admin Enterprise Portal', desc: 'Full KPIs, Users & Settings' },
        { id: 'staff-dashboard', label: 'Staff Dispatcher Console', desc: 'Terminal Intake & Status Manager' },
        { id: 'customer-dashboard', label: 'Customer Portal', desc: 'Client Shipments Overview' },
        { id: 'home', label: 'Public Website', desc: 'Return to Marketing Site' }
      ];
    } else if (activeRole === 'staff') {
      return [
        { id: 'staff-dashboard', label: 'Staff Dispatcher Console', desc: 'Terminal Intake & Status Manager' },
        { id: 'customer-dashboard', label: 'Customer Portal', desc: 'Client Shipments Overview' },
        { id: 'home', label: 'Public Website', desc: 'Return to Marketing Site' }
      ];
    } else if (activeRole === 'customer') {
      return [
        { id: 'customer-dashboard', label: 'Customer Portal', desc: 'My Shipments & Bookings' },
        { id: 'home', label: 'Public Website', desc: 'Return to Marketing Site' }
      ];
    }
    return [];
  };

  const authorizedWorkspaces = getAuthorizedWorkspaces();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--color-white)',
      borderBottom: '1px solid var(--color-border)',
      boxShadow: '0 1px 3px rgba(11, 79, 124, 0.05)'
    }}>
      {/* Top Pre-header Announcement & Authenticated Role Controls */}
      <div style={{
        backgroundColor: 'var(--color-dark-navy)',
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: '12px',
        padding: '6px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="ace-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', flexShrink: 0 }} />
            <span className="desktop-nav" style={{ whiteSpace: 'nowrap' }}>
              ACE Global Freight Network Operational • Real-time IATA / IMO Tracking Live
            </span>
            <span className="mobile-only" style={{ fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              ACE Freight Live
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* If NOT LOGGED IN (Guest): Show Portal Login dropdown with Customer, Staff, and Admin options */}
            {activeRole === 'guest' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ color: '#D9E7F0', fontSize: '11.5px', display: 'none' }} className="desktop-nav">
                  Support: +233 24 555 0192
                </span>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                    id="portal-login-nav-btn"
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#FFFFFF',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <UserCheck size={13} color="#7dd3fc" />
                    <span>Portal Login</span>
                    <ChevronDown size={12} />
                  </button>

                  {portalDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '6px',
                      width: '260px',
                      maxWidth: 'calc(100vw - 24px)',
                      boxSizing: 'border-box',
                      backgroundColor: 'var(--color-white)',
                      borderRadius: '10px',
                      boxShadow: 'var(--shadow-dropdown)',
                      border: '1px solid var(--color-border)',
                      padding: '6px',
                      zIndex: 110,
                      color: 'var(--text-primary)'
                    }}>
                      <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Select Login Portal
                      </div>

                      {/* Customer Login */}
                      <button
                        onClick={() => {
                          if (setLoginPortal) setLoginPortal('customer');
                          handleNavClick('login');
                          setPortalDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light-blue)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'var(--color-light-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-bright-action)' }}>
                          <User size={15} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '12.5px' }}>Customer Login</div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Bookings, tracking & records</div>
                        </div>
                      </button>

                      {/* Staff Login */}
                      <button
                        onClick={() => {
                          if (setLoginPortal) setLoginPortal('staff');
                          handleNavClick('login');
                          setPortalDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light-blue)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F766E' }}>
                          <Truck size={15} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '12.5px' }}>Staff Login</div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Dispatcher & terminal console</div>
                        </div>
                      </button>

                      {/* Admin Login */}
                      <button
                        onClick={() => {
                          if (setLoginPortal) setLoginPortal('admin');
                          handleNavClick('login');
                          setPortalDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light-blue)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
                          <Shield size={15} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '12.5px' }}>Admin Login</div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>Full platform & credential oversight</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* If LOGGED IN: Show role badge and accessible workspace switcher based on permissions */
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', flexShrink: 0 }} />
                    <span className="desktop-nav">
                      {activeRole === 'admin' && (currentUser?.name ? `Admin: ${currentUser.name}` : 'Admin: David Sterling')}
                      {activeRole === 'staff' && (currentUser?.name ? `Staff: ${currentUser.name}` : "Staff: Sarah O'Connor")}
                      {activeRole === 'customer' && `Customer: ${currentUser?.name || 'Kwame Mensah'}`}
                    </span>
                    <span className="mobile-only" style={{ textTransform: 'capitalize' }}>
                      {activeRole}
                    </span>
                    <ChevronDown size={12} />
                  </button>

                  {roleDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '6px',
                      width: '240px',
                      maxWidth: 'calc(100vw - 24px)',
                      boxSizing: 'border-box',
                      backgroundColor: 'var(--color-white)',
                      borderRadius: '10px',
                      boxShadow: 'var(--shadow-dropdown)',
                      border: '1px solid var(--color-border)',
                      padding: '6px',
                      zIndex: 110,
                      color: 'var(--text-primary)'
                    }}>
                      <div style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Authorized Workspaces
                      </div>
                      {authorizedWorkspaces.map(w => (
                        <button
                          key={w.id}
                          onClick={() => {
                            setView(w.id);
                            setRoleDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 10px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: currentView === w.id ? 'var(--color-light-blue)' : 'transparent',
                            color: currentView === w.id ? 'var(--color-primary-blue)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '12px',
                            display: 'block'
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>{w.label}</div>
                          <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{w.desc}</div>
                        </button>
                      ))}

                      <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: '4px 0' }} />

                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: 'var(--status-cancelled-color)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <LogOut size={13} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', color: '#EAF5FC', cursor: 'pointer', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Sign out of platform"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="ace-container navbar-main-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* ACE Logistics Logo */}
        <div
          onClick={() => handleNavClick('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', minWidth: 0 }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-primary-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 2px 6px rgba(11, 79, 124, 0.25)',
            flexShrink: 0
          }}>
            <svg width="26" height="26" viewBox="0 0 64 64" fill="none">
              <path d="M14 44L28 16H36L50 44H41L38 37H26L23 44H14ZM29 30H35L32 23L29 30Z" fill="#FFFFFF"/>
              <circle cx="48" cy="18" r="4.5" fill="#1683D8"/>
            </svg>
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <div className="navbar-logo-text" style={{ fontSize: '19px', fontWeight: 800, color: 'var(--color-primary-blue)', letterSpacing: '-0.02em', lineHeight: 1.1, whiteSpace: 'nowrap' }}>
              ACE <span style={{ color: 'var(--color-bright-action)' }}>LOGISTICS</span>
            </div>
            <div className="navbar-logo-subtitle" style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Global Freight Network
            </div>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          {navLinks.map(link => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '14.5px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-primary-blue)' : 'var(--text-primary)',
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '6px 0',
                  transition: 'color var(--transition-fast)'
                }}
              >
                {link.label}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--color-bright-action)',
                    borderRadius: '2px'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions: Bulb Mode Switch in between Contact & Get a Quote */}
        <div style={{ display: 'none', alignItems: 'center', gap: '14px' }} className="desktop-nav">
          {/* Bulb Icon to switch from light to dark mode (current mode is light which is default) */}
          <button
            type="button"
            onClick={toggleTheme}
            id="theme-toggle-btn"
            title={theme === 'dark' ? 'Switch to Light Mode (currently Dark)' : 'Switch to Dark Mode (currently Light)'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              border: theme === 'dark' ? '1px solid #F59E0B' : '1px solid var(--color-border)',
              backgroundColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.16)' : 'var(--color-very-light-blue)',
              color: theme === 'dark' ? '#FBBF24' : 'var(--color-primary-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: theme === 'dark' ? '0 0 14px rgba(245, 158, 11, 0.4)' : 'var(--shadow-subtle)'
            }}
          >
            <Lightbulb 
              size={20} 
              strokeWidth={2.2}
              fill={theme === 'dark' ? '#FBBF24' : 'none'}
              style={{
                filter: theme === 'dark' ? 'drop-shadow(0 0 4px #F59E0B)' : 'none',
                transition: 'all 0.2s ease'
              }}
              className={theme === 'dark' ? 'ace-bulb-active' : ''}
            />
          </button>

          <button
            onClick={() => handleNavClick('quote')}
            className="ace-btn ace-btn-action"
          >
            <span>Get a Quote</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {/* Mobile Right Controls: Bulb Switch + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }} className="mobile-only">
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              border: theme === 'dark' ? '1px solid #F59E0B' : '1px solid var(--color-border)',
              backgroundColor: theme === 'dark' ? 'rgba(245, 158, 11, 0.16)' : 'var(--color-very-light-blue)',
              color: theme === 'dark' ? '#FBBF24' : 'var(--color-primary-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Lightbulb size={18} fill={theme === 'dark' ? '#FBBF24' : 'none'} />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-hamburger"
            style={{
              width: '38px',
              height: '38px',
              background: 'none',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-blue)',
              cursor: 'pointer'
            }}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderBottom: '2px solid var(--color-border)',
          padding: '14px 16px 20px',
          boxShadow: 'var(--shadow-dropdown)',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          animation: 'aceDrawerSlideDown 0.22s ease-out'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
            {navLinks.map(link => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    textAlign: 'left',
                    background: isActive ? 'var(--color-light-blue)' : 'transparent',
                    color: isActive ? 'var(--color-primary-blue)' : 'var(--text-primary)',
                    fontWeight: isActive ? 700 : 500,
                    border: 'none',
                    borderLeft: isActive ? '3px solid var(--color-bright-action)' : '3px solid transparent',
                    padding: '11px 14px',
                    borderRadius: '6px',
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '44px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--color-bright-action)' }} />
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => handleNavClick('quote')}
              className="ace-btn ace-btn-action"
              style={{ width: '100%', minHeight: '44px', fontSize: '14.5px' }}
            >
              <span>Get a Quote</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => handleNavClick('track')}
              className="ace-btn ace-btn-secondary"
              style={{ width: '100%', minHeight: '44px', fontSize: '14.5px' }}
            >
              <span>Track Shipment</span>
            </button>
            {activeRole === 'guest' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Select Login Portal</div>
                <button
                  onClick={() => {
                    if (setLoginPortal) setLoginPortal('customer');
                    handleNavClick('login');
                  }}
                  className="ace-btn ace-btn-ghost"
                  style={{ width: '100%', minHeight: '44px', justifyContent: 'flex-start', border: '1px solid var(--color-border)', gap: '10px' }}
                >
                  <User size={16} color="var(--color-bright-action)" />
                  <span>Customer Login</span>
                </button>
                <button
                  onClick={() => {
                    if (setLoginPortal) setLoginPortal('staff');
                    handleNavClick('login');
                  }}
                  className="ace-btn ace-btn-ghost"
                  style={{ width: '100%', minHeight: '44px', justifyContent: 'flex-start', border: '1px solid var(--color-border)', gap: '10px' }}
                >
                  <Truck size={16} color="#0D9488" />
                  <span>Staff Dispatcher Login</span>
                </button>
                <button
                  onClick={() => {
                    if (setLoginPortal) setLoginPortal('admin');
                    handleNavClick('login');
                  }}
                  className="ace-btn ace-btn-ghost"
                  style={{ width: '100%', minHeight: '44px', justifyContent: 'flex-start', border: '1px solid var(--color-border)', gap: '10px' }}
                >
                  <Shield size={16} color="#F59E0B" />
                  <span>Admin Console Login</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {activeRole} Workspaces & Consoles
                </div>
                {authorizedWorkspaces.map(w => (
                  <button
                    key={w.id}
                    onClick={() => handleNavClick(w.id)}
                    className="ace-btn ace-btn-ghost"
                    style={{
                      width: '100%',
                      minHeight: '44px',
                      justifyContent: 'flex-start',
                      border: currentView === w.id ? '1px solid var(--color-bright-action)' : '1px solid var(--color-border)',
                      backgroundColor: currentView === w.id ? 'var(--color-light-blue)' : 'transparent',
                      color: currentView === w.id ? 'var(--color-primary-blue)' : 'var(--text-primary)',
                      padding: '8px 12px',
                      textAlign: 'left'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '12.5px' }}>{w.label}</div>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{w.desc}</div>
                    </div>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="ace-btn ace-btn-ghost"
                  style={{ width: '100%', minHeight: '42px', color: 'var(--status-cancelled-color)', justifyContent: 'center', marginTop: '4px' }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes aceDrawerSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (min-width: 860px) {
          .desktop-nav { display: flex !important; }
          .mobile-hamburger { display: none !important; }
          .mobile-only { display: none !important; }
        }
        @media (max-width: 859px) {
          .mobile-only { display: flex !important; }
          .navbar-main-container {
            height: 64px !important;
          }
        }
        @media (max-width: 380px) {
          .navbar-main-container {
            height: 60px !important;
          }
          .navbar-logo-text {
            font-size: 17px !important;
          }
          .navbar-logo-subtitle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
