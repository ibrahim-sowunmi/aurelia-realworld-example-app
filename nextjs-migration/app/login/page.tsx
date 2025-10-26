import { AuthForm } from '@/components/auth/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in | Conduit',
  description: 'Sign in to Conduit',
};

export default function LoginPage() {
  return <AuthForm type="login" />;
}
