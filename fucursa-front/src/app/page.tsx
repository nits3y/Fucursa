'use client';

import { useState } from 'react';
import LoginModal from '@/components/LoginModal';
import JoinExamModal from '@/components/JoinExamModal';
import { BookOpen, GraduationCap, Shield, Clock, Users, CheckCircle } from 'lucide-react';

export default function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showJoinExamModal, setShowJoinExamModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fucursa
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Secure Online Exam Platform
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Secure Online Examinations
            <span className="block text-3xl sm:text-4xl text-blue-600 mt-2">
              with Anti-Cheating Measures
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Fucursa provides a secure platform for conducting online exams with advanced anti-cheating 
            features including fullscreen lock, tab-switch prevention, and real-time monitoring.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button
              onClick={() => setShowLoginModal(true)}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center space-x-3 w-full sm:w-auto"
            >
              <GraduationCap className="h-6 w-6" />
              <span>Teacher Login</span>
            </button>
            
            <button
              onClick={() => setShowJoinExamModal(true)}
              className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center space-x-3 w-full sm:w-auto"
            >
              <Users className="h-6 w-6" />
              <span>Join Exam</span>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Student Features */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">For Students</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Secure Exam Mode</div>
                  <div className="text-gray-600">Prevents tab switching, Alt+Tab, and exiting fullscreen</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Auto Start on Fullscreen</div>
                  <div className="text-gray-600">Exam begins automatically when fullscreen is enabled</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Simple Join Process</div>
                  <div className="text-gray-600">Enter your name and exam ID to get started</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Time-Limited Exams</div>
                  <div className="text-gray-600">Clear countdown timer for fair duration</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Teacher Features */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">For Teachers</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Login Dashboard</div>
                  <div className="text-gray-600">Access to all created exams and management tools</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Exam Management</div>
                  <div className="text-gray-600">Create, view, and manage all your exams</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Real-Time Control</div>
                  <div className="text-gray-600">Set time limits and monitor exam sessions</div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">Anti-Cheating Features</div>
                  <div className="text-gray-600">Advanced security measures and monitoring</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-red-100 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Security Features</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                <Shield className="h-8 w-8 text-red-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fullscreen Lock</h4>
              <p className="text-gray-600 text-sm">Prevents students from exiting fullscreen mode during exams</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                <Clock className="h-8 w-8 text-red-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Tab Detection</h4>
              <p className="text-gray-600 text-sm">Monitors and prevents tab switching and Alt+Tab usage</p>
            </div>
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
                <BookOpen className="h-8 w-8 text-red-600 mx-auto" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Auto-Start</h4>
              <p className="text-gray-600 text-sm">Exam begins automatically when security conditions are met</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Fucursa</h3>
            </div>
            <p className="text-gray-400">
              Secure Online Exam Platform with Advanced Anti-Cheating Measures
            </p>
          </div>
        </div>
      </footer>

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