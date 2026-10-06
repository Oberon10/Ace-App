'use client';

import React from 'react';
import AnalyticsView from '../../../views/AnalyticsView';
import { useApp } from '../../../context/AppContext';

export default function AdminAnalyticsPage() {
  const { navigate, setActiveRole } = useApp();

  return (
    <AnalyticsView 
      setView={navigate} 
      setActiveRole={setActiveRole} 
    />
  );
}
