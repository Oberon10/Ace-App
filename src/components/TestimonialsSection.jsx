import React from 'react';
import { Star, MapPin, Truck, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/testimonials';

function TestimonialCard({ testimonial }) {
  const isRoute = testimonial.metaType === 'Route';

  return (
    <div 
      className="ace-card ace-card-interactive ace-testimonial-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '32px 28px',
        borderRadius: 'var(--radius-card)',
        backgroundColor: 'var(--color-white)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
        position: 'relative'
      }}
    >
      <div>
        {/* Rating Stars & Quote Icon */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
            role="img" 
            aria-label={`${testimonial.rating} out of 5 stars`}
          >
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star 
                key={i} 
                size={17} 
                fill="#F59E0B" 
                color="#F59E0B" 
                aria-hidden="true" 
              />
            ))}
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '6px' }}>
              5.0
            </span>
          </div>

          <div style={{ 
            color: 'var(--color-bright-action)', 
            opacity: 0.25,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Quote size={24} />
          </div>
        </div>

        {/* Testimonial Quote */}
        <blockquote style={{ 
          fontSize: '14.5px', 
          lineHeight: 1.65, 
          color: 'var(--text-primary)',
          fontStyle: 'normal',
          marginBottom: '24px'
        }}>
          "{testimonial.quote}"
        </blockquote>
      </div>

      {/* Card Footer: Author Profile & Meta Badge */}
      <div style={{ 
        borderTop: '1px solid var(--color-border-subtle)', 
        paddingTop: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src={testimonial.avatar} 
            alt={testimonial.name}
            className="ace-testimonial-avatar"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--color-border)',
              backgroundColor: 'var(--color-light-blue)',
              flexShrink: 0,
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          />
          <div style={{ minWidth: 0 }}>
            <h3 style={{ 
              fontSize: '15.5px', 
              fontWeight: 700, 
              color: 'var(--color-primary-blue)', 
              margin: 0,
              lineHeight: 1.2
            }}>
              {testimonial.name}
            </h3>
            <div style={{ 
              fontSize: '12.5px', 
              color: 'var(--text-secondary)', 
              marginTop: '3px',
              fontWeight: 500
            }}>
              {testimonial.role}
            </div>
          </div>
        </div>

        {/* Route or Service Meta Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--color-very-light-blue)',
          border: '1px solid var(--color-border)',
          padding: '5px 10px',
          borderRadius: '6px',
          fontSize: '11.5px',
          fontWeight: 600,
          color: 'var(--color-primary-blue)',
          alignSelf: 'flex-start'
        }}>
          {isRoute ? (
            <MapPin size={13} color="var(--color-bright-action)" />
          ) : (
            <Truck size={13} color="var(--color-bright-action)" />
          )}
          <span>
            {testimonial.metaType}: <strong style={{ color: 'var(--text-primary)' }}>{testimonial.metaValue}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section 
      aria-labelledby="testimonials-heading"
      style={{ 
        backgroundColor: 'var(--color-white)', 
        paddingTop: '64px', 
        paddingBottom: '80px',
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border)'
      }}
    >
      <div className="ace-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
          <span 
            style={{ 
              fontSize: '12px', 
              fontWeight: 700, 
              color: 'var(--color-bright-action)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em',
              display: 'inline-block',
              marginBottom: '6px'
            }}
          >
            CUSTOMER STORIES
          </span>
          <h2 
            id="testimonials-heading"
            style={{ 
              fontSize: 'clamp(24px, 3.2vw, 32px)', 
              color: 'var(--color-primary-blue)', 
              fontWeight: 800, 
              marginTop: '2px', 
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}
          >
            Trusted by customers who move with us
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            From personal deliveries to growing businesses, customers trust us to move their packages quickly, safely, and reliably.
          </p>
        </div>

        {/* 3-Column Responsive Testimonials Grid */}
        <div className="ace-testimonials-grid">
          {TESTIMONIALS.map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))}
        </div>
      </div>

      <style>{`
        .ace-testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .ace-testimonial-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-elevated);
          border-color: #BAE6FD;
        }

        .ace-testimonial-card:hover .ace-testimonial-avatar {
          border-color: var(--color-bright-action);
          transform: scale(1.04);
        }

        @media (max-width: 960px) {
          .ace-testimonials-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 640px) {
          .ace-testimonials-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .ace-testimonial-card {
            padding: 24px 20px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ace-testimonial-card,
          .ace-testimonial-avatar {
            transition: none !important;
            transform: none !important;
          }
          .ace-testimonial-card:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
