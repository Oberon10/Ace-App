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
  Globe2
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
