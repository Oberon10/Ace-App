import React, { useState } from 'react';
import { 
  Calculator, 
  ArrowRight, 
  Plane, 
  Ship, 
  Truck, 
  Train, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Package,
  Calendar,
  MapPin,
  Navigation
} from 'lucide-react';
import { COUNTRY_LIST, getCitiesForCountry } from '../data/locations';

export default function QuoteView({ onProceedToShipment }) {
  // Origin Country & City State
  const [originCountry, setOriginCountry] = useState('Ghana');
  const [originCity, setOriginCity] = useState('Accra');
  const [isCustomOriginCity, setIsCustomOriginCity] = useState(false);

  // Destination Country & City State
  const [destinationCountry, setDestinationCountry] = useState('United Kingdom');
  const [destinationCity, setDestinationCity] = useState('London');
  const [isCustomDestinationCity, setIsCustomDestinationCity] = useState(false);

  // Package specs
  const [weight, setWeight] = useState('45');
  const [length, setLength] = useState('60');
  const [width, setWidth] = useState('40');
  const [height, setHeight] = useState('40');
  const [method, setMethod] = useState('Air Freight Priority');
  const [isCalculating, setIsCalculating] = useState(false);

  // Dynamic city lists
  const originCities = getCitiesForCountry(originCountry);
  const originCityList = originCities.includes(originCity) || !originCity
    ? originCities
    : [originCity, ...originCities];

  const destinationCities = getCitiesForCountry(destinationCountry);
  const destinationCityList = destinationCities.includes(destinationCity) || !destinationCity
    ? destinationCities
    : [destinationCity, ...destinationCities];

  // Derived full location strings for routing & shipment prefill
  const origin = originCity ? `${originCity}, ${originCountry}` : originCountry;
  const destination = destinationCity ? `${destinationCity}, ${destinationCountry}` : destinationCountry;

  // Handlers for Origin
  const handleOriginCountryChange = (e) => {
    const newCountry = e.target.value;
    setOriginCountry(newCountry);
    setIsCustomOriginCity(false);
    const cities = getCitiesForCountry(newCountry);
    setOriginCity(cities.length > 0 ? cities[0] : '');
  };

  const handleOriginCityChange = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomOriginCity(true);
      setOriginCity('');
    } else {
      setIsCustomOriginCity(false);
      setOriginCity(val);
    }
  };

  // Handlers for Destination
  const handleDestinationCountryChange = (e) => {
    const newCountry = e.target.value;
    setDestinationCountry(newCountry);
    setIsCustomDestinationCity(false);
    const cities = getCitiesForCountry(newCountry);
    setDestinationCity(cities.length > 0 ? cities[0] : '');
  };

  const handleDestinationCityChange = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomDestinationCity(true);
      setDestinationCity('');
    } else {
      setIsCustomDestinationCity(false);
      setDestinationCity(val);
    }
  };

  // Result state
  const [quoteResult, setQuoteResult] = useState({
    estimatedCost: 485,
    estimatedDelivery: '3–4 Business Days',
    method: 'Air Freight Priority',
    breakdown: {
      freight: 410,
      fuel: 45,
      customs: 30
    }
  });

  const handleCalculate = (e) => {
    e.preventDefault();
    setIsCalculating(true);

    setTimeout(() => {
      const w = parseFloat(weight) || 10;
      let rate = 9.0;
      let days = '2–4 Business Days';

      if (method.includes('Ocean')) {
        rate = 2.5;
        days = '14–22 Days';
      } else if (method.includes('Ground') || method.includes('Road')) {
        rate = 4.0;
        days = '1–3 Business Days';
      } else if (method.includes('Rail')) {
        rate = 4.5;
        days = '4–6 Business Days';
      }

      const freight = Math.round(w * rate);
      const fuel = Math.round(freight * 0.12);
      const customs = 30;
      const total = freight + fuel + customs;

      setQuoteResult({
        estimatedCost: total,
        estimatedDelivery: days,
        method: method,
        breakdown: {
          freight,
          fuel,
          customs
        }
      });
      setIsCalculating(false);
    }, 400);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '48px 0 80px' }}>
      <div className="ace-container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Instant Freight Rates
          </span>
          <h1 style={{ fontSize: '32px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '4px', marginBottom: '8px' }}>
            Get a Competitive Shipping Quote
          </h1>
          <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)' }}>
            Calculate real-time door-to-door and port-to-port freight rates across our air, ocean, rail, and road networks.
          </p>
        </div>

        {/* ===================================================
            SECTION: TWO-COLUMN QUOTE LAYOUT
            =================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gap: '32px',
          alignItems: 'start'
        }} className="quote-grid">
          {/* LEFT: QUOTE FORM */}
          <div className="ace-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
              <Calculator size={22} color="var(--color-primary-blue)" />
              <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)', fontWeight: 700 }}>
                Shipment Parameters
              </h3>
            </div>

            <form onSubmit={handleCalculate}>
              {/* Origin & Destination Geography Selectors */}
              <div className="quote-hubs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '20px' }}>
                {/* Origin Hub Card */}
                <div style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: 'var(--color-light-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-bright-action)' }}>
                      <MapPin size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-primary-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Origin Location
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Collection Country & City</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="ace-form-group" style={{ marginBottom: 0 }}>
                      <label className="ace-label ace-label-required">Origin Country</label>
                      <select
                        className="ace-select"
                        value={originCountry}
                        onChange={handleOriginCountryChange}
                        required
                      >
                        {COUNTRY_LIST.map(c => (
                          <option key={`orig-country-${c}`} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="ace-form-group" style={{ marginBottom: 0 }}>
                      <label className="ace-label ace-label-required">Origin City</label>
                      {!isCustomOriginCity ? (
                        <select
                          className="ace-select"
                          value={originCity}
                          onChange={handleOriginCityChange}
                          required
                        >
                          {originCityList.map(city => (
                            <option key={`orig-city-${city}`} value={city}>{city}</option>
                          ))}
                          <option value="__custom__">+ Other / Unlisted City...</option>
                        </select>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            className="ace-input"
                            value={originCity}
                            onChange={(e) => setOriginCity(e.target.value)}
                            placeholder="Type origin city..."
                            required
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomOriginCity(false);
                              const cities = getCitiesForCountry(originCountry);
                              setOriginCity(cities.length > 0 ? cities[0] : '');
                            }}
                            className="ace-btn ace-btn-ghost ace-btn-sm"
                            style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
                          >
                            List
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Destination Hub Card */}
                <div style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '10px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                      <Navigation size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-primary-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Destination Location
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target Country & City</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="ace-form-group" style={{ marginBottom: 0 }}>
                      <label className="ace-label ace-label-required">Destination Country</label>
                      <select
                        className="ace-select"
                        value={destinationCountry}
                        onChange={handleDestinationCountryChange}
                        required
                      >
                        {COUNTRY_LIST.map(c => (
                          <option key={`dest-country-${c}`} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="ace-form-group" style={{ marginBottom: 0 }}>
                      <label className="ace-label ace-label-required">Destination City</label>
                      {!isCustomDestinationCity ? (
                        <select
                          className="ace-select"
                          value={destinationCity}
                          onChange={handleDestinationCityChange}
                          required
                        >
                          {destinationCityList.map(city => (
                            <option key={`dest-city-${city}`} value={city}>{city}</option>
                          ))}
                          <option value="__custom__">+ Other / Unlisted City...</option>
                        </select>
                      ) : (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            type="text"
                            className="ace-input"
                            value={destinationCity}
                            onChange={(e) => setDestinationCity(e.target.value)}
                            placeholder="Type destination city..."
                            required
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomDestinationCity(false);
                              const cities = getCitiesForCountry(destinationCountry);
                              setDestinationCity(cities.length > 0 ? cities[0] : '');
                            }}
                            className="ace-btn ace-btn-ghost ace-btn-sm"
                            style={{ fontSize: '11px', whiteSpace: 'nowrap' }}
                          >
                            List
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Weight & Dimensions */}
              <div className="quote-dimensions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="ace-input"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="45"
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label">Length (cm)</label>
                  <input
                    type="number"
                    className="ace-input"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="60"
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label">Width (cm)</label>
                  <input
                    type="number"
                    className="ace-input"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="40"
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label">Height (cm)</label>
                  <input
                    type="number"
                    className="ace-input"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="40"
                  />
                </div>
              </div>

              {/* Shipping Method Select */}
              <div className="ace-form-group" style={{ marginBottom: '24px' }}>
                <label className="ace-label ace-label-required">Shipping Method</label>
                <select
                  className="ace-select"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="Air Freight Priority">Air Freight Priority (Express Transit)</option>
                  <option value="Ocean Container Freight">Ocean Container Freight (FCL / LCL Sea)</option>
                  <option value="Ground Express Fleet">Ground Express Fleet (Interstate Trucking)</option>
                  <option value="Rail Intermodal Express">Rail Intermodal Express (Corridor Rail)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isCalculating}
                className="ace-btn ace-btn-primary"
                style={{ width: '100%', height: '46px', fontSize: '15px' }}
              >
                <span>{isCalculating ? 'Calculating Rates...' : 'Calculate Quote'}</span>
                <Calculator size={16} />
              </button>
            </form>
          </div>

          {/* RIGHT: ESTIMATED RESULT CARD */}
          <div className="ace-card" style={{
            backgroundColor: 'var(--color-white)',
            boxShadow: 'var(--shadow-card)',
            border: '2px solid var(--color-border)',
            padding: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-bright-action)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Instant Estimate
              </span>
              <span style={{ fontSize: '11px', color: 'var(--status-delivered-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={13} />
                Guaranteed Tier
              </span>
            </div>

            {/* Big Price Headline */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Estimated Shipping Cost</div>
              <div style={{ fontSize: '38px', fontWeight: 800, color: 'var(--color-primary-blue)', lineHeight: 1.1, marginTop: '4px' }}>
                ${quoteResult.estimatedCost}.00 <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-secondary)' }}>USD</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                All taxes, airport/port surcharges, and customs handling included.
              </div>
            </div>

            {/* Spec Details */}
            <div style={{
              backgroundColor: 'var(--color-light-blue)',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shipping Method:</span>
                <strong style={{ color: 'var(--color-primary-blue)' }}>{quoteResult.method}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Delivery:</span>
                <strong style={{ color: 'var(--status-delivered-color)' }}>{quoteResult.estimatedDelivery}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Routing Corridor:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{origin} → {destination}</span>
              </div>
            </div>

            {/* Itemized Cost Breakdown */}
            <div style={{ marginBottom: '24px', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Base Carrier Freight:</span>
                <span>${quoteResult.breakdown.freight}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Fuel & Security Surcharge:</span>
                <span>${quoteResult.breakdown.fuel}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Documentation & Handling:</span>
                <span>${quoteResult.breakdown.customs}.00</span>
              </div>
            </div>

            {/* Continue to Shipment CTA Button */}
            <button
              onClick={() => onProceedToShipment({ weight, method, origin, destination })}
              className="ace-btn ace-btn-action"
              style={{ width: '100%', height: '48px', fontSize: '15px' }}
            >
              <span>Continue to Shipment</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .quote-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .quote-hubs-grid {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .quote-dimensions-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
        }
        @media (max-width: 380px) {
          .quote-dimensions-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
