"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import type { UpdateUserData } from "../../types";

export default function SettingsPage() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuth();
  
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setImage(user.image || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setEmail(user.email || "");
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors(null);
    setIsSubmitting(true);

    try {
      const userData: UpdateUserData = {
        image,
        username,
        bio,
        email
      };
      
      if (password) {
        userData.password = password;
      }
      
      await updateUser(userData);
      setPassword(""); // Clear password field after successful update
      setIsSubmitting(false);
    } catch (err: any) {
      if (err.errors) {
        setErrors(err.errors);
      }
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <ProtectedRoute>
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

              {errors && (
                <ul className="error-messages">
                  {Object.keys(errors).map(key => (
                    <li key={key}>{key} {errors[key]}</li>
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
                      value={image} 
                      onChange={e => setImage(e.target.value)} 
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input 
                      className="form-control form-control-lg" 
                      type="text" 
                      placeholder="Your Name" 
                      value={username} 
                      onChange={e => setUsername(e.target.value)} 
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <textarea 
                      className="form-control form-control-lg" 
                      rows={8} 
                      placeholder="Short bio about you" 
                      value={bio} 
                      onChange={e => setBio(e.target.value)} 
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input 
                      className="form-control form-control-lg" 
                      type="text" 
                      placeholder="Email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <input 
                      className="form-control form-control-lg" 
                      type="password" 
                      placeholder="New Password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
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
              >
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
