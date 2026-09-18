import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Star, 
  MapPin, 
  Truck, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Pause, 
  Play, 
  Plane, 
  ShieldCheck 
} from 'lucide-react';
import { TESTIMONIALS } from '../data/testimonials';

function TestimonialCard({ testimonial, isActive = false }) {
  const isRoute = testimonial.metaType === 'Route';

  return (
    <div 
      className={`ace-card ace-card-interactive ace-testimonial-card ${isActive ? 'ace-testimonial-active' : ''}`}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 24px',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isActive ? '2px solid var(--color-bright-action)' : '1px solid rgba(255, 255, 255, 0.85)',
        boxShadow: isActive 
          ? '0 20px 40px -10px rgba(14, 165, 233, 0.35), 0 8px 20px rgba(0, 0, 0, 0.2)' 
          : '0 16px 36px -8px rgba(0, 0, 0, 0.38), 0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
        position: 'relative'
      }}
    >
      <div>
        {/* Rating Stars & Quote Icon */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '3px' }}
            role="img" 
            aria-label={`${testimonial.rating} out of 5 stars`}
          >
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
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
            opacity: 0.3,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Quote size={22} />
          </div>
        </div>

        {/* Testimonial Quote */}
        <blockquote style={{ 
          fontSize: '14.5px', 
          lineHeight: 1.65, 
          color: 'var(--text-primary)',
          fontStyle: 'normal',
          margin: 0,
          marginBottom: '20px'
        }}>
          "{testimonial.quote}"
        </blockquote>
      </div>

      {/* Card Footer: Author Profile & Meta Badge */}
      <div style={{ 
        borderTop: '1px solid var(--color-border-subtle)', 
        paddingTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {/* User Info with Picture */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name}
              className="ace-testimonial-avatar"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2.5px solid #0284C7',
                backgroundColor: 'var(--color-light-blue)',
                flexShrink: 0,
                display: 'block',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
              }}
            />
            {testimonial.verified && (
              <div 
                title="Verified Consignment Customer"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF'
                }}
              >
                <CheckCircle2 size={12} strokeWidth={3} />
              </div>
            )}
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <h3 style={{ 
                fontSize: '15.5px', 
                fontWeight: 700, 
                color: 'var(--color-primary-blue)', 
                margin: 0,
                lineHeight: 1.2
              }}>
                {testimonial.name}
              </h3>
            </div>
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--text-secondary)', 
              marginTop: '3px',
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {testimonial.role}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: 'var(--text-muted)', 
              marginTop: '1px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {testimonial.company}
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
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '11.5px',
          fontWeight: 600,
          color: '#0369A1',
          alignSelf: 'flex-start',
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {isRoute ? (
            <MapPin size={13} color="var(--color-bright-action)" style={{ flexShrink: 0 }} />
          ) : testimonial.metaValue.toLowerCase().includes('air') ? (
            <Plane size={13} color="var(--color-bright-action)" style={{ flexShrink: 0 }} />
          ) : (
            <Truck size={13} color="var(--color-bright-action)" style={{ flexShrink: 0 }} />
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {testimonial.metaType}: <strong style={{ color: 'var(--text-primary)' }}>{testimonial.metaValue}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const totalItems = TESTIMONIALS.length;

  // Responsive Items Per Page
  const updateItemsPerPage = useCallback(() => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    if (width <= 640) {
      setItemsPerPage(1);
    } else if (width <= 1024) {
      setItemsPerPage(2);
    } else {
      setItemsPerPage(3);
    }
  }, []);

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, [updateItemsPerPage]);

  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  // Auto slide effect
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4200);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleSelectCustomer = (index) => {
    const targetIndex = Math.min(index, maxIndex);
    setCurrentIndex(targetIndex);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setIsPaused(false);
  };

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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative Gradient Glows */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '20%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-120px',
        right: '15%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="ace-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 36px' }}>
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
            VERIFIED CUSTOMER STORIES
          </span>
          <h2 
            id="testimonials-heading"
            style={{ 
              fontSize: 'clamp(24px, 3.8vw, 38px)', 
              color: '#FFFFFF', 
              fontWeight: 800, 
              marginTop: '4px', 
              marginBottom: '14px',
              letterSpacing: '-0.025em',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)'
            }}
          >
            Trusted by 10,000+ Shippers Worldwide
          </h2>
          <p style={{ 
            fontSize: '15px', 
            color: '#E0F2FE', 
            lineHeight: 1.65,
            maxWidth: '640px',
            margin: '0 auto',
            opacity: 0.95,
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)'
          }}>
            From high-growth African exporters and global retailers to European manufacturers and time-critical medical couriers—discover how ACE powers commerce across borders.
          </p>
        </div>

        {/* ===================================================
            AUTOMATIC SLIDING CUSTOMER PICTURES MARQUEE (10 PICTURES & NAMES)
            =================================================== */}
        <div 
          className="customer-pictures-marquee-container"
          style={{
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            backgroundColor: 'rgba(7, 30, 50, 0.65)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            backdropFilter: 'blur(12px)',
            padding: '16px 0'
          }}
        >
          {/* Subtle gradient fades on left and right */}
          <div className="marquee-edge-fade-left" />
          <div className="marquee-edge-fade-right" />

          {/* Marquee Track: duplicated 10 items for seamless infinite auto-scroll */}
          <div className="customer-pictures-track">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((item, idx) => {
              const originalIndex = idx % totalItems;
              const isSelected = currentIndex === originalIndex;

              return (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={() => handleSelectCustomer(originalIndex)}
                  className={`marquee-customer-pill ${isSelected ? 'marquee-pill-selected' : ''}`}
                  title={`View story: ${item.name}`}
                >
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img 
                      src={item.avatar} 
                      alt={item.name} 
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: isSelected ? '2.5px solid #38BDF8' : '2px solid rgba(255, 255, 255, 0.7)',
                        boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.7)' : '0 2px 6px rgba(0,0,0,0.3)',
                        display: 'block'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '-1px',
                      right: '-1px',
                      width: '13px',
                      height: '13px',
                      borderRadius: '50%',
                      backgroundColor: '#10B981',
                      border: '1.5px solid #072A42',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                    </div>
                  </div>

                  <div style={{ textAlign: 'left', minWidth: '100px' }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: 700, 
                      color: isSelected ? '#38BDF8' : '#FFFFFF',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.2
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#94A3B8', 
                      whiteSpace: 'nowrap',
                      marginTop: '2px'
                    }}>
                      {item.country}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            AUTOMATIC SLIDING CAROUSEL (MAIN CUSTOMER STORIES)
            =================================================== */}
        <div 
          className="ace-carousel-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ position: 'relative' }}
        >
          {/* Overflow Viewport */}
          <div style={{ overflow: 'hidden', padding: '10px 4px 16px' }}>
            <div 
              className="ace-carousel-track"
              style={{
                display: 'flex',
                gap: '24px',
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                transform: `translateX(calc(-${currentIndex} * (${100 / itemsPerPage}% + ${24 / itemsPerPage}px)))`
              }}
            >
              {TESTIMONIALS.map((item, idx) => (
                <div 
                  key={item.id}
                  style={{
                    flex: `0 0 calc(${100 / itemsPerPage}% - ${(24 * (itemsPerPage - 1)) / itemsPerPage}px)`,
                    minWidth: 0,
                    boxSizing: 'border-box'
                  }}
                >
                  <TestimonialCard 
                    testimonial={item} 
                    isActive={currentIndex === idx}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous customer story"
            className="carousel-nav-btn carousel-nav-prev"
          >
            <ChevronLeft size={22} color="#FFFFFF" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next customer story"
            className="carousel-nav-btn carousel-nav-next"
          >
            <ChevronRight size={22} color="#FFFFFF" />
          </button>
        </div>

        {/* ===================================================
            CAROUSEL CONTROLS BAR: DOT INDICATORS & PLAY/PAUSE
            =================================================== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '28px',
          flexWrap: 'wrap'
        }}>
          {/* Play / Pause Auto-Slide Button */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              borderRadius: '20px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease'
            }}
            title={isPaused ? 'Resume auto-sliding' : 'Pause auto-sliding'}
          >
            {isPaused ? <Play size={13} fill="#38BDF8" color="#38BDF8" /> : <Pause size={13} />}
            <span>{isPaused ? 'Resume Auto-Slide' : 'Auto-Sliding Active'}</span>
          </button>

          {/* Dot Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                style={{
                  width: currentIndex === dotIdx ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: currentIndex === dotIdx ? '#38BDF8' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: currentIndex === dotIdx ? '0 0 8px #38BDF8' : 'none'
                }}
              />
            ))}
          </div>

          {/* Counter Tag */}
          <div style={{
            fontSize: '12px',
            color: '#94A3B8',
            fontWeight: 600,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span>{currentIndex + 1}</span> / <span>{maxIndex + 1}</span>
          </div>
        </div>

        {/* Trust Badges Counter Bar */}
        <div style={{
          marginTop: '44px',
          paddingTop: '28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#38BDF8' }}>99.8%</div>
            <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '3px' }}>On-Time Guaranteed SLA</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>140+</div>
            <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '3px' }}>Global Airport & Port Hubs</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#FCD34D' }}>Zero Losses</div>
            <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '3px' }}>Tamper-Proof Telemetry</div>
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>24/7</div>
            <div style={{ fontSize: '12.5px', color: '#CBD5E1', marginTop: '3px' }}>Live Dispatch Support</div>
          </div>
        </div>
      </div>

      <style>{`
        /* Infinite Marquee Animation for 10 Customer Pictures */
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .customer-pictures-track {
          display: flex;
          gap: 16px;
          width: max-content;
          animation: marqueeScroll 32s linear infinite;
        }

        .customer-pictures-marquee-container:hover .customer-pictures-track {
          animation-play-state: paused;
        }

        .marquee-edge-fade-left {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 50px;
          background: linear-gradient(to right, rgba(7, 30, 50, 0.95), transparent);
          z-index: 2;
          pointer-events: none;
        }

        .marquee-edge-fade-right {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          width: 50px;
          background: linear-gradient(to left, rgba(7, 30, 50, 0.95), transparent);
          z-index: 2;
          pointer-events: none;
        }

        .marquee-customer-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 6px 14px 6px 8px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.25s ease;
          outline: none;
        }

        .marquee-customer-pill:hover {
          background: rgba(14, 165, 233, 0.2);
          border-color: #38BDF8;
          transform: translateY(-2px);
        }

        .marquee-pill-selected {
          background: rgba(14, 165, 233, 0.25) !important;
          border-color: #38BDF8 !important;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
        }

        /* Navigation Arrows */
        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(7, 42, 66, 0.85);
          border: 1px solid rgba(56, 189, 248, 0.4);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 4;
          backdrop-filter: blur(8px);
          transition: all 0.2s ease;
        }

        .carousel-nav-btn:hover {
          background: var(--color-bright-action);
          border-color: #FFFFFF;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5);
        }

        .carousel-nav-prev {
          left: -20px;
        }

        .carousel-nav-next {
          right: -20px;
        }

        .ace-testimonial-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 50px -10px rgba(0, 0, 0, 0.5), 0 0 25px rgba(56, 189, 248, 0.3) !important;
          border-color: #38BDF8 !important;
        }

        .ace-testimonial-card:hover .ace-testimonial-avatar {
          border-color: #38BDF8 !important;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.5) !important;
          transform: scale(1.06);
        }

        @media (max-width: 1100px) {
          .carousel-nav-prev {
            left: -10px;
          }
          .carousel-nav-next {
            right: -10px;
          }
        }

        @media (max-width: 640px) {
          .carousel-nav-btn {
            display: none;
          }
          .customer-pictures-marquee-container {
            margin-bottom: 24px;
          }
          .ace-testimonial-card {
            padding: 22px 18px !important;
          }
          .ace-testimonials-section {
            padding-top: 56px !important;
            padding-bottom: 64px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .customer-pictures-track {
            animation: none !important;
          }
          .ace-carousel-track {
            transition: none !important;
          }
          .ace-testimonial-card,
          .ace-testimonial-avatar {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
