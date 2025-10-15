'use client';

import { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { examApi, apiUtils } from '@/lib/api';
import { Exam } from '@/types/database';
import { useToast } from '@/components/Toast';

interface EditExamModalProps {
  exam: Exam;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditExamModal({ exam, onClose, onSuccess }: EditExamModalProps) {
  const toast = useToast();
  const [title, setTitle] = useState(exam.title);
  const [description, setDescription] = useState(exam.description);
  const [timePerQuestion, setTimePerQuestion] = useState(exam.timePerQuestion || 60);
  const [status, setStatus] = useState(exam.status);
  const [instructions, setInstructions] = useState(exam.instructions || '');
  const [requireEdpCode, setRequireEdpCode] = useState(exam.requireEdpCode || false);
  const [edpCodes, setEdpCodes] = useState<string[]>(exam.edpCodes || []);
  const [newEdpCode, setNewEdpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const updateData = {
        title,
        description,
        timeLimit: Math.ceil(timePerQuestion / 60), // Convert to minutes for backward compatibility
        timeLimitSeconds: timePerQuestion,
        timePerQuestion,
        timingMode: 'per-question' as const,
        status,
        instructions: instructions || undefined
      };

      const response = await examApi.update(exam.id, updateData);
      
      if (apiUtils.isSuccess(response)) {
        toast.success('Exam updated successfully!');
        onSuccess();
        onClose();
      } else {
        setError(apiUtils.handleError(response));
      }
    } catch (error) {
      console.error('Failed to update exam:', error);
      setError('Failed to update exam. Please try again.');
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
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Edit Exam</h2>
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
        <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-start space-x-3 backdrop-blur-sm">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-400" />
              <div>
                <p className="font-medium text-red-200 mb-1">Error</p>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
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

            <div className="md:col-span-2">
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
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'active' | 'completed' | 'archived')}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white transition-all duration-300"
                style={{ colorScheme: 'dark' }}
              >
                <option value="draft" className="bg-gray-800 text-white">Draft</option>
                <option value="active" className="bg-gray-800 text-white">Active</option>
                <option value="completed" className="bg-gray-800 text-white">Completed</option>
                <option value="archived" className="bg-gray-800 text-white">Archived</option>
              </select>
            </div>

            <div className="md:col-span-2">
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
                <Save className="h-4 w-4 relative z-10" />
                <span className="relative z-10">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
