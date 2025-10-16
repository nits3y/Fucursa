import { ApiResponse, Teacher, Exam, Question, StudentResponse, StudentInfo, CreateExamRequest, CreateQuestionRequest, SubmitExamRequest, LoginRequest, ExamStats } from '@/types/database';

// Base API URL
const API_BASE = '/api';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Network error occurred'
    };
  }
}

// Teacher API functions
export const teacherApi = {
  // Get all teachers
  async getAll(): Promise<ApiResponse<Teacher[]>> {
    return apiRequest<Teacher[]>('/teachers');
  },

  // Get teacher by ID
  async getById(id: string): Promise<ApiResponse<Teacher>> {
    return apiRequest<Teacher>(`/teachers/${id}`);
  },

  // Create teacher
  async create(teacherData: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Teacher>> {
    return apiRequest<Teacher>('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
    });
  },

  // Update teacher
  async update(id: string, updateData: Partial<Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Teacher>> {
    return apiRequest<Teacher>(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete teacher
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiRequest<null>(`/teachers/${id}`, {
      method: 'DELETE',
    });
  },

  // Teacher login
  async login(credentials: LoginRequest): Promise<ApiResponse<Omit<Teacher, 'password'>>> {
    return apiRequest<Omit<Teacher, 'password'>>('/teachers/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
};

// Exam API functions
export const examApi = {
  // Get all exams
  async getAll(teacherId?: string): Promise<ApiResponse<Exam[]>> {
    const url = teacherId ? `/exams?teacherId=${teacherId}` : '/exams';
    return apiRequest<Exam[]>(url);
  },

  // Get exam by ID
  async getById(id: string): Promise<ApiResponse<Exam>> {
    return apiRequest<Exam>(`/exams/${id}`);
  },

  // Create exam
  async create(examData: CreateExamRequest & { teacherId: string }): Promise<ApiResponse<Exam>> {
    return apiRequest<Exam>('/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  },

  // Update exam
  async update(id: string, updateData: Partial<Omit<Exam, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Exam>> {
    return apiRequest<Exam>(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete exam
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiRequest<null>(`/exams/${id}`, {
      method: 'DELETE',
    });
  },

  // Get exam questions
  async getQuestions(id: string): Promise<ApiResponse<Question[]>> {
    return apiRequest<Question[]>(`/exams/${id}/questions`);
  },

  // Get exam responses
  async getResponses(id: string): Promise<ApiResponse<StudentResponse[]>> {
    return apiRequest<StudentResponse[]>(`/exams/${id}/responses`);
  },
};

// Question API functions
export const questionApi = {
  // Get questions by exam
  async getByExam(examId: string): Promise<ApiResponse<Question[]>> {
    return apiRequest<Question[]>(`/questions?examId=${examId}`);
  },

  // Get question by ID
  async getById(id: string): Promise<ApiResponse<Question>> {
    return apiRequest<Question>(`/questions/${id}`);
  },

  // Create question
  async create(questionData: CreateQuestionRequest): Promise<ApiResponse<Question>> {
    return apiRequest<Question>('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  },

  // Update question
  async update(id: string, updateData: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ApiResponse<Question>> {
    return apiRequest<Question>(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete question
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiRequest<null>(`/questions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Student Response API functions
export const studentResponseApi = {
  // Get all responses
  async getAll(examId?: string, studentId?: string): Promise<ApiResponse<StudentResponse[]>> {
    const params = new URLSearchParams();
    if (examId) params.append('examId', examId);
    if (studentId) params.append('studentId', studentId);
    const url = params.toString() ? `/student-responses?${params.toString()}` : '/student-responses';
    return apiRequest<StudentResponse[]>(url);
  },

  // Get response by ID
  async getById(id: string): Promise<ApiResponse<StudentResponse>> {
    return apiRequest<StudentResponse>(`/student-responses/${id}`);
  },

  // Submit exam response
  async submit(responseData: SubmitExamRequest): Promise<ApiResponse<StudentResponse>> {
    return apiRequest<StudentResponse>('/student-responses', {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  },

  // Update response (for grading)
  async update(id: string, updateData: Partial<Omit<StudentResponse, 'id' | 'createdAt'>>): Promise<ApiResponse<StudentResponse>> {
    return apiRequest<StudentResponse>(`/student-responses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete response
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiRequest<null>(`/student-responses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Statistics API functions
export const statsApi = {
  // Get overall statistics
  async getStats(teacherId?: string): Promise<ApiResponse<ExamStats>> {
    const url = teacherId ? `/stats?teacherId=${teacherId}` : '/stats';
    return apiRequest<ExamStats>(url);
  },
};

// Utility functions
export const apiUtils = {
  // Handle API errors
  handleError: (error: any): string => {
    if (error?.error) return error.error;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
  },

  // Check if response is successful
  isSuccess: (response: ApiResponse<any>): boolean => {
    return response.success === true;
  },

  // Get data from response
  getData: <T>(response: ApiResponse<T>): T | null => {
    return response.success ? response.data || null : null;
  },
};
