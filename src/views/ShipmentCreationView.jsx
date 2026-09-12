import React, { useState } from 'react';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Package, 
  User, 
  MapPin, 
  Truck, 
  Plane, 
  Ship, 
  Train, 
  CheckCircle2, 
  ShieldCheck, 
  Printer, 
  Eye,
  FileText,
  Globe
} from 'lucide-react';
import { COUNTRY_LIST, getCitiesForCountry } from '../data/locations';

export default function ShipmentCreationView({ 
  onShipmentCreated, 
  onCancel,
  prefilledQuote = null,
  currentUser = null
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [createdShipment, setCreatedShipment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomSenderCity, setIsCustomSenderCity] = useState(false);
  const [isCustomReceiverCity, setIsCustomReceiverCity] = useState(false);

  // Parse prefilled quote locations if passed from Quote View
  const parseLocation = (locStr, defaultCity, defaultCountry) => {
    if (!locStr) return { city: defaultCity, country: defaultCountry };
    const parts = locStr.split(',').map(s => s.trim());
    if (parts.length >= 2) {
      return { city: parts[0], country: parts[1] };
    } else if (parts.length === 1 && parts[0]) {
      return { city: parts[0], country: defaultCountry };
    }
    return { city: defaultCity, country: defaultCountry };
  };

  const parsedOrigin = parseLocation(prefilledQuote?.origin, currentUser?.city || 'Accra', currentUser?.country || 'Ghana');
  const parsedDestination = parseLocation(prefilledQuote?.destination, 'London', 'United Kingdom');

  // Form State initialized with logged-in customer's profile
  const [formData, setFormData] = useState({
    // 1 Sender
    senderName: currentUser?.name || 'Kwame Mensah',
    senderCompany: currentUser?.company || (currentUser?.name ? `${currentUser.name}'s Trading` : 'Gold Coast Trading Ltd'),
    senderEmail: currentUser?.email || 'k.mensah@goldcoasttrading.com',
    senderPhone: currentUser?.phone || '+233 24 555 0192',
    senderAddress: currentUser?.address || 'Plot 14, Industrial Area, Ring Road Central',
    senderCity: parsedOrigin.city,
    senderCountry: parsedOrigin.country,

    // 2 Receiver
    receiverName: 'Eleanor Vance',
    receiverCompany: 'Vance Global Ltd',
    receiverEmail: 'eleanor.vance@vanceglobal.co.uk',
    receiverPhone: '+44 20 7946 0912',
    receiverAddress: '24 Bishopsgate, Floor 18',
    receiverCity: parsedDestination.city,
    receiverCountry: parsedDestination.country,

    // 3 Package
    packageType: 'High-Value Electronic Sensors',
    weightKg: prefilledQuote?.weight || '42.5',
    lengthCm: '60',
    widthCm: '45',
    heightCm: '40',
    pieces: '3',
    declaredValue: '12450',
    insurance: true,

    // 4 Shipping Method
    shippingMethod: prefilledQuote?.method || 'Air Freight Priority',
    notes: 'Fragile sensors, maintain vertical orientation.'
  });

  const steps = [
    { number: 1, label: 'Sender' },
    { number: 2, label: 'Receiver' },
    { number: 3, label: 'Package' },
    { number: 4, label: 'Shipping' },
    { number: 5, label: 'Review' }
  ];

  // Dynamic list of cities based on selected country
  const senderCities = getCitiesForCountry(formData.senderCountry);
  const currentSenderCityList = senderCities.includes(formData.senderCity) || !formData.senderCity
    ? senderCities
    : [formData.senderCity, ...senderCities];

  const receiverCities = getCitiesForCountry(formData.receiverCountry);
  const currentReceiverCityList = receiverCities.includes(formData.receiverCity) || !formData.receiverCity
    ? receiverCities
    : [formData.receiverCity, ...receiverCities];

  const handleSenderCountryChange = (e) => {
    const newCountry = e.target.value;
    const cities = getCitiesForCountry(newCountry);
    setIsCustomSenderCity(false);
    setFormData(prev => ({
      ...prev,
      senderCountry: newCountry,
      senderCity: cities.length > 0 ? cities[0] : ''
    }));
  };

  const handleReceiverCountryChange = (e) => {
    const newCountry = e.target.value;
    const cities = getCitiesForCountry(newCountry);
    setIsCustomReceiverCity(false);
    setFormData(prev => ({
      ...prev,
      receiverCountry: newCountry,
      receiverCity: cities.length > 0 ? cities[0] : ''
    }));
  };

  const handleSenderCityChange = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomSenderCity(true);
      setFormData(prev => ({ ...prev, senderCity: '' }));
    } else {
      setIsCustomSenderCity(false);
      updateField('senderCity', val);
    }
  };

  const handleReceiverCityChange = (e) => {
    const val = e.target.value;
    if (val === '__custom__') {
      setIsCustomReceiverCity(true);
      setFormData(prev => ({ ...prev, receiverCity: '' }));
    } else {
      setIsCustomReceiverCity(false);
      updateField('receiverCity', val);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const calculateCost = () => {
    const weight = parseFloat(formData.weightKg) || 10;
    let baseRate = 8.5; // per kg for Air
    if (formData.shippingMethod.includes('Ocean')) baseRate = 2.4;
    else if (formData.shippingMethod.includes('Ground') || formData.shippingMethod.includes('Road')) baseRate = 3.8;
    else if (formData.shippingMethod.includes('Rail')) baseRate = 4.2;

    const freight = Math.round(weight * baseRate);
    const fuel = Math.round(freight * 0.12);
    const customs = 35;
    const total = freight + fuel + customs;
    return { freight, fuel, customs, total };
  };

  const cost = calculateCost();

  const handleConfirmShipment = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      // Generate realistic tracking code: ACE-2026-XXXXXX
      const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newTrackingId = `ACE-2026-${randomSuffix}`;

      const newShipment = {
        id: newTrackingId,
        trackingNumber: newTrackingId,
        status: 'IN TRANSIT',
        statusCode: 'transit',
        method: formData.shippingMethod,
        methodType: formData.shippingMethod.toLowerCase().includes('air') ? 'air' : 
                    formData.shippingMethod.toLowerCase().includes('ocean') ? 'ocean' : 
                    formData.shippingMethod.toLowerCase().includes('rail') ? 'rail' : 'road',
        origin: `${formData.senderCity}, ${formData.senderCountry}`,
        destination: `${formData.receiverCity}, ${formData.receiverCountry}`,
        currentLocation: `${formData.senderCity} Hub (Consignment Dispatched)`,
        estimatedDelivery: 'September 18, 2026',
        createdDate: '2026-09-12',
        customer: formData.senderCompany || formData.senderName,
        sender: {
          name: formData.senderName,
          company: formData.senderCompany,
          phone: formData.senderPhone,
          email: formData.senderEmail,
          address: formData.senderAddress,
          city: formData.senderCity,
          country: formData.senderCountry
        },
        receiver: {
          name: formData.receiverName,
          company: formData.receiverCompany,
          phone: formData.receiverPhone,
          email: formData.receiverEmail,
          address: formData.receiverAddress,
          city: formData.receiverCity,
          country: formData.receiverCountry
        },
        package: {
          type: formData.packageType,
          weightKg: parseFloat(formData.weightKg) || 10,
          dimensions: `${formData.lengthCm} × ${formData.widthCm} × ${formData.heightCm} cm`,
          pieces: parseInt(formData.pieces) || 1,
          declaredValue: `$${parseFloat(formData.declaredValue || 0).toLocaleString()}`,
          insurance: formData.insurance ? 'Full ACE All-Risk Coverage' : 'Standard Commercial Liability',
          sealNumber: `ACE-SL-${Math.floor(10000 + Math.random() * 90000)}`
        },
        charges: {
          freight: cost.freight,
          fuelSurcharge: cost.fuel,
          customsHandling: cost.customs,
          total: cost.total
        },
        timeline: [
          {
            id: 1,
            title: 'Shipment Created & Manifest Booked',
            description: 'Electronic shipping order registered with ACE Logistics network.',
            location: `${formData.senderCity}, ${formData.senderCountry}`,
            date: 'Sep 12, 2026',
            time: '08:00 AM',
            status: 'completed'
          },
          {
            id: 2,
            title: 'Dispatch Pickup Assigned',
            description: 'Consignment queued for priority dispatch courier pickup.',
            location: `${formData.senderCity} Hub`,
            date: 'Sep 12, 2026',
            time: '10:30 AM',
            status: 'active'
          },
          {
            id: 3,
            title: 'In Transit to Destination Hub',
            description: 'Carrier transit scheduled via priority intermodal route.',
            location: `En route to ${formData.receiverCity}`,
            date: 'Sep 14, 2026',
            time: 'Est. 02:00 PM',
            status: 'future'
          },
          {
            id: 4,
            title: 'Delivered',
            description: 'Final delivery and verified recipient signature.',
            location: `${formData.receiverCity}, ${formData.receiverCountry}`,
            date: 'Sep 18, 2026',
            time: 'Est. 05:00 PM',
            status: 'future'
          }
        ]
      };

      setIsSubmitting(false);
      setCreatedShipment(newShipment);
      onShipmentCreated(newShipment);
    }, 600);
  };

  // SUCCESS STATE (Section 32)
  if (createdShipment) {
    return (
      <div style={{
        position: 'relative',
        minHeight: 'calc(100vh - 140px)',
        backgroundImage: 'linear-gradient(180deg, rgba(7, 42, 66, 0.82) 0%, rgba(11, 79, 124, 0.75) 100%), url(/images/package-courier.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 25%',
        backgroundAttachment: 'fixed',
        padding: '60px 0 84px'
      }}>
        <div className="ace-container" style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
          <div className="ace-card" style={{ textAlign: 'center', padding: '40px 32px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              border: '2px solid #A7F3D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#10B981'
            }}>
              <CheckCircle2 size={36} />
            </div>

            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#059669',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Confirmation Completed
            </span>

            <h2 style={{ fontSize: '24px', color: 'var(--color-primary-blue)', fontWeight: 800, marginTop: '4px', marginBottom: '8px' }}>
              Shipment Created Successfully
            </h2>

            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Your cargo booking has been confirmed and assigned to the ACE Global Freight dispatch queue.
            </p>

            {/* Generated Tracking ID Card */}
            <div style={{
              backgroundColor: 'var(--color-light-blue)',
              borderRadius: '10px',
              border: '1px solid #c8e2f4',
              padding: '18px',
              marginBottom: '28px'
            }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Your Assigned Tracking Number
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary-blue)', letterSpacing: '0.05em', marginTop: '4px' }}>
                {createdShipment.trackingNumber}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Estimated Delivery: {createdShipment.estimatedDelivery} • {createdShipment.method}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => onShipmentCreated(createdShipment, 'view-details')}
                className="ace-btn ace-btn-action"
              >
                <Eye size={15} />
                <span>View Shipment</span>
              </button>

              <button
                onClick={() => onShipmentCreated(createdShipment, 'view-receipt')}
                className="ace-btn ace-btn-primary"
              >
                <Printer size={15} />
                <span>Download Receipt</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      minHeight: 'calc(100vh - 140px)',
      backgroundImage: 'linear-gradient(180deg, rgba(7, 42, 66, 0.82) 0%, rgba(11, 79, 124, 0.75) 100%), url(/images/package-courier.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center 25%',
      backgroundAttachment: 'fixed',
      padding: '44px 0 84px'
    }}>
      <div className="ace-container" style={{ maxWidth: '840px', position: 'relative', zIndex: 2 }}>
        {/* Page Title & Intro */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px', 
            fontWeight: 700, 
            color: '#90CDF4', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em',
            marginBottom: '10px'
          }}>
            <Package size={13} color="#38BDF8" />
            <span>Doorstep Courier Intake • Dispatch Booking</span>
          </span>
          <h1 style={{ fontSize: '32px', color: '#FFFFFF', fontWeight: 800, marginTop: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Send a Package — Create Shipment
          </h1>
          <p style={{ fontSize: '14.5px', color: '#D9E7F0', marginTop: '6px', maxWidth: '600px', margin: '6px auto 0' }}>
            Complete the 5 steps below to generate shipping labels, schedule carrier pickup, and receive instant live tracking.
          </p>
        </div>

        {/* ===================================================
            PROGRESS STEPPER (Section 16)
            =================================================== */}
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
          padding: '16px 20px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-elevated)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {steps.map((step, idx) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              const isFuture = currentStep < step.number;

              return (
                <div 
                  key={step.number} 
                  onClick={() => { if (isCompleted) setCurrentStep(step.number); }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    flex: 1,
                    cursor: isCompleted ? 'pointer' : 'default',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                    backgroundColor: isCompleted ? '#10B981' : isActive ? 'var(--color-bright-action)' : 'var(--color-light-blue)',
                    color: isCompleted || isActive ? '#FFFFFF' : 'var(--text-muted)',
                    border: `2px solid ${isCompleted ? '#10B981' : isActive ? 'var(--color-bright-action)' : 'var(--color-border)'}`,
                    boxShadow: isActive ? '0 0 0 4px rgba(22, 131, 216, 0.18)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}>
                    {isCompleted ? <Check size={16} strokeWidth={3} /> : step.number}
                  </div>

                  <span style={{
                    fontSize: '12.5px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-primary-blue)' : isCompleted ? 'var(--text-primary)' : 'var(--text-muted)'
                  }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            MULTI-STEP FORM CARDS
            =================================================== */}
        <div className="ace-card" style={{ padding: '32px' }}>
          {/* STEP 1: SENDER */}
          {currentStep === 1 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <User size={20} color="var(--color-primary-blue)" />
                <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)' }}>Step 1: Shipper Information (Sender)</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Full Contact Name</label>
                  <input
                    type="text"
                    className="ace-input"
                    value={formData.senderName}
                    onChange={(e) => updateField('senderName', e.target.value)}
                    placeholder="e.g. Kwame Mensah"
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Company Name</label>
                  <input
                    type="text"
                    className="ace-input"
                    value={formData.senderCompany}
                    onChange={(e) => updateField('senderCompany', e.target.value)}
                    placeholder="e.g. Gold Coast Trading Ltd"
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Email Address</label>
                  <input
                    type="email"
                    className="ace-input"
                    value={formData.senderEmail}
                    onChange={(e) => updateField('senderEmail', e.target.value)}
                    placeholder="name@company.com"
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Phone Number</label>
                  <input
                    type="tel"
                    className="ace-input"
                    value={formData.senderPhone}
                    onChange={(e) => updateField('senderPhone', e.target.value)}
                    placeholder="+233 24 555 0192"
                    required
                  />
                </div>

                <div className="ace-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="ace-label ace-label-required">Street Address</label>
                  <input
                    type="text"
                    className="ace-input"
                    value={formData.senderAddress}
                    onChange={(e) => updateField('senderAddress', e.target.value)}
                    placeholder="Plot 14, Industrial Area, Ring Road Central"
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Country (Shipper)</label>
                  <select
                    className="ace-select"
                    value={formData.senderCountry}
                    onChange={handleSenderCountryChange}
                    required
                  >
                    <option value="" disabled>Select Country</option>
                    {COUNTRY_LIST.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div className="ace-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="ace-label ace-label-required">City (Shipper)</label>
                    {isCustomSenderCity && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomSenderCity(false);
                          if (senderCities.length > 0) updateField('senderCity', senderCities[0]);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-bright-action)', fontSize: '11.5px', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Choose from list
                      </button>
                    )}
                  </div>
                  {isCustomSenderCity ? (
                    <input
                      type="text"
                      className="ace-input"
                      value={formData.senderCity}
                      onChange={(e) => updateField('senderCity', e.target.value)}
                      placeholder="Type custom city name"
                      autoFocus
                      required
                    />
                  ) : (
                    <select
                      className="ace-select"
                      value={formData.senderCity}
                      onChange={handleSenderCityChange}
                      required
                    >
                      <option value="" disabled>Select City</option>
                      {currentSenderCityList.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                      <option value="__custom__">+ Other / Unlisted City...</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: RECEIVER */}
          {currentStep === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <MapPin size={20} color="var(--color-primary-blue)" />
                <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)' }}>Step 2: Consignee Information (Receiver)</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Recipient Name</label>
                  <input
                    type="text"
                    className="ace-input"
                    value={formData.receiverName}
                    onChange={(e) => updateField('receiverName', e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label">Company Name</label>
                  <input
                    type="text"
                    className="ace-input"
                    value={formData.receiverCompany}
                    onChange={(e) => updateField('receiverCompany', e.target.value)}
                    placeholder="e.g. Vance Global Ltd"
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Email Address</label>
                  <input
                    type="email"
                    className="ace-input"
                    value={formData.receiverEmail}
                    onChange={(e) => updateField('receiverEmail', e.target.value)}
                    placeholder="recipient@domain.com"
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Phone Number</label>
                  <input
                    type="tel"
                    className="ace-input"
                    value={formData.receiverPhone}
                    onChange={(e) => updateField('receiverPhone', e.target.value)}
                    placeholder="+44 20 7946 0912"
                    required
                  />
                </div>

                <div className="ace-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="ace-label ace-label-required">Delivery Street Address</label>
                  <input
                    type="text"
                    className="ace-input"
                    value={formData.receiverAddress}
                    onChange={(e) => updateField('receiverAddress', e.target.value)}
                    placeholder="24 Bishopsgate, Floor 18"
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Destination Country</label>
                  <select
                    className="ace-select"
                    value={formData.receiverCountry}
                    onChange={handleReceiverCountryChange}
                    required
                  >
                    <option value="" disabled>Select Country</option>
                    {COUNTRY_LIST.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                <div className="ace-form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="ace-label ace-label-required">Destination City</label>
                    {isCustomReceiverCity && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomReceiverCity(false);
                          if (receiverCities.length > 0) updateField('receiverCity', receiverCities[0]);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-bright-action)', fontSize: '11.5px', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Choose from list
                      </button>
                    )}
                  </div>
                  {isCustomReceiverCity ? (
                    <input
                      type="text"
                      className="ace-input"
                      value={formData.receiverCity}
                      onChange={(e) => updateField('receiverCity', e.target.value)}
                      placeholder="Type custom destination city"
                      autoFocus
                      required
                    />
                  ) : (
                    <select
                      className="ace-select"
                      value={formData.receiverCity}
                      onChange={handleReceiverCityChange}
                      required
                    >
                      <option value="" disabled>Select City</option>
                      {currentReceiverCityList.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                      <option value="__custom__">+ Other / Unlisted City...</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PACKAGE DETAILS */}
          {currentStep === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <Package size={20} color="var(--color-primary-blue)" />
                <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)' }}>Step 3: Package & Cargo Specifications</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div className="ace-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="ace-label ace-label-required">Cargo Description</label>
                  <input
                    type="text"
                    className="ace-input"
                    value={formData.packageType}
                    onChange={(e) => updateField('packageType', e.target.value)}
                    placeholder="e.g. High-Value Electronic Sensors, Precision Tooling"
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Gross Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="ace-input"
                    value={formData.weightKg}
                    onChange={(e) => updateField('weightKg', e.target.value)}
                    placeholder="42.5"
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Pieces / Packages</label>
                  <input
                    type="number"
                    className="ace-input"
                    value={formData.pieces}
                    onChange={(e) => updateField('pieces', e.target.value)}
                    placeholder="3"
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Length (cm)</label>
                  <input
                    type="number"
                    className="ace-input"
                    value={formData.lengthCm}
                    onChange={(e) => updateField('lengthCm', e.target.value)}
                    placeholder="60"
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Width (cm)</label>
                  <input
                    type="number"
                    className="ace-input"
                    value={formData.widthCm}
                    onChange={(e) => updateField('widthCm', e.target.value)}
                    placeholder="45"
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Height (cm)</label>
                  <input
                    type="number"
                    className="ace-input"
                    value={formData.heightCm}
                    onChange={(e) => updateField('heightCm', e.target.value)}
                    placeholder="40"
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Declared Customs Value (USD)</label>
                  <input
                    type="number"
                    className="ace-input"
                    value={formData.declaredValue}
                    onChange={(e) => updateField('declaredValue', e.target.value)}
                    placeholder="12450"
                  />
                </div>

                <div className="ace-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={formData.insurance}
                      onChange={(e) => updateField('insurance', e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: 'var(--color-bright-action)' }}
                    />
                    <span>Include ACE Comprehensive All-Risk Cargo Insurance (Recommended)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: SHIPPING METHOD */}
          {currentStep === 4 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <Truck size={20} color="var(--color-primary-blue)" />
                <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)' }}>Step 4: Select Freight Service Tier</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                {[
                  {
                    title: "Air Freight Priority",
                    desc: "Express flight dispatch with guaranteed 2–4 business days delivery.",
                    icon: Plane,
                    rate: "$485.00 Est."
                  },
                  {
                    title: "Ocean Container Freight",
                    desc: "Economical maritime shipping for heavier tonnage, 14–22 days transit.",
                    icon: Ship,
                    rate: "$210.00 Est."
                  },
                  {
                    title: "Ground Express Fleet",
                    desc: "Dedicated interstate road haulage with direct GPS tracking.",
                    icon: Truck,
                    rate: "$320.00 Est."
                  },
                  {
                    title: "Rail Intermodal Express",
                    desc: "Eco-friendly continental rail freight network.",
                    icon: Train,
                    rate: "$280.00 Est."
                  }
                ].map((tier, idx) => {
                  const isSelected = formData.shippingMethod === tier.title;
                  const Icon = tier.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => updateField('shippingMethod', tier.title)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderRadius: '10px',
                        border: `2px solid ${isSelected ? 'var(--color-bright-action)' : 'var(--color-border)'}`,
                        backgroundColor: isSelected ? 'var(--color-light-blue)' : 'var(--color-white)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'var(--color-primary-blue)' : 'var(--color-light-blue)',
                          color: isSelected ? '#FFFFFF' : 'var(--color-primary-blue)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-primary-blue)' }}>{tier.title}</div>
                          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{tier.desc}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: 'var(--color-primary-blue)', fontSize: '15px' }}>{tier.rate}</div>
                        <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>Space Reserved</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="ace-form-group">
                <label className="ace-label">Handling & Courier Instructions</label>
                <textarea
                  rows="3"
                  className="ace-textarea"
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="e.g. Fragile, temperature sensitive, do not stack..."
                />
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & CONFIRM */}
          {currentStep === 5 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <ShieldCheck size={20} color="var(--color-primary-blue)" />
                <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)' }}>Step 5: Review Consignment & Confirm</h3>
              </div>

              {/* Review Summary Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                {/* Shipper */}
                <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-primary-blue)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Origin (Shipper)
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{formData.senderName}</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{formData.senderCompany}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formData.senderCity}, {formData.senderCountry}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formData.senderPhone}</div>
                </div>

                {/* Consignee */}
                <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-primary-blue)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Destination (Consignee)
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{formData.receiverName}</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{formData.receiverCompany}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formData.receiverCity}, {formData.receiverCountry}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{formData.receiverPhone}</div>
                </div>

                {/* Package Spec */}
                <div style={{ backgroundColor: 'var(--color-very-light-blue)', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-primary-blue)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Cargo Specs & Service
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{formData.packageType}</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{formData.weightKg} kg • {formData.lengthCm}×{formData.widthCm}×{formData.heightCm} cm</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-bright-action)', fontWeight: 600 }}>{formData.shippingMethod}</div>
                  <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>Declared: ${formData.declaredValue} USD</div>
                </div>
              </div>

              {/* Price Calculation Card */}
              <div style={{ backgroundColor: 'var(--color-light-blue)', borderRadius: '10px', padding: '18px 20px', marginBottom: '24px', border: '1px solid #cce3f3' }}>
                <h4 style={{ fontSize: '15px', color: 'var(--color-primary-blue)', marginBottom: '12px', fontWeight: 700 }}>
                  Itemized Freight Estimate
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Base Freight Rate:</span>
                  <span style={{ fontWeight: 600 }}>${cost.freight}.00 USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Fuel & Environmental Surcharge:</span>
                  <span style={{ fontWeight: 600 }}>${cost.fuel}.00 USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Terminal Handling & Customs:</span>
                  <span style={{ fontWeight: 600 }}>${cost.customs}.00 USD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-blue)', borderTop: '1px solid #bddcee', paddingTop: '10px' }}>
                  <span>Total Calculated Shipping Cost:</span>
                  <span>${cost.total}.00 USD</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="ace-btn ace-btn-secondary"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="ace-btn ace-btn-ghost"
              >
                <span>Cancel</span>
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ace-btn ace-btn-action"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmShipment}
                disabled={isSubmitting}
                className="ace-btn ace-btn-action ace-btn-lg"
              >
                <span>{isSubmitting ? 'Creating Shipment...' : 'Confirm Shipment'}</span>
                <Check size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
