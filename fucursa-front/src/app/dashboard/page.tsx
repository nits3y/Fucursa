'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Eye, Edit, Trash2, Users, Clock, Calendar, Settings, LogOut, X, User } from 'lucide-react';
import { examApi, statsApi, apiUtils } from '@/lib/api';
import { Exam, ExamStats } from '@/types/database';
import EditExamModal from '@/components/EditExamModal';
import ConfirmModal from '@/components/ConfirmModal';
import TeacherSettingsModal from '@/components/TeacherSettingsModal';
import { useToast } from '@/components/Toast';

export default function Dashboard() {
  const toast = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<ExamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [examToDelete, setExamToDelete] = useState<{ id: string; title: string } | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [teacherName, setTeacherName] = useState('Teacher');
  const [avatarColor, setAvatarColor] = useState('');

  // Check if exam deadline has passed
  // Returns true if current time is past the exam's endDate
  const isExamClosed = (exam: Exam) => {
    if (!exam.endDate) return false;
    const now = new Date();
    const deadline = new Date(exam.endDate);
    return now > deadline;
  };

  // Get the display status - if exam has active status but deadline passed, show "Closed"
  const getDisplayStatus = (exam: Exam) => {
    if (exam.status === 'active' && isExamClosed(exam)) {
      return 'closed';
    }
    return exam.status;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-300 border-green-500/30 shadow-lg shadow-green-500/10',
      closed: 'bg-red-500/20 text-red-300 border-red-500/30 shadow-lg shadow-red-500/10',
      completed: 'bg-gray-500/20 text-gray-300 border-gray-500/30 shadow-lg shadow-gray-500/10',
      draft: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 shadow-lg shadow-yellow-500/10'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Generate random avatar color
  const generateAvatarColor = () => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-pink-500 to-rose-500',
      'from-teal-500 to-emerald-500',
      'from-violet-500 to-fuchsia-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Load data on component mount
  useEffect(() => {
    loadDashboardData();
    setAvatarColor(generateAvatarColor());
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get teacher ID from localStorage (assuming teacher is logged in)
      const teacherId = localStorage.getItem('teacherId');
      
      if (!teacherId) {
        toast.error('Please log in first');
        window.location.href = '/';
        return;
      }

      // Get teacher info from localStorage
      const teacherInfo = localStorage.getItem('teacherInfo');
      if (teacherInfo) {
        try {
          const parsedInfo = JSON.parse(teacherInfo);
          setTeacherName(parsedInfo.name || 'Teacher');
        } catch (e) {
          console.error('Failed to parse teacher info:', e);
        }
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

  const handleDeleteExam = (examId: string, examTitle: string) => {
    setExamToDelete({ id: examId, title: examTitle });
    setShowConfirmDelete(true);
  };

  const confirmDeleteExam = async () => {
    if (!examToDelete) return;
    
    try {
      const response = await examApi.delete(examToDelete.id);
      if (apiUtils.isSuccess(response)) {
        toast.success('Exam deleted successfully!');
        // Reload the dashboard
        loadDashboardData();
      } else {
        toast.error('Failed to delete exam: ' + apiUtils.handleError(response));
      }
    } catch (error) {
      console.error('Failed to delete exam:', error);
      toast.error('Failed to delete exam. Please try again.');
    } finally {
      setExamToDelete(null);
    }
  };

  const handleCopyCode = (examId: string) => {
    // Copy just the exam ID/code instead of the full URL
    navigator.clipboard.writeText(examId).then(() => {
      toast.success('Exam code copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = examId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Exam code copied to clipboard!');
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
           
            </div>
            
            {/* Settings & Logout */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowSettingsModal(true)}
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-gray-300 hover:text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-all duration-300"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Welcome Section with Teacher Profile */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-lg ring-2 ring-white/20`}>
              <span className="text-white font-bold text-lg">
                {teacherName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-400">Welcome back,</p>
              <h2 className="text-lg font-bold text-white">{teacherName}</h2>
            </div>
          </div>
        </div>

        {/* Stats Cards - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
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
                          {getStatusBadge(getDisplayStatus(exam))}
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
                            onClick={() => handleCopyCode(exam.id)}
                            className="text-xs text-green-300 hover:text-green-200 font-medium hover:bg-green-500/20 px-2 py-1 rounded transition-all duration-300"
                          >
                            Copy Code
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

      {/* Confirm Delete Modal */}
      {/* Settings Modal */}
      {showSettingsModal && (
        <TeacherSettingsModal
          onClose={() => setShowSettingsModal(false)}
          teacherName={teacherName}
        />
      )}

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          setExamToDelete(null);
        }}
        onConfirm={confirmDeleteExam}
        title="Delete Exam"
        message={`Are you sure you want to delete "${examToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
}

// Create Exam Modal Component
function CreateExamModal({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'basic' | 'settings'>('basic');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timePerQuestion, setTimePerQuestion] = useState(60);
  const [instructions, setInstructions] = useState('');
  const [enableDeadline, setEnableDeadline] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [requireEdpCode, setRequireEdpCode] = useState(false);
  const [edpCodes, setEdpCodes] = useState<string[]>([]);
  const [newEdpCode, setNewEdpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddEdpCode = () => {
    const code = newEdpCode.trim();
    // Validate: must be numbers only
    if (!/^\d+$/.test(code)) {
      toast.warning('EDP code must contain only numbers');
      return;
    }
    if (code && !edpCodes.includes(code)) {
      setEdpCodes([...edpCodes, code]);
      setNewEdpCode('');
      toast.success('EDP code added');
    } else if (edpCodes.includes(code)) {
      toast.warning('EDP code already exists');
    }
  };

  const handleRemoveEdpCode = (code: string) => {
    setEdpCodes(edpCodes.filter(c => c !== code));
    toast.success('EDP code removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const teacherId = localStorage.getItem('teacherId');
      if (!teacherId) {
        toast.error('Please log in first');
        return;
      }

      // Combine date and time if deadline is enabled and both are provided
      let endDate = undefined;
      if (enableDeadline && deadlineDate && deadlineTime) {
        endDate = `${deadlineDate}T${deadlineTime}`;
      }

      const examData = {
        title,
        description,
        teacherId,
        timeLimit: Math.ceil(timePerQuestion / 60), // Convert to minutes for backward compatibility
        timeLimitSeconds: timePerQuestion,
        timePerQuestion,
        timingMode: 'per-question' as const,
        instructions: instructions || undefined,
        endDate: endDate || undefined,
        requireEdpCode,
        edpCodes: requireEdpCode ? edpCodes : []
      };

      const response = await examApi.create(examData);
      
      if (apiUtils.isSuccess(response)) {
        toast.success('Exam created successfully!');
      onClose();
        // Refresh the page to show the new exam
        window.location.reload();
      } else {
        toast.error(apiUtils.handleError(response));
      }
    } catch (error) {
      console.error('Failed to create exam:', error);
      toast.error('Failed to create exam. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-purple-900/30 to-black/90 backdrop-blur-md flex items-center justify-center p-2 z-50 animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/20 to-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.3)] w-full max-w-3xl border-2 border-purple-500/30 flex flex-col h-[90vh]">
        {/* Futuristic glow effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-30"></div>
        <div className="absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-30"></div>
        
        {/* Header with gradient */}
        <div className="relative flex items-center justify-between px-5 py-3 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Create New Exam</h2>
          </div>
          <button 
            onClick={onClose} 
            className="group relative text-gray-400 hover:text-white p-1.5 rounded-lg transition-all duration-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/50"
          >
            <X className="h-5 w-5 relative z-10" />
            <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/10 rounded-lg transition-all duration-300"></div>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-purple-500/20 px-5 pt-3 bg-slate-900/30">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`relative px-6 py-2 text-sm font-medium transition-all duration-300 ${
              activeTab === 'basic'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Basic Info
            {activeTab === 'basic' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`relative px-6 py-2 text-sm font-medium transition-all duration-300 ${
              activeTab === 'settings'
                ? 'text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Settings
            {activeTab === 'settings' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            )}
          </button>
        </div>

        {/* Content - No Scrolling */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          {/* Tab Content Container - Fixed Height */}
          <div className="flex-1 p-5">
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="h-full flex flex-col space-y-4">
            <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Exam Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white text-sm placeholder-gray-400 transition-all duration-300"
                    placeholder="e.g., Mathematics Final Exam"
                required
              />
            </div>

                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white text-sm placeholder-gray-400 transition-all duration-300 resize-none"
                    placeholder="Describe the exam content and objectives"
                required
              />
            </div>

                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Instructions (Optional)
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    className="w-full h-32 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white text-sm placeholder-gray-400 transition-all duration-300 resize-none"
                    placeholder="Add special instructions for students"
                  />
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="h-full flex flex-col space-y-5">
            <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    Time Per Question *
              </label>
              <input
                type="number"
                    value={timePerQuestion}
                    onChange={(e) => setTimePerQuestion(parseInt(e.target.value) || 0)}
                    min="1"
                    max="3600"
                    className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white text-sm placeholder-gray-400 transition-all duration-300"
                    placeholder="60"
                required
              />
                  <p className="mt-1 text-[10px] text-gray-400">
                    ⏱️ Time allowed for each question (in seconds)
                  </p>
                </div>

                {/* Deadline Section with Toggle Switch */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-300">
                      Exam Deadline
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableDeadline}
                        onChange={(e) => setEnableDeadline(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-xs text-gray-300">Set Deadline</span>
                    </label>
                  </div>
                  
                  {enableDeadline ? (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">Date</label>
                          <input
                            type="date"
                            value={deadlineDate}
                            onChange={(e) => setDeadlineDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white text-sm transition-all duration-300"
                            style={{ colorScheme: 'dark' }}
                            required={enableDeadline}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-gray-400 mb-1">Time</label>
                          <input
                            type="time"
                            value={deadlineTime}
                            onChange={(e) => setDeadlineTime(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white text-sm transition-all duration-300"
                            style={{ colorScheme: 'dark' }}
                            required={enableDeadline}
                          />
                        </div>
                      </div>
                      <p className="mt-1 text-[10px] text-gray-400">
                        📅 Exam will automatically close and stop accepting responses after this date/time
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-6 text-gray-400 text-xs">
                      <p>Enable deadline to set an automatic closing date/time for the exam</p>
                    </div>
                  )}
                </div>

                {/* EDP Code Section */}
                <div className="flex-1 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-medium text-gray-300">
                      EDP Code Verification
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireEdpCode}
                        onChange={(e) => setRequireEdpCode(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-xs text-gray-300">Require EDP Code</span>
                    </label>
                  </div>

                  {requireEdpCode && (
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newEdpCode}
                          onChange={(e) => setNewEdpCode(e.target.value.replace(/\D/g, ''))}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEdpCode())}
                          className="flex-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white text-sm placeholder-gray-400 transition-all duration-300"
                          placeholder="Enter EDP code (numbers only)"
                        />
                        <button
                          type="button"
                          onClick={handleAddEdpCode}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-all duration-300 font-medium"
                        >
                          Add
                        </button>
                      </div>

                      {edpCodes.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                          <p className="text-[10px] text-gray-400">Allowed EDP Codes ({edpCodes.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {edpCodes.map((code) => (
                              <div
                                key={code}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg"
                              >
                                <span className="text-blue-300 text-xs font-mono">{code}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEdpCode(code)}
                                  className="text-blue-300 hover:text-red-300 transition-colors text-sm"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {requireEdpCode && edpCodes.length === 0 && (
                        <p className="text-[10px] text-yellow-400">⚠️ Add at least one EDP code</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>

          {/* Fixed Footer - Always Visible */}
          <div className="flex justify-end space-x-3 px-5 py-4 border-t border-purple-500/20 bg-slate-900/30">
            <button
              type="button"
              onClick={onClose}
              className="group relative px-5 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 text-gray-300 hover:text-white rounded-lg transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 font-medium text-sm"
            >
              <span className="relative z-10">Cancel</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative overflow-hidden px-5 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all duration-300 flex items-center space-x-2 border-2 border-purple-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <span className="relative z-10">{isLoading ? 'Creating...' : 'Create Exam'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
