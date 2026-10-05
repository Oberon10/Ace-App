import React, { useState, useEffect } from 'react';
import { KNOWN_ACCOUNTS, USERS_LIST } from '../data/shipments';
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
  Package,
  Globe2,
  X,
  Loader2
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

  // Login Fields - customer & staff inputs start completely blank with clear placeholders
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

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

  // Auto-fill sensible default credentials only for Admin demo console; Customer and Staff portals start blank
  useEffect(() => {
    if (selectedPortal === 'customer' || selectedPortal === 'staff') {
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

      // Validate customer password
      if (matchedCustomer.loginPassword && matchedCustomer.loginPassword !== cleanPassword) {
        setPasswordError('Incorrect password. Please verify your password and try again.');
        return;
      }

      setPasswordError('');
      onLoginSuccess('customer', { ...matchedCustomer, role: 'customer' });
      return;
    }

    // STRICT STAFF VERIFICATION: Only admin-registered staff can log in
    if (selectedPortal === 'staff') {
      const registeredStaff = getRegisteredStaff();
      const staffAccount = registeredStaff.find(s => s.email?.trim().toLowerCase() === cleanEmail);

      if (!staffAccount) {
        setPasswordError('Account not found. Only admin-registered staff can log in. Please contact your system administrator.');
        return;
      }

      if (staffAccount.status === 'Inactive') {
        setPasswordError('This staff account is currently inactive. Please contact your administrator.');
        return;
      }

      if (staffAccount.loginPassword && staffAccount.loginPassword !== cleanPassword) {
        setPasswordError('Incorrect password. Please verify your staff credentials and try again.');
        return;
      }

      setPasswordError('');
      onLoginSuccess('staff', { ...staffAccount, role: 'staff', station: staffStation });
      return;
    }

    // Admin portal verification
    if (selectedPortal === 'admin') {
      const adminAccount = USERS_LIST.find(u => u.email.toLowerCase() === cleanEmail && u.role?.toLowerCase() === 'admin') ||
                           KNOWN_ACCOUNTS.find(a => a.email.toLowerCase() === cleanEmail && a.role === 'admin');
      if (!adminAccount) {
        setPasswordError('Administrator record not found.');
        return;
      }
      if (adminAccount.loginPassword && adminAccount.loginPassword !== cleanPassword) {
        setPasswordError('Incorrect administrator passkey.');
        return;
      }
      if (!adminToken || adminToken.trim() !== 'ACE-SEC-2026') {
        setPasswordError('Invalid Hardware Security Token. Key must be ACE-SEC-2026.');
        return;
      }
      setPasswordError('');
      onLoginSuccess('admin', { ...adminAccount, role: 'admin' });
      return;
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please ensure both passwords match.');
      return;
    }
    if (!signupPassword || signupPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return;
    }

    const cleanEmail = signupEmail.trim().toLowerCase();
    const existingCustomers = getRegisteredCustomers();
    if (existingCustomers.some(c => c.email?.trim().toLowerCase() === cleanEmail)) {
      setPasswordError('An account with this email address already exists. Please log in.');
      return;
    }

    setIsSubmitting(true);
    setPasswordError('');
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim() || 'New Customer';

    // 1. Sync to Supabase `customers` table with exact required fields:
    // id, first name, last name, email address, country, phone number, password, items
    const syncRes = await syncCustomerToSupabase({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailAddress: cleanEmail,
      country: country.trim() || 'Ghana',
      phoneNumber: phoneNumber.trim(),
      password: signupPassword,
      items: items.trim() || 'General Commercial Merchandise'
    });

    const newCustomer = { 
      id: syncRes.data?.id || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      supabaseId: syncRes.data?.id,
      name: fullName, 
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: cleanEmail, 
      loginPassword: signupPassword,
      country: country.trim() || 'Ghana',
      phone: phoneNumber.trim(),
      items: items.trim() || 'General Commercial Merchandise',
      company: `${fullName}'s Trading Co`,
      role: 'customer',
      syncedToSupabase: syncRes.success
    };

    // 2. Persist new registered customer locally
    saveRegisteredCustomer(newCustomer);
    setIsSubmitting(false);
    onLoginSuccess('customer', newCustomer);
  };

  // ===================================================
  // SOCIAL AUTHENTICATION (Google & Apple SSO)
  // ===================================================
  const [socialModal, setSocialModal] = useState(null); // { provider: 'Google' | 'Apple', mode: 'login' | 'register' }
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialEmail, setSocialEmail] = useState('');
  const [socialName, setSocialName] = useState('');

  const openSocialAuth = (provider) => {
    const existingName = (firstName && lastName)
      ? `${firstName} ${lastName}`
      : firstName || (loginEmail ? loginEmail.split('@')[0] : '');
    const defaultName = existingName || 'Grace Sterling';
    const defaultEmail = signupEmail || loginEmail || (provider === 'Google' ? 'grace.sterling@gmail.com' : 'grace.sterling@icloud.com');

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

    // 1. Check if customer already exists in local storage
    const registeredCustomers = getRegisteredCustomers();
    let existingCust = registeredCustomers.find(c => c.email?.trim().toLowerCase() === cleanEmail);

    let customerObj;
    if (existingCust) {
      // Existing customer social login
      customerObj = {
        ...existingCust,
        provider,
        role: 'customer'
      };
    } else {
      // Register new customer via Social SSO & Sync to Supabase
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

    setTimeout(() => {
      setSocialLoading(false);
      setSocialModal(null);
      onLoginSuccess('customer', customerObj);
    }, 450);
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: 'calc(100vh - 140px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 16px',
      backgroundImage: "linear-gradient(135deg, rgba(7, 42, 66, 0.88) 0%, rgba(11, 79, 124, 0.82) 100%), url('/images/contact-operations-center.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div style={{
        maxWidth: '1040px',
        width: '100%',
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-section)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        position: 'relative',
        zIndex: 2
      }} className="auth-split">
        {/* ===================================================
            LEFT SIDE: LOGISTICS BRANDING & SECURITY NOTICE
            =================================================== */}
        <div className="auth-info-pane" style={{
          position: 'relative',
          backgroundImage: `url(${
            selectedPortal === 'admin'
              ? '/images/corporate-logistics-hub.jpg'
              : selectedPortal === 'staff'
              ? '/images/contact-operations-center.jpg'
              : '/images/truck-freight.jpg'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#FFFFFF',
          padding: '48px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transition: 'background-image 0.4s ease'
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
              {selectedPortal === 'customer' ? 'Customer Freight Access' :
               selectedPortal === 'staff' ? 'Terminal Dispatch Console' : 'Executive Admin Console'}
            </h2>
            <p style={{ color: '#D9E7F0', fontSize: '13.5px', lineHeight: 1.6 }}>
              {selectedPortal === 'customer' ? 'Secure portal to manage personal consignments, book cargo, and monitor real-time tracking.' :
               selectedPortal === 'staff' ? 'Authorized terminal dispatch portal for manifest intake and flight/vessel status operations.' :
               'Executive authority console for global network monitoring, user access control, and platform audit records.'}
            </p>
          </div>

          {/* Role Access Matrix Info on Left - strictly isolated to current portal */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px', borderTop: '1px solid rgba(255,255,255,0.18)', paddingTop: '20px' }}>
            {selectedPortal === 'customer' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <User size={16} color="#38BDF8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#FFFFFF' }}>Customer Portal:</strong>
                  <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11.5px' }}>Strictly isolated records for personal bookings and deliveries.</span>
                </div>
              </div>
            )}
            {selectedPortal === 'staff' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Truck size={16} color="#38BDF8" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#FFFFFF' }}>Staff Dispatcher:</strong>
                  <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11.5px' }}>Terminal intake, manifest queue & consignment status manager only.</span>
                </div>
              </div>
            )}
            {selectedPortal === 'admin' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Shield size={16} color="#FBBF24" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#FBBF24' }}>Executive Admin:</strong>
                  <span style={{ color: '#CBD5E1', display: 'block', fontSize: '11.5px' }}>Sole authority to view staff & customer login details and full analytics.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE: AUTH CARD
            =================================================== */}
        <div className="auth-card-body" style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* Heading & Contextual Subtitle based on Portal */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '22px', color: 'var(--color-primary-blue)', fontWeight: 800 }}>
                {isRegister ? 'Create Customer Account' : 
                 selectedPortal === 'customer' ? 'Customer Login' :
                 selectedPortal === 'staff' ? 'Staff Login' : 'Admin Console Login'}
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

              {/* Row 3: Country & Phone Number */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '12px' }}>
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Country</label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon">
                      <Globe2 size={15} />
                    </div>
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
              </div>

              {/* Row 4: Cargo Goods / Consignment Items */}
              <div className="ace-form-group">
                <label className="ace-label ace-label-required">Items / Consignment Cargo Goods</label>
                <div className="ace-input-wrapper">
                  <div className="ace-input-icon">
                    <Package size={15} />
                  </div>
                  <input
                    type="text"
                    className="ace-input ace-input-with-icon"
                    placeholder="e.g. Commercial Electronics, Textiles, Cocoa & Agritech, Auto Parts"
                    value={items}
                    onChange={(e) => setItems(e.target.value)}
                    required
                  />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Specify your primary consignment cargo types or merchandise
                </div>
              </div>

              {/* Row 5: Password & Confirm Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Password</label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon">
                      <Lock size={15} />
                    </div>
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      className="ace-input ace-input-with-icon"
                      placeholder="Password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      style={{ paddingRight: '36px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
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
                      {showSignupPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Confirm Password</label>
                  <div className="ace-input-wrapper">
                    <div className="ace-input-icon">
                      <Lock size={15} />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="ace-input ace-input-with-icon"
                      placeholder="Confirm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ paddingRight: '36px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
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
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Supabase Realtime Sync Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '11.5px',
                color: '#166534',
                marginTop: '4px',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={14} color="#16A34A" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Real-time Supabase Sync:</strong> Account data directly syncs to cloud table <code>public.customers</code>.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="ace-btn ace-btn-action"
                style={{ width: '100%', height: '46px', fontSize: '15px', marginBottom: '16px', opacity: isSubmitting ? 0.8 : 1 }}
              >
                {isSubmitting ? (
                  <span>Syncing with Supabase Database...</span>
                ) : (
                  <>
                    <span>Create Customer Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Social Registration Section */}
              <div className="social-auth-divider">
                <span>Or register with</span>
              </div>
              <div className="social-auth-grid">
                <button
                  type="button"
                  onClick={() => openSocialAuth('Google')}
                  className="social-btn social-btn-google"
                  id="customer-register-google-btn"
                  title="Register using your Google account"
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
                  id="customer-register-apple-btn"
                  title="Register using your Apple ID"
                >
                  <svg className="social-btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-1 .04-2.13.67-2.76 1.44-.57.69-1.06 1.8-1 2.87 1.13.09 2.2-.61 2.82-1.38z"/>
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </form>
          ) : (
            /* ===================================================
                AUTHENTICATION LOGIN FORM (Customer, Staff, or Admin)
                =================================================== */
            <form onSubmit={handleLoginSubmit}>
              {/* Email Address */}
              <div className="ace-form-group">
                <label className="ace-label ace-label-required">
                  {selectedPortal === 'admin' ? 'Administrator Corporate Email' : 'Email'}
                </label>
                <div className="ace-input-wrapper">
                  <div className="ace-input-icon">
                    <Mail size={15} />
                  </div>
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

              {/* Password with Eye view/hide toggle */}
              <div className="ace-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="ace-label ace-label-required">
                    {selectedPortal === 'admin' ? 'Administrative Passkey' : 'Password'}
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

              <button
                type="submit"
                className="ace-btn"
                style={{
                  width: '100%',
                  height: '46px',
                  fontSize: '15px',
                  marginTop: '6px',
                  marginBottom: '16px',
                  backgroundColor: selectedPortal === 'staff' ? '#0D9488' : 'var(--color-primary-blue)',
                  color: '#FFFFFF',
                  borderColor: selectedPortal === 'staff' ? '#0D9488' : 'var(--color-primary-blue)'
                }}
              >
                <span>
                  {selectedPortal === 'customer' ? 'Customer Login' :
                   selectedPortal === 'staff' ? 'Staff Login' : 'Sign In as Administrator'}
                </span>
                <ArrowRight size={16} />
              </button>

              {/* Social Login Options (Customer Portal Only) */}
              {selectedPortal === 'customer' && (
                <>
                  <div className="social-auth-divider">
                    <span>Or sign in with</span>
                  </div>
                  <div className="social-auth-grid">
                    <button
                      type="button"
                      onClick={() => openSocialAuth('Google')}
                      className="social-btn social-btn-google"
                      id="customer-login-google-btn"
                      title="Sign in using your Google account"
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
                      id="customer-login-apple-btn"
                      title="Sign in using your Apple ID"
                    >
                      <svg className="social-btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-1 .04-2.13.67-2.76 1.44-.57.69-1.06 1.8-1 2.87 1.13.09 2.2-.61 2.82-1.38z"/>
                      </svg>
                      <span>Apple</span>
                    </button>
                  </div>
                </>
              )}
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

      {/* ===================================================
          SOCIAL AUTH MODAL (Google & Apple SSO Dialog)
          =================================================== */}
      {socialModal && (
        <div className="social-modal-overlay" onClick={() => !socialLoading && setSocialModal(null)}>
          <div className="social-modal-box" onClick={(e) => e.stopPropagation()}>
            {/* Modal Close Button */}
            <button 
              type="button" 
              className="social-modal-close" 
              onClick={() => !socialLoading && setSocialModal(null)}
              disabled={socialLoading}
              title="Close"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: socialModal.provider === 'Apple' ? '#000000' : '#FFFFFF',
                border: socialModal.provider === 'Apple' ? '2px solid rgba(255,255,255,0.2)' : '1px solid #E2E8F0',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto'
              }}>
                {socialModal.provider === 'Google' ? (
                  <svg viewBox="0 0 24 24" width="28" height="28">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFFFFF">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-1 .04-2.13.67-2.76 1.44-.57.69-1.06 1.8-1 2.87 1.13.09 2.2-.61 2.82-1.38z"/>
                  </svg>
                )}
              </div>
              <h4 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--color-primary-blue)', margin: '0 0 6px 0' }}>
                {socialModal.mode === 'register' ? `Register with ${socialModal.provider}` : `Sign in with ${socialModal.provider}`}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                Instant single sign-on authentication for ACE Global Customer Portal
              </p>
            </div>

            {/* Profile Authorization Box */}
            <div style={{
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-bg-alt, #F8FAFC)',
              border: '1px solid var(--border-color, #E2E8F0)',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--text-muted)' }}>
                  Authorized Profile
                </span>
                <span style={{
                  fontSize: '11px',
                  color: '#16A34A',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={13} />
                  Verified Identity
                </span>
              </div>

              <div className="ace-form-group" style={{ marginBottom: '10px' }}>
                <label className="ace-label" style={{ fontSize: '11.5px' }}>Account Full Name</label>
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
                <label className="ace-label" style={{ fontSize: '11.5px' }}>{socialModal.provider} Email Address</label>
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

            {/* Action Button */}
            <button
              type="button"
              onClick={handleCompleteSocialAuth}
              disabled={socialLoading}
              className="ace-btn"
              style={{
                width: '100%',
                height: '46px',
                fontSize: '14.5px',
                fontWeight: 700,
                backgroundColor: socialModal.provider === 'Apple' ? '#000000' : '#4285F4',
                borderColor: socialModal.provider === 'Apple' ? '#000000' : '#4285F4',
                color: '#FFFFFF',
                marginBottom: '10px'
              }}
            >
              {socialLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Loader2 size={16} className="ace-spinner" />
                  <span>Connecting & Syncing...</span>
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span>Continue to Customer Portal</span>
                  <ArrowRight size={16} />
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => !socialLoading && setSocialModal(null)}
              disabled={socialLoading}
              style={{
                width: '100%',
                height: '34px',
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            {/* Security Notice Footer */}
            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-color, #E2E8F0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11px',
              color: 'var(--text-muted)'
            }}>
              <Shield size={12} color="#10B981" />
              <span>Protected by 256-bit SSL & Supabase Cloud Security</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Social Authentication Divider */
        .social-auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 18px 0 14px 0;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .social-auth-divider::before,
        .social-auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-color, #E2E8F0);
        }
        .social-auth-divider::before {
          margin-right: 12px;
        }
        .social-auth-divider::after {
          margin-left: 12px;
        }

        /* Social Auth Buttons Grid */
        .social-auth-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 18px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          height: 42px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          outline: none;
        }
        .social-btn:hover {
          transform: translateY(-1px);
        }
        .social-btn:active {
          transform: translateY(0);
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
        }

        /* Dark mode overrides */
        [data-theme="dark"] .social-auth-divider,
        .dark-mode .social-auth-divider {
          color: #94A3B8;
        }
        [data-theme="dark"] .social-auth-divider::before,
        [data-theme="dark"] .social-auth-divider::after,
        .dark-mode .social-auth-divider::before,
        .dark-mode .social-auth-divider::after {
          border-color: rgba(255, 255, 255, 0.12);
        }

        [data-theme="dark"] .social-btn-google,
        .dark-mode .social-btn-google {
          background-color: #1E293B;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #F8FAFC;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        [data-theme="dark"] .social-btn-google:hover,
        .dark-mode .social-btn-google:hover {
          background-color: #334155;
          border-color: rgba(255, 255, 255, 0.25);
        }

        [data-theme="dark"] .social-btn-apple,
        .dark-mode .social-btn-apple {
          background-color: #FFFFFF;
          border: 1px solid #FFFFFF;
          color: #0F172A;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        [data-theme="dark"] .social-btn-apple:hover,
        .dark-mode .social-btn-apple:hover {
          background-color: #E2E8F0;
          border-color: #E2E8F0;
        }

        /* Modal Overlay & Box */
        .social-modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(6px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: socialFadeIn 0.2s ease-out;
        }
        .social-modal-box {
          background-color: var(--color-white, #FFFFFF);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
          width: 100%;
          max-width: 420px;
          padding: 28px 24px;
          position: relative;
          animation: socialScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .social-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.15s ease;
        }
        .social-modal-close:hover {
          background-color: rgba(0,0,0,0.06);
          color: var(--text-primary);
        }
        [data-theme="dark"] .social-modal-box,
        .dark-mode .social-modal-box {
          background-color: #1E293B;
          border-color: rgba(255, 255, 255, 0.12);
        }
        [data-theme="dark"] .social-modal-close:hover,
        .dark-mode .social-modal-close:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
        }

        @keyframes socialFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes socialScaleUp {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        .ace-spinner {
          animation: aceSpin 1s linear infinite;
        }
        @keyframes aceSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

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
          .social-auth-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
