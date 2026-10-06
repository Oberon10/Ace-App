'use client';

import React from 'react';
import AdminDashboardView from '../../../views/AdminDashboardView';
import { useApp } from '../../../context/AppContext';

export default function AdminShipmentsPage() {
  const { 
    shipments, 
    handleSelectShipment, 
    handleOpenReceipt, 
    navigate, 
    setActiveRole 
  } = useApp();

  return (
    <AdminDashboardView 
      shipments={shipments}
      onSelectShipment={handleSelectShipment}
      onViewReceipt={handleOpenReceipt}
      setView={navigate}
      setActiveRole={setActiveRole}
      currentView="admin-shipments"
    />
  );
}
