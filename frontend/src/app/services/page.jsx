'use client';

import React from 'react';
import ServicesView from '../../views/ServicesView';
import { useApp } from '../../context/AppContext';

export default function ServicesPage() {
  const { navigate } = useApp();

  return (
    <ServicesView setView={navigate} />
  );
}
