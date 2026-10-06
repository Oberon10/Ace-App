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
  Package,
  Globe2,
  X,
  Loader2,
  Sun,
  Moon,
  Sparkles,
  Send,
  Fingerprint,
  Smartphone,
  Wallet
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

  // Stored staff registrations override or append
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
  const [isRegister, setIsRegister] = useState(false); // false = Log In, true = Sign Up

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

  // Signup Fields (Customer)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [country, setCountry] = useState('Ghana');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [items, setItems] = useState('General Commercial Merchandise');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Social Auth SSO Modal State
  const [socialModal, setSocialModal] = useState(null);
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);

  // Left card illustration (for desktop system view)
  const [activeIllustration, setActiveIllustration] = useState('uploaded');

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

  // Handle portal switch
  const handlePortalSwitch = (portal) => {
    setSelectedPortal(portal);
    setIsRegister(false);
    setPasswordError('');
    if (portal === 'admin') {
      setLoginEmail('d.sterling@acelogistics.com');
      setLoginPassword('AdminSecurePass#2026');
      setAdminToken('ACE-SEC-2026');
    } else if (portal === 'staff') {
      setLoginEmail('');
      setLoginPassword('');
    } else {
      const saved = localStorage.getItem('ace_remembered_email');
      setLoginEmail(saved || '');
      setLoginPassword('');
    }
  };

  // Handle Log In Submit
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

    setIsSubmitting(true);
    setPasswordError('');

    // Handle Remember Me storage
    if (rememberMe) {
      try { localStorage.setItem('ace_remembered_email', cleanEmail); } catch {}
    } else {
      try { localStorage.removeItem('ace_remembered_email'); } catch {}
    }

    // 1. Attempt Backend Express API (port 5000)
    try {
      const backendUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000/api/auth/login'
        : '/api/auth/login';

      const res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const rawRole = (data.user.role || '').toLowerCase();
          const targetRole = (rawRole === 'dispatcher' || rawRole === 'driver' || rawRole === 'staff')
            ? 'staff'
            : (rawRole === 'admin')
            ? 'admin'
            : 'customer';

          if (data.token) {
            try { localStorage.setItem('ace_auth_token', data.token); } catch {}
          }

          setIsSubmitting(false);
          onLoginSuccess(targetRole, {
            ...data.user,
            role: targetRole,
            token: data.token,
            station: selectedPortal === 'staff' ? staffStation : undefined
          });
          return;
        }
      }
    } catch {
      // Backend unavailable or network error: seamlessly proceed to local verification below
    }

    // 2. High-Availability Fallback Verification
    if (selectedPortal === 'admin') {
      if (cleanEmail === 'd.sterling@acelogistics.com') {
        if (cleanPassword !== 'AdminSecurePass#2026') {
          setIsSubmitting(false);
          setPasswordError('Incorrect Administrator Passkey. Access rejected.');
          return;
        }
        if (adminToken.trim() !== 'ACE-SEC-2026') {
          setIsSubmitting(false);
          setPasswordError('Invalid Hardware Security Token. Security clearance failed.');
          return;
        }
        setIsSubmitting(false);
        onLoginSuccess('admin', {
          name: 'Derek Sterling',
          email: 'd.sterling@acelogistics.com',
          role: 'admin',
          title: 'Executive Vice President of Operations',
          clearanceLevel: 'Level 5 (Full Authority)'
        });
        return;
      }

      const matchedAdmin = USERS_LIST.find(u => u.email?.trim().toLowerCase() === cleanEmail && u.role?.toLowerCase() === 'admin');
      if (matchedAdmin) {
        if (matchedAdmin.loginPassword && matchedAdmin.loginPassword !== cleanPassword) {
          setIsSubmitting(false);
          setPasswordError('Incorrect Administrator Passkey.');
          return;
        }
        setIsSubmitting(false);
        onLoginSuccess('admin', { ...matchedAdmin, role: 'admin' });
        return;
      }

      setIsSubmitting(false);
      setPasswordError('Unauthorized Administrator Email. Please sign in as Derek Sterling or click Quick Demo Fill.');
      return;
    }

    if (selectedPortal === 'staff') {
      const registeredStaff = getRegisteredStaff();
      const matchedStaff = registeredStaff.find(s => s.email?.trim().toLowerCase() === cleanEmail);

      if (!matchedStaff) {
        setIsSubmitting(false);
        setPasswordError('Access Denied: Unrecognized staff account. Only authorized operations personnel can access the Dispatch Console. Try clicking a Quick Demo Fill button.');
        return;
      }

      if (matchedStaff.loginPassword && matchedStaff.loginPassword !== cleanPassword) {
        setIsSubmitting(false);
        setPasswordError('Incorrect operational passkey assigned to your staff profile.');
        return;
      }

      setIsSubmitting(false);
      onLoginSuccess('staff', {
        ...matchedStaff,
        station: staffStation
      });
      return;
    }

    if (selectedPortal === 'customer') {
      const registeredCustomers = getRegisteredCustomers();
      let matchedCustomer = registeredCustomers.find(c => c.email?.trim().toLowerCase() === cleanEmail);

      // Query Supabase database if not in cache
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
          console.warn('Supabase customer login lookup notice:', err);
        }
      }

      if (!matchedCustomer) {
        setIsSubmitting(false);
        setPasswordError('Account not found. Click "Sign Up" above to register or click a Quick Demo Fill account.');
        return;
      }

      if (matchedCustomer.loginPassword && matchedCustomer.loginPassword !== cleanPassword) {
        setIsSubmitting(false);
        setPasswordError('Incorrect password. Please verify your credentials and try again.');
        return;
      }

      setIsSubmitting(false);
      onLoginSuccess('customer', matchedCustomer);
      return;
    }
  };

  // Handle Sign Up Submit
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

    if (!agreeTerms) {
      setPasswordError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'Valued Customer';
    const cleanEmail = signupEmail.trim().toLowerCase();

    // 1. Register with Backend API
    try {
      const backendUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000/api/auth/register'
        : '/api/auth/register';

      fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: cleanEmail,
          password: signupPassword,
          role: 'CUSTOMER'
        })
      }).then(r => r.json()).then(data => {
        if (data.token) {
          try { localStorage.setItem('ace_auth_token', data.token); } catch {}
        }
      }).catch(() => {});
    } catch {
      // ignore
    }

    // 2. Sync to Supabase Cloud Database
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
      company: `${firstName.trim() || 'Customer'}'s Commercial Enterprise`,
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
      try { localStorage.setItem('ace_remembered_email', cleanEmail); } catch {}
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess('customer', newCustomer);
    }, 400);
  };

  // Biometric Instant Auth
  const handleBiometricAuth = () => {
    setIsSubmitting(true);
    setPasswordError('');
    setTimeout(() => {
      const registeredCustomers = getRegisteredCustomers();
      const remembered = localStorage.getItem('ace_remembered_email');
      const target = registeredCustomers.find(c => c.email?.toLowerCase() === remembered?.toLowerCase()) || registeredCustomers[0];
      if (target) {
        setIsSubmitting(false);
        onLoginSuccess('customer', target);
      } else {
        setIsSubmitting(false);
        setPasswordError('No biometric profile registered yet. Please sign in with password first.');
      }
    }, 600);
  };

  // Social Auth SSO Modal Handlers
  const openSocialAuth = (provider) => {
    let defaultName = 'Enterprise Customer';
    let defaultEmail = provider === 'Google' ? 'customer@gmail.com' : 'customer@icloud.com';

    if (isRegister) {
      if (firstName || lastName) defaultName = `${firstName} ${lastName}`.trim();
      if (signupEmail) defaultEmail = signupEmail;
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
      try { localStorage.setItem('ace_remembered_email', cleanEmail); } catch {}
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
          TOP BAR (Always visible with return action)
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
              <img 
                src="/ace-emblem.png" 
                alt="ACE" 
                style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="ace-auth-brand-text">
              <span className="brand-main">
                ACE <span className="brand-highlight">LOGISTICS</span>
              </span>
              <span className="brand-sub">GLOBAL FREIGHT WALLET</span>
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
          MAIN CONTENT: SYSTEM (DESKTOP) + NATIVE MOBILE VIEW
          =================================================== */}
      <main className="ace-auth-main">
        <div className="ace-auth-cards-container">

          {/* ===============================================
              LEFT CARD: LOGISTICS TERMINAL (DESKTOP SYSTEM VIEW)
              =============================================== */}
          <div className="ace-auth-card ace-auth-left-card">
            <div className="left-card-header">
              <div className="left-card-badge">
                <div className="left-card-emblem">
                  <img src="/ace-emblem.png" alt="ACE" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
                </div>
                <span className="left-card-badge-title">ACE LOGISTICS</span>
              </div>
              <span className="left-card-pill">
                <span className="pulse-dot"></span>
                <span>Active Terminal</span>
              </span>
            </div>

            <div className="left-card-image-box">
              <img 
                src={currentIllustration.src} 
                alt="ACE Logistics Warehouse Operations" 
                className="left-card-img"
              />
              <div className="left-card-img-overlay"></div>
              <div className="left-card-floating-badge">
                <Package size={14} color="#38BDF8" />
                <span>{currentIllustration.badge}</span>
              </div>
            </div>

            <div className="illustration-switcher-strip">
              <button
                type="button"
                className={`ill-btn ${activeIllustration === 'uploaded' ? 'active' : ''}`}
                onClick={() => setActiveIllustration('uploaded')}
              >
                Warehouse
              </button>
              <button
                type="button"
                className={`ill-btn ${activeIllustration === 'air-cargo' ? 'active' : ''}`}
                onClick={() => setActiveIllustration('air-cargo')}
              >
                Air Cargo
              </button>
              <button
                type="button"
                className={`ill-btn ${activeIllustration === 'fleet' ? 'active' : ''}`}
                onClick={() => setActiveIllustration('fleet')}
              >
                Fleet
              </button>
            </div>

            <div className="left-card-footer">
              <h2 className="left-card-tagline">
                Track. Manage. <span className="deliver-highlight">Deliver.</span>
              </h2>
              <p className="left-card-description">
                {currentIllustration.caption}
              </p>

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
                  <span>Integrated Digital Freight Wallet</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===============================================
              RIGHT CARD: DRIBBLE WALLET MOBILE APP WORKFLOW
              Exact design from https://dribbble.com/shots/26413366
              =============================================== */}
          <div className="ace-auth-card ace-auth-right-card wallet-screen-card">

            {/* Mobile Top App Bar (Native App Style on Mobile) */}
            <div className="wallet-mobile-status-bar">
              <button 
                type="button" 
                onClick={handleBackToWebsite}
                className="wallet-mobile-back-icon-btn"
                title="Back"
              >
                <ArrowLeft size={18} />
              </button>
              <span className="wallet-mobile-title">
                {isRegister ? 'Sign Up' : 'Log In'}
              </span>
              <div style={{ width: '32px' }} />
            </div>

            {/* 1. OFFICIAL COMPANY LOGO INSIDE LOGIN & SIGNUP */}
            <div className="wallet-company-logo-section">
              <div className="wallet-logo-lockup">
                <img 
                  src="/ace-logo.png" 
                  alt="ACE Logistics" 
                  className="wallet-company-logo-img"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/ace-emblem.png';
                  }}
                />
              </div>
              <div className="wallet-brand-meta">
                <span className="wallet-brand-title">ACE LOGISTICS</span>
                <span className="wallet-brand-badge">FREIGHT WALLET & DISPATCH</span>
              </div>
            </div>

            {/* 2. SIGNATURE DRIBBBLE SEGMENTED TAB SWITCHER: [ Log In | Sign Up ] */}
            <div className="wallet-segmented-toggle" role="tablist">
              <button
                type="button"
                className={`wallet-segment-btn ${!isRegister ? 'active' : ''}`}
                onClick={() => { setIsRegister(false); setPasswordError(''); }}
                id="tab-btn-login"
                role="tab"
                aria-selected={!isRegister}
              >
                Log In
              </button>
              <button
                type="button"
                className={`wallet-segment-btn ${isRegister ? 'active' : ''}`}
                onClick={() => { setIsRegister(true); setPasswordError(''); }}
                id="tab-btn-signup"
                role="tab"
                aria-selected={isRegister}
              >
                Sign Up
              </button>
            </div>

            {/* 3. Secondary Portal Selector (Customer | Staff | Admin) */}
            <div className="wallet-portal-pills" role="tablist">
              <button
                type="button"
                className={`wallet-portal-pill ${selectedPortal === 'customer' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('customer')}
                title="Customer Consignment & Wallet Portal"
              >
                <User size={13} />
                <span>Customer</span>
              </button>
              <button
                type="button"
                className={`wallet-portal-pill ${selectedPortal === 'staff' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('staff')}
                title="Staff Operations & Terminal Dispatch"
              >
                <Truck size={13} />
                <span>Staff Dispatch</span>
              </button>
              <button
                type="button"
                className={`wallet-portal-pill ${selectedPortal === 'admin' ? 'active' : ''}`}
                onClick={() => handlePortalSwitch('admin')}
                title="Executive System Administrator"
              >
                <Shield size={13} />
                <span>Admin</span>
              </button>
            </div>

            {/* 4. Greeting Headline & Subtitle */}
            <div className="wallet-heading-area">
              <h1 className="wallet-main-title">
                {isRegister 
                  ? 'Create Account 🚀' 
                  : selectedPortal === 'customer' 
                  ? 'Welcome Back 👋' 
                  : selectedPortal === 'staff' 
                  ? 'Staff Dispatch Console' 
                  : 'Executive Console'}
              </h1>
              <p className="wallet-main-subtitle">
                {isRegister 
                  ? 'Sign up to fund shipments, track cargo & manage your digital wallet.'
                  : selectedPortal === 'customer' 
                  ? 'Hello there, sign in to continue managing your consignments.'
                  : selectedPortal === 'staff' 
                  ? 'Enter assigned operational dispatch passkey to access terminal.' 
                  : 'Sign in to access global executive oversight & security settings.'}
              </p>
            </div>

            {/* Action Notice (e.g. from Send A Package) */}
            {authNotice && (
              <div className="auth-alert-notice">
                <Package size={16} color="var(--color-bright-action)" style={{ flexShrink: 0 }} />
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

            {/* Quick Demo Credentials Pill Bar */}
            {!isRegister && (
              <div className="demo-credentials-banner">
                <div className="demo-banner-header">
                  <span className="demo-banner-title">
                    <Sparkles size={13} />
                    <span>Quick Demo Credentials</span>
                  </span>
                  <span className="demo-banner-hint">1-click fill</span>
                </div>

                <div className="demo-chips-grid">
                  {selectedPortal === 'customer' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('k.mensah@goldcoasttrading.com');
                          setLoginPassword('KwameTrading#Accra24');
                          setPasswordError('');
                        }}
                        className="demo-chip-btn"
                      >
                        <span>🇬🇭 Kwame Mensah (Customer)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('j.devries@maersklog.nl');
                          setLoginPassword('MaerskRotterdamPass@82');
                          setPasswordError('');
                        }}
                        className="demo-chip-btn"
                      >
                        <span>🇳🇱 Jan De Vries (Customer)</span>
                      </button>
                    </>
                  )}

                  {selectedPortal === 'staff' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('s.oconnor@acelogistics.com');
                          setLoginPassword('StaffDispatchKey@99');
                          setStaffStation('LHR-T4 (Heathrow Cargo Village)');
                          setPasswordError('');
                        }}
                        className="demo-chip-btn staff"
                      >
                        <span>🇬🇧 Sarah O'Connor (LHR)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('r.mensah@acelogistics.com');
                          setLoginPassword('KotokaDispatcher#44');
                          setStaffStation('ACC-T1 (Accra Central Air Hub)');
                          setPasswordError('');
                        }}
                        className="demo-chip-btn staff"
                      >
                        <span>🇬🇭 Robert Mensah (Accra)</span>
                      </button>
                    </>
                  )}

                  {selectedPortal === 'admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setLoginEmail('d.sterling@acelogistics.com');
                        setLoginPassword('AdminSecurePass#2026');
                        setAdminToken('ACE-SEC-2026');
                        setPasswordError('');
                      }}
                      className="demo-chip-btn admin"
                    >
                      <Shield size={12} />
                      <span>Derek Sterling (Executive Admin)</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ===============================================
                SIGN UP FORM (DRIBBBLE WORKFLOW)
                =============================================== */}
            {isRegister ? (
              <form onSubmit={handleSignupSubmit} className="wallet-form">
                {/* Full Name / First & Last */}
                <div className="form-grid-2">
                  <div className="wallet-field-group">
                    <label className="wallet-field-label">First Name</label>
                    <div className="wallet-input-container">
                      <div className="wallet-input-icon"><User size={16} /></div>
                      <input
                        type="text"
                        className="wallet-input"
                        placeholder="Kwame"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="wallet-field-group">
                    <label className="wallet-field-label">Last Name</label>
                    <div className="wallet-input-container">
                      <div className="wallet-input-icon"><User size={16} /></div>
                      <input
                        type="text"
                        className="wallet-input"
                        placeholder="Mensah"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email Address */}
                <div className="wallet-field-group">
                  <label className="wallet-field-label">Email Address</label>
                  <div className="wallet-input-container">
                    <div className="wallet-input-icon"><Mail size={16} /></div>
                    <input
                      type="email"
                      className="wallet-input"
                      placeholder="k.mensah@enterprise.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Country & Phone */}
                <div className="form-grid-2">
                  <div className="wallet-field-group">
                    <label className="wallet-field-label">Country</label>
                    <div className="wallet-input-container">
                      <div className="wallet-input-icon"><Globe2 size={16} /></div>
                      <select
                        className="wallet-select"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
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

                  <div className="wallet-field-group">
                    <label className="wallet-field-label">Phone Number</label>
                    <div className="wallet-input-container">
                      <div className="wallet-input-icon"><Phone size={16} /></div>
                      <input
                        type="tel"
                        className="wallet-input"
                        placeholder="+233 24 555 0192"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Cargo Goods */}
                <div className="wallet-field-group">
                  <label className="wallet-field-label">Consignment / Business Goods</label>
                  <div className="wallet-input-container">
                    <div className="wallet-input-icon"><Package size={16} /></div>
                    <input
                      type="text"
                      className="wallet-input"
                      placeholder="e.g. Commercial Electronics, Cocoa, Auto Parts"
                      value={items}
                      onChange={(e) => setItems(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="form-grid-2">
                  <div className="wallet-field-group">
                    <label className="wallet-field-label">Password</label>
                    <div className="wallet-input-container">
                      <div className="wallet-input-icon"><Lock size={16} /></div>
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        className="wallet-input"
                        placeholder="••••••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="wallet-pwd-toggle"
                      >
                        {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="wallet-field-group">
                    <label className="wallet-field-label">Confirm Password</label>
                    <div className="wallet-input-container">
                      <div className="wallet-input-icon"><Lock size={16} /></div>
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        className="wallet-input"
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Terms & Privacy checkbox */}
                <label className="wallet-checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="wallet-checkbox"
                  />
                  <span>I agree to the <strong style={{ color: 'var(--color-primary-blue)' }}>Terms of Service</strong> and <strong style={{ color: 'var(--color-primary-blue)' }}>Privacy Policy</strong></span>
                </label>

                {/* Primary Sign Up Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="wallet-primary-btn"
                  id="wallet-signup-btn"
                >
                  <span className="btn-content">
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="ace-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </span>
                </button>

                {/* Social Sign up options */}
                <div className="wallet-divider">
                  <span>Or continue with</span>
                </div>

                <div className="wallet-social-grid">
                  <button
                    type="button"
                    onClick={() => openSocialAuth('Google')}
                    className="wallet-social-btn"
                    id="register-google-btn"
                    title="Sign up with Google"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18">
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
                    className="wallet-social-btn"
                    id="register-apple-btn"
                    title="Sign up with Apple ID"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-1 .04-2.13.67-2.76 1.44-.57.69-1.06 1.8-1 2.87 1.13.09 2.2-.61 2.82-1.38z"/>
                    </svg>
                    <span>Apple</span>
                  </button>
                </div>

                {/* Bottom Switch Link */}
                <div className="wallet-bottom-switch">
                  <span>Already have an account? </span>
                  <button
                    type="button"
                    onClick={() => { setIsRegister(false); setPasswordError(''); }}
                    className="wallet-switch-btn"
                  >
                    Log In
                  </button>
                </div>
              </form>
            ) : (
              /* ===============================================
                  LOG IN FORM (DRIBBBLE WORKFLOW)
                  =============================================== */
              <form onSubmit={handleLoginSubmit} className="wallet-form">
                {/* Email / Username Field */}
                <div className="wallet-field-group">
                  <label className="wallet-field-label">
                    {selectedPortal === 'admin' ? 'Administrator Corporate Email' : 'Email Address'}
                  </label>
                  <div className="wallet-input-container">
                    <div className="wallet-input-icon"><Mail size={16} /></div>
                    <input
                      type="email"
                      className="wallet-input"
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
                <div className="wallet-field-group">
                  <label className="wallet-field-label">
                    {selectedPortal === 'admin' ? 'Administrative Passkey' : 'Password'}
                  </label>
                  <div className="wallet-input-container">
                    <div className="wallet-input-icon"><Lock size={16} /></div>
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      className="wallet-input"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (passwordError) setPasswordError('');
                      }}
                      placeholder="••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="wallet-pwd-toggle"
                      title={showLoginPassword ? 'Hide password' : 'View password'}
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Staff Operating Station */}
                {selectedPortal === 'staff' && (
                  <div className="wallet-field-group">
                    <label className="wallet-field-label">Operating Station / Terminal</label>
                    <div className="wallet-input-container">
                      <div className="wallet-input-icon"><Building2 size={16} /></div>
                      <select
                        className="wallet-select"
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

                {/* Admin Hardware Token */}
                {selectedPortal === 'admin' && (
                  <div className="wallet-field-group">
                    <label className="wallet-field-label">Hardware Security Token</label>
                    <div className="wallet-input-container">
                      <div className="wallet-input-icon"><KeyRound size={16} /></div>
                      <input
                        type="text"
                        className="wallet-input"
                        value={adminToken}
                        onChange={(e) => setAdminToken(e.target.value)}
                        placeholder="ACE-SEC-2026"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me and Forgot Password Row */}
                <div className="wallet-options-row">
                  <label className="wallet-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="wallet-checkbox"
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
                    className="wallet-forgot-btn"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Primary Log In Button (Pill Action Button) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`wallet-primary-btn ${
                    selectedPortal === 'staff' ? 'staff-theme' : 
                    selectedPortal === 'admin' ? 'admin-theme' : ''
                  }`}
                  id="auth-sign-in-submit-btn"
                >
                  <span className="btn-content">
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="ace-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {selectedPortal === 'customer' ? 'Log In' :
                           selectedPortal === 'staff' ? 'Log In to Dispatch' : 'Log In as Administrator'}
                        </span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </span>
                </button>

                {/* Social Sign-in & Biometric Options */}
                {selectedPortal === 'customer' && (
                  <>
                    <div className="wallet-divider">
                      <span>Or continue with</span>
                    </div>

                    <div className="wallet-social-grid-three">
                      <button
                        type="button"
                        onClick={() => openSocialAuth('Google')}
                        className="wallet-social-circle-btn"
                        id="login-google-btn"
                        title="Sign in with Google"
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => openSocialAuth('Apple')}
                        className="wallet-social-circle-btn"
                        id="login-apple-btn"
                        title="Sign in with Apple"
                      >
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-1 .04-2.13.67-2.76 1.44-.57.69-1.06 1.8-1 2.87 1.13.09 2.2-.61 2.82-1.38z"/>
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={handleBiometricAuth}
                        className="wallet-social-circle-btn biometric"
                        id="login-biometric-btn"
                        title="Quick Sign In with Biometrics (Touch ID / Face ID)"
                      >
                        <Fingerprint size={20} color="var(--color-primary-blue)" />
                      </button>
                    </div>
                  </>
                )}

                {/* Bottom Switch Link */}
                <div className="wallet-bottom-switch">
                  <span>Don't have an account? </span>
                  <button
                    type="button"
                    onClick={() => { setIsRegister(true); setPasswordError(''); }}
                    className="wallet-switch-btn"
                  >
                    Sign Up
                  </button>
                </div>
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
            >
              <X size={18} />
            </button>

            <div className="modal-icon-wrap">
              <Mail size={24} color="#1683D8" />
            </div>

            <h3 className="modal-title">Reset Your Password</h3>
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
                  className="wallet-primary-btn"
                  style={{ width: '100%', marginTop: '16px' }}
                >
                  Return to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} style={{ marginTop: '16px' }}>
                <div className="wallet-field-group">
                  <label className="wallet-field-label">Registered Email</label>
                  <div className="wallet-input-container">
                    <div className="wallet-input-icon"><Mail size={16} /></div>
                    <input
                      type="email"
                      className="wallet-input"
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
                  className="wallet-primary-btn"
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  <span className="btn-content">
                    <span>Send Reset Instructions</span>
                    <Send size={15} />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="modal-cancel-btn"
                >
                  Back to Log In
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

              <div className="wallet-field-group" style={{ marginBottom: '10px' }}>
                <label className="wallet-field-label">Account Name</label>
                <div className="wallet-input-container">
                  <input
                    type="text"
                    className="wallet-input"
                    value={socialName}
                    onChange={(e) => setSocialName(e.target.value)}
                    placeholder="e.g. Grace Sterling"
                  />
                </div>
              </div>

              <div className="wallet-field-group" style={{ marginBottom: 0 }}>
                <label className="wallet-field-label">{socialModal.provider} Email</label>
                <div className="wallet-input-container">
                  <input
                    type="email"
                    className="wallet-input"
                    value={socialEmail}
                    onChange={(e) => setSocialEmail(e.target.value)}
                    placeholder={socialModal.provider === 'Google' ? 'name@gmail.com' : 'name@icloud.com'}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompleteSocialAuth}
              disabled={socialLoading}
              className="wallet-primary-btn"
              style={{
                width: '100%',
                backgroundColor: socialModal.provider === 'Apple' ? '#0F172A' : '#4285F4',
                borderColor: socialModal.provider === 'Apple' ? '#0F172A' : '#4285F4'
              }}
            >
              {socialLoading ? (
                <span className="btn-content">
                  <Loader2 size={16} className="ace-spin" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                <span>Continue with {socialModal.provider}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          COMPONENT CSS: DRIBBLE WALLET MOBILE APP STYLES
          =================================================== */}
      <style>{`
        .ace-auth-page-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #071524 0%, #0B253E 50%, #061625 100%);
          color: #0F172A;
          position: relative;
          overflow-x: hidden;
          max-width: 100%;
          width: 100%;
          font-family: inherit;
        }

        .ace-auth-page-root::before {
          content: '';
          position: absolute;
          top: -80px;
          left: 5%;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(22, 131, 216, 0.18) 0%, rgba(22, 131, 216, 0) 70%);
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
          background-color: rgba(7, 21, 36, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .ace-auth-topbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 14px 24px;
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
          border-radius: 10px;
          background: #FFFFFF;
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
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #FFFFFF;
        }

        .brand-highlight {
          color: #38BDF8;
        }

        .brand-sub {
          font-size: 9.5px;
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
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ace-auth-theme-btn:hover {
          background: rgba(255, 255, 255, 0.14);
          color: #FFFFFF;
        }

        .ace-auth-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #F1F5F9;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ace-auth-back-btn:hover {
          background: rgba(255, 255, 255, 0.16);
          color: #FFFFFF;
          transform: translateX(-2px);
        }

        /* Main Container */
        .ace-auth-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 36px 20px;
          position: relative;
          z-index: 2;
        }

        .ace-auth-cards-container {
          width: 100%;
          max-width: 1060px;
          display: grid;
          grid-template-columns: 1fr 1.15fr;
          gap: 32px;
          align-items: stretch;
        }

        /* Card Styles */
        .ace-auth-card {
          border-radius: 24px;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
        }

        /* Left Card (Desktop System View) */
        .ace-auth-left-card {
          background: linear-gradient(180deg, #0A1C2E 0%, #061320 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .left-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .left-card-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .left-card-emblem {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .left-card-badge-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.01em;
        }

        .left-card-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 20px;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34D399;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 8px #10B981;
        }

        .left-card-image-box {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          height: 250px;
          margin-bottom: 14px;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .left-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .left-card-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(7, 21, 36, 0.1) 0%, rgba(7, 21, 36, 0.75) 100%);
        }

        .left-card-floating-badge {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: 8px;
          background: rgba(7, 21, 36, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(56, 189, 248, 0.3);
          font-size: 11px;
          color: #E0F2FE;
          font-weight: 600;
        }

        .illustration-switcher-strip {
          display: flex;
          gap: 6px;
          margin-bottom: 16px;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .ill-btn {
          flex: 1;
          padding: 6px 8px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #94A3B8;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ill-btn.active {
          background: rgba(22, 131, 216, 0.25);
          color: #38BDF8;
          border: 1px solid rgba(56, 189, 248, 0.35);
        }

        .left-card-footer {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .left-card-tagline {
          font-size: 20px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .deliver-highlight {
          color: #38BDF8;
        }

        .left-card-description {
          font-size: 12.5px;
          color: #94A3B8;
          line-height: 1.5;
          margin: 0;
        }

        .left-card-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 6px;
        }

        .feature-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 11.5px;
          color: #CBD5E1;
        }

        /* ===============================================
           RIGHT CARD: WALLET MOBILE APP WORKFLOW
           =============================================== */
        .wallet-screen-card {
          padding: 36px 32px;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
        }

        .wallet-mobile-status-bar {
          display: none;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .wallet-mobile-back-icon-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          color: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .wallet-mobile-title {
          font-size: 15px;
          font-weight: 700;
          color: #0F172A;
        }

        /* 1. Official Company Logo inside */
        .wallet-company-logo-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          margin-bottom: 20px;
        }

        .wallet-logo-lockup {
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wallet-company-logo-img {
          height: 48px;
          max-width: 220px;
          object-fit: contain;
          display: block;
        }

        .wallet-brand-meta {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .wallet-brand-title {
          font-size: 15px;
          font-weight: 800;
          color: #0B4F7C;
          letter-spacing: -0.01em;
        }

        .wallet-brand-badge {
          font-size: 9.5px;
          font-weight: 700;
          color: #64748B;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* 2. Signature Dribbble Segmented Tab Switcher */
        .wallet-segmented-toggle {
          position: relative;
          display: flex;
          background: #F1F5F9;
          border-radius: 30px;
          padding: 4px;
          margin-bottom: 16px;
          border: 1px solid #E2E8F0;
        }

        .wallet-segment-btn {
          flex: 1;
          padding: 10px 16px;
          border-radius: 24px;
          border: none;
          background: transparent;
          color: #64748B;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-align: center;
        }

        .wallet-segment-btn.active {
          background: #0B4F7C;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(11, 79, 124, 0.25);
        }

        /* 3. Secondary Role Selector Pills */
        .wallet-portal-pills {
          display: flex;
          justify-content: center;
          gap: 6px;
          margin-bottom: 18px;
        }

        .wallet-portal-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          color: #64748B;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .wallet-portal-pill.active {
          background: rgba(22, 131, 216, 0.12);
          border-color: rgba(22, 131, 216, 0.35);
          color: #0B4F7C;
          font-weight: 700;
        }

        /* 4. Greeting Headline */
        .wallet-heading-area {
          margin-bottom: 18px;
        }

        .wallet-main-title {
          font-size: 22px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.02em;
          margin: 0 0 6px 0;
        }

        .wallet-main-subtitle {
          font-size: 13px;
          color: #64748B;
          margin: 0;
          line-height: 1.45;
        }

        /* Alert notices */
        .auth-alert-notice {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(22, 131, 216, 0.08);
          border: 1px solid rgba(22, 131, 216, 0.25);
          color: #0369A1;
          font-size: 12px;
          margin-bottom: 14px;
          font-weight: 600;
        }

        .auth-alert-error {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          color: #DC2626;
          font-size: 12.5px;
          margin-bottom: 14px;
          font-weight: 600;
        }

        /* Demo credentials banner */
        .demo-credentials-banner {
          margin-bottom: 16px;
          padding: 10px 12px;
          border-radius: 12px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
        }

        .demo-banner-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .demo-banner-title {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          color: #0B4F7C;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .demo-banner-hint {
          font-size: 10.5px;
          color: #94A3B8;
        }

        .demo-chips-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .demo-chip-btn {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 5px 9px;
          font-size: 11.5px;
          font-weight: 600;
          color: #0F172A;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          transition: all 0.15s ease;
        }

        .demo-chip-btn:hover {
          border-color: #0B4F7C;
          color: #0B4F7C;
          background: #F0F9FF;
        }

        .demo-chip-btn.staff {
          color: #0F766E;
          border-color: #99F6E4;
        }

        .demo-chip-btn.admin {
          color: #B45309;
          border-color: #FDE68A;
        }

        /* Forms & Inputs */
        .wallet-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .wallet-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .wallet-field-label {
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }

        .wallet-input-container {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 14px;
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          transition: all 0.2s ease;
        }

        .wallet-input-container:focus-within {
          border-color: #0B4F7C;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(11, 79, 124, 0.1);
        }

        .wallet-input-icon {
          position: absolute;
          left: 14px;
          color: #94A3B8;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .wallet-input {
          width: 100%;
          height: 46px;
          padding: 0 14px 0 42px;
          border: none;
          background: transparent;
          border-radius: 14px;
          font-size: 13.5px;
          color: #0F172A;
          outline: none;
          box-sizing: border-box;
        }

        .wallet-input::placeholder {
          color: #94A3B8;
        }

        .wallet-select {
          width: 100%;
          height: 46px;
          padding: 0 14px 0 42px;
          border: none;
          background: transparent;
          border-radius: 14px;
          font-size: 13.5px;
          color: #0F172A;
          outline: none;
          cursor: pointer;
          appearance: auto;
          box-sizing: border-box;
        }

        .wallet-pwd-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wallet-pwd-toggle:hover {
          color: #0F172A;
        }

        /* Checkbox & Options */
        .wallet-options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
        }

        .wallet-checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12.5px;
          color: #475569;
          cursor: pointer;
          user-select: none;
        }

        .wallet-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          accent-color: #0B4F7C;
          cursor: pointer;
        }

        .wallet-forgot-btn {
          background: none;
          border: none;
          color: #0B4F7C;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .wallet-forgot-btn:hover {
          text-decoration: underline;
        }

        /* Primary Action Button */
        .wallet-primary-btn {
          width: 100%;
          height: 50px;
          border-radius: 28px;
          border: none;
          background: linear-gradient(135deg, #0B4F7C 0%, #1683D8 100%);
          color: #FFFFFF;
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(11, 79, 124, 0.28);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 4px;
        }

        .wallet-primary-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(11, 79, 124, 0.35);
        }

        .wallet-primary-btn:active {
          transform: translateY(0);
        }

        .wallet-primary-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .wallet-primary-btn.staff-theme {
          background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
          box-shadow: 0 6px 18px rgba(13, 148, 136, 0.3);
        }

        .wallet-primary-btn.admin-theme {
          background: linear-gradient(135deg, #D97706 0%, #B45309 100%);
          box-shadow: 0 6px 18px rgba(217, 119, 6, 0.3);
        }

        .btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* Divider */
        .wallet-divider {
          display: flex;
          align-items: center;
          margin: 6px 0;
          text-align: center;
          color: #94A3B8;
          font-size: 11.5px;
          font-weight: 600;
        }

        .wallet-divider::before,
        .wallet-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #E2E8F0;
        }

        .wallet-divider span {
          padding: 0 12px;
        }

        /* Social Auth Grids */
        .wallet-social-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .wallet-social-btn {
          height: 44px;
          border-radius: 24px;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #334155;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .wallet-social-btn:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
        }

        .wallet-social-grid-three {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .wallet-social-circle-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
        }

        .wallet-social-circle-btn:hover {
          background: #F1F5F9;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }

        .wallet-social-circle-btn.biometric {
          background: #F0F9FF;
          border-color: #BAE6FD;
        }

        .wallet-social-circle-btn.biometric:hover {
          background: #E0F2FE;
        }

        /* Bottom Switch Link */
        .wallet-bottom-switch {
          text-align: center;
          font-size: 13px;
          color: #64748B;
          margin-top: 6px;
        }

        .wallet-switch-btn {
          background: none;
          border: none;
          color: #0B4F7C;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
        }

        .wallet-switch-btn:hover {
          text-decoration: underline;
        }

        /* Modal Styles */
        .auth-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }

        .auth-modal-box {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: #FFFFFF;
          border-radius: 20px;
          padding: 28px 24px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          animation: aceSlideUp 0.2s ease;
        }

        .auth-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #F1F5F9;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748B;
        }

        .modal-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          background: #F0F9FF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 6px 0;
        }

        .modal-desc {
          font-size: 13px;
          color: #64748B;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .modal-cancel-btn {
          width: 100%;
          padding: 10px;
          background: none;
          border: none;
          color: #64748B;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 6px;
        }

        .modal-profile-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .profile-box-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .profile-tag {
          font-size: 11px;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
        }

        .verified-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #16A34A;
          font-weight: 700;
        }

        .modal-success-state {
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 14px;
          padding: 18px 16px;
          text-align: center;
        }

        .success-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #16A34A;
          font-weight: 700;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .success-text {
          font-size: 12.5px;
          color: #166534;
          line-height: 1.5;
          margin: 0;
        }

        .ace-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes aceSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ===================================================
            MOBILE VIEW RESPONSIVE OVERRIDES (EXACT DRIBBLE MATCH)
            =================================================== */
        @media (min-width: 769px) and (max-width: 960px) {
          .ace-auth-cards-container {
            gap: 16px !important;
            padding: 0 12px !important;
          }
          .ace-auth-left-card {
            padding: 18px !important;
          }
          .wallet-screen-card {
            padding: 24px 20px !important;
          }
        }

        @media (max-width: 768px) {
          .ace-auth-topbar {
            display: none !important;
          }

          .ace-auth-page-root {
            background: #FFFFFF !important;
          }

          .ace-auth-page-root::before,
          .ace-auth-page-root::after {
            display: none !important;
          }

          .ace-auth-main {
            padding: 0 !important;
            align-items: flex-start !important;
          }

          .ace-auth-cards-container {
            grid-template-columns: 1fr !important;
            max-width: 100% !important;
            gap: 0 !important;
          }

          .ace-auth-left-card {
            display: none !important;
          }

          .wallet-screen-card {
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
            padding: 20px 20px 36px 20px !important;
            min-height: 100vh !important;
          }

          .wallet-mobile-status-bar {
            display: flex !important;
          }

          .wallet-company-logo-img {
            height: 42px !important;
          }

          .form-grid-2 {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}
