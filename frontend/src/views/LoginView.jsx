import React, { useState, useEffect } from 'react';
import { KNOWN_ACCOUNTS, USERS_LIST } from '../data/shipments';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft,
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
  Package,
  Globe2,
  X,
  Loader2,
  Sun,
  Moon,
  Sparkles,
  Layers,
  Send
} from 'lucide-react';
import { syncCustomerToSupabase, supabase } from '../lib/supabase';

// Helper to retrieve all registered customers (merging pre-configured accounts with localStorage)
export function getRegisteredCustomers() {
  let stored = [];
  try {
    const raw = localStorage.getItem('ace_registered_customers');
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse ace_registered_customers from storage', err);
  }

  // Pre-configured registered customer accounts
  const defaultCustomers = [
    ...KNOWN_ACCOUNTS.filter(a => a.role === 'customer'),
    ...USERS_LIST.filter(u => u.role?.toLowerCase() === 'customer').map(u => ({
      name: u.name,
      email: u.email,
      loginPassword: u.loginPassword,
      company: u.department || `${u.name}'s Enterprise`,
      phone: u.phone,
      role: 'customer'
    }))
  ];

  // Map by email for deduplication
  const customerMap = new Map();
  defaultCustomers.forEach(c => {
    if (c.email) {
      customerMap.set(c.email.trim().toLowerCase(), c);
    }
  });

  // Stored customer registrations override or append
  stored.forEach(c => {
    if (c.email) {
      customerMap.set(c.email.trim().toLowerCase(), c);
    }
  });

  return Array.from(customerMap.values());
}

