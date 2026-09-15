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
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.85)',
        boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.38), 0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease',
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
              border: '2px solid #0284C7',
              backgroundColor: 'var(--color-light-blue)',
              flexShrink: 0,
              transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
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
          backgroundColor: '#F0F9FF',
          border: '1px solid #BAE6FD',
          padding: '5px 11px',
          borderRadius: '6px',
          fontSize: '11.5px',
          fontWeight: 600,
          color: '#0369A1',
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
      className="ace-testimonials-section"
      style={{ 
        position: 'relative',
        backgroundImage: "linear-gradient(180deg, rgba(8, 23, 44, 0.88) 0%, rgba(10, 31, 58, 0.84) 50%, rgba(7, 21, 40, 0.92) 100%), url('/images/testimonials-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 38%',
        backgroundRepeat: 'no-repeat',
        paddingTop: '80px', 
        paddingBottom: '96px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
        overflow: 'hidden'
      }}
    >
      <div className="ace-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px' }}>
          <span 
            style={{ 
              fontSize: '11.5px', 
              fontWeight: 700, 
              color: '#38BDF8', 
              backgroundColor: 'rgba(14, 165, 233, 0.16)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              padding: '5px 14px',
              borderRadius: '999px',
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              display: 'inline-block',
              marginBottom: '14px',
              backdropFilter: 'blur(8px)'
            }}
          >
            CUSTOMER STORIES
          </span>
          <h2 
            id="testimonials-heading"
            style={{ 
              fontSize: 'clamp(26px, 3.4vw, 36px)', 
              color: '#FFFFFF', 
              fontWeight: 800, 
              marginTop: '4px', 
              marginBottom: '14px',
              letterSpacing: '-0.025em',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)'
            }}
          >
            Trusted by customers who move with us
          </h2>
          <p style={{ 
            fontSize: '15.5px', 
            color: '#E0F2FE', 
            lineHeight: 1.65,
            maxWidth: '620px',
            margin: '0 auto',
            opacity: 0.95,
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
          }}>
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
          gap: 28px;
        }

        .ace-testimonial-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 50px -10px rgba(0, 0, 0, 0.5), 0 0 25px rgba(56, 189, 248, 0.3) !important;
          border-color: #38BDF8 !important;
        }

        .ace-testimonial-card:hover .ace-testimonial-avatar {
          border-color: #38BDF8 !important;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.4) !important;
          transform: scale(1.06);
        }

        @media (max-width: 960px) {
          .ace-testimonials-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 20px !important;
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
          .ace-testimonials-section {
            padding-top: 56px !important;
            padding-bottom: 64px !important;
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
