'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import Navbar from './Navbar';
import Footer from './Footer';
import ReceiptModal from './ReceiptModal';
import AiAssistant from './AiAssistant';

export default function ClientShell({ children }) {
  const pathname = usePathname();
  const {
    activeRole,
    setActiveRole,
    currentUser,
    handleLogout,
    theme,
    toggleTheme,
    setLoginPortal,
    shipments,
    receiptModalOpen,
    receiptShipment,
    handleCloseReceipt,
    handleSearchTracking,
    handleProceedToShipmentFromQuote,
    navigate
  } = useApp();

  const isAuthView = pathname === '/login';
  const isAdminView = pathname.startsWith('/admin');
  const isDashboardView = isAdminView || 
    pathname.startsWith('/customer/dashboard') || 
    pathname.startsWith('/staff/dashboard');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Global Navigation - hidden on /login and /admin views */}
      {!isAuthView && !isAdminView && (
        <Navbar 
          currentView={pathname} 
          setView={navigate} 
          activeRole={activeRole} 
          setActiveRole={setActiveRole} 
          currentUser={currentUser}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
          setLoginPortal={setLoginPortal}
        />
      )}

      {/* Main Page Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

      {/* Global Footer - hidden on dashboards and login */}
      {!isDashboardView && !isAuthView && (
        <Footer setView={navigate} />
      )}

      {/* Consignment Receipt Modal */}
      <ReceiptModal 
        shipment={receiptShipment} 
        isOpen={receiptModalOpen} 
        onClose={handleCloseReceipt} 
      />

      {/* AI Logistics Assistant */}
      {!isAuthView && (
        <AiAssistant 
          onSearchTracking={handleSearchTracking}
          onProceedToShipment={handleProceedToShipmentFromQuote}
          setView={navigate}
          allShipments={shipments}
          currentUser={currentUser}
          activeRole={activeRole}
          theme={theme}
        />
      )}
    </div>
  );
}
