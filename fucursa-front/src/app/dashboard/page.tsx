'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Eye, Edit, Trash2, Users, Clock, Calendar, Settings, LogOut, X } from 'lucide-react';
import { examApi, statsApi, apiUtils } from '@/lib/api';
import { Exam, ExamStats } from '@/types/database';
import EditExamModal from '@/components/EditExamModal';

export default function Dashboard() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get teacher ID from localStorage (assuming teacher is logged in)
      const teacherId = localStorage.getItem('teacherId');
      
      if (!teacherId) {
        alert('Please log in first');
        window.location.href = '/';
        return;
      }
      
      // Load exams for this teacher only
      const examsResponse = await examApi.getAll(teacherId);
      
      if (apiUtils.isSuccess(examsResponse)) {
        const exams = apiUtils.getData(examsResponse) || [];
        setExams(exams);
      } else {
        console.error('Failed to load exams:', apiUtils.handleError(examsResponse));
      }
      
      // Load statistics for this teacher
      const statsResponse = await statsApi.getStats(teacherId);
      if (apiUtils.isSuccess(statsResponse)) {
        setStats(apiUtils.getData(statsResponse) || null);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear any stored session data
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('teacherId');
    window.location.href = '/';
  };

  const handleViewExam = (examId: string) => {
    // Navigate to exam details page
    window.location.href = `/exam-details/${examId}`;
  };

  const handleEditExam = (examId: string) => {
    const exam = exams.find(e => e.id === examId);
    if (exam) {
      setSelectedExam(exam);
      setShowEditModal(true);
    }
  };

  const handleDeleteExam = async (examId: string, examTitle: string) => {
    if (confirm(`Are you sure you want to delete "${examTitle}"? This action cannot be undone.`)) {
      try {
        const response = await examApi.delete(examId);
        if (apiUtils.isSuccess(response)) {
          alert('Exam deleted successfully!');
          // Reload the dashboard
          loadDashboardData();
        } else {
          alert('Failed to delete exam: ' + apiUtils.handleError(response));
        }
      } catch (error) {
        console.error('Failed to delete exam:', error);
        alert('Failed to delete exam. Please try again.');
      }
    }
  };

  const handleCopyLink = (examId: string) => {
    const examUrl = `${window.location.origin}/exam/${examId}`;
    navigator.clipboard.writeText(examUrl).then(() => {
      alert('Exam link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = examUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Exam link copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Header - Compact */}
      <header className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 rounded-xl shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Fucursa
                </h1>
              </div>
              <div className="hidden md:block">
                <span className="text-gray-300 text-sm">Teacher Dashboard</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                <Settings className="h-4 w-4" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-gray-300 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Stats Cards - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="group bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-3 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-300">Total Exams</p>
                <p className="text-xl font-bold text-white">{stats?.totalExams || 0}</p>
              </div>
            </div>
          </div>

          <div className="group bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-3 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-300">Total Students</p>
                <p className="text-xl font-bold text-white">{stats?.totalStudents || 0}</p>
              </div>
            </div>
          </div>

          <div className="group bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-3 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-300">Active Exams</p>
                <p className="text-xl font-bold text-white">{stats?.activeExams || 0}</p>
              </div>
            </div>
          </div>

          <div className="group bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-3 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-300">Avg Score</p>
                <p className="text-xl font-bold text-white">{stats?.averageScore || 0}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exams Section - Compact */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20">
          <div className="px-4 py-3 border-b border-white/20">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Your Exams</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-1.5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Plus className="h-3.5 w-3.5 relative z-10" />
                <span className="relative z-10">Create New Exam</span>
              </button>
            </div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                <p className="text-gray-300 text-sm">Loading exams...</p>
              </div>
            ) : exams.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <h3 className="text-base font-medium text-white mb-1">No exams yet</h3>
                <p className="text-gray-300 text-sm mb-4">Create your first exam to get started</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Create Exam</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {exams.map((exam) => (
                  <div key={exam.id} className="group bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-base font-semibold text-white">{exam.title}</h3>
                          {getStatusBadge(exam.status)}
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{exam.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{exam.timeLimit} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 ml-3">
                        <button 
                          onClick={() => handleViewExam(exam.id)}
                          className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-all duration-300"
                          title="View Exam"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleEditExam(exam.id)}
                          className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-all duration-300"
                          title="Edit Exam"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteExam(exam.id, exam.title)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                          title="Delete Exam"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {exam.status === 'active' && (
                      <div className="mt-3 p-2.5 bg-green-500/20 backdrop-blur-sm rounded-lg border border-green-500/30">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-green-300">
                            ID: <code className="bg-green-500/20 px-1.5 py-0.5 rounded font-mono text-green-200">{exam.id}</code>
                          </span>
                          <button 
                            onClick={() => handleCopyLink(exam.id)}
                            className="text-xs text-green-300 hover:text-green-200 font-medium hover:bg-green-500/20 px-2 py-1 rounded transition-all duration-300"
                          >
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

      {/* Edit Exam Modal */}
      {showEditModal && selectedExam && (
        <EditExamModal 
          exam={selectedExam}
          onClose={() => {
            setShowEditModal(false);
            setSelectedExam(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedExam(null);
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
}

// Create Exam Modal Component
function CreateExamModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timePerQuestion, setTimePerQuestion] = useState(60);
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const teacherId = localStorage.getItem('teacherId');
      if (!teacherId) {
        alert('Please log in first');
        return;
      }

      const examData = {
        title,
        description,
        teacherId,
        timeLimit: Math.ceil(timePerQuestion / 60), // Convert to minutes for backward compatibility
        timeLimitSeconds: timePerQuestion,
        timePerQuestion,
        timingMode: 'per-question' as const,
        instructions: instructions || undefined
      };

      const response = await examApi.create(examData);
      
      if (apiUtils.isSuccess(response)) {
        alert('Exam created successfully!');
        onClose();
        // Refresh the page to show the new exam
        window.location.reload();
      } else {
        alert(apiUtils.handleError(response));
      }
    } catch (error) {
      console.error('Failed to create exam:', error);
      alert('Failed to create exam. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-purple-900/30 to-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/20 to-slate-900/95 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.3)] w-full max-w-2xl max-h-[90vh] border-2 border-purple-500/30 flex flex-col overflow-hidden">
        {/* Futuristic glow effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-30"></div>
        <div className="absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-30"></div>
        
        {/* Header with gradient */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Create New Exam</h2>
          </div>
          <button 
            onClick={onClose} 
            className="group relative text-gray-400 hover:text-white p-2 rounded-lg transition-all duration-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/50"
          >
            <X className="h-5 w-5 relative z-10" />
            <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 rounded-lg transition-all duration-300"></div>
          </button>
        </div>

        {/* Scrollable content with hidden scrollbar */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                Time Per Question (seconds)
              </label>
              <input
                type="number"
                value={timePerQuestion}
                onChange={(e) => setTimePerQuestion(parseInt(e.target.value) || 0)}
                min="1"
                max="3600"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
                placeholder="Enter time per question in seconds"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Time allowed for each individual question
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Instructions (Optional)
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300 resize-none"
                placeholder="Enter exam instructions"
              />
            </div>

            {/* Futuristic Button Footer */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-purple-500/20">
              <button
                type="button"
                onClick={onClose}
                className="group relative px-6 py-2.5 bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 font-medium"
              >
                <span className="relative z-10">Cancel</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all duration-300 flex items-center space-x-2 border-2 border-purple-400/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <span className="relative z-10">{isLoading ? 'Creating...' : 'Create Exam'}</span>
              </button>
            </div>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
