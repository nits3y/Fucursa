'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Clock, AlertTriangle, Shield, Eye, EyeOff } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'essay' | 'true-false';
  options?: string[];
  correctAnswer?: string;
}

interface ExamData {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
}

export default function ExamPage() {
  const params = useParams();
  const examId = params.id as string;
  
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [securityWarnings, setSecurityWarnings] = useState(0);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [isReenteringFullscreen, setIsReenteringFullscreen] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);

  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const securityCheckRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Mock exam data
  const mockExamData: ExamData = {
    id: examId,
    title: 'Mathematics Final Exam',
    description: 'Comprehensive exam covering algebra, geometry, and calculus topics.',
    timeLimit: 1,
    questions: [
      {
        id: '1',
        question: 'What is the derivative of x²?',
        type: 'multiple-choice',
        options: ['2x', 'x', '2', 'x²'],
        correctAnswer: '2x'
      },
      {
        id: '2',
        question: 'Solve for x: 2x + 5 = 15',
        type: 'multiple-choice',
        options: ['5', '10', '7.5', '20'],
        correctAnswer: '5'
      },
      {
        id: '3',
        question: 'Explain the Pythagorean theorem and provide an example.',
        type: 'essay'
      },
      {
        id: '4',
        question: 'The sum of angles in a triangle is always 180 degrees.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'True'
      }
    ]
  };

  // Security functions
  const enterFullscreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
      return true;
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      setIsFullscreen(false);
      return false;
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  const startCountdown = () => {
    // Clear any existing countdown first
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    setCountdown(8);
    setIsCountingDown(true);
    
    console.log('Starting countdown from 8 seconds'); // Debug log
    
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        console.log('Countdown tick:', prev); // Debug log
        if (prev <= 1) {
          // Time's up, auto-submit exam
          console.log('Countdown reached 0, auto-submitting exam'); // Debug log
          handleSubmitExam(true);
          clearInterval(countdownRef.current!);
          setIsCountingDown(false);
          setShowSecurityModal(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setIsCountingDown(false);
    setCountdown(0);
  };

  const handleSecurityViolation = (type: string) => {
    const newWarningCount = securityWarnings + 1;
    setSecurityWarnings(newWarningCount);
    
    console.warn(`Security violation detected: ${type}`);
    
    if (newWarningCount >= 2) {
      // Auto-submit exam after 2 violations
      handleSubmitExam(true);
    } else {
      setShowSecurityModal(true);
      // Always start countdown when showing security modal
      startCountdown();
    }
  };

  const reenterFullscreen = async (): Promise<boolean> => {
    setIsReenteringFullscreen(true);
    try {
      const success = await enterFullscreen();
      if (!success) {
        // If automatic fullscreen fails, we'll rely on user interaction
        console.warn('Automatic fullscreen failed, user must manually enter fullscreen');
      }
      // Small delay to allow fullscreen to properly activate
      setTimeout(() => {
        setIsReenteringFullscreen(false);
      }, 1000);
      return success;
    } catch (error) {
      console.error('Failed to re-enter fullscreen:', error);
      setIsReenteringFullscreen(false);
      return false;
    }
  };

  // Initialize exam
  useEffect(() => {
    const storedStudentInfo = localStorage.getItem('studentInfo');
    if (!storedStudentInfo) {
      window.location.href = '/';
      return;
    }

    const parsedStudentInfo = JSON.parse(storedStudentInfo);
    setStudentInfo(parsedStudentInfo);
    setExamData(mockExamData);
    setTimeRemaining(mockExamData.timeLimit * 60); // Convert to seconds
  }, [examId]);

  // Security monitoring
  useEffect(() => {
    if (!examStarted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSecurityViolation('Tab switch detected');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Alt+Tab, Ctrl+T, Ctrl+W, etc.
      if (
        (e.altKey && e.key === 'Tab') ||
        (e.ctrlKey && (e.key === 't' || e.key === 'w' || e.key === 'n')) ||
        e.key === 'F11' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault();
        handleSecurityViolation('Forbidden key combination');
      }
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (isCurrentlyFullscreen) {
        // Student returned to fullscreen, reset everything
        stopCountdown();
        setShowSecurityModal(false);
      } else if (examStarted && !isReenteringFullscreen && !isSubmittingExam) {
        // Only trigger security violation if:
        // - Exam has started
        // - We're not in the process of re-entering fullscreen
        // - We're not in the process of submitting the exam
        handleSecurityViolation('Exited fullscreen mode');
      }
    };

    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      handleSecurityViolation('Right-click attempted');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleRightClick);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleRightClick);
      // Cleanup countdown timer
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [examStarted, securityWarnings, isReenteringFullscreen, isSubmittingExam]);

  // Timer
  useEffect(() => {
    if (!examStarted || timeRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [examStarted, timeRemaining]);

  const startExam = async () => {
    await enterFullscreen();
    setExamStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitExam = async (autoSubmit = false) => {
    // Set flag to prevent security violations during legitimate submission
    setIsSubmittingExam(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Stop countdown timer
    stopCountdown();

    // TODO: Submit answers to backend
    console.log('Submitting exam:', {
      studentInfo,
      examId,
      answers,
      timeUsed: (examData!.timeLimit * 60) - timeRemaining,
      securityWarnings,
      autoSubmit
    });

    setIsExamSubmitted(true);
    await exitFullscreen();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!studentInfo || !examData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (isExamSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center border border-white/20">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Exam Submitted!</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Your exam has been successfully submitted. You can now close this window.
          </p>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-sm border border-white/10">
            <div className="space-y-2 text-gray-300">
              <p><span className="text-gray-400">Student:</span> <span className="text-white font-medium">{studentInfo.fullName}</span></p>
              <p><span className="text-gray-400">Exam ID:</span> <span className="text-white font-mono">{examId}</span></p>
              <p><span className="text-gray-400">Security Warnings:</span> <span className={`font-medium ${securityWarnings === 0 ? 'text-green-400' : securityWarnings === 1 ? 'text-yellow-400' : 'text-red-400'}`}>{securityWarnings}</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 border border-white/20">
          <div className="text-center mb-8">
            <div className="transform hover:scale-105 transition-transform duration-300 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-2xl relative">
                <Shield className="h-10 w-10 text-white" />
                <div className="absolute -top-1 -right-1">
                  <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">{examData.title}</h1>
            <p className="text-gray-300 leading-relaxed">{examData.description}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <span className="font-medium text-gray-300">Student:</span>
              <span className="text-white font-medium">{studentInfo.fullName}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <span className="font-medium text-gray-300">Exam ID:</span>
              <span className="text-white font-mono">{examId}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <span className="font-medium text-gray-300">Time Limit:</span>
              <span className="text-white font-medium">{examData.timeLimit} minutes</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <span className="font-medium text-gray-300">Questions:</span>
              <span className="text-white font-medium">{examData.questions.length}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-200">
                <p className="font-semibold mb-3 text-red-300">Security Notice:</p>
                <ul className="space-y-2 text-xs text-red-100">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>Your screen will enter fullscreen mode</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>Tab switching will be monitored and prevented</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>Right-click and keyboard shortcuts are disabled</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    <span>2 security violations will auto-submit your exam</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={startExam}
            className="group relative overflow-hidden w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Start Exam</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQ = examData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/3 via-transparent to-blue-500/3"></div>
      </div>

      {/* Modern Security Status Bar */}
      <div className="relative z-10 bg-gradient-to-r from-red-900/70 via-red-800/70 to-red-900/70 backdrop-blur-xl border-b border-red-500/20 px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-1.5 rounded-full shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Secure Mode</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <AlertTriangle className={`h-4 w-4 ${securityWarnings === 0 ? 'text-green-400' : securityWarnings === 1 ? 'text-yellow-400' : 'text-red-400'}`} />
              <span className="font-semibold text-sm">
                Warnings: <span className={`${securityWarnings >= 1 ? 'text-red-300 font-bold' : 'text-green-300'}`}>{securityWarnings}/2</span>
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-black/30 backdrop-blur-sm px-5 py-2 rounded-full border border-white/20 shadow-lg">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className={`font-mono font-bold text-lg ${timeRemaining < 300 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Modern Progress Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-lg mb-4">
              <span className="text-white font-semibold">
                Question {currentQuestion + 1} of {examData.questions.length}
              </span>
              <div className="w-px h-4 bg-white/30"></div>
              <span className="text-blue-300 font-semibold">
                {Math.round(((currentQuestion + 1) / examData.questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-white/10 backdrop-blur-sm rounded-full h-2 border border-white/20 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 h-2 rounded-full transition-all duration-700 shadow-lg relative"
                style={{ width: `${((currentQuestion + 1) / examData.questions.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Modern Question Card */}
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl mb-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8 text-white leading-relaxed text-center">
                {currentQ.question}
              </h2>

              {currentQ.type === 'multiple-choice' || currentQ.type === 'true-false' ? (
                <div className="space-y-4 max-w-2xl mx-auto">
                  {currentQ.options?.map((option, index) => (
                    <label
                      key={index}
                      className="group flex items-center space-x-5 p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 cursor-pointer transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:-translate-y-1 hover:shadow-2xl"
                    >
                      <div className="relative">
                        <input
                          type="radio"
                          name={`question-${currentQ.id}`}
                          value={option}
                          checked={answers[currentQ.id] === option}
                          onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                          className="w-6 h-6 text-blue-500 bg-white/10 border-white/30 focus:ring-blue-500 focus:ring-2 rounded-full opacity-0 absolute"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          answers[currentQ.id] === option 
                            ? 'border-blue-400 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg' 
                            : 'border-white/40 bg-white/10 group-hover:border-white/60'
                        }`}>
                          {answers[currentQ.id] === option && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-200 group-hover:text-white transition-colors font-medium text-lg flex-1">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              ) : currentQ.type === 'essay' ? (
                <div className="max-w-3xl mx-auto">
                  <textarea
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    className="w-full h-48 p-8 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none text-white placeholder-gray-400 transition-all duration-300 text-lg leading-relaxed shadow-inner"
                    placeholder="Type your detailed answer here..."
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* Modern Navigation */}
          <div className="flex items-center justify-center space-x-8">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="group px-10 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed rounded-2xl transition-all duration-300 border border-white/20 hover:border-white/40 transform hover:-translate-y-1 disabled:transform-none font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              ← Previous
            </button>

            {currentQuestion === examData.questions.length - 1 ? (
              <button
                onClick={() => handleSubmitExam(false)}
                className="group relative overflow-hidden px-12 py-4 bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 text-white rounded-2xl font-bold shadow-2xl hover:shadow-green-500/30 transform hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">🎯 Submit Exam</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(examData.questions.length - 1, currentQuestion + 1))}
                className="group relative overflow-hidden px-10 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 text-white rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Next →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Warning Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-red-900/90 to-red-800/90 backdrop-blur-md rounded-3xl p-8 max-w-md mx-4 border border-red-500/30 shadow-2xl">
            <div className="text-center">
              <div className="bg-red-500 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Security Violation Detected!</h3>
              <p className="text-red-200 mb-6 leading-relaxed">
                Warning {securityWarnings}/2: Unauthorized action detected. 
                {securityWarnings >= 1 && ' One more violation will auto-submit your exam!'}
              </p>
              
              <div className="bg-red-800/50 backdrop-blur-sm border border-red-600/50 rounded-2xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-red-200 mb-3 animate-pulse">{countdown}</div>
                  <p className="text-red-200 text-sm font-semibold">
                    Exam will auto-submit in {countdown} seconds!
                  </p>
                  <p className="text-red-300 text-xs mt-2">
                    Return to fullscreen mode to cancel auto-submission
                  </p>
                </div>
              </div>
              
              {!isFullscreen && (
                <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-4 mb-6">
                  <p className="text-yellow-200 mb-2 font-medium">You must return to fullscreen mode to continue the exam.</p>
                  <p className="text-xs text-yellow-300">
                    Press <strong>F11</strong> or use your browser's fullscreen option to return to fullscreen.
                  </p>
                </div>
              )}
              
              <div className="flex justify-center">
                {!isFullscreen && (
                  <button
                    onClick={() => {
                      stopCountdown();
                      setShowSecurityModal(false);
                      reenterFullscreen().then((success) => {
                        if (!success) {
                          // If fullscreen fails, show a message
                          setTimeout(() => {
                            if (!document.fullscreenElement) {
                              alert('Please manually enter fullscreen mode by pressing F11 or clicking the fullscreen button in your browser.');
                            }
                          }, 1000);
                        }
                      });
                    }}
                    className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
                    disabled={isReenteringFullscreen}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">{isReenteringFullscreen ? 'Entering Fullscreen...' : 'Return to Fullscreen'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
