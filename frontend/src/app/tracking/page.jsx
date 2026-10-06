'use client';

import React, { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import TrackingView from '../../views/TrackingView';
import { useApp } from '../../context/AppContext';

function TrackingContent() {
  const searchParams = useSearchParams();
  const qParam = searchParams.get('q');

  const {
    selectedShipment,
    handleSearchTracking,
    handleSelectShipment,
    handleOpenReceipt,
    shipments,
    trackingQuery,
    hasSearchedTracking,
    handleClearTracking
  } = useApp();

  // If a tracking query param is present on direct page load, perform search automatically
  useEffect(() => {
    if (qParam && qParam !== trackingQuery) {
      handleSearchTracking(qParam);
    }
  }, [qParam]);

  return (
    <TrackingView 
      shipment={selectedShipment}
      onSearchTracking={handleSearchTracking}
      _onSelectShipment={handleSelectShipment}
      onViewReceipt={handleOpenReceipt}
      _allShipments={shipments}
      initialQuery={trackingQuery || qParam || ''}
      hasSearched={hasSearchedTracking || Boolean(qParam)}
      onClearTracking={handleClearTracking}
    />
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Loading tracking system...</div>}>
      <TrackingContent />
    </Suspense>
  );
}
