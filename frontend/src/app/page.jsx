'use client';

import React from 'react';
import HomeView from '../views/HomeView';
import { useApp } from '../context/AppContext';

export default function HomePage() {
  const { 
    navigate, 
    handleSearchTracking, 
    activeRole, 
    handleSendPackageClick 
  } = useApp();

  return (
    <HomeView 
      setView={navigate} 
      onSearchTracking={handleSearchTracking} 
      activeRole={activeRole} 
      onSendPackageClick={handleSendPackageClick} 
    />
  );
}
