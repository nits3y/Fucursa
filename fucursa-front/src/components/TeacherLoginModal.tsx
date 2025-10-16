'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, User, Lock, GraduationCap, AlertCircle } from 'lucide-react';
import { teacherApi, apiUtils } from '@/lib/api';

interface TeacherLoginModalProps {
  onClose: () => void;
  onLoginSuccess: (teacher: any) => void;
}

export default function TeacherLoginModal({ onClose, onLoginSuccess }: TeacherLoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await teacherApi.login({ email, password });
      
      if (apiUtils.isSuccess(response)) {
        const teacher = apiUtils.getData(response);
        if (teacher) {
          // Store teacher info in localStorage
          localStorage.setItem('teacherToken', 'authenticated');
          localStorage.setItem('teacherId', teacher.id);
          localStorage.setItem('teacherInfo', JSON.stringify(teacher));
          
          onLoginSuccess(teacher);
          onClose();
        }
      } else {
        setError(apiUtils.handleError(response));
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-black/90 via-indigo-900/30 to-black/90 backdrop-blur-md flex items-center justify-center p-2 z-50 animate-in fade-in duration-300"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-gradient-to-br from-slate-900/95 via-indigo-900/20 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.3)] w-full max-w-md max-h-[96vh] border-2 border-indigo-500/30 transform transition-all">
        {/* Futuristic glow effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-indigo-500 to-transparent opacity-30"></div>
        <div className="absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-30"></div>
        
        {/* Header with gradient - Compact */}
        <div className="relative flex items-center justify-between px-4 py-3 border-b border-indigo-500/30 bg-gradient-to-r from-indigo-900/20 to-blue-900/20">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-lg shadow-lg">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Teacher Login</h2>
          </div>
          <button 
            onClick={onClose} 
            className="group relative text-gray-400 hover:text-white p-1.5 rounded-lg transition-all duration-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/50"
          >
            <X className="h-5 w-5 relative z-10" />
            <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 rounded-lg transition-all duration-300"></div>
          </button>
        </div>

        {/* Form - Compact */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-3">
            {error && (
              <div className="mb-3 p-2.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-start space-x-2 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-400" />
                <div>
                  <p className="font-medium text-red-200 mb-0.5">Error</p>
                  <p className="text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Email Field - Compact */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white text-sm placeholder-slate-400 backdrop-blur-sm"
                  placeholder="teacher@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Field - Compact */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white text-sm placeholder-slate-400 backdrop-blur-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button with futuristic design - Compact */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative overflow-hidden w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:via-blue-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-2.5 px-4 rounded-lg font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all duration-300 disabled:transform-none disabled:cursor-not-allowed disabled:shadow-none border border-indigo-400/20"
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/30 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <span className="relative z-10 flex items-center justify-center space-x-2">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4" />
                    <span>Sign In</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Footer - Compact */}
        <div className="px-4 py-2.5 bg-slate-800/30 rounded-b-2xl border-t border-indigo-500/20">
          <p className="text-center text-[10px] text-slate-400">
            Secure teacher authentication portal
          </p>
        </div>
      </div>
    </div>
  );
}
