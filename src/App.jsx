import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReceiptModal from './components/ReceiptModal';

// Dedicated Views
import HomeView from './views/HomeView';
import ServicesView from './views/ServicesView';
import TrackingView from './views/TrackingView';
import ContactView from './views/ContactView';
import AboutView from './views/AboutView';
import QuoteView from './views/QuoteView';
import ShipmentCreationView from './views/ShipmentCreationView';
import LoginView from './views/LoginView';
import CustomerDashboardView from './views/CustomerDashboardView';
import AdminDashboardView from './views/AdminDashboardView';
import StaffDashboardView from './views/StaffDashboardView';
import AnalyticsView from './views/AnalyticsView';
import UserManagementView from './views/UserManagementView';

// Initial Mock Data
import { INITIAL_SHIPMENTS } from './data/shipments';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [activeRole, setActiveRole] = useState('guest'); // 'guest', 'customer', 'staff', 'admin'
  const [currentUser, setCurrentUser] = useState(null);
  const [loginPortal, setLoginPortal] = useState('customer'); // 'customer', 'staff', 'admin'

  // Theme Mode State: Default mode is 'light' as specified
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ace_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('ace_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Central Reactive Shipments Repository
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [hasSearchedTracking, setHasSearchedTracking] = useState(false);
  const [prefilledQuote, setPrefilledQuote] = useState(null);

  // Receipt Modal State
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptShipment, setReceiptShipment] = useState(INITIAL_SHIPMENTS[0]);

  // Tracking Search
  const handleSearchTracking = (trackingNumber) => {
    const cleanNumber = (trackingNumber || '').trim();
    setTrackingQuery(cleanNumber);
    setHasSearchedTracking(true);

    if (!cleanNumber) {
      setSelectedShipment(null);
      setCurrentView('track');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const upperClean = cleanNumber.toUpperCase();
    const stripped = upperClean.replace(/[^A-Z0-9]/g, '');

    const found = shipments.find(s => {
      const sNum = (s.trackingNumber || '').toUpperCase();
      const sId = (s.id || '').toUpperCase();
      const sSeal = (s.package?.sealNumber || '').toUpperCase();
      const sNumStripped = sNum.replace(/[^A-Z0-9]/g, '');
      const sIdStripped = sId.replace(/[^A-Z0-9]/g, '');

      return sNum === upperClean || 
             sId === upperClean || 
             sSeal === upperClean ||
             (stripped && sNumStripped === stripped) ||
             (stripped && sIdStripped === stripped) ||
             (stripped.length >= 6 && (sNumStripped.includes(stripped) || stripped.includes(sNumStripped)));
    });

    if (found) {
      setSelectedShipment(found);
    } else {
      setSelectedShipment(null);
    }
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select Shipment from table / card
  const handleSelectShipment = (shipment) => {
    setSelectedShipment(shipment);
    if (shipment) {
      setTrackingQuery(shipment.trackingNumber || shipment.id || '');
      setHasSearchedTracking(true);
    }
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearTracking = () => {
    setSelectedShipment(null);
    setTrackingQuery('');
    setHasSearchedTracking(false);
  };

  // Open Receipt
  const handleOpenReceipt = (shipment) => {
    setReceiptShipment(shipment);
    setReceiptModalOpen(true);
  };

  // New Shipment Created
  const handleShipmentCreated = (newShipment, postAction = null) => {
    setShipments(prev => [newShipment, ...prev]);
    setSelectedShipment(newShipment);

    if (postAction === 'view-details') {
      setCurrentView('track');
    } else if (postAction === 'view-receipt') {
      handleOpenReceipt(newShipment);
    }
  };

  // Update Status from Staff Console
  const handleUpdateShipmentStatus = (shipmentId, updates) => {
    setShipments(prev => prev.map(s => {
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
    }));
  };

  // Quote -> Shipment Booking transition
  const handleProceedToShipmentFromQuote = (quoteData) => {
    setPrefilledQuote(quoteData);
    setCurrentView('new-shipment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Login handler
  const handleLoginSuccess = (role, userObj) => {
    setActiveRole(role);
    setCurrentUser(userObj);
    if (role === 'admin') {
      // Admin has full access to all portals and starts on the comprehensive Admin Dashboard
      setCurrentView('admin-dashboard');
    } else if (role === 'staff') {
      // Staff only has access to Staff Dispatcher and Customer Portal; starts on Staff Dispatcher
      setCurrentView('staff-dashboard');
    } else if (role === 'customer') {
      // Customer has access to Customer Portal only
      setCurrentView('customer-dashboard');
    } else {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logout handler
  const handleLogout = () => {
    setActiveRole('guest');
    setCurrentUser(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDashboardView = [
    'customer-dashboard', 
    'admin-dashboard', 
    'staff-dashboard', 
    'analytics', 
    'users', 
    'admin-shipments', 
    'admin-customers', 
    'admin-settings'
  ].includes(currentView);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Global Navigation with Role Permissions */}
      <Navbar 
        currentView={currentView} 
        setView={setCurrentView} 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        setLoginPortal={setLoginPortal}
      />

      {/* Main View Router */}
      <div style={{ flex: 1 }}>
        {currentView === 'home' && (
          <HomeView 
            setView={setCurrentView} 
            onSearchTracking={handleSearchTracking} 
          />
        )}

        {currentView === 'services' && (
          <ServicesView 
            setView={setCurrentView} 
          />
        )}

        {currentView === 'track' && (
          <TrackingView 
            shipment={selectedShipment} 
            onSearchTracking={handleSearchTracking}
            onSelectShipment={handleSelectShipment}
            onViewReceipt={handleOpenReceipt}
            allShipments={shipments}
            initialQuery={trackingQuery}
            hasSearched={hasSearchedTracking}
            onClearTracking={handleClearTracking}
          />
        )}

        {currentView === 'about' && (
          <AboutView 
            setView={setCurrentView} 
          />
        )}

        {currentView === 'contact' && (
          <ContactView />
        )}

        {currentView === 'quote' && (
          <QuoteView 
            onProceedToShipment={handleProceedToShipmentFromQuote} 
          />
        )}

        {currentView === 'new-shipment' && (
          <ShipmentCreationView 
            onShipmentCreated={handleShipmentCreated} 
            onCancel={() => setCurrentView('home')}
            prefilledQuote={prefilledQuote}
            currentUser={currentUser}
          />
        )}

        {currentView === 'login' && (
          <LoginView 
            onLoginSuccess={handleLoginSuccess} 
            setView={setCurrentView}
            initialPortal={loginPortal}
          />
        )}

        {/* CUSTOMER PORTAL VIEW: Accessible to Customer, Staff, and Admin */}
        {currentView === 'customer-dashboard' && (
          activeRole === 'guest' ? (
            <LoginView onLoginSuccess={handleLoginSuccess} setView={setCurrentView} />
          ) : (
            <CustomerDashboardView 
              shipments={shipments} 
              onSelectShipment={handleSelectShipment} 
              onViewReceipt={handleOpenReceipt} 
              setView={setCurrentView} 
              user={currentUser || { 
                name: 'Kwame Mensah', 
                company: 'Gold Coast Trading Ltd', 
                email: 'k.mensah@goldcoasttrading.com',
                phone: '+233 24 555 0192',
                role: 'customer'
              }}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
            />
          )
        )}

        {/* ADMIN PORTAL VIEWS: Strictly accessible when Admin logs in! */}
        {(currentView === 'admin-dashboard' || currentView === 'admin-shipments' || currentView === 'admin-settings') && (
          activeRole === 'admin' ? (
            <AdminDashboardView 
              shipments={shipments} 
              onSelectShipment={handleSelectShipment} 
              onViewReceipt={handleOpenReceipt} 
              setView={setCurrentView} 
              setActiveRole={setActiveRole}
            />
          ) : activeRole === 'staff' ? (
            // Staff does not have access to Admin Portal, only to Staff Dispatcher and Customer Portal
            <StaffDashboardView 
              shipments={shipments} 
              onUpdateShipmentStatus={handleUpdateShipmentStatus} 
              onSelectShipment={handleSelectShipment} 
              setView={setCurrentView} 
              activeRole={activeRole}
              setActiveRole={setActiveRole}
            />
          ) : (
            <LoginView onLoginSuccess={handleLoginSuccess} setView={setCurrentView} initialPortal="admin" />
          )
        )}

        {/* STAFF DISPATCHER: Accessible to Staff and Admin only */}
        {currentView === 'staff-dashboard' && (
          (activeRole === 'staff' || activeRole === 'admin') ? (
            <StaffDashboardView 
              shipments={shipments} 
              onUpdateShipmentStatus={handleUpdateShipmentStatus} 
              onSelectShipment={handleSelectShipment} 
              setView={setCurrentView} 
              activeRole={activeRole}
              setActiveRole={setActiveRole}
            />
          ) : activeRole === 'customer' ? (
            <CustomerDashboardView 
              shipments={shipments} 
              onSelectShipment={handleSelectShipment} 
              onViewReceipt={handleOpenReceipt} 
              setView={setCurrentView} 
              user={currentUser || { name: 'Kwame Mensah', company: 'Gold Coast Trading Ltd' }}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
            />
          ) : (
            <LoginView onLoginSuccess={handleLoginSuccess} setView={setCurrentView} initialPortal="staff" />
          )
        )}

        {/* ANALYTICS: Admin access only */}
        {currentView === 'analytics' && (
          activeRole === 'admin' ? (
            <AnalyticsView 
              setView={setCurrentView} 
              activeRole={activeRole} 
              setActiveRole={setActiveRole} 
            />
          ) : activeRole === 'staff' ? (
            <StaffDashboardView 
              shipments={shipments} 
              onUpdateShipmentStatus={handleUpdateShipmentStatus} 
              onSelectShipment={handleSelectShipment} 
              setView={setCurrentView} 
              activeRole={activeRole}
              setActiveRole={setActiveRole}
            />
          ) : (
            <LoginView onLoginSuccess={handleLoginSuccess} setView={setCurrentView} initialPortal="admin" />
          )
        )}

        {/* USERS MANAGEMENT & CUSTOMERS DIRECTORY: Admin access only */}
        {(currentView === 'users' || currentView === 'admin-customers') && (
          activeRole === 'admin' ? (
            <UserManagementView 
              setView={setCurrentView} 
              activeRole={activeRole} 
              setActiveRole={setActiveRole}
              initialFilter={currentView === 'admin-customers' ? 'Customer' : 'ALL'}
              currentView={currentView}
            />
          ) : activeRole === 'staff' ? (
            <StaffDashboardView 
              shipments={shipments} 
              onUpdateShipmentStatus={handleUpdateShipmentStatus} 
              onSelectShipment={handleSelectShipment} 
              setView={setCurrentView} 
              activeRole={activeRole}
              setActiveRole={setActiveRole}
            />
          ) : (
            <LoginView onLoginSuccess={handleLoginSuccess} setView={setCurrentView} initialPortal="admin" />
          )
        )}
      </div>

      {/* Official Bill of Lading / Consignment Receipt Modal */}
      <ReceiptModal 
        shipment={receiptShipment} 
        isOpen={receiptModalOpen} 
        onClose={() => setReceiptModalOpen(false)} 
      />

      {/* Global Footer */}
      {!isDashboardView && (
        <Footer setView={setCurrentView} />
      )}
    </div>
  );
}
