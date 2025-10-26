'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    image: '',
    username: '',
    bio: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        image: user.image || '',
        username: user.username || '',
        bio: user.bio || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    try {
      await updateUser({
        ...formData,
        password: formData.password.length > 0 ? formData.password : undefined
      });
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

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return null; // Or redirect to login
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

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
              <fieldset>
                <fieldset className="form-group">
                  <input 
                    className="form-control" 
                    type="text" 
                    placeholder="URL of profile picture" 
                    name="image"
                    value={formData.image}
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
                    value={formData.username}
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
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input 
                    className="form-control form-control-lg" 
                    type="text" 
                    placeholder="Email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input 
                    className="form-control form-control-lg" 
                    type="password" 
                    placeholder="Password" 
                    name="password"
                    value={formData.password}
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
