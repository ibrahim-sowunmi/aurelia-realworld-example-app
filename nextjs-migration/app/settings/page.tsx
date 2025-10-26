'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import type { UpdateUserData } from '@/types';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<UpdateUserData>({
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
        password: '' // Password is never pre-filled
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    
    try {
      const dataToUpdate: UpdateUserData = {};
      
      if (formData.image !== user?.image) dataToUpdate.image = formData.image;
      if (formData.username !== user?.username) dataToUpdate.username = formData.username;
      if (formData.bio !== user?.bio) dataToUpdate.bio = formData.bio;
      if (formData.email !== user?.email) dataToUpdate.email = formData.email;
      if (formData.password) dataToUpdate.password = formData.password;
      
      await updateUser(dataToUpdate);
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      }
    }
  };
  
  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  if (!user) {
    return <div className="container page">Loading...</div>;
  }
  
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            
            {errors && (
              <ul className="error-messages">
                {Object.keys(errors).map((key) => (
                  <li key={key}>
                    {key} {errors[key]}
                  </li>
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
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
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
                  />
                </fieldset>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                >
                  Update Settings
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
