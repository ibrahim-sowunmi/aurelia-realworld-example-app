import { AuthForm } from '@/components/auth/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up | Conduit',
  description: 'Create a new account on Conduit',
};

export default function RegisterPage() {
  return <AuthForm type="register" />;
}
