'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import type { UpdateUserData } from '../../../types';

export default function SettingsComponent() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();
  
  const [formData, setFormData] = useState<UpdateUserData>({
    image: user?.image || '',
    username: user?.username || '',
    bio: user?.bio || '',
    email: user?.email || '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors(null);

    try {
      const updatedData: UpdateUserData = {};
      
      if (formData.image !== user?.image) updatedData.image = formData.image;
      if (formData.username !== user?.username) updatedData.username = formData.username;
      if (formData.bio !== user?.bio) updatedData.bio = formData.bio;
      if (formData.email !== user?.email) updatedData.email = formData.email;
      if (formData.password) updatedData.password = formData.password;
      
      await updateUser(updatedData);
    } catch (error: any) {
      console.error('Settings update error:', error);
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({ 'Error': ['An unexpected error occurred.'] });
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
    router.push('/login');
    return null;
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
              <fieldset disabled={isSubmitting}>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleInputChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="New Password"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleInputChange}
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
