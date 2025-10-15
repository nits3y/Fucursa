/**
 * QuestionManager Component
 * 
 * This component allows teachers to:
 * - View all questions for an exam
 * - Add new questions with different types (multiple choice, true/false, identification, essay)
 * - Edit existing questions, answers, and point values
 * - Delete questions
 * - Reorder questions
 */

'use client';
import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, GripVertical, CheckSquare, Square } from 'lucide-react';
import { questionApi, apiUtils } from '@/lib/api';
import type { Question } from '@/types/database';
import { useToast } from '@/components/Toast';
import ConfirmModal from '@/components/ConfirmModal';

// Question type options
const QUESTION_TYPES = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false', label: 'True or False' },
  { value: 'identification', label: 'Identification' },
  { value: 'essay', label: 'Essay' },
  { value: 'short-answer', label: 'Short Answer' }
];

interface QuestionManagerProps {
  examId: string;
  onClose: () => void;
}

export default function QuestionManager({ examId, onClose }: QuestionManagerProps) {
  const toast = useToast();
  
  // State for questions list
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for add/edit question modal
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  
  // State for import JSON modal
  const [showImportModal, setShowImportModal] = useState(false);
  
  // State for confirm delete modal
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);
  
  // State for multiple selection
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [showConfirmDeleteMultiple, setShowConfirmDeleteMultiple] = useState(false);

  // Load questions for this exam
  useEffect(() => {
    loadQuestions();
  }, [examId]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await questionApi.getByExam(examId);
      
      if (apiUtils.isSuccess(response)) {
        setQuestions(response.data || []);
      } else {
        setError(apiUtils.handleError(response));
      }
    } catch (error) {
      console.error('Failed to load questions:', error);
      setError('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add new question
  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionModal(true);
  };

  // Handle edit question
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionModal(true);
  };

  // Handle delete question
  const handleDeleteQuestion = (questionId: string) => {
    setQuestionToDelete(questionId);
    setShowConfirmDelete(true);
  };

  // Confirm delete question
  const confirmDeleteQuestion = async () => {
    if (!questionToDelete) return;

    try {
      const response = await questionApi.delete(questionToDelete);
      
      if (apiUtils.isSuccess(response)) {
        toast.success('Question deleted successfully!');
        loadQuestions();
      } else {
        toast.error(apiUtils.handleError(response));
      }
    } catch (error) {
      console.error('Failed to delete question:', error);
      toast.error('Failed to delete question');
    } finally {
      setQuestionToDelete(null);
    }
  };

  // Toggle question selection
  const toggleQuestionSelection = (questionId: string) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestions(newSelected);
  };

  // Select all questions
  const selectAllQuestions = () => {
    if (selectedQuestions.size === questions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(questions.map(q => q.id)));
    }
  };

  // Handle delete multiple questions
  const handleDeleteMultiple = () => {
    if (selectedQuestions.size === 0) {
      toast.warning('Please select at least one question to delete');
      return;
    }
    setShowConfirmDeleteMultiple(true);
  };

  // Confirm delete multiple questions
  const confirmDeleteMultiple = async () => {
    try {
      const deletePromises = Array.from(selectedQuestions).map(id => 
        questionApi.delete(id)
      );
      
      const results = await Promise.all(deletePromises);
      const successCount = results.filter(r => apiUtils.isSuccess(r)).length;
      
      if (successCount === selectedQuestions.size) {
        toast.success(`${successCount} question(s) deleted successfully!`);
      } else {
        toast.warning(`${successCount} of ${selectedQuestions.size} question(s) deleted`);
      }
      
      setSelectedQuestions(new Set());
      loadQuestions();
    } catch (error) {
      console.error('Failed to delete questions:', error);
      toast.error('Failed to delete questions');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/90 via-purple-900/30 to-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/20 to-slate-900/95 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_rgba(139,92,246,0.3)] w-full max-w-4xl max-h-[90vh] border-2 border-purple-500/30 flex flex-col overflow-hidden">
        {/* Futuristic glow effects */}
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent opacity-30"></div>
        <div className="absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent opacity-30"></div>
        
        {/* Header with gradient */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Manage Questions</h2>
              <p className="text-xs text-gray-400 mt-0.5">{questions.length} question(s)</p>
            </div>
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
        <div className="flex-1 overflow-y-auto p-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
              {error}
            </div>
          )}

          {/* Action Buttons - Futuristic */}
          <div className="space-y-2 mb-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddQuestion}
                className="group relative flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white rounded-xl font-semibold text-sm shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all duration-300 border-2 border-purple-400/30 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <Plus className="h-4 w-4 relative z-10" />
                <span className="relative z-10">Add New</span>
              </button>

              <button
                onClick={() => setShowImportModal(true)}
                className="group relative flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 hover:from-green-500 hover:via-teal-500 hover:to-cyan-500 text-white rounded-xl font-semibold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300 border-2 border-green-400/30 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-cyan-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <svg className="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="relative z-10">Import JSON</span>
              </button>
            </div>

            {/* Selection Controls */}
            {questions.length > 0 && (
              <div className="flex items-center justify-between p-2 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg">
                <button
                  onClick={selectAllQuestions}
                  className="flex items-center space-x-2 text-xs text-gray-300 hover:text-white transition-colors"
                >
                  {selectedQuestions.size === questions.length ? (
                    <CheckSquare className="h-4 w-4 text-blue-400" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  <span>
                    {selectedQuestions.size === questions.length 
                      ? 'Deselect All' 
                      : `Select All (${selectedQuestions.size} selected)`}
                  </span>
                </button>

                {selectedQuestions.size > 0 && (
                  <button
                    onClick={handleDeleteMultiple}
                    className="group relative flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-semibold text-xs shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transition-all duration-300 border border-red-400/30 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Trash2 className="h-3.5 w-3.5 relative z-10" />
                    <span className="relative z-10">Delete Selected ({selectedQuestions.size})</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Questions List - Compact */}
          {isLoading ? (
            <div className="text-center py-8 text-gray-400 text-sm">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              <p>No questions yet. Click "Add New Question" to get started.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className={`bg-white/5 backdrop-blur-sm border rounded-lg p-3 hover:bg-white/10 transition-all duration-300 ${
                    selectedQuestions.has(question.id) 
                      ? 'border-blue-500/50 bg-blue-500/10' 
                      : 'border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start space-x-2 flex-1">
                      {/* Checkbox for selection */}
                      <button
                        onClick={() => toggleQuestionSelection(question.id)}
                        className="flex-shrink-0 mt-0.5"
                      >
                        {selectedQuestions.has(question.id) ? (
                          <CheckSquare className="h-5 w-5 text-blue-400" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded text-white font-bold text-xs flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1.5 flex-wrap">
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-xs font-medium whitespace-nowrap">
                            {QUESTION_TYPES.find(t => t.value === question.type)?.label || question.type}
                          </span>
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-300 border border-green-500/30 rounded text-xs font-medium whitespace-nowrap">
                            {question.points} {question.points === 1 ? 'pt' : 'pts'}
                          </span>
                        </div>
                        <p className="text-white font-medium text-sm mb-1.5">{question.question}</p>
                        
                        {/* Show options for multiple choice - Compact */}
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="mt-2 space-y-1">
                            {question.options.map((option, idx) => (
                              <div 
                                key={idx}
                                className={`text-xs px-2 py-1 rounded ${
                                  option === question.correctAnswer 
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                                    : 'text-gray-400 bg-white/5'
                                }`}
                              >
                                {String.fromCharCode(65 + idx)}. {option}
                                {option === question.correctAnswer && ' ✓'}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Show correct answer for other types - Compact */}
                        {question.type !== 'multiple-choice' && question.type !== 'essay' && (
                          <div className="mt-1.5 text-xs">
                            <span className="text-gray-400">Answer: </span>
                            <span className="text-green-300 font-medium">{question.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons - Compact */}
                    <div className="flex items-center space-x-1.5 ml-2">
                      <button
                        onClick={() => handleEditQuestion(question)}
                        className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded transition-all duration-300"
                        title="Edit question"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded transition-all duration-300"
                        title="Delete question"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer - Futuristic */}
        <div className="flex justify-end p-4 border-t border-purple-500/20 bg-gradient-to-r from-purple-900/10 to-blue-900/10 flex-shrink-0">
          <button
            onClick={onClose}
            className="group relative px-6 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 font-medium text-sm"
          >
            <span className="relative z-10">Close</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </button>
        </div>
      </div>

      {/* Add/Edit Question Modal */}
      {showQuestionModal && (
        <QuestionFormModal
          examId={examId}
          question={editingQuestion}
          onClose={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
          onSuccess={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
            loadQuestions();
          }}
        />
      )}

      {/* Import JSON Modal */}
      {showImportModal && (
        <ImportJSONModal
          examId={examId}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            loadQuestions();
          }}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          setQuestionToDelete(null);
        }}
        onConfirm={confirmDeleteQuestion}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmModal
        isOpen={showConfirmDeleteMultiple}
        onClose={() => setShowConfirmDeleteMultiple(false)}
        onConfirm={() => {
          confirmDeleteMultiple();
          setShowConfirmDeleteMultiple(false);
        }}
        title="Delete Multiple Questions"
        message={`Are you sure you want to delete ${selectedQuestions.size} selected question(s)? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        isDangerous={true}
      />
    </div>
  );
}

// Question Form Modal Component
interface QuestionFormModalProps {
  examId: string;
  question: Question | null;
  onClose: () => void;
  onSuccess: () => void;
}

function QuestionFormModal({ examId, question, onClose, onSuccess }: QuestionFormModalProps) {
  const toast = useToast();
  const isEditing = !!question;
  
  // Form state
  const [questionText, setQuestionText] = useState(question?.question || '');
  const [questionType, setQuestionType] = useState<string>(question?.type || 'multiple-choice');
  const [points, setPoints] = useState(question?.points || 1);
  const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer || '');
  const [options, setOptions] = useState<string[]>(question?.options || ['', '', '', '']);
  const [explanation, setExplanation] = useState(question?.explanation || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle option change for multiple choice
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Add new option for multiple choice
  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  // Remove option for multiple choice
  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.warning('You must have at least 2 options');
      return;
    }
    const newOptions = options.filter((_, idx) => idx !== index);
    setOptions(newOptions);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validation
      if (!questionText.trim()) {
        setError('Please enter a question');
        setIsLoading(false);
        return;
      }

      if (questionType === 'multiple-choice') {
        const validOptions = options.filter(opt => opt.trim() !== '');
        if (validOptions.length < 2) {
          setError('Please provide at least 2 options');
          setIsLoading(false);
          return;
        }
        if (!correctAnswer || !validOptions.includes(correctAnswer)) {
          setError('Please select a correct answer from the options');
          setIsLoading(false);
          return;
        }
      } else if (questionType !== 'essay' && !correctAnswer.trim()) {
        setError('Please provide a correct answer');
        setIsLoading(false);
        return;
      }

      const questionData = {
        examId,
        question: questionText,
        type: questionType as 'multiple-choice' | 'essay' | 'true-false' | 'identification' | 'short-answer' | 'fill-in-blank',
        points,
        correctAnswer: questionType === 'essay' ? '' : correctAnswer,
        options: questionType === 'multiple-choice' ? options.filter(opt => opt.trim() !== '') : undefined,
        explanation: explanation || undefined,
        order: question?.order || 0
      };

      let response;
      if (isEditing) {
        response = await questionApi.update(question.id, questionData);
      } else {
        response = await questionApi.create(questionData);
      }

      if (apiUtils.isSuccess(response)) {
        toast.success(`Question ${isEditing ? 'updated' : 'created'} successfully!`);
        onSuccess();
      } else {
        setError(apiUtils.handleError(response));
      }
    } catch (error) {
      console.error('Failed to save question:', error);
      setError('Failed to save question');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
      <div className="relative bg-gradient-to-br from-slate-900/98 via-purple-900/25 to-slate-900/98 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(139,92,246,0.4)] w-full max-w-2xl max-h-[90vh] border-2 border-purple-500/40 flex flex-col overflow-hidden">
        {/* Enhanced glow effects */}
        <div className="absolute top-0 left-1/3 w-1/3 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 right-1/3 w-1/3 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60"></div>
        
        {/* Header with gradient */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-purple-500/40 bg-gradient-to-r from-purple-900/30 to-pink-900/30 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              {isEditing ? 'Edit Question' : 'Add New Question'}
            </h3>
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
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Question Type and Points */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Question Type
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white transition-all duration-300"
                    style={{ colorScheme: 'dark' }}
                  >
                    {QUESTION_TYPES.map(type => (
                      <option key={type.value} value={type.value} className="bg-gray-800 text-white">{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Question
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300 resize-none"
                  placeholder="Enter your question here"
                  required
                />
              </div>

              {/* Multiple Choice Options */}
              {questionType === 'multiple-choice' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Answer Options
                  </label>
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={correctAnswer === option}
                          onChange={() => setCorrectAnswer(option)}
                          className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        />
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Option</span>
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-400">Select the radio button to mark the correct answer</p>
                </div>
              )}

              {/* True/False Options */}
              {questionType === 'true-false' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Correct Answer
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value="True"
                        checked={correctAnswer === 'True'}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500"
                      />
                      <span className="text-white">True</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value="False"
                        checked={correctAnswer === 'False'}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 focus:ring-blue-500"
                      />
                      <span className="text-white">False</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Identification/Short Answer */}
              {(questionType === 'identification' || questionType === 'short-answer') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter the correct answer"
                    required
                  />
                </div>
              )}

              {/* Essay - No correct answer needed */}
              {questionType === 'essay' && (
                <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm">
                  Essay questions will be graded manually. No correct answer is required.
                </div>
              )}

              {/* Explanation (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300 resize-none"
                  placeholder="Add an explanation for the correct answer"
                />
              </div>
            </div>

            {/* Futuristic Buttons */}
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
                className="group relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-300 flex items-center space-x-2 border-2 border-pink-400/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <Save className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{isLoading ? 'Saving...' : (isEditing ? 'Update Question' : 'Add Question')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Import JSON Modal Component
interface ImportJSONModalProps {
  examId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ImportJSONModal({ examId, onClose, onSuccess }: ImportJSONModalProps) {
  const toast = useToast();
  const [jsonText, setJsonText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTemplate, setShowTemplate] = useState(false);

  // JSON Template
  const jsonTemplate = `[
  {
    "question": "What is the capital of France?",
    "type": "identification",
    "points": 1,
    "correctAnswer": "Paris"
  },
  {
    "question": "What is 2 + 2?",
    "type": "multiple-choice",
    "points": 1,
    "correctAnswer": "4",
    "options": ["2", "3", "4", "5"]
  },
  {
    "question": "The earth is flat.",
    "type": "true-false",
    "points": 1,
    "correctAnswer": "False"
  },
  {
    "question": "Explain the theory of relativity.",
    "type": "essay",
    "points": 5,
    "correctAnswer": ""
  }
]`;

  const handleImport = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Parse JSON
      const questionsData = JSON.parse(jsonText);

      // Validate it's an array
      if (!Array.isArray(questionsData)) {
        setError('JSON must be an array of questions');
        setIsLoading(false);
        return;
      }

      // Import each question
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < questionsData.length; i++) {
        const q = questionsData[i];

        // Validate required fields
        if (!q.question || !q.type || !q.points) {
          failCount++;
          continue;
        }

        try {
          const questionData = {
            examId,
            question: q.question,
            type: q.type as 'multiple-choice' | 'essay' | 'true-false' | 'identification' | 'short-answer' | 'fill-in-blank',
            points: parseInt(q.points) || 1,
            correctAnswer: q.correctAnswer || '',
            options: q.options || undefined,
            explanation: q.explanation || undefined,
            order: i
          };

          const response = await questionApi.create(questionData);

          if (apiUtils.isSuccess(response)) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} question(s)!${failCount > 0 ? ` (${failCount} failed)` : ''}`);
        onSuccess();
      } else {
        setError('Failed to import any questions. Please check your JSON format.');
      }
    } catch (err) {
      setError('Invalid JSON format. Please check your syntax.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(jsonTemplate);
    toast.success('Template copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 z-[60] animate-in fade-in duration-200">
      <div className="relative bg-gradient-to-br from-slate-900/98 via-green-900/25 to-slate-900/98 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.4)] w-full max-w-3xl max-h-[90vh] border-2 border-green-500/40 flex flex-col overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/3 w-1/3 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 right-1/3 w-1/3 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-green-500/40 bg-gradient-to-r from-green-900/30 to-cyan-900/30 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-cyan-500 rounded-full"></div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Import Questions from JSON
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="group relative text-gray-400 hover:text-white p-2 rounded-lg transition-all duration-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/50"
          >
            <X className="h-5 w-5 relative z-10" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Template Toggle */}
          <div className="mb-4">
            <button
              onClick={() => setShowTemplate(!showTemplate)}
              className="text-sm text-cyan-400 hover:text-cyan-300 underline"
            >
              {showTemplate ? '▼ Hide' : '▶ Show'} JSON Template
            </button>
          </div>

          {/* Template Display */}
          {showTemplate && (
            <div className="mb-4 relative">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-green-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">JSON Template:</span>
                  <button
                    onClick={copyTemplate}
                    className="text-xs px-3 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-all"
                  >
                    Copy Template
                  </button>
                </div>
                <pre className="text-xs text-green-300 overflow-x-auto">
                  {jsonTemplate}
                </pre>
              </div>
              <div className="mt-2 text-xs text-gray-400 space-y-1">
                <p>• <strong>question</strong>: Question text (required)</p>
                <p>• <strong>type</strong>: multiple-choice | true-false | identification | essay | short-answer | fill-in-blank (required)</p>
                <p>• <strong>points</strong>: Point value (required)</p>
                <p>• <strong>correctAnswer</strong>: Correct answer (required for non-essay)</p>
                <p>• <strong>options</strong>: Array of options (required for multiple-choice)</p>
                <p>• <strong>explanation</strong>: Optional explanation</p>
              </div>
            </div>
          )}

          {/* JSON Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Paste your JSON here:
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-gray-400 transition-all duration-300 resize-none font-mono text-sm"
              placeholder={jsonTemplate}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-4 border-t border-green-500/20 bg-gradient-to-r from-green-900/10 to-cyan-900/10 flex-shrink-0">
          <button
            onClick={onClose}
            className="group relative px-6 py-2.5 bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 text-gray-300 hover:text-white rounded-xl transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 font-medium"
          >
            <span className="relative z-10">Cancel</span>
          </button>
          <button
            onClick={handleImport}
            disabled={isLoading || !jsonText.trim()}
            className="group relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-green-600 via-teal-600 to-cyan-600 hover:from-green-500 hover:via-teal-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300 flex items-center space-x-2 border-2 border-green-400/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg className="h-4 w-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="relative z-10">{isLoading ? 'Importing...' : 'Import Questions'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

