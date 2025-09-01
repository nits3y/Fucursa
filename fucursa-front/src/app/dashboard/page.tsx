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
      active: 'bg-green-500/20 text-green-300 border-green-500/30 shadow-lg shadow-green-500/10',
      completed: 'bg-gray-500/20 text-gray-300 border-gray-500/30 shadow-lg shadow-gray-500/10',
      draft: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 shadow-lg shadow-yellow-500/10'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${styles[status as keyof typeof styles]}`}>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-2xl shadow-2xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Fucursa
                </h1>
              </div>
              <div className="hidden md:block">
                <span className="text-gray-300">Teacher Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-xl transition-all duration-300"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Exams</p>
                <p className="text-2xl font-bold text-white">{exams.length}</p>
              </div>
            </div>
          </div>

          <div className="group bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Total Students</p>
                <p className="text-2xl font-bold text-white">
                  {exams.reduce((sum, exam) => sum + exam.studentsCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">Active Exams</p>
                <p className="text-2xl font-bold text-white">
                  {exams.filter(exam => exam.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="group bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300">This Month</p>
                <p className="text-2xl font-bold text-white">
                  {exams.filter(exam => new Date(exam.createdAt).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exams Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
          <div className="px-6 py-4 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Your Exams</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Create New Exam</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {exams.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No exams yet</h3>
                <p className="text-gray-300 mb-6">Create your first exam to get started</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Create Exam</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {exams.map((exam) => (
                  <div key={exam.id} className="group bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/10 hover:border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-white">{exam.title}</h3>
                          {getStatusBadge(exam.status)}
                        </div>
                        <p className="text-gray-300 mb-4">{exam.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{exam.timeLimit} minutes</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{exam.studentsCount} students</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Created {exam.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-xl transition-all duration-300 group-hover:scale-110">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-xl transition-all duration-300 group-hover:scale-110">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-xl transition-all duration-300 group-hover:scale-110">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {exam.status === 'active' && (
                      <div className="mt-4 p-4 bg-green-500/20 backdrop-blur-sm rounded-2xl border border-green-500/30 shadow-lg shadow-green-500/10">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-300">
                            Exam ID: <code className="bg-green-500/20 px-2 py-1 rounded-lg font-mono text-green-200">{exam.id}</code>
                          </span>
                          <button className="text-sm text-green-300 hover:text-green-200 font-medium hover:bg-green-500/20 px-3 py-1 rounded-lg transition-all duration-300">
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-lg border border-white/20">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Create New Exam</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Exam Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
                placeholder="Enter exam title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300 resize-none"
                placeholder="Enter exam description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                min="5"
                max="300"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative overflow-hidden w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">{isLoading ? 'Creating...' : 'Create Exam'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
