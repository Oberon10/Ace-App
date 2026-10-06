'use client';

import React from 'react';
import StaffDashboardView from '../../../views/StaffDashboardView';
import LoginView from '../../../views/LoginView';
import { useApp } from '../../../context/AppContext';

export default function StaffDashboardPage() {
  const { 
    activeRole, 
    handleLoginSuccess, 
    navigate, 
    shipments, 
    handleUpdateShipmentStatus, 
    handleSelectShipment, 
    setActiveRole,
    theme,
    toggleTheme 
  } = useApp();

  if (activeRole !== 'staff' && activeRole !== 'admin') {
    return (
      <LoginView 
        onLoginSuccess={(role, userObj) => handleLoginSuccess(role, userObj, '/staff/dashboard')} 
        setView={navigate}
        initialPortal="staff"
        authNotice="Please sign in with authorized dispatch credentials."
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <StaffDashboardView 
      shipments={shipments} 
      onUpdateShipmentStatus={handleUpdateShipmentStatus} 
      onSelectShipment={handleSelectShipment} 
      setView={navigate} 
      activeRole={activeRole} 
      setActiveRole={setActiveRole} 
    />
  );
}
