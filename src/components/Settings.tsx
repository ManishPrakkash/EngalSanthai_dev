import React, { useState } from 'react';
import type { User } from '../../types/types';
import Button from './ui/Button.tsx';
import { EyeIcon, UserCircleIcon, LockClosedIcon, CheckCircleIcon } from './ui/Icon.tsx';
import Toast from './ui/Toast.tsx';

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileData {
  name: string;
  email: string;
}

interface SettingsProps {
  user: User;
  onUpdateProfile: (profile: ProfileData) => void;
  onChangePassword: (passwords: PasswordChangeData) => void;
}

// Generic Card component for settings
const SettingsCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
    {children}
  </div>
);

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileData {
  name: string;
  email: string;
}

interface SettingsProps {
  user: User;
  onUpdateProfile: (profile: ProfileData) => void;
  onChangePassword: (passwords: PasswordChangeData) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateProfile, onChangePassword }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Profile form state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user.name,
    email: user.email || '', // Assuming email might be added to User type
  });

  // Password form state
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    language: 'en',
    autoBackup: true,
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onUpdateProfile(profileData);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to update profile. Please try again.', type: 'error' });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({ message: 'New passwords do not match!', type: 'error' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setToast({ message: 'Password must be at least 6 characters long!', type: 'error' });
      return;
    }

    try {
      onChangePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setToast({ message: 'Password changed successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to change password. Please check your current password.', type: 'error' });
    }
  };

  const tabs = [
    { id: 'profile' as const, name: 'Profile', icon: <UserCircleIcon className="h-5 w-5" /> },
    { id: 'password' as const, name: 'Password', icon: <LockClosedIcon className="h-5 w-5" /> },
    { id: 'preferences' as const, name: 'Preferences', icon: <CheckCircleIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <SettingsCard className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
            <p className="text-gray-600">Update your personal information and contact details.</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 capitalize"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User ID
                </label>
                <input
                  type="text"
                  value={user.id}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </SettingsCard>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <SettingsCard className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Change Password</h2>
            <p className="text-gray-600">Ensure your account is using a long, random password to stay secure.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters long.</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit">
                Change Password
              </Button>
            </div>
          </form>
        </SettingsCard>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <SettingsCard className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Preferences</h2>
            <p className="text-gray-600">Customize your application experience and notifications.</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.notifications}
                  onChange={(e) => setPreferences({ ...preferences, notifications: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Dark Mode</h3>
                <p className="text-sm text-gray-500">Switch to dark theme for better viewing in low light</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.darkMode}
                  onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Auto Backup</h3>
                <p className="text-sm text-gray-500">Automatically backup your data daily</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={preferences.autoBackup}
                  onChange={(e) => setPreferences({ ...preferences, autoBackup: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                id="language"
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
              </select>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => setToast({ message: 'Preferences saved successfully!', type: 'success' })}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </SettingsCard>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Settings;