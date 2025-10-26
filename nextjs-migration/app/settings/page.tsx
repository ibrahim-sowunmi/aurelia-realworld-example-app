'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  
  const [formState, setFormState] = useState({
    image: '',
    username: '',
    bio: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormState({
        image: user.image || '',
        username: user.username || '',
        bio: user.bio || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    try {
      const updateData = Object.entries(formState)
        .filter(([key, value]) => {
          if (key === 'password') return value !== '';
          if (!user) return false;
          return value !== (user[key as keyof typeof user] || '');
        })
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

      if (Object.keys(updateData).length > 0) {
        await updateUser(updateData);
      }
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

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) {
    return <div className="settings-page">Loading...</div>;
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

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
              <fieldset>
                <fieldset className="form-group">
                  <input 
                    className="form-control" 
                    type="text" 
                    placeholder="URL of profile picture" 
                    name="image"
                    value={formState.image}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input 
                    className="form-control form-control-lg" 
                    type="text" 
                    placeholder="Your Name" 
                    name="username"
                    value={formState.username}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea 
                    className="form-control form-control-lg" 
                    rows={8} 
                    placeholder="Short bio about you"
                    name="bio"
                    value={formState.bio}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input 
                    className="form-control form-control-lg" 
                    type="email" 
                    placeholder="Email" 
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input 
                    className="form-control form-control-lg" 
                    type="password" 
                    placeholder="New Password" 
                    name="password"
                    value={formState.password}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </fieldset>
                <button 
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Update Settings
                </button>
              </fieldset>
            </form>

            <hr />
            <button 
              className="btn btn-outline-danger"
              onClick={handleLogout}
              disabled={isSubmitting}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
