'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Eye, Edit, Trash2, Users, Clock, Calendar, Settings, LogOut, X } from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  createdAt: string;
  status: 'draft' | 'active' | 'completed';
  studentsCount: number;
}

export default function Dashboard() {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 'EXAM001',
      title: 'Mathematics Final Exam',
      description: 'Comprehensive exam covering algebra, geometry, and calculus topics.',
      timeLimit: 120,
      createdAt: '2024-01-15',
      status: 'active',
      studentsCount: 25
    },
    {
      id: 'EXAM002',
      title: 'Physics Midterm',
      description: 'Midterm examination on mechanics and thermodynamics.',
      timeLimit: 90,
      createdAt: '2024-01-10',
      status: 'completed',
      studentsCount: 30
    },
    {
      id: 'EXAM003',
      title: 'Chemistry Quiz',
      description: 'Quick assessment on organic chemistry fundamentals.',
      timeLimit: 45,
      createdAt: '2024-01-20',
      status: 'draft',
      studentsCount: 0
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleLogout = () => {
    // Clear any stored session data
    localStorage.removeItem('teacherToken');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Fucursa
                </h1>
              </div>
              <div className="hidden md:block">
                <span className="text-gray-600">Teacher Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.reduce((sum, exam) => sum + exam.studentsCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.filter(exam => exam.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {exams.filter(exam => new Date(exam.createdAt).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exams Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Exams</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Exam</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {exams.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No exams yet</h3>
                <p className="text-gray-600 mb-4">Create your first exam to get started</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Create Exam
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {exams.map((exam) => (
                  <div key={exam.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                          {getStatusBadge(exam.status)}
                        </div>
                        <p className="text-gray-600 mb-3">{exam.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{exam.timeLimit} minutes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{exam.studentsCount} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {exam.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {exam.status === 'active' && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800">
                            Exam ID: <code className="bg-green-100 px-2 py-1 rounded font-mono">{exam.id}</code>
                          </span>
                          <button className="text-sm text-green-700 hover:text-green-900 font-medium">
                            Copy Link
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Exam Modal */}
      {showCreateModal && (
        <CreateExamModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

// Create Exam Modal Component
function CreateExamModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement actual exam creation with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just close modal
      onClose();
    } catch (error) {
      console.error('Failed to create exam:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Exam</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exam Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter exam title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter exam description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                min="5"
                max="300"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200"
            >
              {isLoading ? 'Creating...' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
