'use client';

import { useState } from 'react';
import LoginModal from '@/components/LoginModal';
import JoinExamModal from '@/components/JoinExamModal';
import { BookOpen, GraduationCap, Users, Sparkles } from 'lucide-react';

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showJoinExamModal, setShowJoinExamModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo Section */}
        <div className="text-center mb-16">
          <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl mb-6 relative">
              <BookOpen className="h-12 w-12 text-white" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 tracking-tight">
            Fucursa
          </h1>
          
          <p className="text-gray-300 text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Secure Online Examination Platform
            <span className="block text-lg text-gray-400 mt-2">with Advanced Anti-Cheating Technology</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <button
            onClick={() => setShowLoginModal(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-2 transition-all duration-300 flex items-center space-x-4 min-w-[240px] justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <GraduationCap className="h-7 w-7 relative z-10" />
            <span className="relative z-10">Teacher Login</span>
          </button>
          
          <button
            onClick={() => setShowJoinExamModal(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 transition-all duration-300 flex items-center space-x-4 min-w-[240px] justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Users className="h-7 w-7 relative z-10" />
            <span className="relative z-10">Join Exam</span>
          </button>
        </div>

        {/* Author Credit */}
        <div className="text-center">
          <div className="inline-flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 hover:bg-white/10 transition-all duration-300 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-sm">YP</span>
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Created by</p>
              <p className="text-gray-300 text-xs">Yestin Prado</p>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-32 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-300 opacity-75"></div>
        <div className="absolute bottom-20 left-32 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping delay-700 opacity-75"></div>
        <div className="absolute bottom-32 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-1000 opacity-75"></div>
      </div>

      {/* Modals */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      {showJoinExamModal && (
        <JoinExamModal onClose={() => setShowJoinExamModal(false)} />
      )}
    </div>
  );
}