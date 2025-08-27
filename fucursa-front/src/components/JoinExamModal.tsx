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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Join Exam</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-gray-400/50"
                  placeholder="Last Name, First Name"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Format: Smith, John
              </p>
            </div>

            {/* Exam ID Field */}
            <div>
              <label htmlFor="examId" className="block text-sm font-medium text-gray-700 mb-2">
                Exam ID
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="examId"
                  type="text"
                  value={examId}
                  onChange={(e) => setExamId(e.target.value.toUpperCase())}
                  className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors placeholder:text-gray-400/50"
                  placeholder="EXAM123"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter the exam ID provided by your teacher
              </p>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
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
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed"
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
        <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
          <p className="text-center text-sm text-gray-600">
            Need help?{' '}
            <a href="#" className="text-purple-600 hover:text-purple-500 font-medium">
              Contact your teacher
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
