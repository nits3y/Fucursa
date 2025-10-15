'use client';

import { useState } from 'react';
import { X, User, Hash, Users, AlertCircle, Key } from 'lucide-react';
import { examApi, apiUtils } from '@/lib/api';

interface JoinExamModalProps {
  onClose: () => void;
}

export default function JoinExamModal({ onClose }: JoinExamModalProps) {
  const [fullName, setFullName] = useState('');
  const [examId, setExamId] = useState('');
  const [edpCode, setEdpCode] = useState('');
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

      // Validate exam ID exists and is active
      const examResponse = await examApi.getById(examId.trim());
      
      if (!apiUtils.isSuccess(examResponse)) {
        setError('Exam not found. Please check the exam ID and try again.');
        return;
      }

      const exam = apiUtils.getData(examResponse);
      if (!exam) {
        setError('Exam not found. Please check the exam ID and try again.');
        return;
      }

      // Check if exam is active
      if (exam.status !== 'active') {
        setError('This exam is not currently active. Please contact your teacher.');
        return;
      }

      // Verify EDP code if required
      if (exam.requireEdpCode) {
        if (!edpCode.trim()) {
          setError('This exam requires an EDP code. Please enter your EDP code.');
          return;
        }
        
        // Check if the provided EDP code is in the allowed list
        if (!exam.edpCodes || !exam.edpCodes.includes(edpCode.trim())) {
          setError('Invalid EDP code. Please check your EDP code and try again.');
          return;
        }
      }

      // Store student info in localStorage
      localStorage.setItem('studentInfo', JSON.stringify({
        fullName: fullName.trim(),
        email: '', // Will be filled later if needed
        examId: examId.trim(),
        edpCode: edpCode.trim(),
        joinTime: new Date().toISOString()
      }));

      // Redirect to exam page
      window.location.href = `/exam/${examId}`;
      
    } catch (err) {
      console.error('Failed to join exam:', err);
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md max-h-[96vh] transform transition-all modal-animation">
        {/* Header - Compact */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg shadow-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Join Exam</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-slate-800/50 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form - Compact */}
        <form onSubmit={handleSubmit} className="p-4">
          {error && (
            <div className="mb-3 p-2.5 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs flex items-start space-x-2 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-400" />
              <div>
                <p className="font-medium text-red-200 mb-0.5">Error</p>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {/* Full Name Field - Compact */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white text-sm placeholder-slate-400 backdrop-blur-sm"
                  placeholder="Last Name, First Name"
                  required
                />
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                Format: Smith, John
              </p>
            </div>

            {/* Exam ID Field - Compact */}
            <div>
              <label htmlFor="examId" className="block text-xs font-medium text-slate-300 mb-1.5">
                Exam ID
              </label>
              <div className="relative">
                <Hash className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="examId"
                  type="text"
                  value={examId}
                  onChange={(e) => setExamId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white text-sm placeholder-slate-400 backdrop-blur-sm font-mono"
                  placeholder="exam_1704067200000_xyz789abc"
                  required
                />
              </div>
              <p className="mt-0.5 text-[10px] text-slate-400">
                💡 Test: <span 
                  className="font-mono bg-blue-500/20 px-1 rounded cursor-pointer hover:bg-blue-500/30 transition-colors text-blue-400"
                  onClick={() => setExamId('exam_1704067200000_xyz789abc')}
                >
                  exam_1704067200000_xyz789abc
                </span>
              </p>
            </div>

            {/* EDP Code Field - Compact */}
            <div>
              <label htmlFor="edpCode" className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center space-x-1">
                <span>EDP Code</span>
                <span className="text-[10px] text-slate-500 font-normal">(if required)</span>
              </label>
              <div className="relative">
                <Key className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="edpCode"
                  type="text"
                  value={edpCode}
                  onChange={(e) => setEdpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-white text-sm placeholder-slate-400 backdrop-blur-sm font-mono"
                  placeholder="Enter EDP code"
                />
              </div>
            </div>

            {/* Important Notice - Compact */}
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-2.5 backdrop-blur-sm">
              <div className="flex items-start space-x-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-[10px] text-amber-200">
                  <p className="font-semibold mb-0.5">Important Notice:</p>
                  <ul className="space-y-0.5">
                    <li>• Screen enters fullscreen mode</li>
                    <li>• Tab switching disabled</li>
                    <li>• Exam starts automatically</li>
                    <li>• Be ready before joining</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button - Compact */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-700 text-white py-2.5 px-4 rounded-lg font-bold text-sm transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25 disabled:transform-none disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Joining...</span>
                </div>
              ) : (
                'Join Exam'
              )}
            </button>
          </div>
        </form>

        {/* Footer - Compact */}
        <div className="px-4 py-2.5 bg-slate-800/30 rounded-b-2xl border-t border-slate-700/50">
          <p className="text-center text-[10px] text-slate-400">
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
