'use client';

import { useState } from 'react';
import { X, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface TeacherSettingsModalProps {
  onClose: () => void;
  teacherName: string;
}

export default function TeacherSettingsModal({ onClose, teacherName }: TeacherSettingsModalProps) {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate passwords
      if (!currentPassword || !newPassword || !confirmPassword) {
        setError('All fields are required');
        setIsLoading(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError('New passwords do not match');
        setIsLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters');
        setIsLoading(false);
        return;
      }

      // Get teacher info from localStorage
      const teacherId = localStorage.getItem('teacherId');
      if (!teacherId) {
        setError('Teacher not found. Please log in again.');
        setIsLoading(false);
        return;
      }

      // Call API to update password
      const response = await fetch(`/api/teachers/${teacherId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to update password');
        setIsLoading(false);
        return;
      }

      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-purple-900/30 to-black/90 backdrop-blur-md flex items-center justify-center p-2 z-50 animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/20 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.3)] w-full max-w-md border-2 border-purple-500/30 flex flex-col h-auto max-h-[96vh]">
        {/* Futuristic glow effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        
        {/* Header with gradient */}
        <div className="relative flex items-center justify-between px-5 py-3 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Account Settings
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="group relative text-gray-400 hover:text-white p-1.5 rounded-lg transition-all duration-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/50"
          >
            <X className="h-5 w-5 relative z-10" />
            <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 rounded-lg transition-all duration-300"></div>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 px-5 py-4 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-xs">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Teacher Name Display */}
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <p className="text-xs text-gray-400 mb-1">Logged in as:</p>
              <p className="text-sm text-white font-semibold">{teacherName}</p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h3 className="text-sm font-semibold text-white mb-3">Change Password</h3>

              {/* Current Password */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-400">Minimum 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Buttons */}
        <div className="flex justify-end space-x-3 px-5 py-3 border-t border-purple-500/20">
          <button
            type="button"
            onClick={onClose}
            className="group relative px-5 py-2 text-sm bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 text-gray-300 hover:text-white rounded-lg transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 font-medium"
          >
            <span className="relative z-10">Cancel</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="group relative overflow-hidden px-5 py-2 text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all duration-300 flex items-center space-x-2 border-2 border-purple-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Lock className="h-4 w-4 relative z-10" />
            <span className="relative z-10">
              {isLoading ? 'Updating...' : 'Update Password'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

