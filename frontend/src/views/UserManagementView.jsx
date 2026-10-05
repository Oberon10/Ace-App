import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { USERS_LIST } from '../data/shipments';
import { 
  Users, 
  Plus, 
  ShieldCheck, 
  Mail, 
  CheckCircle2, 
  UserCheck, 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  Copy, 
  Check, 
  Search, 
  ShieldAlert, 
  KeyRound, 
  Phone, 
  AlertTriangle, 
  ArrowRight, 
  Building2, 
  Truck, 
  RefreshCw,
  Shield
} from 'lucide-react';
import { syncCustomerToSupabase } from '../lib/supabase';

export default function UserManagementView({ 
  setView, 
  activeRole, 
  setActiveRole,
  initialFilter = 'ALL',
  currentView = 'users'
}) {
  const [users, setUsers] = useState(USERS_LIST);
  const [activeFilter, setActiveFilter] = useState(initialFilter); // 'ALL', 'Staff', 'Customer', 'Admin'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Password visibility state: set of user ids currently revealed
  const [revealedPasswords, setRevealedPasswords] = useState(new Set());
  const [showAllPasswords, setShowAllPasswords] = useState(false);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [inspectUser, setInspectUser] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('Staff');
  const [newUserDept, setNewUserDept] = useState('Terminal Operations');
  const [newUserPhone, setNewUserPhone] = useState('+44 20 7946 0000');

  // Copy helper
  const handleCopy = (text, fieldId) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Toggle single user password visibility
  const togglePasswordVisibility = (id) => {
    setRevealedPasswords(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle all passwords
  const handleToggleAllPasswords = () => {
    if (showAllPasswords) {
      setRevealedPasswords(new Set());
      setShowAllPasswords(false);
    } else {
      setRevealedPasswords(new Set(users.map(u => u.id)));
      setShowAllPasswords(true);
    }
  };

  // Toggle active / inactive status
  const toggleStatus = (id) => {
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return u;
    });
    setUsers(updatedUsers);
    
    // Sync status change to localStorage for staff
    const targetUser = updatedUsers.find(u => u.id === id);
    if (targetUser && targetUser.role?.toLowerCase() === 'staff') {
      try {
        const raw = localStorage.getItem('ace_registered_staff');
        const list = raw ? JSON.parse(raw) : [];
        const filtered = list.filter(s => s.email?.trim().toLowerCase() !== targetUser.email?.trim().toLowerCase());
        filtered.push(targetUser);
        localStorage.setItem('ace_registered_staff', JSON.stringify(filtered));
      } catch (err) {
        console.error('Failed to sync staff status to localStorage', err);
      }
    }

    if (inspectUser && inspectUser.id === id) {
      setInspectUser(prev => ({ ...prev, status: prev.status === 'Active' ? 'Inactive' : 'Active' }));
    }
  };

  // Add new user
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const generatedScope = newUserRole === 'Admin' 
      ? 'Full All-Portals Executive Authority (Privileged to view staff & customer login details)'
      : newUserRole === 'Staff'
      ? 'Terminal Dispatcher & Customer Console Only'
      : 'Personal Shipments & Telemetry Records Only';

    const created = {
      id: `usr-${users.length + 1}`,
      name: newUserName,
      email: newUserEmail,
      loginPassword: newUserPassword || 'TempPass#' + Math.floor(1000 + Math.random() * 9000),
      role: newUserRole,
      department: newUserDept,
      phone: newUserPhone,
      status: 'Active',
      lastLogin: 'Just now',
      accessScope: generatedScope
    };

    setUsers([created, ...users]);

    // Persist to localStorage so the new user can log in immediately
    if (newUserRole === 'Staff') {
      try {
        const raw = localStorage.getItem('ace_registered_staff');
        const list = raw ? JSON.parse(raw) : [];
        const filtered = list.filter(s => s.email?.trim().toLowerCase() !== newUserEmail.trim().toLowerCase());
        filtered.push(created);
        localStorage.setItem('ace_registered_staff', JSON.stringify(filtered));
      } catch (err) {
        console.error('Failed to sync staff to localStorage', err);
      }
    } else if (newUserRole === 'Customer') {
      try {
        const raw = localStorage.getItem('ace_registered_customers');
        const list = raw ? JSON.parse(raw) : [];
        const filtered = list.filter(c => c.email?.trim().toLowerCase() !== newUserEmail.trim().toLowerCase());
        filtered.push(created);
        localStorage.setItem('ace_registered_customers', JSON.stringify(filtered));

        // Sync new customer directly to Supabase customers table
        syncCustomerToSupabase({
          name: newUserName,
          emailAddress: newUserEmail,
          phoneNumber: newUserPhone,
          country: newUserLocation || 'Ghana',
          password: newUserPassword,
          items: 'General Commercial Cargo & Freight'
        });
      } catch (err) {
        console.error('Failed to sync customer to localStorage or Supabase', err);
      }
    }

    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserPhone('+44 20 7946 0000');
    setAddModalOpen(false);
  };

  // Filtered users
  const filteredUsers = users.filter(u => {
    // Role filter
    if (activeFilter !== 'ALL' && u.role.toLowerCase() !== activeFilter.toLowerCase()) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (u.name || '').toLowerCase().includes(q);
      const matchEmail = (u.email || '').toLowerCase().includes(q);
      const matchDept = (u.department || '').toLowerCase().includes(q);
      const matchRole = (u.role || '').toLowerCase().includes(q);
      const matchPhone = (u.phone || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchDept || matchRole || matchPhone;
    }
    return true;
  });

  // Security Check: Only Admin has administrative privilege to view this management console
  if (activeRole !== 'admin') {
    return (
      <div className="ace-dashboard-layout">
        <Sidebar 
          role={activeRole} 
          currentView={currentView} 
          setView={setView} 
          setActiveRole={setActiveRole} 
        />
        <main className="ace-dashboard-main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="ace-card" style={{ maxWidth: '520px', textAlign: 'center', padding: '40px 32px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              backgroundColor: '#FEE2E2', 
              color: '#DC2626', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px' 
            }}>
              <ShieldAlert size={32} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-primary-blue)', marginBottom: '10px' }}>
              Administrative Privilege Required
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              Access to personnel records and the administrative authority to view <strong>Staff and Customer login credentials</strong> is strictly restricted to System Administrators.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setView(activeRole === 'staff' ? 'staff-dashboard' : 'customer-dashboard')} 
                className="ace-btn ace-btn-secondary"
              >
                Return to My Console
              </button>
              <button 
                onClick={() => {
                  setActiveRole('guest');
                  setView('login');
                }} 
                className="ace-btn ace-btn-action"
              >
                Sign In as Administrator
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="ace-dashboard-layout">
      <Sidebar 
        role="admin" 
        currentView={currentView} 
        setView={setView} 
        setActiveRole={setActiveRole} 
      />

      <main className="ace-dashboard-main">
        {/* ADMINISTRATIVE SECURITY CLEARANCE BANNER */}
        <div style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '12px',
          padding: '18px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.15)',
          borderLeft: '4px solid #38BDF8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38BDF8',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  ADMINISTRATIVE PRIVILEGE ACTIVE
                </span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>• Executive Clearance Level 1</span>
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#E2E8F0', lineHeight: 1.4 }}>
                As an <strong>Administrator</strong>, you possess the exclusive administrative privilege to view, audit, and provision login credentials for all <strong>Staff Dispatchers</strong> and <strong>Customer Accounts</strong>.
              </p>
            </div>
          </div>

          <div className="admin-banner-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleToggleAllPasswords}
              style={{
                backgroundColor: showAllPasswords ? '#DC2626' : 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                transition: 'all 0.15s ease'
              }}
            >
              {showAllPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
              <span>{showAllPasswords ? 'Mask All Passwords' : 'Show All Passwords'}</span>
            </button>
            <button
              onClick={() => setAddModalOpen(true)}
              className="ace-btn ace-btn-action"
              style={{ fontSize: '12.5px', padding: '7px 16px' }}
            >
              <Plus size={15} />
              <span>Provision User</span>
            </button>
          </div>
        </div>

        {/* Header & Overview Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', color: 'var(--color-primary-blue)', fontWeight: 800, margin: 0 }}>
              Personnel & Credentials Directory
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Administrative oversight for corporate staff dispatchers, warehouse operators, and verified customer portals.
            </p>
          </div>

          {/* Quick Counter Badges */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="ace-card" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={16} color="var(--color-bright-action)" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ACCOUNTS</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary-blue)' }}>{users.length}</div>
              </div>
            </div>
            <div className="ace-card" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={16} color="#0D9488" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>STAFF DISPATCHERS</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0D9488' }}>
                  {users.filter(u => u.role === 'Staff').length}
                </div>
              </div>
            </div>
            <div className="ace-card" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building2 size={16} color="#1683D8" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>CUSTOMERS</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1683D8' }}>
                  {users.filter(u => u.role === 'Customer').length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '20px'
        }}>
          {/* Category Filter Tabs */}
          <div className="ace-filter-scroll" style={{ display: 'flex', gap: '8px', maxWidth: '100%', overflowX: 'auto', paddingBottom: '4px' }}>
            {[
              { id: 'ALL', label: `All Accounts (${users.length})` },
              { id: 'Staff', label: `Staff Personnel (${users.filter(u => u.role === 'Staff').length})` },
              { id: 'Customer', label: `Customer Accounts (${users.filter(u => u.role === 'Customer').length})` },
              { id: 'Admin', label: `Administrators (${users.filter(u => u.role === 'Admin').length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeFilter === tab.id ? '1px solid var(--color-primary-blue)' : '1px solid var(--color-border)',
                  backgroundColor: activeFilter === tab.id ? 'var(--color-primary-blue)' : 'var(--color-white)',
                  color: activeFilter === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 240px', maxWidth: '100%' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search user, email, dept, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ace-input"
              style={{ paddingLeft: '36px', height: '38px', fontSize: '13px', width: '100%' }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Personnel & Credentials Table */}
        <div className="ace-table-container">
          <table className="ace-table">
            <thead>
              <tr>
                <th>User / Identity</th>
                <th>Role Tier</th>
                <th>Login Email (Clearance)</th>
                <th>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <KeyRound size={13} color="var(--color-bright-action)" />
                    <span>Login Password (Admin View)</span>
                  </div>
                </th>
                <th>Department / Organization</th>
                <th>Access Scope & Clearance</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-secondary)' }}>
                    No accounts matching current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const isPasswordRevealed = showAllPasswords || revealedPasswords.has(u.id);

                  return (
                    <tr key={u.id}>
                      {/* Name & Phone */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: u.role === 'Admin' ? '#FEF3C7' : u.role === 'Staff' ? '#CCFBF1' : 'var(--color-light-blue)',
                            color: u.role === 'Admin' ? '#B45309' : u.role === 'Staff' ? '#0F766E' : 'var(--color-primary-blue)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '13px'
                          }}>
                            {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--color-primary-blue)', fontSize: '13.5px' }}>
                              {u.name}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={10} /> {u.phone || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td>
                        <span style={{
                          backgroundColor: u.role === 'Admin' ? '#FEF3C7' : u.role === 'Staff' ? '#CCFBF1' : '#E0F2FE',
                          color: u.role === 'Admin' ? '#B45309' : u.role === 'Staff' ? '#0F766E' : '#0369A1',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {u.role === 'Admin' && <Shield size={11} />}
                          {u.role === 'Staff' && <Truck size={11} />}
                          {u.role === 'Customer' && <Building2 size={11} />}
                          {u.role}
                        </span>
                      </td>

                      {/* Login Email */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12.5px', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                            {u.email}
                          </span>
                          <button
                            onClick={() => handleCopy(u.email, `email-${u.id}`)}
                            title="Copy email"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              color: copiedField === `email-${u.id}` ? '#10B981' : 'var(--text-muted)'
                            }}
                          >
                            {copiedField === `email-${u.id}` ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </div>
                      </td>

                      {/* Login Password with Show/Hide Toggle */}
                      <td>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: 'var(--color-surface)',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid var(--color-border)'
                        }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontSize: '12.5px',
                            fontWeight: isPasswordRevealed ? 700 : 500,
                            color: isPasswordRevealed ? '#B45309' : 'var(--text-muted)',
                            letterSpacing: isPasswordRevealed ? 'normal' : '2px',
                            minWidth: '130px'
                          }}>
                            {isPasswordRevealed ? (u.loginPassword || 'StaffSecurePass#2026') : '••••••••••••'}
                          </span>

                          {/* Eye Toggle */}
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(u.id)}
                            title={isPasswordRevealed ? "Hide Password" : "View Password (Admin Privilege)"}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              color: isPasswordRevealed ? 'var(--color-bright-action)' : 'var(--text-muted)',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {isPasswordRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>

                          {/* Copy Password */}
                          {isPasswordRevealed && (
                            <button
                              type="button"
                              onClick={() => handleCopy(u.loginPassword || 'StaffSecurePass#2026', `pass-${u.id}`)}
                              title="Copy password"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px',
                                color: copiedField === `pass-${u.id}` ? '#10B981' : 'var(--text-muted)',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              {copiedField === `pass-${u.id}` ? <Check size={13} /> : <Copy size={13} />}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Department / Org */}
                      <td style={{ fontSize: '12.5px' }}>{u.department}</td>

                      {/* Access Scope */}
                      <td>
                        <span style={{
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          display: 'inline-block',
                          maxWidth: '220px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }} title={u.accessScope}>
                          {u.accessScope || (u.role === 'Staff' ? 'Dispatcher & Terminal Only' : 'Client Shipments Only')}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: u.status === 'Active' ? '#059669' : '#94A3B8'
                        }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: u.status === 'Active' ? '#10B981' : '#94A3B8' }} />
                          {u.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <button
                          onClick={() => setInspectUser(u)}
                          className="ace-btn ace-btn-ghost ace-btn-sm"
                          style={{ fontSize: '11.5px', marginRight: '6px', color: 'var(--color-primary-blue)', fontWeight: 600 }}
                        >
                          Inspect Details
                        </button>
                        <button
                          onClick={() => toggleStatus(u.id)}
                          className="ace-btn ace-btn-ghost ace-btn-sm"
                          style={{ fontSize: '11.5px', color: u.status === 'Active' ? '#DC2626' : '#059669' }}
                        >
                          {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ===================================================
            MODAL: INSPECT PERSONNEL LOGIN DOSSIER (ADMIN ONLY)
            =================================================== */}
        {inspectUser && (
          <div className="ace-modal-backdrop" onClick={() => setInspectUser(null)}>
            <div className="ace-modal" onClick={e => e.stopPropagation()} style={{ padding: '30px', maxWidth: '560px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px', borderBottom: '1px solid var(--color-border)', paddingBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                      ADMINISTRATIVE CREDENTIAL DOSSIER
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {inspectUser.id}</span>
                  </div>
                  <h3 style={{ fontSize: '20px', color: 'var(--color-primary-blue)', fontWeight: 800, margin: 0 }}>
                    {inspectUser.name}
                  </h3>
                </div>
                <button 
                  onClick={() => setInspectUser(null)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Administrative Notice */}
              <div style={{
                backgroundColor: 'var(--color-light-blue)',
                border: '1px solid #BAE6FD',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '20px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}>
                <ShieldCheck size={20} color="var(--color-bright-action)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '12px', color: 'var(--color-primary-blue)', lineHeight: 1.4 }}>
                  Verified Admin Privilege: You are viewing confidential authentication keys and login routing parameters.
                </span>
              </div>

              {/* Credential Details Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {/* Role & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Assigned Role</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary-blue)', marginTop: '4px' }}>
                      {inspectUser.role}
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Account Status</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: inspectUser.status === 'Active' ? '#059669' : '#94A3B8', marginTop: '4px' }}>
                      {inspectUser.status}
                    </div>
                  </div>
                </div>

                {/* Login Email */}
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Login Email Address
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {inspectUser.email}
                    </span>
                    <button
                      onClick={() => handleCopy(inspectUser.email, 'modal-email')}
                      className="ace-btn ace-btn-ghost ace-btn-sm"
                      style={{ fontSize: '11.5px', gap: '4px' }}
                    >
                      {copiedField === 'modal-email' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                      <span>{copiedField === 'modal-email' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Login Password */}
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    System Password / Login Passphrase
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700, color: '#B45309' }}>
                      {inspectUser.loginPassword || 'StaffSecurePass#2026'}
                    </span>
                    <button
                      onClick={() => handleCopy(inspectUser.loginPassword || 'StaffSecurePass#2026', 'modal-password')}
                      className="ace-btn ace-btn-ghost ace-btn-sm"
                      style={{ fontSize: '11.5px', gap: '4px' }}
                    >
                      {copiedField === 'modal-password' ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                      <span>{copiedField === 'modal-password' ? 'Copied' : 'Copy Password'}</span>
                    </button>
                  </div>
                </div>

                {/* Phone & Department */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
                  <div style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Phone Number</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {inspectUser.phone || '+44 20 7946 0199'}
                    </div>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Department / Hub</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {inspectUser.department}
                    </div>
                  </div>
                </div>

                {/* Access Scope */}
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Access Clearance & Portal Scope
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {inspectUser.accessScope || (
                      inspectUser.role === 'Admin'
                        ? 'Full Executive Authority: Live Telemetry, All Portals, Analytics, User Management & Credential Audits.'
                        : inspectUser.role === 'Staff'
                        ? 'Authorized for Staff Dispatcher and Customer Portal View only. Prohibited from Admin Command.'
                        : 'Authorized for Personal Deliveries & Tracking Telemetry only. Restricted from other accounts.'
                    )}
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => toggleStatus(inspectUser.id)}
                  className="ace-btn ace-btn-ghost"
                  style={{ color: inspectUser.status === 'Active' ? '#DC2626' : '#059669', fontSize: '13px' }}
                >
                  {inspectUser.status === 'Active' ? 'Deactivate Account' : 'Reactivate Account'}
                </button>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const dossierText = `User: ${inspectUser.name}\nRole: ${inspectUser.role}\nEmail: ${inspectUser.email}\nPassword: ${inspectUser.loginPassword || 'StaffSecurePass#2026'}\nPhone: ${inspectUser.phone}\nDepartment: ${inspectUser.department}\nAccess Scope: ${inspectUser.accessScope}`;
                      handleCopy(dossierText, 'modal-all');
                    }}
                    className="ace-btn ace-btn-secondary"
                    style={{ fontSize: '13px' }}
                  >
                    {copiedField === 'modal-all' ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                    <span>{copiedField === 'modal-all' ? 'Dossier Copied!' : 'Copy Full Dossier'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInspectUser(null)}
                    className="ace-btn ace-btn-action"
                    style={{ fontSize: '13px' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            MODAL: ADD NEW USER WITH CREDENTIALS (ADMIN ONLY)
            =================================================== */}
        {addModalOpen && (
          <div className="ace-modal-backdrop" onClick={() => setAddModalOpen(false)}>
            <div className="ace-modal" onClick={e => e.stopPropagation()} style={{ padding: '28px', maxWidth: '500px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: 'var(--color-primary-blue)', fontWeight: 800, margin: 0 }}>
                    Provision New Platform Account
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                    Configure credentials and grant portal permissions.
                  </p>
                </div>
                <button onClick={() => setAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddUser}>
                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Full Name</label>
                  <input
                    type="text"
                    className="ace-input"
                    placeholder="e.g. Samuel Adjei"
                    value={newUserName}
                    onChange={e => setNewUserName(e.target.value)}
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Email Address (Login Identity)</label>
                  <input
                    type="email"
                    className="ace-input"
                    placeholder="e.g. s.adjei@acelogistics.com"
                    value={newUserEmail}
                    onChange={e => setNewUserEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="ace-form-group">
                  <label className="ace-label ace-label-required">Initial Login Password</label>
                  <input
                    type="text"
                    className="ace-input"
                    placeholder="e.g. StaffSecurePass#2026"
                    value={newUserPassword}
                    onChange={e => setNewUserPassword(e.target.value)}
                    required
                  />
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Admin clearance allows you to record this password for credential tracking.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                  <div className="ace-form-group">
                    <label className="ace-label ace-label-required">Role Permission</label>
                    <select
                      className="ace-select"
                      value={newUserRole}
                      onChange={e => setNewUserRole(e.target.value)}
                    >
                      <option value="Staff">Staff Dispatcher</option>
                      <option value="Customer">Customer Account</option>
                      <option value="Admin">Administrator</option>
                    </select>
                  </div>

                  <div className="ace-form-group">
                    <label className="ace-label">Contact Phone</label>
                    <input
                      type="text"
                      className="ace-input"
                      value={newUserPhone}
                      onChange={e => setNewUserPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="ace-form-group">
                  <label className="ace-label">Department / Branch Organization</label>
                  <input
                    type="text"
                    className="ace-input"
                    value={newUserDept}
                    onChange={e => setNewUserDept(e.target.value)}
                  />
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" onClick={() => setAddModalOpen(false)} className="ace-btn ace-btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="ace-btn ace-btn-action">
                    Create & Save Credentials
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <style>{`
          @media (max-width: 640px) {
            .admin-banner-actions {
              width: 100%;
            }
            .admin-banner-actions button {
              flex: 1;
              justify-content: center;
            }
          }
        `}</style>
      </main>
    </div>
  );
}
