import React from 'react';
import { Check, Clock, Radio, MapPin } from 'lucide-react';

export default function TrackingTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No timeline events available for this shipment.
      </div>
    );
  }

  return (
    <div className="ace-timeline">
      {events.map((evt, idx) => {
        const isCompleted = evt.status === 'completed';
        const isActive = evt.status === 'active';
        const isFuture = evt.status === 'future';

        let itemStatusClass = 'future';
        if (isCompleted) itemStatusClass = 'completed';
        else if (isActive) itemStatusClass = 'active';

        return (
          <div key={evt.id || idx} className={`ace-timeline-item ${itemStatusClass}`}>
            {/* Timeline indicator node */}
            <div className="ace-timeline-node">
              {isCompleted && <Check size={12} strokeWidth={3} />}
              {isActive && <Radio size={12} strokeWidth={3} className="animate-pulse" />}
              {isFuture && <Clock size={11} strokeWidth={2} />}
            </div>

            {/* Event Content */}
            <div className="ace-timeline-content">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                <h4 style={{ 
                  fontSize: '15px', 
                  color: isActive ? 'var(--color-primary-blue)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {evt.title}
                  {isActive && (
                    <span style={{ 
                      fontSize: '11px', 
                      backgroundColor: 'var(--color-light-blue)', 
                      color: 'var(--color-bright-action)', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase'
                    }}>
                      Current Step
                    </span>
                  )}
                </h4>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  <span>{evt.date}</span>
                  {evt.time && <span style={{ marginLeft: '6px' }}>• {evt.time}</span>}
                </div>
              </div>

              {evt.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-primary-blue)', fontWeight: 500, marginBottom: '6px' }}>
                  <MapPin size={13} strokeWidth={2.2} />
                  <span>{evt.location}</span>
                </div>
              )}

              <p style={{ fontSize: '13.5px', color: isFuture ? 'var(--text-muted)' : 'var(--text-secondary)', lineHeight: 1.5 }}>
                {evt.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
