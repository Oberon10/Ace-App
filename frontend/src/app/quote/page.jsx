'use client';

import React from 'react';
import QuoteView from '../../views/QuoteView';
import { useApp } from '../../context/AppContext';

export default function QuotePage() {
  const { handleProceedToShipmentFromQuote } = useApp();

  return (
    <QuoteView 
      onProceedToShipment={handleProceedToShipmentFromQuote} 
    />
  );
}
