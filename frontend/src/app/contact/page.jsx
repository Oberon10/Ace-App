'use client';

import React from 'react';
import ContactView from '../../views/ContactView';
import { useApp } from '../../context/AppContext';

export default function ContactPage() {
  const { navigate, currentUser, activeRole } = useApp();

  return (
    <ContactView 
      setView={navigate} 
      currentUser={currentUser} 
      activeRole={activeRole} 
    />
  );
}
