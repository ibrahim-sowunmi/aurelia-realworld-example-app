import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
