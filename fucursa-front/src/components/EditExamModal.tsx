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
  const [activeTab, setActiveTab] = useState<'basic' | 'settings'>('basic');
  const [title, setTitle] = useState(exam.title);
  const [description, setDescription] = useState(exam.description);
  const [timePerQuestion, setTimePerQuestion] = useState(exam.timePerQuestion || 60);
  const [status, setStatus] = useState(exam.status);
  const [instructions, setInstructions] = useState(exam.instructions || '');
  
  // Enable deadline toggle if exam already has an endDate
  const [enableDeadline, setEnableDeadline] = useState(!!exam.endDate);
  
  // Split existing endDate into date and time
  const [deadlineDate, setDeadlineDate] = useState(
    exam.endDate ? exam.endDate.slice(0, 10) : ''
  );
  const [deadlineTime, setDeadlineTime] = useState(
    exam.endDate ? exam.endDate.slice(11, 16) : ''
  );
  
  const [requireEdpCode, setRequireEdpCode] = useState(exam.requireEdpCode || false);
  const [edpCodes, setEdpCodes] = useState<string[]>(exam.edpCodes || []);
  const [newEdpCode, setNewEdpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    setError('');

    try {
      // Combine date and time if deadline is enabled and both are provided
      let endDate = undefined;
      if (enableDeadline && deadlineDate && deadlineTime) {
        endDate = `${deadlineDate}T${deadlineTime}`;
      }

      const updateData = {
        title,
        description,
        timeLimit: Math.ceil(timePerQuestion / 60), // Convert to minutes for backward compatibility
        timeLimitSeconds: timePerQuestion,
        timePerQuestion,
        timingMode: 'per-question' as const,
        status,
        instructions: instructions || undefined,
        endDate: endDate || undefined,
        requireEdpCode,
        edpCodes: requireEdpCode ? edpCodes : []
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
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Edit Exam</h2>
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
          {/* Error Display */}
          {error && (
            <div className="mx-5 mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-xs flex items-start space-x-2 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-red-400" />
              <div>
                <p className="font-medium text-red-200 mb-0.5">Error</p>
                <p className="text-red-300">{error}</p>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="flex-1 px-5 py-4">
            {activeTab === 'basic' && (
              <div className="space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Exam Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
                      placeholder="Enter exam title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300 resize-none"
                      placeholder="Enter exam description"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Time Per Question (seconds)
                      </label>
                      <input
                        type="number"
                        value={timePerQuestion}
                        onChange={(e) => setTimePerQuestion(parseInt(e.target.value) || 0)}
                        min="1"
                        max="3600"
                        className="w-full px-3 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
                        placeholder="e.g., 60"
                        required
                      />
                      <p className="mt-1 text-[10px] text-gray-400">
                        Time per question
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1.5">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'draft' | 'active' | 'completed' | 'archived')}
                        className="w-full px-3 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white transition-all duration-300"
                        style={{ colorScheme: 'dark' }}
                      >
                        <option value="draft" className="bg-gray-800 text-white">Draft</option>
                        <option value="active" className="bg-gray-800 text-white">Active</option>
                        <option value="completed" className="bg-gray-800 text-white">Completed</option>
                        <option value="archived" className="bg-gray-800 text-white">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      Instructions (Optional)
                    </label>
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      rows={5}
                      className="w-full px-3 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300 resize-none"
                      placeholder="Enter exam instructions"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4 h-full">
                {/* Exam Deadline Section with Toggle Switch */}
                <div className="border border-orange-500/20 rounded-xl p-4 bg-orange-500/5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-medium text-gray-300">
                      Exam Deadline
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enableDeadline}
                        onChange={(e) => setEnableDeadline(e.target.checked)}
                        className="w-3.5 h-3.5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
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
                            className="w-full px-3 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white transition-all duration-300"
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
                            className="w-full px-3 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 text-white transition-all duration-300"
                            style={{ colorScheme: 'dark' }}
                            required={enableDeadline}
                          />
                        </div>
                      </div>
                      <p className="mt-2 text-[10px] text-gray-400">
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
                <div className="border border-purple-500/20 rounded-xl p-4 bg-purple-500/5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-medium text-gray-300">
                      EDP Code Verification
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireEdpCode}
                        onChange={(e) => setRequireEdpCode(e.target.checked)}
                        className="w-3.5 h-3.5 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
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
                          className="flex-1 px-3 py-2 text-sm bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
                          placeholder="Enter EDP code (numbers only)"
                        />
                        <button
                          type="button"
                          onClick={handleAddEdpCode}
                          className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-medium"
                        >
                          Add
                        </button>
                      </div>

                      {edpCodes.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] text-gray-400">Allowed EDP Codes ({edpCodes.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {edpCodes.map((code) => (
                              <div
                                key={code}
                                className="flex items-center space-x-2 px-2.5 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg"
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
                        <p className="text-[10px] text-yellow-400">⚠️ Add at least one EDP code to enable verification</p>
                      )}
                    </div>
                  )}
                </div>

                {!requireEdpCode && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    <p>Enable EDP Code Verification to add access codes</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-3 px-5 py-3 border-t border-purple-500/20">
            <button
              type="button"
              onClick={onClose}
              className="group relative px-5 py-2 text-sm bg-gradient-to-r from-gray-800/50 to-gray-900/50 hover:from-gray-700/50 hover:to-gray-800/50 text-gray-300 hover:text-white rounded-lg transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 font-medium"
            >
              <span className="relative z-10">Cancel</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative overflow-hidden px-5 py-2 text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-bold shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all duration-300 flex items-center space-x-2 border-2 border-purple-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <Save className="h-4 w-4 relative z-10" />
              <span className="relative z-10">
                {isLoading ? 'Saving...' : 'Save Changes'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
