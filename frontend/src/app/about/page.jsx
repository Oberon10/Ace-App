'use client';

import React from 'react';
import AboutView from '../../views/AboutView';
import { useApp } from '../../context/AppContext';

export default function AboutPage() {
  const { navigate } = useApp();

  return (
    <AboutView setView={navigate} />
  );
}