export function saveRegisteredCustomer(newCustomer) {
  try {
    const raw = localStorage.getItem('ace_registered_customers');
    const list = raw ? JSON.parse(raw) : [];
    const filtered = list.filter(c => c.email?.trim().toLowerCase() !== newCustomer.email?.trim().toLowerCase());
    filtered.push(newCustomer);
    localStorage.setItem('ace_registered_customers', JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to save customer to localStorage', err);
  }
}

// Helper to retrieve all admin-registered staff members (merging pre-configured accounts with localStorage)
export function getRegisteredStaff() {
  let stored = [];
  try {
    const raw = localStorage.getItem('ace_registered_staff');
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse ace_registered_staff from storage', err);
  }

  // Pre-configured staff accounts registered in the system
  const defaultStaff = [
    ...KNOWN_ACCOUNTS.filter(a => a.role === 'staff'),
    ...USERS_LIST.filter(u => u.role?.toLowerCase() === 'staff').map(u => ({
      name: u.name,
      email: u.email,
      loginPassword: u.loginPassword,
      department: u.department || 'Terminal Operations',
      phone: u.phone,
      status: u.status || 'Active',
      role: 'staff'
    }))
  ];

  // Map by email for deduplication
  const staffMap = new Map();
  defaultStaff.forEach(s => {
    if (s.email) {
      staffMap.set(s.email.trim().toLowerCase(), s);
    }
  });

  // Stored staff registrations (e.g. added by Admin in User Management) override or append
  stored.forEach(s => {
    if (s.email) {
      staffMap.set(s.email.trim().toLowerCase(), s);
    }
  });

  return Array.from(staffMap.values());
}

export function saveRegisteredStaff(newStaff) {
  try {
    const raw = localStorage.getItem('ace_registered_staff');
    const list = raw ? JSON.parse(raw) : [];
    const filtered = list.filter(s => s.email?.trim().toLowerCase() !== newStaff.email?.trim().toLowerCase());
    filtered.push(newStaff);
    localStorage.setItem('ace_registered_staff', JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to save staff to localStorage', err);
  }
}

export default function LoginView({ 
  onLoginSuccess, 
  setView, 
  initialPortal = 'customer',
  authNotice = '',
  theme = 'light',
  toggleTheme
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

  // Login Fields - customer & staff inputs start blank or from saved remember-me
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Load remembered email on mount
  useEffect(() => {
    const saved = localStorage.getItem('ace_remembered_email');
    if (saved && selectedPortal === 'customer') {
      setLoginEmail(saved);
      setRememberMe(true);
    }
  }, [selectedPortal]);

  // Staff specific fields
  const [staffStation, setStaffStation] = useState('ACC-T1 (Accra Central Air Hub)');

  // Admin specific fields
  const [adminToken, setAdminToken] = useState('ACE-SEC-2026');

  // Signup Fields (Customer only)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [country, setCountry] = useState('Ghana');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [items, setItems] = useState('General Commercial Merchandise');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Social Auth SSO Modal State
  const [socialModal, setSocialModal] = useState(null); // null | { provider: 'Google'|'Apple', mode: 'login'|'register' }
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);

  // Illustration selection (Default is user's uploaded warehouse photo)
  const [activeIllustration, setActiveIllustration] = useState('uploaded'); // 'uploaded' | 'air-cargo' | 'fleet'

  const illustrations = {
    'uploaded': {
      label: 'Warehouse Ground Dispatch',
      badge: 'Operational Facility • Warehouse Hub',
      src: '/images/auth-warehouse-worker.jpg',
      tagline: 'Track. Manage. Deliver.',
      caption: 'Real-time cargo telemetry and automated warehouse dispatch across 140+ global destinations.'
    },
    'air-cargo': {
      label: 'Air Cargo Terminal',
      badge: 'Intermodal Freight Hub',
      src: '/images/air-cargo.jpg',
      tagline: 'Track. Manage. Deliver.',
      caption: 'Direct global airport connections, express courier routing, and priority airspace slots.'
    },
    'fleet': {
      label: 'Continental Freight Fleet',
      badge: 'Long-Haul Logistics Network',
      src: '/images/truck-freight.jpg',
      tagline: 'Track. Manage. Deliver.',
      caption: 'High-capacity intermodal linehaul fleet with continuous GPS monitoring and secure cargo locks.'
    }
  };

  const currentIllustration = illustrations[activeIllustration] || illustrations['uploaded'];

  // Auto-fill sensible default credentials only for Admin demo console; Customer and Staff portals start blank
  useEffect(() => {
    if (selectedPortal === 'customer') {
      const saved = localStorage.getItem('ace_remembered_email');
      setLoginEmail(saved || '');
      setLoginPassword('');
    } else if (selectedPortal === 'staff') {
      setLoginEmail('');
      setLoginPassword('');
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = (loginEmail || '').trim().toLowerCase();
    const cleanPassword = (loginPassword || '').trim();

    if (!cleanEmail) {
      setPasswordError('Please enter your email address.');
      return;
    }

    if (!cleanPassword) {
      setPasswordError('Please enter your password.');
      return;
    }

    // Handle Remember Me storage
    if (rememberMe) {
      localStorage.setItem('ace_remembered_email', cleanEmail);
    } else {
      localStorage.removeItem('ace_remembered_email');
    }

    // STRICT CUSTOMER VERIFICATION: Only registered customers can log in
    if (selectedPortal === 'customer') {
      const registeredCustomers = getRegisteredCustomers();
      let matchedCustomer = registeredCustomers.find(c => c.email?.trim().toLowerCase() === cleanEmail);

      // If not found in local cache, query Supabase database
      if (!matchedCustomer) {
        try {
          const { data, error } = await supabase
            .from('customers')
            .select('*')
            .or(`email_address.eq.${cleanEmail},"email address".eq.${cleanEmail}`);

          if (!error && data && data.length > 0) {
            const dbCust = data[0];
            matchedCustomer = {
              id: dbCust.id,
              supabaseId: dbCust.id,
              name: `${dbCust.first_name || dbCust['first name'] || ''} ${dbCust.last_name || dbCust['last name'] || ''}`.trim() || 'Customer',
              firstName: dbCust.first_name || dbCust['first name'],
              lastName: dbCust.last_name || dbCust['last name'],
              email: dbCust.email_address || dbCust['email address'],
              loginPassword: dbCust.password,
              country: dbCust.country || 'Ghana',
              phone: dbCust.phone_number || dbCust['phone number'],
              items: dbCust.items || 'General Cargo',
              company: `${dbCust.first_name || 'Customer'}'s Enterprise`,
              role: 'customer',
              syncedToSupabase: true
            };
            saveRegisteredCustomer(matchedCustomer);
          }
        } catch (err) {
          console.warn('Supabase customer login lookup warning:', err);
        }
      }

      if (!matchedCustomer) {
        setPasswordError('Account not found. Only registered customers can log in. Please create an account or verify your email.');
        return;
      }

      if (matchedCustomer.loginPassword && matchedCustomer.loginPassword !== cleanPassword) {
        setPasswordError('Incorrect password. Please verify your credentials and try again.');
        return;
      }

      onLoginSuccess('customer', matchedCustomer);
      return;
    }

    // STRICT STAFF VERIFICATION: Only staff members registered by the system/admin can log in
    if (selectedPortal === 'staff') {
      const registeredStaff = getRegisteredStaff();
      const matchedStaff = registeredStaff.find(s => s.email?.trim().toLowerCase() === cleanEmail);

      if (!matchedStaff) {
        setPasswordError('Access Denied: Unrecognized staff account. Only authorized operations personnel registered by an Administrator can access the Dispatch Console.');
        return;
      }

      if (matchedStaff.loginPassword && matchedStaff.loginPassword !== cleanPassword) {
        setPasswordError('Incorrect password. Please enter the operational passkey assigned to your staff profile.');
        return;
      }

      onLoginSuccess('staff', {
        ...matchedStaff,
        station: staffStation
      });
      return;
    }

    // ADMIN VERIFICATION: Pre-authorized system administrator
    if (selectedPortal === 'admin') {
      if (cleanEmail !== 'd.sterling@acelogistics.com') {
        setPasswordError('Unauthorized Administrator Email. Only authorized executives may access the Executive Admin Console.');
        return;
      }

      if (cleanPassword !== 'AdminSecurePass#2026') {
        setPasswordError('Incorrect Administrator Passkey. Access rejected.');
        return;
      }

      if (adminToken.trim() !== 'ACE-SEC-2026') {
        setPasswordError('Invalid Hardware Security Token. Security clearance failed.');
        return;
      }

      onLoginSuccess('admin', {
        name: 'Derek Sterling',
        email: 'd.sterling@acelogistics.com',
        role: 'admin',
        title: 'Executive Vice President of Operations',
        clearanceLevel: 'Level 5 (Full Authority)'
      });
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (signupPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsSubmitting(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const cleanEmail = signupEmail.trim().toLowerCase();

    // Sync to Supabase Cloud Database
    const syncResult = await syncCustomerToSupabase({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailAddress: cleanEmail,
      country,
      phoneNumber: phoneNumber.trim(),
      password: signupPassword,
      items: items.trim()
    });

    const newCustomer = {
      id: syncResult.data?.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      supabaseId: syncResult.data?.id,
      name: fullName,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail,
      loginPassword: signupPassword,
      company: `${firstName.trim()}'s Commercial Enterprise`,
      country,
      phone: phoneNumber.trim(),
      items: items.trim(),
      role: 'customer',
      status: 'Active',
      registeredAt: new Date().toISOString(),
      syncedToSupabase: syncResult.success
    };

    saveRegisteredCustomer(newCustomer);

    if (rememberMe) {
      localStorage.setItem('ace_remembered_email', cleanEmail);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess('customer', newCustomer);
    }, 400);
  };

  const openSocialAuth = (provider) => {
    let defaultName = 'Enterprise Customer';
    let defaultEmail = provider === 'Google' ? 'customer@gmail.com' : 'customer@icloud.com';

    if (isRegister) {
      if (firstName || lastName) {
        defaultName = `${firstName} ${lastName}`.trim();
      }
      if (signupEmail) {
        defaultEmail = signupEmail;
      }
    } else if (loginEmail) {
      defaultEmail = loginEmail;
    }

    setSocialName(defaultName);
    setSocialEmail(defaultEmail);
    setSocialModal({
      provider,
      mode: isRegister ? 'register' : 'login'
    });
    setPasswordError('');
  };

  const handleCompleteSocialAuth = async () => {
    if (!socialModal) return;
    setSocialLoading(true);
    const { provider } = socialModal;
    const cleanEmail = (socialEmail || (provider === 'Google' ? 'customer@gmail.com' : 'customer@icloud.com')).trim().toLowerCase();
    const cleanName = (socialName || `${provider} Customer`).trim();
    const nameParts = cleanName.split(' ');
    const fName = nameParts[0] || provider;
    const lName = nameParts.slice(1).join(' ') || 'Customer';

    const registeredCustomers = getRegisteredCustomers();
    let existingCust = registeredCustomers.find(c => c.email?.trim().toLowerCase() === cleanEmail);

    let customerObj;
    if (existingCust) {
      customerObj = {
        ...existingCust,
        provider,
        role: 'customer'
      };
    } else {
      const syncRes = await syncCustomerToSupabase({
        firstName: fName,
        lastName: lName,
        emailAddress: cleanEmail,
        country: country || 'Ghana',
        phoneNumber: phoneNumber || '+233 55 892 4110',
        password: `SSO-${provider}-Auth`,
        items: items || 'General Commercial Merchandise'
      });

      customerObj = {
        id: syncRes.data?.id || `CUST-SSO-${Math.floor(1000 + Math.random() * 9000)}`,
        supabaseId: syncRes.data?.id,
        name: cleanName,
        firstName: fName,
        lastName: lName,
        email: cleanEmail,
        loginPassword: `SSO-${provider}-Auth`,
        country: country || 'Ghana',
        phone: phoneNumber || '+233 55 892 4110',
        items: items || 'General Commercial Merchandise',
        company: `${cleanName}'s Trading Co`,
        role: 'customer',
        provider,
        syncedToSupabase: syncRes.success
      };

      saveRegisteredCustomer(customerObj);
    }

    if (rememberMe) {
      localStorage.setItem('ace_remembered_email', cleanEmail);
    }

    setTimeout(() => {
      setSocialLoading(false);
      setSocialModal(null);
      onLoginSuccess('customer', customerObj);
    }, 450);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotSubmitted(true);
    setTimeout(() => {
      // Keep state showing success
    }, 1000);
  };

  const handleBackToWebsite = () => {
    if (typeof setView === 'function') {
      setView('home');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="ace-auth-page-root">
      {/* ===================================================
          TOP BAR: ACE LOGISTICS ← Back to Website
          =================================================== */}
      <header className="ace-auth-topbar">
        <div className="ace-auth-topbar-inner">
          {/* Brand Logo & Name */}
          <div 
            className="ace-auth-brand" 
            onClick={handleBackToWebsite}
            title="Return to ACE Logistics Home"
          >
            <div className="ace-auth-logo-icon">
              <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
                <path d="M14 44L28 16H36L50 44H41L38 37H26L23 44H14ZM29 30H35L32 23L29 30Z" fill="#FFFFFF"/>
              </svg>
            </div>
            <div className="ace-auth-brand-text">
              <span className="brand-main">
                ACE <span className="brand-highlight">LOGISTICS</span>
              </span>
              <span className="brand-sub">GLOBAL FREIGHT PORTAL</span>
            </div>
          </div>

          {/* Right Action: Theme toggle + ← Back to Website */}
          <div className="ace-auth-actions">
            {typeof toggleTheme === 'function' && (
              <button 
                type="button" 
                onClick={toggleTheme} 
                className="ace-auth-theme-btn"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            )}

            <button 
              type="button" 
              onClick={handleBackToWebsite} 
              className="ace-auth-back-btn"
              id="back-to-website-btn"
            >
              <ArrowLeft size={16} />
              <span>Back to Website</span>
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================
          MAIN CONTENT: DUAL CARD WIREFRAME LAYOUT
          =================================================== */}
      <main className="ace-auth-main">
        <div className="ace-auth-cards-container">

          {/* ===============================================
              LEFT CARD: ACE LOGISTICS & LOGISTICS IMAGE
              =============================================== */}
          <div className="ace-auth-card ace-auth-left-card">
            {/* Left Card Top Header */}
            <div className="left-card-header">
              <div className="left-card-badge">
                <div className="left-card-emblem">
                  <svg width="16" height="16" viewBox="0 0 64 64" fill="none">
                    <path d="M14 44L28 16H36L50 44H41L38 37H26L23 44H14ZM29 30H35L32 23L29 30Z" fill="#FFFFFF"/>
                  </svg>
                </div>
                <span className="left-card-badge-title">ACE LOGISTICS</span>
              </div>
              <span className="left-card-pill">
                <span className="pulse-dot"></span>
                <span>Active Terminal</span>
              </span>
            </div>

            {/* Logistics Image Container (Worker Photo) */}
            <div className="left-card-image-box">
              <img 
                src={currentIllustration.src} 
                alt="ACE Logistics Warehouse Operations" 
                className="left-card-img"
              />
              
              {/* Image Gradient Overlay */}
              <div className="left-card-img-overlay"></div>

              {/* Floating Status Tag on image */}
              <div className="left-card-floating-badge">
                <Package size={14} color="#38BDF8" />
                <span>{currentIllustration.badge}</span>
              </div>
            </div>

            {/* Quick Image Preview Switcher */}
            <div className="illustration-switcher-strip">
              <button
                type="button"
                className={`ill-btn ${activeIllustration === 'uploaded' ? 'active' : ''}`}
                onClick={() => setActiveIllustration('uploaded')}
                title="Warehouse Worker Dispatch (Uploaded Photo)"
              >
                Warehouse
              </button>
              <button
                type="button"
                className={`ill-btn ${activeIllustration === 'air-cargo' ? 'active' : ''}`}
                onClick={() => setActiveIllustration('air-cargo')}
                title="Air Cargo Logistics Terminal"
              >
                Air Cargo
              </button>
              <button
                type="button"
                className={`ill-btn ${activeIllustration === 'fleet' ? 'active' : ''}`}
                onClick={() => setActiveIllustration('fleet')}
                title="Freight Transit Fleet"
              >
                Fleet
              </button>
            </div>

            {/* Left Card Tagline & Description */}
            <div className="left-card-footer">
              <h2 className="left-card-tagline">
                Track. Manage. <span className="deliver-highlight">Deliver.</span>
              </h2>
              <p className="left-card-description">
                {currentIllustration.caption}
              </p>

              {/* Security & Reliability Feature Highlights */}
              <div className="left-card-features">
                <div className="feature-chip">
                  <CheckCircle2 size={13} color="#10B981" />
                  <span>Real-time GPS Telemetry</span>
                </div>
                <div className="feature-chip">
                  <CheckCircle2 size={13} color="#10B981" />
                  <span>Automated Customs Clearance</span>
                </div>
                <div className="feature-chip">
                  <CheckCircle2 size={13} color="#10B981" />
                  <span>256-bit Encrypted Manifests</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===============================================
              RIGHT CARD: WELCOME BACK & SIGN IN FORM
              =============================================== */}
          <div className="ace-auth-card ace-auth-right-card">

            {/* Portal Tabs: Customer | Staff | Admin */}
            <div className="portal-tabs-row" role="tablist">
              <button
                type="button"
                className={`portal-tab ${selectedPortal === 'customer' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('customer')}
                role="tab"
                aria-selected={selectedPortal === 'customer'}
              >
                <User size={14} />
                <span>Customer</span>
              </button>
              <button
                type="button"
                className={`portal-tab ${selectedPortal === 'staff' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('staff')}
                role="tab"
                aria-selected={selectedPortal === 'staff'}
              >
                <Truck size={14} />
                <span>Staff</span>
              </button>
              <button
                type="button"
                className={`portal-tab ${selectedPortal === 'admin' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('admin')}
                role="tab"
                aria-selected={selectedPortal === 'admin'}
              >
                <Shield size={14} />
                <span>Admin</span>
              </button>
            </div>

            {/* Heading & Subtitle */}
            <div className="auth-form-heading">
              <h1 className="auth-main-title">
                {isRegister 
                  ? 'Create Customer Account' 
                  : selectedPortal === 'customer' 
                  ? 'Welcome back' 
                  : selectedPortal === 'staff' 
                  ? 'Staff Dispatch Console' 
                  : 'Welcome back'}
              </h1>
              <p className="auth-main-subtitle">
                {isRegister 
                  ? 'Sign up to create shipments, manage bookings, and access tracking.'
                  : selectedPortal === 'customer' 
                  ? 'Sign in to your ACE Logistics account' 
                  : selectedPortal === 'staff' 
                  ? 'Enter dispatch credentials to access the terminal intake console.' 
                  : 'Sign in to your administrative executive console.'}
              </p>
            </div>

            {/* Action Notice (e.g. from Send A Package) */}
            {authNotice && (
              <div className="auth-alert-notice">
                <Package size={17} color="var(--color-bright-action)" style={{ flexShrink: 0 }} />
                <span>{authNotice}</span>
              </div>
            )}

            {/* Password / Validation Error Alert */}
            {passwordError && (
              <div className="auth-alert-error">
                <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                <span>{passwordError}</span>
              </div>
            )}

            {/* ===============================================
                CUSTOMER SIGNUP FORM (WHEN isRegister IS TRUE)
                =============================================== */}
            {isRegister ? (
              <form onSubmit={handleSignupSubmit} className="auth-form">
                {/* Row: First Name & Last Name */}
                <div className="form-grid-2">
                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">First Name</label>
                    <div className="ace-input-wrapper">
                      <div className="ace-input-icon"><User size={15} /></div>
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
                      <div className="ace-input-icon"><User size={15} /></div>
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

                {/* Email Address */}
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Email</label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon"><Mail size={15} /></div>
                    <input
                      type="email"
                      className="ace-input ace-input-with-icon"
                      placeholder="k.mensah@enterprise.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Row: Country & Phone */}
                <div className="form-grid-2">
                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Country</label>
                    <div className="ace-input-wrapper">
                      <div className="ace-input-icon"><Globe2 size={15} /></div>
                      <select
                        className="ace-select ace-input-with-icon"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        style={{ height: '42px', appearance: 'auto' }}
                      >
                        <option value="Ghana">🇬🇭 Ghana</option>
                        <option value="United Kingdom">🇬🇧 United Kingdom</option>
                        <option value="Netherlands">🇳🇱 Netherlands</option>
                        <option value="United States">🇺🇸 United States</option>
                        <option value="Nigeria">🇳🇬 Nigeria</option>
                        <option value="China">🇨🇳 China</option>
                        <option value="Germany">🇩🇪 Germany</option>
                        <option value="Canada">🇨🇦 Canada</option>
                        <option value="South Africa">🇿🇦 South Africa</option>
                        <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
                        <option value="International">🌐 Other / International</option>
                      </select>
                    </div>
                  </div>

                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Phone</label>
                    <div className="ace-input-wrapper">
                      <div className="ace-input-icon"><Phone size={15} /></div>
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
                </div>

                {/* Cargo Items */}
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Consignment / Cargo Goods</label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon"><Package size={15} /></div>
                    <input
                      type="text"
                      className="ace-input ace-input-with-icon"
                      placeholder="e.g. Commercial Electronics, Cocoa & Agritech, Auto Parts"
                      value={items}
                      onChange={(e) => setItems(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Row: Password & Confirm */}
                <div className="form-grid-2">
                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Password</label>
                    <div className="ace-input-wrapper">
                      <div className="ace-input-icon"><Lock size={15} /></div>
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        className="ace-input ace-input-with-icon"
                        placeholder="••••••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        style={{ paddingRight: '36px' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="pwd-toggle"
                        title={showSignupPassword ? 'Hide password' : 'View password'}
                      >
                        {showSignupPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Confirm</label>
                    <div className="ace-input-wrapper">
                      <div className="ace-input-icon"><Lock size={15} /></div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="ace-input ace-input-with-icon"
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ paddingRight: '36px' }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="pwd-toggle"
                        title={showConfirmPassword ? 'Hide password' : 'View password'}
                      >
                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cloud Database Sync indicator */}
                <div className="supabase-sync-tag">
                  <CheckCircle2 size={14} color="#16A34A" />
                  <span>Real-time cloud database sync enabled</span>
                </div>

                {/* Create Account Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="auth-primary-submit-btn"
                  id="create-account-submit-btn"
                >
                  {isSubmitting ? (
                    <span className="flex-center-gap">
                      <Loader2 size={16} className="ace-spinner" />
                      <span>Creating Account...</span>
                    </span>
                  ) : (
                    <span className="flex-center-gap">
                      <span>Create Account</span>
                      <ArrowRight size={16} />
                    </span>
                  )}
                </button>

                {/* Social Sign up options */}
                <div className="social-auth-divider">
                  <span>OR register with</span>
                </div>

                <div className="social-auth-grid">
                  <button
                    type="button"
                    onClick={() => openSocialAuth('Google')}
                    className="social-btn social-btn-google"
                    id="register-google-btn"
                  >
                    <svg className="social-btn-icon" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openSocialAuth('Apple')}
                    className="social-btn social-btn-apple"
                    id="register-apple-btn"
                  >
                    <svg className="social-btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-1 .04-2.13.67-2.76 1.44-.57.69-1.06 1.8-1 2.87 1.13.09 2.2-.61 2.82-1.38z"/>
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>

                {/* Back to sign in */}
                <div className="auth-toggle-link-row">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => { setIsRegister(false); setPasswordError(''); }}
                    className="auth-link-btn"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            ) : (
              /* ===============================================
                  SIGN IN FORM (CUSTOMER, STAFF, ADMIN)
                  =============================================== */
              <form onSubmit={handleLoginSubmit} className="auth-form">
                {/* Email Field */}
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">
                    {selectedPortal === 'admin' ? 'Administrator Corporate Email' : 'Email'}
                  </label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon"><Mail size={15} /></div>
                    <input
                      type="email"
                      className="ace-input ace-input-with-icon"
                      placeholder={
                        selectedPortal === 'admin' ? 'd.sterling@acelogistics.com' : 'Enter your email'
                      }
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">
                    {selectedPortal === 'admin' ? 'Administrative Passkey' : 'Password'}
                  </label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon"><Lock size={15} /></div>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      className="ace-input ace-input-with-icon"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      style={{ paddingRight: '40px' }}
                      placeholder={selectedPortal === 'admin' ? '••••••••••••' : 'Enter your password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="pwd-toggle"
                      title={showLoginPassword ? 'Hide password' : 'View password'}
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Staff specific Operating Hub Station */}
                {selectedPortal === 'staff' && (
                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Operating Station / Terminal</label>
                    <div className="ace-input-wrapper">
                      <div className="ace-input-icon"><Building2 size={15} /></div>
                      <select
                        className="ace-select ace-input-with-icon"
                        value={staffStation}
                        onChange={(e) => setStaffStation(e.target.value)}
                        style={{ height: '42px', appearance: 'auto' }}
                      >
                        <option value="ACC-T1 (Accra Central Air Hub)">ACC-T1 (Accra Central Air Cargo Hub)</option>
                        <option value="LHR-T4 (Heathrow Cargo Village)">LHR-T4 (Heathrow Cargo Village, London)</option>
                        <option value="RTM-P2 (Rotterdam Maritime Port)">RTM-P2 (Rotterdam Deep-Water Terminal)</option>
                        <option value="JFK-C7 (New York Intermodal)">JFK-C7 (JFK Intermodal Air Terminal)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Admin specific Hardware Token */}
                {selectedPortal === 'admin' && (
                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Hardware Security Token / Key</label>
                    <div className="ace-input-wrapper">
                      <div className="ace-input-icon"><KeyRound size={15} /></div>
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

                {/* Remember Me and Forgot Password Row */}
                <div className="auth-options-row">
                  <label className="remember-me-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="remember-me-checkbox"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotSubmitted(false);
                      setForgotEmail(loginEmail || '');
                      setShowForgotModal(true);
                    }}
                    className="forgot-password-link-btn"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Primary Button */}
                <button
                  type="submit"
                  className={`auth-primary-submit-btn ${
                    selectedPortal === 'staff' ? 'staff-theme-btn' : 
                    selectedPortal === 'admin' ? 'admin-theme-btn' : ''
                  }`}
                  id="auth-sign-in-submit-btn"
                >
                  <span className="flex-center-gap">
                    <span>
                      {selectedPortal === 'customer' ? 'Sign In' :
                       selectedPortal === 'staff' ? 'Sign In to Terminal' : 'Sign In as Administrator'}
                    </span>
                    <ArrowRight size={16} />
                  </span>
                </button>

                {/* Social Sign-in Options (Customer Portal) */}
                {selectedPortal === 'customer' && (
                  <>
                    <div className="social-auth-divider">
                      <span>OR sign in with</span>
                    </div>

                    <div className="social-auth-grid">
                      <button
                        type="button"
                        onClick={() => openSocialAuth('Google')}
                        className="social-btn social-btn-google"
                        id="login-google-btn"
                        title="Sign in with your Google account"
                      >
                        <svg className="social-btn-icon" viewBox="0 0 24 24" width="18" height="18">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openSocialAuth('Apple')}
                        className="social-btn social-btn-apple"
                        id="login-apple-btn"
                        title="Sign in with your Apple ID"
                      >
                        <svg className="social-btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-1 .04-2.13.67-2.76 1.44-.57.69-1.06 1.8-1 2.87 1.13.09 2.2-.61 2.82-1.38z"/>
                        </svg>
                        <span>Apple</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Bottom Toggle Link: Don't have an account? Create an account */}
                {selectedPortal === 'customer' && (
                  <div className="auth-toggle-link-row">
                    <span>Don't have an account? </span>
                    <button
                      type="button"
                      onClick={() => { setIsRegister(true); setPasswordError(''); }}
                      className="auth-link-btn"
                    >
                      Create an account
                    </button>
                  </div>
                )}
              </form>
            )}

          </div>

        </div>
      </main>

      {/* ===================================================
          FORGOT PASSWORD MODAL
          =================================================== */}
      {showForgotModal && (
        <div className="auth-modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="auth-modal-close" 
              onClick={() => setShowForgotModal(false)}
              title="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="modal-icon-wrap">
              <KeyRound size={26} color="var(--color-bright-action)" />
            </div>

            <h3 className="modal-title">Reset your password</h3>
            <p className="modal-desc">
              Enter your registered email address and we'll send you instructions to recover access to your ACE Logistics account.
            </p>

            {forgotSubmitted ? (
              <div className="modal-success-state">
                <div className="success-badge">
                  <CheckCircle2 size={18} color="#16A34A" />
                  <span>Reset instructions sent!</span>
                </div>
                <p className="success-text">
                  If an account exists for <strong>{forgotEmail}</strong>, an authentication reset link has been dispatched to your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="ace-btn auth-primary-submit-btn"
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} style={{ marginTop: '16px' }}>
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Registered Email</label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon"><Mail size={15} /></div>
                    <input
                      type="email"
                      className="ace-input ace-input-with-icon"
                      placeholder="name@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-primary-submit-btn"
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <span className="flex-center-gap">
                    <span>Send Reset Instructions</span>
                    <Send size={15} />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="modal-cancel-btn"
                >
                  Back to Sign In
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===================================================
          SOCIAL AUTH MODAL (Google & Apple SSO Dialog)
          =================================================== */}
      {socialModal && (
        <div className="auth-modal-overlay" onClick={() => !socialLoading && setSocialModal(null)}>
          <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="auth-modal-close" 
              onClick={() => !socialLoading && setSocialModal(null)}
              disabled={socialLoading}
              title="Close"
            >
              <X size={18} />
            </button>

            <div className="modal-icon-wrap" style={{
              backgroundColor: socialModal.provider === 'Apple' ? '#000000' : '#FFFFFF',
              border: socialModal.provider === 'Apple' ? '2px solid rgba(255,255,255,0.2)' : '1px solid #E2E8F0'
            }}>
              {socialModal.provider === 'Google' ? (
                <svg viewBox="0 0 24 24" width="26" height="26">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="#FFFFFF">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-1 .04-2.13.67-2.76 1.44-.57.69-1.06 1.8-1 2.87 1.13.09 2.2-.61 2.82-1.38z"/>
                </svg>
              )}
            </div>

            <h3 className="modal-title">
              {socialModal.mode === 'register' ? `Register with ${socialModal.provider}` : `Sign in with ${socialModal.provider}`}
            </h3>
            <p className="modal-desc">
              Instant single sign-on authentication for ACE Global Customer Portal
            </p>

            <div className="modal-profile-box">
              <div className="profile-box-header">
                <span className="profile-tag">Authorized SSO Identity</span>
                <span className="verified-tag">
                  <CheckCircle2 size={13} color="#16A34A" />
                  Verified
                </span>
              </div>

              <div className="ace-form-group" style={{ marginBottom: '10px' }}>
                <label className="ace-label" style={{ fontSize: '11.5px' }}>Account Name</label>
                <input
                  type="text"
                  className="ace-input"
                  value={socialName}
                  onChange={(e) => setSocialName(e.target.value)}
                  placeholder="e.g. Grace Sterling"
                  style={{ fontSize: '13px', height: '38px' }}
                />
              </div>

              <div className="ace-form-group" style={{ marginBottom: 0 }}>
                <label className="ace-label" style={{ fontSize: '11.5px' }}>{socialModal.provider} Email</label>
                <input
                  type="email"
                  className="ace-input"
                  value={socialEmail}
                  onChange={(e) => setSocialEmail(e.target.value)}
                  placeholder={socialModal.provider === 'Google' ? 'name@gmail.com' : 'name@icloud.com'}
                  style={{ fontSize: '13px', height: '38px' }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompleteSocialAuth}
              disabled={socialLoading}
              className="auth-primary-submit-btn"
              style={{
                width: '100%',
                backgroundColor: socialModal.provider === 'Apple' ? '#0F172A' : '#4285F4',
                borderColor: socialModal.provider === 'Apple' ? '#0F172A' : '#4285F4'
              }}
            >
              {socialLoading ? (
                <span className="flex-center-gap">
                  <Loader2 size={16} className="ace-spinner" />
                  <span>Connecting & Syncing...</span>
                </span>
              ) : (
                <span className="flex-center-gap">
                  <span>Continue to Customer Portal</span>
                  <ArrowRight size={16} />
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => !socialLoading && setSocialModal(null)}
              disabled={socialLoading}
              className="modal-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          EMBEDDED STYLES FOR THE AUTH LAYOUT
          =================================================== */}
      <style>{`
        .ace-auth-page-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(145deg, #091E33 0%, #071524 50%, #040D17 100%);
          color: #F8FAFC;
          font-family: var(--font-family, 'Inter', -apple-system, sans-serif);
          position: relative;
        }

        /* Ambient Glow Blobs */
        .ace-auth-page-root::before {
          content: '';
          position: absolute;
          top: -120px;
          left: 10%;
          width: 520px;
          height: 520px;
          background: radial-gradient(circle, rgba(22, 131, 216, 0.16) 0%, rgba(22, 131, 216, 0) 70%);
          pointer-events: none;
          z-index: 0;
        }

        .ace-auth-page-root::after {
          content: '';
          position: absolute;
          bottom: -100px;
          right: 8%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, rgba(14, 165, 233, 0) 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* Top Bar */
        .ace-auth-topbar {
          position: relative;
          z-index: 10;
          width: 100%;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background-color: rgba(7, 21, 36, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .ace-auth-topbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ace-auth-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
        }

        .ace-auth-logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 9px;
          background: linear-gradient(135deg, #1683D8 0%, #0B4F7C 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(22, 131, 216, 0.35);
          transition: transform 0.2s ease;
        }

        .ace-auth-brand:hover .ace-auth-logo-icon {
          transform: scale(1.05);
        }

        .ace-auth-brand-text {
          display: flex;
          flex-direction: column;
        }

        .brand-main {
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #FFFFFF;
        }

        .brand-highlight {
          color: #38BDF8;
        }

        .brand-sub {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #94A3B8;
        }

        .ace-auth-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ace-auth-theme-btn {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ace-auth-theme-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #FFFFFF;
        }

        .ace-auth-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #F1F5F9;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ace-auth-back-btn:hover {
          background: rgba(255, 255, 255, 0.14);
          border-color: rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
          transform: translateX(-2px);
        }

        /* Main Container */
        .ace-auth-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          z-index: 2;
        }

        .ace-auth-cards-container {
          width: 100%;
          max-width: 1060px;
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 28px;
          align-items: stretch;
        }

        /* Card Styles */
        .ace-auth-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        /* ===============================================
           LEFT CARD: ILLUSTRATION PANE
           =============================================== */
        .ace-auth-left-card {
          background: linear-gradient(180deg, rgba(15, 30, 48, 0.88) 0%, rgba(9, 21, 35, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .left-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .left-card-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .left-card-emblem {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #1683D8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .left-card-badge-title {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: 0.04em;
          color: #FFFFFF;
        }

        .left-card-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.35);
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #34D399;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
          animation: pulseAnim 2s infinite;
        }

        @keyframes pulseAnim {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }

        /* Image Box */
        .left-card-image-box {
          position: relative;
          width: 100%;
          height: 310px;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.3);
          margin-bottom: 12px;
          background-color: #0B1929;
        }

        .left-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          transition: transform 0.5s ease;
        }

        .left-card-image-box:hover .left-card-img {
          transform: scale(1.03);
        }

        .left-card-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7, 21, 36, 0.1) 0%, rgba(7, 21, 36, 0.7) 100%);
          pointer-events: none;
        }

        .left-card-floating-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          background: rgba(7, 21, 36, 0.85);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #E2E8F0;
        }

        /* Switcher Strip */
        .illustration-switcher-strip {
          display: flex;
          gap: 6px;
          margin-bottom: 18px;
        }

        .ill-btn {
          flex: 1;
          padding: 5px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94A3B8;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ill-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .ill-btn.active {
          background: rgba(22, 131, 216, 0.2);
          border-color: #1683D8;
          color: #38BDF8;
        }

        /* Left Card Footer */
        .left-card-footer {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .left-card-tagline {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.25;
        }

        .deliver-highlight {
          color: #38BDF8;
        }

        .left-card-description {
          font-size: 13px;
          line-height: 1.55;
          color: #94A3B8;
          margin: 0;
        }

        .left-card-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 6px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .feature-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 500;
          color: #CBD5E1;
        }

        /* ===============================================
           RIGHT CARD: AUTH FORM PANE
           =============================================== */
        .ace-auth-right-card {
          background-color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
          padding: 38px 34px;
          display: flex;
          flex-direction: column;
          color: #0F172A;
        }

        /* Dark mode for right card */
        [data-theme="dark"] .ace-auth-right-card,
        .dark-mode .ace-auth-right-card {
          background-color: #0F1F30;
          border-color: rgba(255, 255, 255, 0.12);
          color: #F8FAFC;
        }

        /* Portal Tabs */
        .portal-tabs-row {
          display: flex;
          background: #F1F5F9;
          padding: 4px;
          border-radius: 10px;
          gap: 4px;
          margin-bottom: 22px;
          border: 1px solid #E2E8F0;
        }

        [data-theme="dark"] .portal-tabs-row,
        .dark-mode .portal-tabs-row {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .portal-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 7px;
          border: none;
          background: transparent;
          color: #64748B;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        [data-theme="dark"] .portal-tab,
        .dark-mode .portal-tab {
          color: #94A3B8;
        }

        .portal-tab:hover {
          color: #0F172A;
        }

        [data-theme="dark"] .portal-tab:hover,
        .dark-mode .portal-tab:hover {
          color: #FFFFFF;
        }

        .portal-tab.active {
          background: #FFFFFF;
          color: #0B4F7C;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        [data-theme="dark"] .portal-tab.active,
        .dark-mode .portal-tab.active {
          background: #1683D8;
          color: #FFFFFF;
          box-shadow: 0 2px 10px rgba(22, 131, 216, 0.4);
        }

        /* Heading */
        .auth-form-heading {
          margin-bottom: 20px;
        }

        .auth-main-title {
          font-size: 26px;
          font-weight: 800;
          color: #0B4F7C;
          letter-spacing: -0.02em;
          margin: 0 0 6px 0;
          line-height: 1.2;
        }

        [data-theme="dark"] .auth-main-title,
        .dark-mode .auth-main-title {
          color: #38BDF8;
        }

        .auth-main-subtitle {
          font-size: 13.5px;
          color: #64748B;
          margin: 0;
          line-height: 1.5;
        }

        [data-theme="dark"] .auth-main-subtitle,
        .dark-mode .auth-main-subtitle {
          color: #94A3B8;
        }

        /* Alerts */
        .auth-alert-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(2, 132, 199, 0.08);
          border: 1px solid rgba(2, 132, 199, 0.3);
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 12.5px;
          color: #0B4F7C;
          font-weight: 600;
          margin-bottom: 16px;
        }

        [data-theme="dark"] .auth-alert-notice,
        .dark-mode .auth-alert-notice {
          color: #BAE6FD;
        }

        .auth-alert-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 12.5px;
          color: #991B1B;
          margin-bottom: 16px;
        }

        [data-theme="dark"] .auth-alert-error,
        .dark-mode .auth-alert-error {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.35);
          color: #FCA5A5;
        }

        /* Forms */
        .auth-form {
          display: flex;
          flex-direction: column;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .pwd-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
          transition: color 0.15s ease;
        }

        .pwd-toggle:hover {
          color: #475569;
        }

        [data-theme="dark"] .pwd-toggle:hover,
        .dark-mode .pwd-toggle:hover {
          color: #FFFFFF;
        }

        /* Options Row: Remember me & Forgot Password */
        .auth-options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
          margin-bottom: 18px;
        }

        .remember-me-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
          user-select: none;
        }

        [data-theme="dark"] .remember-me-checkbox-label,
        .dark-mode .remember-me-checkbox-label {
          color: #CBD5E1;
        }

        .remember-me-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #1683D8;
          cursor: pointer;
        }

        .forgot-password-link-btn {
          background: none;
          border: none;
          color: #1683D8;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s ease;
        }

        .forgot-password-link-btn:hover {
          color: #0B4F7C;
          text-decoration: underline;
        }

        [data-theme="dark"] .forgot-password-link-btn:hover,
        .dark-mode .forgot-password-link-btn:hover {
          color: #38BDF8;
        }

        /* Submit Button */
        .auth-primary-submit-btn {
          width: 100%;
          height: 48px;
          border-radius: 9px;
          background: linear-gradient(135deg, #1683D8 0%, #0B4F7C 100%);
          border: 1px solid #1683D8;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(22, 131, 216, 0.35);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .auth-primary-submit-btn:hover {
          background: linear-gradient(135deg, #1E90E6 0%, #0D5D91 100%);
          box-shadow: 0 6px 20px rgba(22, 131, 216, 0.45);
          transform: translateY(-1px);
        }

        .auth-primary-submit-btn:active {
          transform: translateY(0);
        }

        .staff-theme-btn {
          background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
          border-color: #0D9488;
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.35);
        }

        .staff-theme-btn:hover {
          background: linear-gradient(135deg, #14B8A6 0%, #115E59 100%);
        }

        .admin-theme-btn {
          background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
          border-color: #D97706;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
        }

        .admin-theme-btn:hover {
          background: linear-gradient(135deg, #F59E0B 0%, #92400E 100%);
        }

        .flex-center-gap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* Social Auth Divider */
        .social-auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 20px 0 16px 0;
          font-size: 11.5px;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .social-auth-divider::before,
        .social-auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #E2E8F0;
        }

        [data-theme="dark"] .social-auth-divider::before,
        [data-theme="dark"] .social-auth-divider::after,
        .dark-mode .social-auth-divider::before,
        .dark-mode .social-auth-divider::after {
          border-color: rgba(255, 255, 255, 0.12);
        }

        .social-auth-divider::before {
          margin-right: 12px;
        }

        .social-auth-divider::after {
          margin-left: 12px;
        }

        /* Social Auth Grid */
        .social-auth-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 44px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }

        .social-btn-google {
          background-color: #FFFFFF;
          border: 1px solid #CBD5E1;
          color: #1E293B;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .social-btn-google:hover {
          background-color: #F8FAFC;
          border-color: #94A3B8;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }

        .social-btn-apple {
          background-color: #0F172A;
          border: 1px solid #0F172A;
          color: #FFFFFF;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }

        .social-btn-apple:hover {
          background-color: #000000;
          border-color: #000000;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16);
          transform: translateY(-1px);
        }

        [data-theme="dark"] .social-btn-google,
        .dark-mode .social-btn-google {
          background-color: #1E293B;
          border-color: rgba(255, 255, 255, 0.15);
          color: #F8FAFC;
        }

        [data-theme="dark"] .social-btn-google:hover,
        .dark-mode .social-btn-google:hover {
          background-color: #334155;
        }

        [data-theme="dark"] .social-btn-apple,
        .dark-mode .social-btn-apple {
          background-color: #FFFFFF;
          border-color: #FFFFFF;
          color: #0F172A;
        }

        [data-theme="dark"] .social-btn-apple:hover,
        .dark-mode .social-btn-apple:hover {
          background-color: #E2E8F0;
        }

        /* Toggle Links */
        .auth-toggle-link-row {
          text-align: center;
          font-size: 13.5px;
          color: #64748B;
        }

        [data-theme="dark"] .auth-toggle-link-row,
        .dark-mode .auth-toggle-link-row {
          color: #94A3B8;
        }

        .auth-link-btn {
          background: none;
          border: none;
          color: #1683D8;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s ease;
        }

        .auth-link-btn:hover {
          color: #0B4F7C;
          text-decoration: underline;
        }

        [data-theme="dark"] .auth-link-btn:hover,
        .dark-mode .auth-link-btn:hover {
          color: #38BDF8;
        }

        .supabase-sync-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 11.5px;
          color: #166534;
          margin-bottom: 14px;
        }

        [data-theme="dark"] .supabase-sync-tag,
        .dark-mode .supabase-sync-tag {
          background: rgba(16, 185, 129, 0.15);
          border-color: rgba(16, 185, 129, 0.35);
          color: #A7F3D0;
        }

        /* Modal Styles */
        .auth-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: modalFadeIn 0.2s ease-out;
        }

        .auth-modal-box {
          background-color: #FFFFFF;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
          width: 100%;
          max-width: 440px;
          padding: 30px 26px;
          position: relative;
          color: #0F172A;
          animation: modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        [data-theme="dark"] .auth-modal-box,
        .dark-mode .auth-modal-box {
          background-color: #1E293B;
          border-color: rgba(255, 255, 255, 0.12);
          color: #F8FAFC;
        }

        .auth-modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .auth-modal-close:hover {
          background-color: rgba(0, 0, 0, 0.06);
          color: #0F172A;
        }

        [data-theme="dark"] .auth-modal-close:hover,
        .dark-mode .auth-modal-close:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        .modal-icon-wrap {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #EAF5FC;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px auto;
        }

        [data-theme="dark"] .modal-icon-wrap,
        .dark-mode .modal-icon-wrap {
          background: rgba(22, 131, 216, 0.2);
        }

        .modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #0B4F7C;
          text-align: center;
          margin: 0 0 6px 0;
        }

        [data-theme="dark"] .modal-title,
        .dark-mode .modal-title {
          color: #38BDF8;
        }

        .modal-desc {
          font-size: 13px;
          color: #64748B;
          text-align: center;
          line-height: 1.5;
          margin: 0;
        }

        [data-theme="dark"] .modal-desc,
        .dark-mode .modal-desc {
          color: #94A3B8;
        }

        .modal-cancel-btn {
          width: 100%;
          height: 38px;
          background: none;
          border: none;
          color: #64748B;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: color 0.15s ease;
        }

        .modal-cancel-btn:hover {
          color: #0F172A;
        }

        [data-theme="dark"] .modal-cancel-btn:hover,
        .dark-mode .modal-cancel-btn:hover {
          color: #FFFFFF;
        }

        .modal-profile-box {
          padding: 14px;
          border-radius: 10px;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          margin: 16px 0;
        }

        [data-theme="dark"] .modal-profile-box,
        .dark-mode .modal-profile-box {
          background-color: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .profile-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .profile-tag {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748B;
        }

        .verified-tag {
          font-size: 11px;
          font-weight: 700;
          color: #16A34A;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .modal-success-state {
          text-align: center;
          padding: 12px 0;
        }

        .success-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
          font-weight: 700;
          font-size: 13px;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 12px;
        }

        .success-text {
          font-size: 13px;
          color: #475569;
          line-height: 1.5;
        }

        [data-theme="dark"] .success-text,
        .dark-mode .success-text {
          color: #CBD5E1;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalScaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .ace-spinner {
          animation: aceSpin 1s linear infinite;
        }

        @keyframes aceSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive Breakpoints */
        @media (max-width: 960px) {
          .ace-auth-cards-container {
            grid-template-columns: 1fr;
            max-width: 520px;
          }
          .ace-auth-left-card {
            padding: 24px;
          }
          .left-card-image-box {
            height: 240px;
          }
          .ace-auth-right-card {
            padding: 28px 22px;
          }
        }

        @media (max-width: 480px) {
          .ace-auth-topbar-inner {
            padding: 12px 16px;
          }
          .brand-main {
            font-size: 16px;
          }
          .brand-sub {
            font-size: 9px;
          }
          .ace-auth-back-btn span {
            display: none;
          }
          .ace-auth-main {
            padding: 20px 12px;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
          .social-auth-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
