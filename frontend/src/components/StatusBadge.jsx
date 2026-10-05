import React from 'react';
import { CheckCircle2, Truck, Clock, XCircle } from 'lucide-react';

export default function StatusBadge({ status, className = '' }) {
  const norm = (status || '').toUpperCase().trim();

  let badgeClass = 'ace-badge-neutral';
  let Icon = Clock;
  let text = status || 'Unknown';

  if (norm === 'DELIVERED' || norm === 'COMPLETED' || norm === 'SUCCESS') {
    badgeClass = 'ace-badge-delivered';
    Icon = CheckCircle2;
  } else if (norm === 'IN TRANSIT' || norm === 'TRANSIT' || norm === 'ACTIVE') {
    badgeClass = 'ace-badge-transit';
    Icon = Truck;
  } else if (norm === 'PENDING' || norm === 'PROCESSING' || norm === 'ON HOLD') {
    badgeClass = 'ace-badge-pending';
    Icon = Clock;
  } else if (norm === 'CANCELLED' || norm === 'FAILED' || norm === 'ERROR') {
    badgeClass = 'ace-badge-cancelled';
    Icon = XCircle;
  }

  return (
    <span className={`ace-badge ${badgeClass} ${className}`}>
      <span className="ace-badge-dot" />
      <Icon size={12} strokeWidth={2.5} />
      <span>{text}</span>
    </span>
  );
}
