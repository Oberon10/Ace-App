'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import Sidebar from '../../components/Sidebar';
import { 
  ShieldAlert, 
  ArrowLeft, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  Home,
  User,
  LogOut
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { 
    activeRole, 
    setActiveRole, 
    currentUser, 
    handleLogout, 
    navigate,
    quickAuthorizeAdmin 
  } = useApp();

  // If NOT authorized as admin, display the Protected Clearance Gate
  if (activeRole !== 'admin') {
    return (
      <div className="admin-gate-overlay" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: 'linear-gradient(135deg, #071524 0%, #0B253E 50%, #061625 100%)',
        color: '#FFFFFF',
        position: 'relative'
      }}>
        {/* Ambient background glows */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="admin-gate-card" style={{
          maxWidth: '520px',
          width: '100%',
          backgroundColor: '#0F1F30',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '16px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55)',
          padding: '36px 30px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Clearance Badge */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px auto',
            color: '#F59E0B'
          }}>
            <ShieldAlert size={32} />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 10px',
            borderRadius: '20px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#FBBF24',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px'
          }}>
            <Lock size={12} />
            <span>Restricted Zone</span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Executive Admin Clearance Required
          </h2>

          <p style={{ fontSize: '13.5px', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
            The requested console <code style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px', color: '#FCD34D' }}>{pathname}</code> requires Level-5 Executive Administrator privileges. Please sign in with your enterprise credentials.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Primary Action: Go to Admin Login */}
            <Link 
              href={`/login?portal=admin&redirect=${encodeURIComponent(pathname)}`}
              className="ace-btn"
              style={{
                width: '100%',
                height: '46px',
                backgroundColor: '#F59E0B',
                color: '#000000',
                border: 'none',
                fontWeight: 800,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                textDecoration: 'none'
              }}
            >
              Sign In as Administrator
            </Link>

            {/* Quick Demo Authorize button */}
            <button
              type="button"
              onClick={quickAuthorizeAdmin}
              className="ace-btn"
              style={{
                width: '100%',
                height: '42px',
                backgroundColor: 'rgba(22, 131, 216, 0.15)',
                color: '#38BDF8',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                fontWeight: 700,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            >
              <Sparkles size={15} />
              <span>Quick-Authorize as Admin (Demo Mode)</span>
            </button>

            {/* Clear Back to Website Option */}
            <Link
              href="/"
              style={{
                marginTop: '6px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#CBD5E1',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <ArrowLeft size={15} />
              <span>Back to Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Derive active view ID for sidebar highlighting
  const currentViewId = (() => {
    if (pathname.includes('/shipments')) return 'admin-shipments';
    if (pathname.includes('/customers')) return 'admin-customers';
    if (pathname.includes('/settings')) return 'admin-settings';
    if (pathname.includes('/analytics')) return 'analytics';
    if (pathname.includes('/users')) return 'users';
    return 'admin-dashboard';
  })();

  return (
    <div className="ace-admin-shell" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-very-light-blue)'
    }}>
      {/* ===================================================
          ADMIN TOP NAVIGATION BAR
          =================================================== */}
      <header className="ace-admin-topbar" style={{
        backgroundColor: '#071F32',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        {/* Left: Brand & Admin Console Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link 
            href="/admin/dashboard" 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '7px',
              backgroundColor: '#1683D8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <svg width="20" height="20" viewBox="0 0 64 64" fill="none">
                <path d="M14 44L28 16H36L50 44H41L38 37H26L23 44H14ZM29 30H35L32 23L29 30Z" fill="#FFFFFF"/>
              </svg>
            </div>
            <div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                ACE <span style={{ color: '#38BDF8' }}>LOGISTICS</span>
              </span>
              <span style={{
                marginLeft: '8px',
                fontSize: '10.5px',
                fontWeight: 800,
                color: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                padding: '2px 7px',
                borderRadius: '6px',
                textTransform: 'uppercase'
              }}>
                ADMIN CONSOLE
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Prominent "Back to Website" and Profile actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* CLEAR PROMINENT "BACK TO WEBSITE" BUTTON */}
          <Link
            href="/"
            className="admin-back-website-btn"
            id="admin-back-to-website-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Website</span>
          </Link>

          {/* Admin User Chip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            color: '#E2E8F0',
            fontSize: '12.5px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 6px #10B981'
            }} />
            <span style={{ fontWeight: 600 }}>{currentUser?.name || 'Derek Sterling'}</span>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 10px'
            }}
            title="Sign out of Admin Console"
          >
            <LogOut size={16} />
            <span className="desktop-only">Logout</span>
          </button>
        </div>
      </header>

      {/* ===================================================
          ADMIN BODY WITH ROUTE CONTENT
          =================================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
