'use client';

import React from 'react';
import CustomerDashboardView from '../../../views/CustomerDashboardView';
import LoginView from '../../../views/LoginView';
import { useApp } from '../../../context/AppContext';

export default function CustomerDashboardPage() {
  const { 
    activeRole, 
    currentUser, 
    handleLoginSuccess, 
    navigate, 
    shipments, 
    handleSelectShipment, 
    handleOpenReceipt, 
    setActiveRole,
    theme,
    toggleTheme 
  } = useApp();

  if (activeRole === 'guest') {
    return (
      <LoginView 
        onLoginSuccess={(role, userObj) => handleLoginSuccess(role, userObj, '/customer/dashboard')} 
        setView={navigate}
        initialPortal="customer"
        authNotice="Please sign in to access your Customer Portal."
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <CustomerDashboardView 
      shipments={shipments} 
      onSelectShipment={handleSelectShipment} 
      onViewReceipt={handleOpenReceipt} 
      setView={navigate} 
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
  );
}
