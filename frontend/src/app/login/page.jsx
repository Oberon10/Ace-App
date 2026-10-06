'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LoginView from '../../views/LoginView';
import { useApp } from '../../context/AppContext';

function LoginContent() {
  const searchParams = useSearchParams();
  const portalParam = searchParams.get('portal');
  const redirectParam = searchParams.get('redirect');

  const { 
    handleLoginSuccess, 
    navigate, 
    loginPortal, 
    authNotice, 
    theme, 
    toggleTheme 
  } = useApp();

  return (
    <LoginView 
      onLoginSuccess={(role, userObj) => handleLoginSuccess(role, userObj, redirectParam)} 
      setView={navigate} 
      initialPortal={portalParam || loginPortal || 'customer'} 
      authNotice={authNotice} 
      theme={theme} 
      toggleTheme={toggleTheme} 
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Loading authentication portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
