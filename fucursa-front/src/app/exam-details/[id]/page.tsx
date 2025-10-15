'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Eye, Users, Clock, Calendar, BookOpen, AlertCircle, Edit } from 'lucide-react';
import { examApi, questionApi, studentResponseApi, apiUtils } from '@/lib/api';
import { Exam, Question, StudentResponse } from '@/types/database';
import QuestionManager from '@/components/QuestionManager';

export default function ExamDetailsPage() {
  const params = useParams();
  const examId = params.id as string;
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<StudentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuestionManager, setShowQuestionManager] = useState(false);
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'score-high' | 'score-low'>('name-asc');

  useEffect(() => {
    loadExamDetails();
  }, [examId]);

  // Sort responses based on selected sort option
  const getSortedResponses = () => {
    const sorted = [...responses];
    
    switch (sortBy) {
      case 'name-asc':
        return sorted.sort((a, b) => 
          (a.studentName || '').localeCompare(b.studentName || '')
        );
      case 'name-desc':
        return sorted.sort((a, b) => 
          (b.studentName || '').localeCompare(a.studentName || '')
        );
      case 'score-high':
        return sorted.sort((a, b) => 
          (b.score || 0) - (a.score || 0)
        );
      case 'score-low':
        return sorted.sort((a, b) => 
          (a.score || 0) - (b.score || 0)
        );
      default:
        return sorted;
    }
  };

  const loadExamDetails = async () => {
    try {
      setLoading(true);
      
      // Check if teacher is logged in
      const teacherId = localStorage.getItem('teacherId');
      if (!teacherId) {
        alert('Please log in first');
        window.location.href = '/';
        return;
      }

      // Load exam data
      const examResponse = await examApi.getById(examId);
      if (!apiUtils.isSuccess(examResponse)) {
        setError('Exam not found');
        return;
      }

      const examData = apiUtils.getData(examResponse);
      if (!examData) {
        setError('Exam not found');
        return;
      }

      // Check if this exam belongs to the logged-in teacher
      if (examData.teacherId !== teacherId) {
        setError('You do not have permission to view this exam');
        return;
      }

      setExam(examData);

      // Load questions
      const questionsResponse = await questionApi.getByExam(examId);
      if (apiUtils.isSuccess(questionsResponse)) {
        const examQuestions = apiUtils.getData(questionsResponse);
        if (examQuestions) {
          const sortedQuestions = examQuestions.sort((a, b) => a.order - b.order);
          setQuestions(sortedQuestions);
        }
      }

      // Load student responses
      const responsesResponse = await studentResponseApi.getAll(examId);
      if (apiUtils.isSuccess(responsesResponse)) {
        const examResponses = apiUtils.getData(responsesResponse);
        if (examResponses) {
          setResponses(examResponses);
        }
      }

    } catch (error) {
      console.error('Failed to load exam details:', error);
      setError('Failed to load exam details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      completed: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      draft: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      archived: 'bg-red-500/20 text-red-300 border-red-500/30'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Exam not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-2xl shadow-2xl">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Exam Details
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Exam Info Card - Compact */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">{exam.title}</h2>
              {getStatusBadge(exam.status)}
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-3">{exam.description}</p>
          
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300">{exam.timeLimit} min</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-green-400" />
              <span className="text-gray-300">{new Date(exam.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-400" />
              <span className="text-gray-300">{responses.length} responses</span>
            </div>
          </div>

          {exam.instructions && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 mt-3">
              <h3 className="text-white font-semibold text-sm mb-1">Instructions</h3>
              <p className="text-gray-300 text-xs">{exam.instructions}</p>
            </div>
          )}
        </div>

        {/* Questions Section - Compact */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">Questions ({questions.length})</h3>
            <button
              onClick={() => setShowQuestionManager(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              <Edit className="h-3.5 w-3.5" />
              <span>Manage Questions</span>
            </button>
          </div>
          
          {questions.length === 0 ? (
            <div className="text-center py-6">
              <BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-300 text-sm">No questions added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-blue-400">Q{index + 1}</span>
                      <h4 className="text-sm font-medium text-white">{question.question}</h4>
                    </div>
                    <span className="text-xs text-green-400 font-semibold whitespace-nowrap ml-2">{question.points} pts</span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded capitalize">{question.type.replace('-', ' ')}</span>
                    {question.options && (
                      <span>{question.options.length} options</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student Responses Section - Compact */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl border border-white/20 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">Student Responses ({responses.length})</h3>
            
            {responses.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name-asc' | 'name-desc' | 'score-high' | 'score-low')}
                  className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-xs focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="name-asc" className="bg-gray-800 text-white">Name (A → Z)</option>
                  <option value="name-desc" className="bg-gray-800 text-white">Name (Z → A)</option>
                  <option value="score-high" className="bg-gray-800 text-white">Highest Score</option>
                  <option value="score-low" className="bg-gray-800 text-white">Lowest Score</option>
                </select>
              </div>
            )}
          </div>
          
          {responses.length === 0 ? (
            <div className="text-center py-6">
              <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-300 text-sm">No student responses yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {getSortedResponses().map((response) => (
                <div key={response.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white">{response.studentName}</h4>
                      <p className="text-gray-400 text-xs">{response.studentEmail}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {response.score || 0}/{response.totalPoints || 0}
                      </div>
                      <div className="text-xs text-gray-400">
                        points
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{Math.floor(response.timeSpent / 60)}m {response.timeSpent % 60}s</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(response.submittedAt).toLocaleDateString()}</span>
                    </div>
                    {response.isAutoSubmitted && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">Auto</span>
                    )}
                    {response.securityWarnings > 0 && (
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded">{response.securityWarnings} ⚠</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Question Manager Modal */}
      {showQuestionManager && (
        <QuestionManager
          examId={examId}
          onClose={() => {
            setShowQuestionManager(false);
            loadExamDetails(); // Reload to show updated questions
          }}
        />
      )}
    </div>
  );
}
