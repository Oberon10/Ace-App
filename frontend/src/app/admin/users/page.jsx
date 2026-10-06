'use client';

import React from 'react';
import UserManagementView from '../../../views/UserManagementView';
import { useApp } from '../../../context/AppContext';

export default function AdminUsersPage() {
  const { navigate, activeRole, setActiveRole } = useApp();

  return (
    <UserManagementView 
      setView={navigate} 
      activeRole={activeRole} 
      setActiveRole={setActiveRole}
      initialFilter="ALL"
      currentView="users"
    />
  );
}
