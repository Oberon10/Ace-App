'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { INITIAL_SHIPMENTS } from '../data/shipments';

const AppContext = createContext(null);

export const ROUTE_MAP = {
  'home': '/',
  'services': '/services',
  'track': '/tracking',
  'tracking': '/tracking',
  'about': '/about',
  'contact': '/contact',
  'quote': '/quote',
  'new-shipment': '/new-shipment',
  'login': '/login',
  'customer-dashboard': '/customer/dashboard',
  'staff-dashboard': '/staff/dashboard',
  'admin-dashboard': '/admin/dashboard',
  'admin-shipments': '/admin/shipments',
  'admin-customers': '/admin/customers',
  'admin-settings': '/admin/settings',
  'analytics': '/admin/analytics',
  'users': '/admin/users'
};

export function AppProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // Authentication State
  const [activeRole, setActiveRole] = useState('guest'); // 'guest' | 'customer' | 'staff' | 'admin'
  const [currentUser, setCurrentUser] = useState(null);
  const [loginPortal, setLoginPortal] = useState('customer');
  const [authNotice, setAuthNotice] = useState('');
  const [postLoginRedirect, setPostLoginRedirect] = useState(null);

  // Theme State
  const [theme, setTheme] = useState('light');

  // Central Reactive Shipments Repository
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [hasSearchedTracking, setHasSearchedTracking] = useState(false);
  const [prefilledQuote, setPrefilledQuote] = useState(null);

  // Receipt Modal State
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptShipment, setReceiptShipment] = useState(null);

  // Hydrate client state from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('ace_theme') || 'light';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }

      const savedRole = localStorage.getItem('ace_auth_role');
      if (savedRole) {
        setActiveRole(savedRole);
      }

      const savedUser = localStorage.getItem('ace_current_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }

      const storedShipments = localStorage.getItem('ace_registered_consignments');
      if (storedShipments) {
        const parsed = JSON.parse(storedShipments);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setShipments(parsed);
        }
      }
    } catch (err) {
      console.warn('LocalStorage hydration error:', err);
    }
  }, []);

  // Theme toggler
  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('ace_theme', nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
        if (nextTheme === 'dark') {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      } catch {
        // ignore
      }
      return nextTheme;
    });
  };

  // Global Navigation Helper: compatible with both legacy view IDs ('about') and paths ('/about')
  const navigate = (target) => {
    if (!target) return;
    const dest = ROUTE_MAP[target] || (target.startsWith('/') ? target : `/${target}`);
    router.push(dest);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setView = (target) => {
    navigate(target);
  };

  // Tracking Search Functionality
  const handleSearchTracking = (trackingNumber) => {
    const cleanNumber = (trackingNumber || '').trim();
    if (!cleanNumber) {
      setSelectedShipment(null);
      setTrackingQuery('');
      setHasSearchedTracking(false);
      navigate('/tracking');
      return;
    }

    setTrackingQuery(cleanNumber);
    setHasSearchedTracking(true);

    const upperClean = cleanNumber.toUpperCase();
    const stripped = upperClean.replace(/[^A-Z0-9]/g, '');

    const found = shipments.find(s => {
      const sNum = (s.trackingNumber || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const sId = (s.id || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const sSeal = (s.package?.sealNumber || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      return sNum === stripped || sId === stripped || sSeal === stripped;
    });

    setSelectedShipment(found || null);
    navigate('/tracking');

    setTimeout(() => {
      const detailsEl = document.getElementById('shipment-telemetry-root') || 
                        document.getElementById('consignment-input') || 
                        document.getElementById('shipment-details-section');
      if (detailsEl) {
        detailsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleSelectShipment = (shipment) => {
    setSelectedShipment(shipment);
    if (shipment) {
      setTrackingQuery(shipment.trackingNumber || shipment.id || '');
      setHasSearchedTracking(true);
    }
    navigate('/tracking');
    setTimeout(() => {
      const detailsEl = document.getElementById('shipment-telemetry-root') || 
                        document.getElementById('shipment-details-section');
      if (detailsEl) {
        detailsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

  const handleClearTracking = () => {
    setSelectedShipment(null);
    setTrackingQuery('');
    setHasSearchedTracking(false);
  };

  // Receipt Modal Handlers
  const handleOpenReceipt = (shipment) => {
    setReceiptShipment(shipment);
    setReceiptModalOpen(true);
  };

  const handleCloseReceipt = () => {
    setReceiptModalOpen(false);
    setReceiptShipment(null);
  };

  // Shipment Creation
  const handleShipmentCreated = (newShipment, postAction = null) => {
    setShipments(prev => {
      const updated = [newShipment, ...prev];
      try {
        localStorage.setItem('ace_registered_consignments', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to sync shipments to localStorage', err);
      }
      return updated;
    });
    setSelectedShipment(newShipment);

    if (postAction === 'view-details') {
      navigate('/tracking');
    } else if (postAction === 'view-receipt') {
      handleOpenReceipt(newShipment);
    }
  };

  // Shipment Status Update (Staff & Admin)
  const handleUpdateShipmentStatus = (shipmentId, updates) => {
    setShipments(prev => {
      const updatedList = prev.map(s => {
        if (s.id === shipmentId || s.trackingNumber === shipmentId) {
          const now = new Date();
          const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

          const updatedTimeline = [
            ...s.timeline.map(t => t.status === 'active' ? { ...t, status: 'completed' } : t),
            {
              id: s.timeline.length + 1,
              title: `Status Milestone: ${updates.status}`,
              description: updates.note || `Dispatcher update recorded at ${updates.currentLocation}.`,
              location: updates.currentLocation || s.currentLocation,
              date: dateStr,
              time: timeStr,
              status: 'active'
            }
          ];

          const updated = {
            ...s,
            status: updates.status,
            currentLocation: updates.currentLocation || s.currentLocation,
            timeline: updatedTimeline
          };

          if (selectedShipment?.id === s.id) {
            setSelectedShipment(updated);
          }
          return updated;
        }
        return s;
      });

      try {
        localStorage.setItem('ace_registered_consignments', JSON.stringify(updatedList));
      } catch (err) {
        console.error('Failed to sync updated shipment to localStorage', err);
      }
      return updatedList;
    });
  };

  // Quote -> Shipment Booking Transition
  const handleProceedToShipmentFromQuote = (quoteData) => {
    setPrefilledQuote(quoteData);
    navigate('/new-shipment');
  };

  // Send Package Action with Guest gate
  const handleSendPackageClick = () => {
    if (activeRole === 'guest') {
      setLoginPortal('customer');
      setAuthNotice('Please sign in or create an account to book and send a package.');
      setPostLoginRedirect('/new-shipment');
      navigate('/login?portal=customer');
    } else {
      navigate('/new-shipment');
    }
  };

  // Authentication Handlers
  const handleLoginSuccess = (role, userObj, customRedirect = null) => {
    setActiveRole(role);
    setCurrentUser(userObj);

    try {
      localStorage.setItem('ace_auth_role', role);
      localStorage.setItem('ace_current_user', JSON.stringify(userObj));
    } catch {
      // ignore
    }

    const destination = customRedirect || postLoginRedirect;
    setPostLoginRedirect(null);
    setAuthNotice('');

    if (destination) {
      navigate(destination);
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else if (role === 'staff') {
      navigate('/staff/dashboard');
    } else if (role === 'customer') {
      navigate('/customer/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    setActiveRole('guest');
    setCurrentUser(null);
    try {
      localStorage.removeItem('ace_auth_role');
      localStorage.removeItem('ace_current_user');
    } catch {
      // ignore
    }
    navigate('/');
  };

  // Quick authorize demo for admin
  const quickAuthorizeAdmin = () => {
    const adminUser = {
      name: 'Derek Sterling',
      email: 'd.sterling@acelogistics.com',
      role: 'admin',
      title: 'Executive Vice President of Operations',
      clearanceLevel: 'Level 5 (Full Authority)'
    };
    handleLoginSuccess('admin', adminUser, pathname);
  };

  // Current view helper derived from route pathname
  const currentView = (() => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/about')) return 'about';
    if (pathname.startsWith('/services')) return 'services';
    if (pathname.startsWith('/tracking') || pathname.startsWith('/track')) return 'track';
    if (pathname.startsWith('/contact')) return 'contact';
    if (pathname.startsWith('/login')) return 'login';
    if (pathname.startsWith('/quote')) return 'quote';
    if (pathname.startsWith('/new-shipment')) return 'new-shipment';
    if (pathname.startsWith('/admin/shipments')) return 'admin-shipments';
    if (pathname.startsWith('/admin/customers')) return 'admin-customers';
    if (pathname.startsWith('/admin/settings')) return 'admin-settings';
    if (pathname.startsWith('/admin/analytics')) return 'analytics';
    if (pathname.startsWith('/admin/users')) return 'users';
    if (pathname.startsWith('/admin')) return 'admin-dashboard';
    if (pathname.startsWith('/customer/dashboard')) return 'customer-dashboard';
    if (pathname.startsWith('/staff/dashboard')) return 'staff-dashboard';
    return 'home';
  })();

  const value = {
    // Auth & User
    activeRole,
    setActiveRole,
    currentUser,
    setCurrentUser,
    loginPortal,
    setLoginPortal,
    authNotice,
    setAuthNotice,
    handleLoginSuccess,
    handleLogout,
    quickAuthorizeAdmin,
    handleSendPackageClick,

    // Theme
    theme,
    toggleTheme,

    // Navigation
    currentView,
    navigate,
    setView,
    pathname,

    // Shipments & Tracking
    shipments,
    selectedShipment,
    setSelectedShipment,
    trackingQuery,
    setTrackingQuery,
    hasSearchedTracking,
    handleSearchTracking,
    handleSelectShipment,
    handleClearTracking,
    handleShipmentCreated,
    handleUpdateShipmentStatus,

    // Quote & New Shipment
    prefilledQuote,
    setPrefilledQuote,
    handleProceedToShipmentFromQuote,

    // Receipts
    receiptModalOpen,
    receiptShipment,
    handleOpenReceipt,
    handleCloseReceipt
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
