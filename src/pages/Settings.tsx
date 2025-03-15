import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, Store } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (currentPassword !== 'password123') { // Mock validation
      setError('Current password is incorrect');
      return;
    }

    // Mock email update
    setSuccess('Email updated successfully');
    setCurrentPassword('');
    setNewEmail('');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (currentPassword !== 'password123') { // Mock validation
      setError('Current password is incorrect');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    // Mock password update
    setSuccess('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleRestaurantNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (currentPassword !== 'password123') { // Mock validation
      setError('Current password is incorrect');
      return;
    }

    if (!restaurantName.trim()) {
      setError('Please enter a restaurant name');
      return;
    }

    // Mock restaurant name update
    setSuccess('Restaurant name updated successfully');
    setCurrentPassword('');
    setRestaurantName('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7f9f7] flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to access settings</h2>
          <p className="text-gray-600">Please sign in to manage your account settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="space-y-6">
        {/* Restaurant Name Change Form (Only for merchants) */}
        {user.type === 'merchant' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Store className="h-5 w-5 mr-2" />
              Change Restaurant Name
            </h2>
            <form onSubmit={handleRestaurantNameChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Restaurant Name
                </label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1db954] text-white py-2 px-4 rounded-full hover:bg-[#169c46] transition-colors"
              >
                Update Restaurant Name
              </button>
            </form>
          </div>
        )}

        {/* Email Change Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Change Email
          </h2>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1db954] text-white py-2 px-4 rounded-full hover:bg-[#169c46] transition-colors"
            >
              Update Email
            </button>
          </form>
        </div>

        {/* Password Change Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Change Password
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1db954] focus:ring focus:ring-[#1db954] focus:ring-opacity-50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1db954] text-white py-2 px-4 rounded-full hover:bg-[#169c46] transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;