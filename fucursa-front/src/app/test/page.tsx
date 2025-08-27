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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Fucursa Testing Page</h1>
          <p className="text-xl text-gray-600">Test all frontend features without backend</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick Setup */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Setup</h2>
            
            <div className="space-y-4">
              <button
                onClick={setupDemoData}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <User className="h-5 w-5" />
                <span>Setup Demo Student Data</span>
              </button>
              
              <p className="text-sm text-gray-600">
                Click this button to set up demo student information in localStorage. 
                This allows you to directly navigate to exam pages.
              </p>
            </div>
          </div>

          {/* Navigation Options */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Navigation Options</h2>
            
            <div className="space-y-4">
              <a
                href="/"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <BookOpen className="h-5 w-5" />
                <span>Go to Landing Page</span>
              </a>
              
              <a
                href="/dashboard"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <Hash className="h-5 w-5" />
                <span>Go to Teacher Dashboard</span>
              </a>
            </div>
          </div>
        </div>

        {/* Test Exam Links */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Exam Pages</h2>
          <p className="text-gray-600 mb-6">
            Click "Setup Demo Student Data" first, then click any exam below to test the exam interface:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {testExamUrls.map((exam) => (
              <a
                key={exam.id}
                href={`/exam/${exam.id}`}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{exam.name}</p>
                    <p className="text-sm text-gray-600 font-mono">ID: {exam.id}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Testing Instructions</h2>
          <div className="space-y-4 text-amber-800">
            <div>
              <h3 className="font-semibold mb-2">1. Test Landing Page Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Click "Teacher Login" to test the login modal</li>
                <li>Click "Join Exam" to test the join exam modal</li>
                <li>Try entering different names and exam IDs</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">2. Test Teacher Dashboard:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Login with any credentials to access dashboard</li>
                <li>View exam statistics and management interface</li>
                <li>Try creating a new exam</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">3. Test Exam Interface:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
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
