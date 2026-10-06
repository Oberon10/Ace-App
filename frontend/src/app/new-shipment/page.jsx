'use client';

import React from 'react';
import ShipmentCreationView from '../../views/ShipmentCreationView';
import LoginView from '../../views/LoginView';
import { useApp } from '../../context/AppContext';

export default function NewShipmentPage() {
  const { 
    activeRole, 
    handleLoginSuccess, 
    navigate, 
    handleShipmentCreated, 
    prefilledQuote, 
    currentUser,
    theme,
    toggleTheme 
  } = useApp();

  if (activeRole === 'guest') {
    return (
      <LoginView 
        onLoginSuccess={(role, userObj) => handleLoginSuccess(role, userObj, '/new-shipment')} 
        setView={navigate}
        initialPortal="customer"
        authNotice="Please sign in or create an account to book and send a package."
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <ShipmentCreationView 
      onShipmentCreated={handleShipmentCreated} 
      onCancel={() => navigate('/')} 
      prefilledQuote={prefilledQuote} 
      currentUser={currentUser} 
    />
  );
}
