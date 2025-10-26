'use client';

import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
