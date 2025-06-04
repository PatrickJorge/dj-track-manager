import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User, Mail, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile logic would go here
    setIsEditing(false);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>
      
      <div className="bg-dark-800 border border-dark-700 rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10">
            <div className="bg-dark-700 h-24 w-24 rounded-full flex items-center justify-center">
              <User className="h-12 w-12 text-dark-400" />
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="label">Name</label>
                    <input
                      id="name"
                      type="text"
                      className="input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="label">Email</label>
                    <input
                      id="email"
                      type="email"
                      className="input bg-dark-700"
                      value={user?.email}
                      disabled
                    />
                    <p className="text-dark-400 text-xs mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="label">New Password (optional)</label>
                    <input
                      id="password"
                      type="password"
                      className="input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  
                  {password && (
                    <div>
                      <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
                      <input
                        id="confirmPassword"
                        type="password"
                        className="input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={!!password}
                      />
                      {password !== confirmPassword && (
                        <p className="text-error-500 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={password !== confirmPassword && !!password}
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">{user?.name}</h2>
                    <div className="flex items-center text-dark-300 mt-2">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-primary"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={logout}
                      className="btn-outline flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <h3 className="font-medium text-lg mb-2">Account Stats</h3>
          <div className="text-3xl font-bold text-primary-500">Pro</div>
          <p className="text-dark-400 text-sm mt-1">Account type</p>
        </div>
        
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <h3 className="font-medium text-lg mb-2">Storage</h3>
          <div className="w-full bg-dark-700 rounded-full h-2.5">
            <div className="bg-secondary-600 h-2.5 rounded-full w-1/4"></div>
          </div>
          <p className="text-dark-400 text-sm mt-2">250MB of 1GB used</p>
        </div>
        
        <div className="bg-dark-800 border border-dark-700 rounded-lg p-6">
          <h3 className="font-medium text-lg mb-2">Member Since</h3>
          <div className="text-lg font-medium">June 2023</div>
          <p className="text-dark-400 text-sm mt-1">1 year, 3 months</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;