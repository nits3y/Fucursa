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
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const securityCheckRef = useRef<NodeJS.Timeout | null>(null);

  // Mock exam data
  const mockExamData: ExamData = {
    id: examId,
    title: 'Mathematics Final Exam',
    description: 'Comprehensive exam covering algebra, geometry, and calculus topics.',
    timeLimit: 120,
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
      }
      setIsFullscreen(true);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
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

  const handleSecurityViolation = (type: string) => {
    const newWarningCount = securityWarnings + 1;
    setSecurityWarnings(newWarningCount);
    
    console.warn(`Security violation detected: ${type}`);
    
    if (newWarningCount >= 3) {
      // Auto-submit exam after 3 violations
      handleSubmitExam(true);
    } else {
      setShowSecurityModal(true);
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
      
      if (!isCurrentlyFullscreen && examStarted) {
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
    };
  }, [examStarted, securityWarnings]);

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
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (isExamSubmitted) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Exam Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your exam has been successfully submitted. You can now close this window.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p><strong>Student:</strong> {studentInfo.fullName}</p>
            <p><strong>Exam ID:</strong> {examId}</p>
            <p><strong>Security Warnings:</strong> {securityWarnings}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4">
          <div className="text-center mb-8">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{examData.title}</h1>
            <p className="text-gray-600">{examData.description}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Student:</span>
              <span className="text-gray-900">{studentInfo.fullName}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Exam ID:</span>
              <span className="text-gray-900 font-mono">{examId}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Time Limit:</span>
              <span className="text-gray-900">{examData.timeLimit} minutes</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Questions:</span>
              <span className="text-gray-900">{examData.questions.length}</span>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-2">Security Notice:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your screen will enter fullscreen mode</li>
                  <li>• Tab switching will be monitored and prevented</li>
                  <li>• Right-click and keyboard shortcuts are disabled</li>
                  <li>• 3 security violations will auto-submit your exam</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  const currentQ = examData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Security Status Bar */}
      <div className="bg-red-900 px-4 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Secure Mode Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span>Warnings: {securityWarnings}/3</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className={`font-mono ${timeRemaining < 300 ? 'text-red-400' : ''}`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">
              Question {currentQuestion + 1} of {examData.questions.length}
            </span>
            <span className="text-sm text-gray-300">
              {Math.round(((currentQuestion + 1) / examData.questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / examData.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentQ.question}
          </h2>

          {currentQ.type === 'multiple-choice' || currentQ.type === 'true-false' ? (
            <div className="space-y-3">
              {currentQ.options?.map((option, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={option}
                    checked={answers[currentQ.id] === option}
                    onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          ) : currentQ.type === 'essay' ? (
            <textarea
              value={answers[currentQ.id] || ''}
              onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
              className="w-full h-32 p-4 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Type your answer here..."
            />
          ) : null}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 rounded-lg transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center space-x-4">
            {currentQuestion === examData.questions.length - 1 ? (
              <button
                onClick={() => handleSubmitExam(false)}
                className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Submit Exam
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(examData.questions.length - 1, currentQuestion + 1))}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Warning Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-red-900 rounded-lg p-6 max-w-md mx-4">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Security Violation Detected!</h3>
              <p className="text-red-200 mb-4">
                Warning {securityWarnings}/3: Unauthorized action detected. 
                {securityWarnings >= 2 && ' One more violation will auto-submit your exam!'}
              </p>
              <button
                onClick={() => setShowSecurityModal(false)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
