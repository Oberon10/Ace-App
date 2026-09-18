import React, { useState, useEffect } from 'react';
import { KNOWN_ACCOUNTS } from '../data/shipments';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Truck,
  Building2,
  KeyRound,
  ShieldAlert,
  Package
} from 'lucide-react';

export default function LoginView({ 
  onLoginSuccess, 
  setView, 
  initialPortal = 'customer',
  authNotice = ''
}) {
  const [selectedPortal, setSelectedPortal] = useState(initialPortal); // 'customer', 'staff', 'admin'
  const [isRegister, setIsRegister] = useState(false);

  // Sync if initialPortal prop changes
  useEffect(() => {
    if (initialPortal) {
      setSelectedPortal(initialPortal);
      setIsRegister(false);
    }
  }, [initialPortal]);

  // Login Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Staff specific fields
  const [staffStation, setStaffStation] = useState('ACC-T1 (Accra Central Air Hub)');

  // Admin specific fields
  const [adminToken, setAdminToken] = useState('ACE-SEC-2026');

  // Signup Fields (Customer only)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Auto-fill sensible default email placeholders when switching portal tabs
  useEffect(() => {
    if (selectedPortal === 'customer') {
      setLoginEmail('k.mensah@goldcoasttrading.com');
      setLoginPassword('KwameTrading#Accra24');
    } else if (selectedPortal === 'staff') {
      setLoginEmail('s.oconnor@acelogistics.com');
      setLoginPassword('StaffDispatchKey@99');
    } else if (selectedPortal === 'admin') {
      setLoginEmail('d.sterling@acelogistics.com');
      setLoginPassword('AdminSecurePass#2026');
    }
  }, [selectedPortal]);

  const handlePortalSwitch = (portal) => {
    setSelectedPortal(portal);
    setIsRegister(false);
    setPasswordError('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = (loginEmail || '').trim().toLowerCase();

    // Check against known accounts for exact user profile
    const matchedAccount = KNOWN_ACCOUNTS.find(a => a.email.toLowerCase() === cleanEmail);
    if (matchedAccount) {
      onLoginSuccess(matchedAccount.role, { ...matchedAccount });
      return;
    }

    // Unlisted user login: derive role based on active portal tab
    const role = selectedPortal;
    const prefix = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const capitalizedName = prefix.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 
      (role === 'admin' ? 'System Administrator' : role === 'staff' ? 'Terminal Officer' : 'Authorized Customer');

    onLoginSuccess(role, { 
      name: capitalizedName, 
      email: loginEmail.trim(), 
      company: role === 'customer' ? `${capitalizedName}'s Commercial Account` : 'ACE Global Logistics Network',
      role 
    });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please ensure both passwords match.');
      return;
    }
    setPasswordError('');

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'New Customer';
    onLoginSuccess('customer', { 
      name: fullName, 
      email: signupEmail.trim(), 
      phone: phoneNumber.trim(),
      company: `${fullName}'s Trading Co`,
      role: 'customer' 
    });
  };

  return (
    <div style={{ backgroundColor: 'var(--color-very-light-blue)', minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{
        maxWidth: '1040px',
        width: '100%',
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-section)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr'
      }} className="auth-split">
        {/* ===================================================
            LEFT SIDE: LOGISTICS BRANDING & SECURITY NOTICE
            =================================================== */}
        <div className="auth-info-pane" style={{
          position: 'relative',
          backgroundImage: 'url(/images/truck-freight.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#FFFFFF',
          padding: '48px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Dark Navy Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(7, 20, 34, 0.95) 0%, rgba(11, 79, 124, 0.88) 100%)'
          }} />

          {/* Brand header */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-bright-action)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
                  <path d="M14 44L28 16H36L50 44H41L38 37H26L23 44H14ZM29 30H35L32 23L29 30Z" fill="#FFFFFF"/>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  ACE <span style={{ color: '#38BDF8' }}>LOGISTICS</span>
                </span>
                <div style={{ fontSize: '11px', color: '#90CDF4', fontWeight: 600, letterSpacing: '0.1em' }}>
                  GLOBAL FREIGHT PORTAL
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.25, marginBottom: '14px' }}>
              Multi-Console Enterprise Access
            </h2>
            <p style={{ color: '#D9E7F0', fontSize: '13.5px', lineHeight: 1.6 }}>
              Select your authorized portal to access live tracking, dispatcher scheduling, or executive system administration.
            </p>
          </div>

          {/* Role Access Matrix Info on Left */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px', borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <User size={16} color="#38BDF8" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#FFFFFF' }}>Customer Portal:</strong>
                <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11.5px' }}>Strictly isolated records for personal bookings and deliveries.</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Truck size={16} color="#38BDF8" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#FFFFFF' }}>Staff Dispatcher:</strong>
                <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11.5px' }}>Terminal intake, manifest queue & consignment status manager only.</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Shield size={16} color="#FBBF24" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#FBBF24' }}>Executive Admin:</strong>
                <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11.5px' }}>Sole authority to view staff & customer login details and full analytics.</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE: AUTH CARD (PORTAL SELECTOR + FORM)
            =================================================== */}
        <div className="auth-card-body" style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          {/* Top 3-Way Portal Selector: Customer, Staff, Admin */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.06em' }}>
              Select Login Portal:
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '6px',
              backgroundColor: 'var(--color-very-light-blue)',
              padding: '5px',
              borderRadius: '10px',
              border: '1px solid var(--color-border)'
            }}>
              {/* 1. Customer Login */}
              <button
                type="button"
                onClick={() => handlePortalSwitch('customer')}
                style={{
                  padding: '9px 6px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: selectedPortal === 'customer' ? 'var(--color-white)' : 'transparent',
                  color: selectedPortal === 'customer' ? 'var(--color-primary-blue)' : 'var(--text-secondary)',
                  fontWeight: selectedPortal === 'customer' ? 700 : 500,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: selectedPortal === 'customer' ? 'var(--shadow-subtle)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <User size={15} color={selectedPortal === 'customer' ? 'var(--color-bright-action)' : 'currentColor'} />
                <span>Customer</span>
              </button>

              {/* 2. Staff Login */}
              <button
                type="button"
                onClick={() => handlePortalSwitch('staff')}
                style={{
                  padding: '9px 6px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: selectedPortal === 'staff' ? 'var(--color-white)' : 'transparent',
                  color: selectedPortal === 'staff' ? '#0D9488' : 'var(--text-secondary)',
                  fontWeight: selectedPortal === 'staff' ? 700 : 500,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: selectedPortal === 'staff' ? 'var(--shadow-subtle)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Truck size={15} color={selectedPortal === 'staff' ? '#0D9488' : 'currentColor'} />
                <span>Staff</span>
              </button>

              {/* 3. Admin Login */}
              <button
                type="button"
                onClick={() => handlePortalSwitch('admin')}
                style={{
                  padding: '9px 6px',
                  borderRadius: '7px',
                  border: 'none',
                  backgroundColor: selectedPortal === 'admin' ? 'var(--color-white)' : 'transparent',
                  color: selectedPortal === 'admin' ? 'var(--color-primary-blue)' : 'var(--text-secondary)',
                  fontWeight: selectedPortal === 'admin' ? 700 : 500,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: selectedPortal === 'admin' ? 'var(--shadow-subtle)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Shield size={15} color={selectedPortal === 'admin' ? '#F59E0B' : 'currentColor'} />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Heading & Contextual Subtitle based on Portal */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '22px', color: 'var(--color-primary-blue)', fontWeight: 800 }}>
                {isRegister ? 'Create Customer Account' : 
                 selectedPortal === 'customer' ? 'Customer Portal Login' :
                 selectedPortal === 'staff' ? 'Staff Dispatcher Login' : 'Admin Console Login'}
              </h3>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: '10px',
                backgroundColor: selectedPortal === 'customer' ? 'var(--color-light-blue)' :
                                 selectedPortal === 'staff' ? '#CCFBF1' : '#FEF3C7',
                color: selectedPortal === 'customer' ? 'var(--color-primary-blue)' :
                       selectedPortal === 'staff' ? '#0F766E' : '#B45309'
              }}>
                {selectedPortal} Mode
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {isRegister 
                ? 'Fill in your details below to set up your personal cargo account.'
                : selectedPortal === 'customer'
                ? 'Sign in to access your personal shipments and tracking telemetry.'
                : selectedPortal === 'staff'
                ? 'Authorized terminal staff only. Access intake and manifest manager.'
                : 'Executive clearance only. Authorized to view staff and customer login details.'}
            </p>
          </div>

          {/* Action Requirement Notice (e.g. redirected when clicking Send A Package) */}
          {authNotice && (
            <div style={{
              backgroundColor: 'rgba(2, 132, 199, 0.08)',
              border: '1px solid rgba(2, 132, 199, 0.35)',
              borderRadius: '8px',
              padding: '11px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Package size={19} color="var(--color-bright-action)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12.5px', color: 'var(--color-primary-blue)', fontWeight: 600, lineHeight: 1.45 }}>
                {authNotice}
              </span>
            </div>
          )}

          {/* Security Notice for Staff & Admin */}
          {selectedPortal === 'staff' && (
            <div style={{
              backgroundColor: 'var(--color-very-light-blue)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Lock size={15} color="#0D9488" style={{ flexShrink: 0 }} />
              <span>Staff authorization is restricted to Dispatcher Console & Customer Portal only. Administrative controls are locked.</span>
            </div>
          )}

          {selectedPortal === 'admin' && (
            <div style={{
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '11.5px',
              color: 'var(--text-primary)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <ShieldAlert size={15} color="#F59E0B" style={{ flexShrink: 0 }} />
              <span><strong>Administrative Privilege:</strong> You have exclusive permission to inspect staff credentials and customer login records.</span>
            </div>
          )}

          {/* Password Error Alert */}
          {passwordError && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
              <span>{passwordError}</span>
            </div>
          )}

          {/* ===================================================
              CUSTOMER SIGNUP FORM
              =================================================== */}
          {isRegister ? (
            <form onSubmit={handleSignupSubmit}>
              {/* Row 1: First Name & Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">First Name</label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon">
                      <User size={15} />
                    </div>
                    <input
                      type="text"
                      className="ace-input ace-input-with-icon"
                      placeholder="e.g. Kwame"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Last Name</label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon">
                      <User size={15} />
                    </div>
                    <input
                      type="text"
                      className="ace-input ace-input-with-icon"
                      placeholder="e.g. Mensah"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email Address */}
              <div className="ace-form-group">
                <label className="ace-label ace-label-required">Email Address</label>
                <div className="ace-input-wrapper">
                  <div className="ace-input-icon">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    className="ace-input ace-input-with-icon"
                    placeholder="k.mensah@goldcoasttrading.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 3: Phone Number */}
              <div className="ace-form-group">
                <label className="ace-label ace-label-required">Phone Number</label>
                <div className="ace-input-wrapper">
                  <div className="ace-input-icon">
                    <Phone size={15} />
                  </div>
                  <input
                    type="tel"
                    className="ace-input ace-input-with-icon"
                    placeholder="+233 24 555 0192"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Row 4: Password with Eye toggle */}
              <div className="ace-form-group">
                <label className="ace-label ace-label-required">Password</label>
                <div className="ace-input-wrapper">
                  <div className="ace-input-icon">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    className="ace-input ace-input-with-icon"
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    style={{ paddingRight: '40px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                    title={showSignupPassword ? 'Hide password' : 'View password'}
                  >
                    {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Row 5: Confirm Password with Eye toggle */}
              <div className="ace-form-group">
                <label className="ace-label ace-label-required">Confirm Password</label>
                <div className="ace-input-wrapper">
                  <div className="ace-input-icon">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="ace-input ace-input-with-icon"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ paddingRight: '40px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                    title={showConfirmPassword ? 'Hide password' : 'View password'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="ace-btn ace-btn-action"
                style={{ width: '100%', height: '46px', fontSize: '15px', marginTop: '8px', marginBottom: '16px' }}
              >
                <span>Create Customer Account</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* ===================================================
                AUTHENTICATION LOGIN FORM (Customer, Staff, or Admin)
                =================================================== */
            <form onSubmit={handleLoginSubmit}>
              {/* Email Address */}
              <div className="ace-form-group">
                <label className="ace-label ace-label-required">
                  {selectedPortal === 'admin' ? 'Administrator Corporate Email' :
                   selectedPortal === 'staff' ? 'Staff Dispatcher Email' : 'Customer Account Email'}
                </label>
                <div className="ace-input-wrapper">
                  <div className="ace-input-icon">
                    <Mail size={15} />
                  </div>
                  <input
                    type="email"
                    className="ace-input ace-input-with-icon"
                    placeholder={
                      selectedPortal === 'admin' ? 'd.sterling@acelogistics.com' :
                      selectedPortal === 'staff' ? 's.oconnor@acelogistics.com' : 'name@company.com'
                    }
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password with Eye view/hide toggle */}
              <div className="ace-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="ace-label ace-label-required">
                    {selectedPortal === 'admin' ? 'Administrative Passkey' :
                     selectedPortal === 'staff' ? 'Staff Security Password' : 'Password'}
                  </label>
                  {selectedPortal === 'customer' && (
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--color-bright-action)', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="ace-input-wrapper">
                  <div className="ace-input-icon">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    className="ace-input ace-input-with-icon"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ paddingRight: '40px' }}
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                    title={showLoginPassword ? 'Hide password' : 'View password'}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Staff specific terminal hub selector */}
              {selectedPortal === 'staff' && (
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Operating Station / Terminal</label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon">
                      <Building2 size={15} />
                    </div>
                    <select
                      className="ace-select"
                      style={{ paddingLeft: '38px' }}
                      value={staffStation}
                      onChange={(e) => setStaffStation(e.target.value)}
                    >
                      <option value="ACC-T1 (Accra Central Air Hub)">ACC-T1 (Accra Central Air Cargo Hub)</option>
                      <option value="LHR-T4 (Heathrow Cargo Village)">LHR-T4 (Heathrow Cargo Village, London)</option>
                      <option value="RTM-P2 (Rotterdam Maritime Port)">RTM-P2 (Rotterdam Deep-Water Terminal)</option>
                      <option value="JFK-C7 (New York Intermodal)">JFK-C7 (JFK Intermodal Air Terminal)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Admin specific security key */}
              {selectedPortal === 'admin' && (
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Hardware Security Token / Key</label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon">
                      <KeyRound size={15} />
                    </div>
                    <input
                      type="text"
                      className="ace-input ace-input-with-icon"
                      value={adminToken}
                      onChange={(e) => setAdminToken(e.target.value)}
                      placeholder="ACE-SEC-2026"
                      required
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--color-bright-action)' }}
                />
                <label htmlFor="rememberMe" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Remember this workstation for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="ace-btn"
                style={{
                  width: '100%',
                  height: '46px',
                  fontSize: '15px',
                  marginBottom: '16px',
                  backgroundColor: selectedPortal === 'staff' ? '#0D9488' : 'var(--color-primary-blue)',
                  color: '#FFFFFF',
                  borderColor: selectedPortal === 'staff' ? '#0D9488' : 'var(--color-primary-blue)'
                }}
              >
                <span>
                  {selectedPortal === 'customer' ? 'Sign In to Customer Portal' :
                   selectedPortal === 'staff' ? 'Authenticate Staff Dispatcher' : 'Sign In as Administrator'}
                </span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Customer Registration Toggle (Only displayed for Customer portal) */}
          {selectedPortal === 'customer' && (
            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {isRegister ? (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(false); setPasswordError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-bright-action)', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Customer Sign In
                  </button>
                </span>
              ) : (
                <span>
                  New customer?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(true); setPasswordError(''); }}
                    style={{ background: 'none', border: 'none', color: 'var(--color-bright-action)', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Create Customer Account
                  </button>
                </span>
              )}
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .auth-split {
            grid-template-columns: 1fr !important;
          }
          .auth-info-pane {
            padding: 28px 20px !important;
          }
          .auth-card-body {
            padding: 24px 18px !important;
          }
        }
        @media (max-width: 480px) {
          .auth-info-pane {
            padding: 20px 14px !important;
          }
          .auth-card-body {
            padding: 20px 14px !important;
          }
        }
      `}</style>
    </div>
  );
}
