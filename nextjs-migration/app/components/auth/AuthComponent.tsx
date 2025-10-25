'use client';

import React, { useState, FormEvent, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import type { LoginCredentials, RegisterCredentials } from '@/types';

interface AuthComponentProps {
  type: 'login' | 'register';
}

export default function AuthComponent({ type }: AuthComponentProps) {
  const router = useRouter();
  const { login, register: registerUser } = useAuth();
  
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const canSave = useMemo(() => {
    if (type === 'login') {
      return email !== '' && password !== '';
    } else {
      return username !== '' && email !== '' && password !== '';
    }
  }, [type, username, email, password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setIsSubmitting(true);

    try {
      if (type === 'login') {
        const credentials: LoginCredentials = {
          email,
          password,
        };
        await login(credentials);
      } else {
        const credentials: RegisterCredentials = {
          username,
          email,
          password,
        };
        await registerUser(credentials);
      }
      
      router.push('/');
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ 'Error': ['An unexpected error occurred.'] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">
              Sign {type === 'login' ? 'in' : 'up'}
            </h1>
            <p className="text-xs-center">
              {type === 'register' ? (
                <Link href="/login">Have an account?</Link>
              ) : (
                <Link href="/register">Need an account?</Link>
              )}
            </p>

            {errors && (
              <ul className="error-messages">
                {Object.entries(errors).map(([key, messages]) => 
                  messages.map((message, index) => (
                    <li key={`${key}-${index}`}>
                      {key} {message}
                    </li>
                  ))
                )}
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              {type === 'register' && (
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </fieldset>
              )}
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </fieldset>
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                disabled={!canSave || isSubmitting}
              >
                Sign {type === 'login' ? 'in' : 'up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
