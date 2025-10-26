'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../lib/services/user';
import { UpdateUserData } from '../../types';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    image: '',
    username: '',
    bio: '',
    email: '',
    password: ''
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        image: user.image || '',
        username: user.username || '',
        bio: user.bio || '',
        email: user.email || '',
        password: ''
      });
      setIsLoading(false);
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSaving) return;
    
    setIsSaving(true);
    setErrors({});
    
    try {
      const updateData: UpdateUserData = {};
      if (formData.image) updateData.image = formData.image;
      if (formData.username) updateData.username = formData.username;
      if (formData.bio) updateData.bio = formData.bio;
      if (formData.email) updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;
      
      await userService.updateUser(updateData);
    } catch (error: any) {
      console.error('Error updating user:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ 
          'server': ['An unexpected error occurred. Please try again.'] 
        });
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  if (isLoading) {
    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <p>Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            
            {Object.keys(errors).length > 0 && (
              <ul className="error-messages">
                {Object.entries(errors).map(([key, messages]) => (
                  messages.map((message, index) => (
                    <li key={`${key}-${index}`}>{key} {message}</li>
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
                    onChange={handleInputChange}
                    disabled={isSaving}
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
                    disabled={isSaving}
                  />
                </fieldset>
                
                <fieldset className="form-group">
                  <textarea 
                    className="form-control form-control-lg" 
                    rows={8} 
                    placeholder="Short bio about you" 
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  ></textarea>
                </fieldset>
                
                <fieldset className="form-group">
                  <input 
                    className="form-control form-control-lg" 
                    type="text" 
                    placeholder="Email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                </fieldset>
                
                <fieldset className="form-group">
                  <input 
                    className="form-control form-control-lg" 
                    type="password" 
                    placeholder="New Password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                </fieldset>
                
                <button 
                  className="btn btn-lg btn-primary pull-xs-right" 
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? 'Updating...' : 'Update Settings'}
                </button>
              </fieldset>
            </form>
            
            <hr />
            <button 
              className="btn btn-outline-danger" 
              onClick={handleLogout}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
