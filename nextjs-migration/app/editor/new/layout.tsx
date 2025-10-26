import React from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function NewEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
