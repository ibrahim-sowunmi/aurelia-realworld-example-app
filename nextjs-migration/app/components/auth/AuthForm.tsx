'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSave = type === 'login'
    ? email !== '' && password !== ''
    : username !== '' && email !== '' && password !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setIsSubmitting(true);

    try {
      const credentials = {
        username,
        email,
        password,
      };

      if (type === 'login') {
        await login(credentials);
      } else {
        await register(credentials);
      }
      router.push('/');
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ 'Error': ['An unexpected error occurred'] });
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
            <h1 className="text-xs-center">Sign {type === 'login' ? 'in' : 'up'}</h1>
            <p className="text-xs-center">
              {type === 'register' ? (
                <a href="/login">Have an account?</a>
              ) : (
                <a href="/register">Need an account?</a>
              )}
            </p>

            {errors && (
              <ul className="error-messages">
                {Object.keys(errors).map(key => (
                  errors[key].map((error, index) => (
                    <li key={`${key}-${index}`}>{key} {error}</li>
                  ))
                ))}
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
                    disabled={isSubmitting}
                  />
                </fieldset>
              )}
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
