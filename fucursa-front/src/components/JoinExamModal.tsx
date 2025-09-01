'use client';

import { useState } from 'react';
import { X, User, Hash, Users, AlertCircle } from 'lucide-react';

interface JoinExamModalProps {
  onClose: () => void;
}

export default function JoinExamModal({ onClose }: JoinExamModalProps) {
  const [fullName, setFullName] = useState('');
  const [examId, setExamId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!fullName.trim()) {
        setError('Please enter your full name');
        return;
      }
      
      if (!examId.trim()) {
        setError('Please enter the exam ID');
        return;
      }

      // Check if name format is correct (Last Name, First Name)
      if (!fullName.includes(',')) {
        setError('Please enter your name in the format: Last Name, First Name');
        return;
      }

      // TODO: Implement actual exam validation with backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // For demo purposes, accept any valid format
      // In real implementation, validate exam ID exists and is active
      
      // Store student info in localStorage for demo
      localStorage.setItem('studentInfo', JSON.stringify({
        fullName: fullName.trim(),
        examId: examId.trim(),
        joinTime: new Date().toISOString()
      }));

      // Redirect to exam page
      window.location.href = `/exam/${examId}`;
      
    } catch (err) {
      setError('Failed to join exam. Please check your exam ID and try again.');
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-md transform transition-all modal-animation">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Join Exam</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800/50 rounded-xl"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
                         <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-start space-x-2 backdrop-blur-sm">
                             <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder-slate-400 backdrop-blur-sm"
                  placeholder="Last Name, First Name"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Format: Smith, John
              </p>
            </div>

            {/* Exam ID Field */}
            <div>
              <label htmlFor="examId" className="block text-sm font-medium text-slate-300 mb-2">
                Exam ID
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  id="examId"
                  type="text"
                  value={examId}
                  onChange={(e) => setExamId(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white placeholder-slate-400 backdrop-blur-sm font-mono"
                  placeholder="EXAM123"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Enter the exam ID provided by your teacher
              </p>
            </div>

            {/* Important Notice */}
                         <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-start space-x-2">
                                 <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                                 <div className="text-sm text-amber-200">
                  <p className="font-semibold mb-1">Important Notice:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Your screen will enter fullscreen mode</li>
                    <li>• Tab switching will be disabled</li>
                    <li>• The exam will start automatically</li>
                    <li>• Make sure you're ready before joining</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/25 disabled:transform-none disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Joining exam...</span>
                </div>
              ) : (
                'Join Exam'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-800/30 rounded-b-3xl border-t border-slate-700/50">
          <p className="text-center text-sm text-slate-400">
            Need help?{' '}
            <a href="#" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Contact your teacher
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
