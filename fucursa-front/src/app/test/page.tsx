'use client';

import { useEffect } from 'react';
import { BookOpen, User, Hash, ArrowRight } from 'lucide-react';

export default function TestPage() {
  const setupDemoData = () => {
    // Set up demo student info
    const demoStudentInfo = {
      fullName: 'Doe, John',
      examId: 'DEMO123',
      joinTime: new Date().toISOString()
    };
    
    localStorage.setItem('studentInfo', JSON.stringify(demoStudentInfo));
    alert('Demo data set! You can now navigate to any exam page.');
  };

  const testExamUrls = [
    { id: 'EXAM001', name: 'Mathematics Final Exam' },
    { id: 'EXAM002', name: 'Physics Midterm' },
    { id: 'DEMO123', name: 'Demo Exam' },
    { id: 'TEST456', name: 'Test Exam' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-12">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="transform hover:scale-105 transition-transform duration-300 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl relative">
              <BookOpen className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1">
                <div className="w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4 tracking-tight">Fucursa Testing</h1>
          <p className="text-xl text-gray-300 font-light">Test all frontend features without backend</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick Setup */}
          <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Setup</h2>
            
            <div className="space-y-6">
              <button
                onClick={setupDemoData}
                className="group/btn relative overflow-hidden w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white py-4 px-6 rounded-2xl font-bold shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <User className="h-6 w-6 relative z-10" />
                <span className="relative z-10">Setup Demo Student Data</span>
              </button>
              
              <p className="text-sm text-gray-300 leading-relaxed">
                Click this button to set up demo student information in localStorage. 
                This allows you to directly navigate to exam pages.
              </p>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2">
            <h2 className="text-2xl font-bold text-white mb-6">Navigation Options</h2>
            
            <div className="space-y-4">
              <a
                href="/"
                className="group/btn relative overflow-hidden w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-4 px-6 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <BookOpen className="h-6 w-6 relative z-10" />
                <span className="relative z-10">Go to Landing Page</span>
              </a>
              
              <a
                href="/dashboard"
                className="group/btn relative overflow-hidden w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white py-4 px-6 rounded-2xl font-bold shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <Hash className="h-6 w-6 relative z-10" />
                <span className="relative z-10">Go to Teacher Dashboard</span>
              </a>
            </div>
          </div>
        </div>

        {/* Test Exam Links */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Test Exam Pages</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Click "Setup Demo Student Data" first, then click any exam below to test the exam interface:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {testExamUrls.map((exam) => (
              <a
                key={exam.id}
                href={`/exam/${exam.id}`}
                className="group p-6 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/10 hover:border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white mb-1">{exam.name}</p>
                    <p className="text-sm text-gray-400 font-mono">ID: {exam.id}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-all duration-300 group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-500/30 rounded-2xl p-8 mt-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-amber-200 mb-6">Testing Instructions</h2>
          <div className="space-y-6 text-amber-100">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h3 className="font-semibold mb-3 text-amber-200 flex items-center space-x-2">
                <span className="bg-amber-500 text-amber-900 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <span>Test Landing Page Features:</span>
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-100/90 ml-8">
                <li>Click "Teacher Login" to test the login modal</li>
                <li>Click "Join Exam" to test the join exam modal</li>
                <li>Try entering different names and exam IDs</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h3 className="font-semibold mb-3 text-amber-200 flex items-center space-x-2">
                <span className="bg-amber-500 text-amber-900 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <span>Test Teacher Dashboard:</span>
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-100/90 ml-8">
                <li>Login with any credentials to access dashboard</li>
                <li>View exam statistics and management interface</li>
                <li>Try creating a new exam</li>
              </ul>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h3 className="font-semibold mb-3 text-amber-200 flex items-center space-x-2">
                <span className="bg-amber-500 text-amber-900 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <span>Test Exam Interface:</span>
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-100/90 ml-8">
                <li>Setup demo data first (button above)</li>
                <li>Click any exam link to enter exam mode</li>
                <li>Test fullscreen functionality</li>
                <li>Try security features (right-click, tab switching, etc.)</li>
                <li>Navigate through questions and submit exam</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
