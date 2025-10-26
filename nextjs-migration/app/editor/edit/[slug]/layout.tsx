import React from 'react';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function EditEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
