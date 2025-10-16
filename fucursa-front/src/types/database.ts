// Teacher interface
export interface Teacher {
  id: string;
  name: string;
  email: string;
  password: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

// Exam interface
export interface Exam {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  timeLimit: number; // in minutes
  timeLimitSeconds?: number; // in seconds
  timePerQuestion?: number; // in seconds
  timingMode?: 'exam' | 'per-question'; // timing control mode
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  maxAttempts?: number;
  instructions?: string;
  edpCodes?: string[]; // Array of EDP codes for access control
  requireEdpCode?: boolean; // Whether EDP code verification is required
}

// Question interface
export interface Question {
  id: string;
  examId: string;
  question: string;
  type: 'multiple-choice' | 'essay' | 'true-false' | 'identification' | 'short-answer' | 'fill-in-blank';
  options?: string[];
  correctAnswer?: string;
  points: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  explanation?: string;
  isRequired?: boolean;
}

// Student response interface
export interface StudentResponse {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  edpCode?: string; // EDP code used by the student
  answers: {
    [questionId: string]: string;
  };
  score?: number;
  totalPoints?: number;
  percentage?: number;
  timeSpent: number; // in seconds
  submittedAt: string;
  createdAt: string;
  isAutoSubmitted: boolean;
  securityWarnings: number;
  status: 'in-progress' | 'submitted' | 'graded';
}

// Student info interface for exam taking
export interface StudentInfo {
  fullName: string;
  email: string;
  studentId?: string;
  department?: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Login request interface
export interface LoginRequest {
  email: string;
  password: string;
}

// Create exam request interface
export interface CreateExamRequest {
  title: string;
  description: string;
  timeLimit?: number;
  timeLimitSeconds?: number;
  timePerQuestion?: number;
  timingMode?: 'exam' | 'per-question';
  instructions?: string;
  startDate?: string;
  endDate?: string;
  maxAttempts?: number;
  requireEdpCode?: boolean;
  edpCodes?: string[];
}

// Create question request interface
export interface CreateQuestionRequest {
  examId: string;
  question: string;
  type: 'multiple-choice' | 'essay' | 'true-false' | 'identification' | 'short-answer' | 'fill-in-blank';
  options?: string[];
  correctAnswer?: string;
  points: number;
  order: number;
  explanation?: string;
  isRequired?: boolean;
}

// Submit exam request interface
export interface SubmitExamRequest {
  examId: string;
  studentInfo: StudentInfo;
  answers: { [questionId: string]: string };
  timeSpent: number;
  isAutoSubmitted: boolean;
  securityWarnings: number;
  edpCode?: string; // EDP code used by the student
}

// Exam statistics interface
export interface ExamStats {
  totalExams: number;
  activeExams: number;
  completedExams: number;
  totalStudents: number;
  totalResponses: number;
  averageScore: number;
}

// Question statistics interface
export interface QuestionStats {
  questionId: string;
  totalResponses: number;
  correctResponses: number;
  averageTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
