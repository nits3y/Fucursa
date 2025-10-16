import fs from 'fs';
import path from 'path';

// Database file paths
const DB_DIR = path.join(process.cwd(), 'src', 'database');
const TEACHERS_DB = path.join(DB_DIR, 'teachers.json');
const EXAMS_DB = path.join(DB_DIR, 'exams.json');
const STUDENT_RESPONSES_DB = path.join(DB_DIR, 'student_responses.json');
const QUESTIONS_DB = path.join(DB_DIR, 'questions.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize database files if they don't exist
const initializeDatabase = () => {
  if (!fs.existsSync(TEACHERS_DB)) {
    fs.writeFileSync(TEACHERS_DB, JSON.stringify({ teachers: [] }, null, 2));
  }
  if (!fs.existsSync(EXAMS_DB)) {
    fs.writeFileSync(EXAMS_DB, JSON.stringify({ exams: [] }, null, 2));
  }
  if (!fs.existsSync(STUDENT_RESPONSES_DB)) {
    fs.writeFileSync(STUDENT_RESPONSES_DB, JSON.stringify({ responses: [] }, null, 2));
  }
  if (!fs.existsSync(QUESTIONS_DB)) {
    fs.writeFileSync(QUESTIONS_DB, JSON.stringify({ questions: [] }, null, 2));
  }
};

// Initialize database on import
initializeDatabase();

// Generic database operations
export class Database {
  private static readFile(filePath: string): any {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading database file ${filePath}:`, error);
      return null;
    }
  }

  private static writeFile(filePath: string, data: any): boolean {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing to database file ${filePath}:`, error);
      return false;
    }
  }

  // Teachers database operations
  static async getTeachers() {
    const data = this.readFile(TEACHERS_DB);
    return data?.teachers || [];
  }

  static async getTeacherById(id: string) {
    const teachers = await this.getTeachers();
    return teachers.find((teacher: any) => teacher.id === id);
  }

  static async getTeacherByEmail(email: string) {
    const teachers = await this.getTeachers();
    return teachers.find((teacher: any) => teacher.email === email);
  }

  static async createTeacher(teacherData: any) {
    const data = this.readFile(TEACHERS_DB);
    const newTeacher = {
      id: `teacher_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...teacherData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.teachers.push(newTeacher);
    this.writeFile(TEACHERS_DB, data);
    return newTeacher;
  }

  static async updateTeacher(id: string, updateData: any) {
    const data = this.readFile(TEACHERS_DB);
    const teacherIndex = data.teachers.findIndex((teacher: any) => teacher.id === id);
    
    if (teacherIndex === -1) return null;
    
    data.teachers[teacherIndex] = {
      ...data.teachers[teacherIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    this.writeFile(TEACHERS_DB, data);
    return data.teachers[teacherIndex];
  }

  static async deleteTeacher(id: string) {
    const data = this.readFile(TEACHERS_DB);
    data.teachers = data.teachers.filter((teacher: any) => teacher.id !== id);
    this.writeFile(TEACHERS_DB, data);
    return true;
  }

  // Exams database operations
  static async getExams() {
    const data = this.readFile(EXAMS_DB);
    return data?.exams || [];
  }

  static async getExamById(id: string) {
    const exams = await this.getExams();
    return exams.find((exam: any) => exam.id === id);
  }

  static async getExamsByTeacher(teacherId: string) {
    const exams = await this.getExams();
    return exams.filter((exam: any) => exam.teacherId === teacherId);
  }

  static async createExam(examData: any) {
    const data = this.readFile(EXAMS_DB);
    const newExam = {
      id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...examData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.exams.push(newExam);
    this.writeFile(EXAMS_DB, data);
    return newExam;
  }

  static async updateExam(id: string, updateData: any) {
    const data = this.readFile(EXAMS_DB);
    const examIndex = data.exams.findIndex((exam: any) => exam.id === id);
    
    if (examIndex === -1) return null;
    
    data.exams[examIndex] = {
      ...data.exams[examIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    this.writeFile(EXAMS_DB, data);
    return data.exams[examIndex];
  }

  static async deleteExam(id: string) {
    const data = this.readFile(EXAMS_DB);
    data.exams = data.exams.filter((exam: any) => exam.id !== id);
    this.writeFile(EXAMS_DB, data);
    return true;
  }

  // Questions database operations
  static async getQuestions() {
    const data = this.readFile(QUESTIONS_DB);
    return data?.questions || [];
  }

  static async getQuestionById(id: string) {
    const questions = await this.getQuestions();
    return questions.find((question: any) => question.id === id);
  }

  static async getQuestionsByExam(examId: string) {
    const questions = await this.getQuestions();
    return questions.filter((question: any) => question.examId === examId);
  }

  static async createQuestion(questionData: any) {
    const data = this.readFile(QUESTIONS_DB);
    const newQuestion = {
      id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...questionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.questions.push(newQuestion);
    this.writeFile(QUESTIONS_DB, data);
    return newQuestion;
  }

  static async updateQuestion(id: string, updateData: any) {
    const data = this.readFile(QUESTIONS_DB);
    const questionIndex = data.questions.findIndex((question: any) => question.id === id);
    
    if (questionIndex === -1) return null;
    
    data.questions[questionIndex] = {
      ...data.questions[questionIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    this.writeFile(QUESTIONS_DB, data);
    return data.questions[questionIndex];
  }

  static async deleteQuestion(id: string) {
    const data = this.readFile(QUESTIONS_DB);
    data.questions = data.questions.filter((question: any) => question.id !== id);
    this.writeFile(QUESTIONS_DB, data);
    return true;
  }

  // Student responses database operations
  static async getStudentResponses() {
    const data = this.readFile(STUDENT_RESPONSES_DB);
    return data?.responses || [];
  }

  static async getStudentResponseById(id: string) {
    const responses = await this.getStudentResponses();
    return responses.find((response: any) => response.id === id);
  }

  static async getResponsesByExam(examId: string) {
    const responses = await this.getStudentResponses();
    return responses.filter((response: any) => response.examId === examId);
  }

  static async getResponsesByStudent(studentId: string) {
    const responses = await this.getStudentResponses();
    return responses.filter((response: any) => response.studentId === studentId);
  }

  static async createStudentResponse(responseData: any) {
    const data = this.readFile(STUDENT_RESPONSES_DB);
    const newResponse = {
      id: `response_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...responseData,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    data.responses.push(newResponse);
    this.writeFile(STUDENT_RESPONSES_DB, data);
    return newResponse;
  }

  static async updateStudentResponse(id: string, updateData: any) {
    const data = this.readFile(STUDENT_RESPONSES_DB);
    const responseIndex = data.responses.findIndex((response: any) => response.id === id);
    
    if (responseIndex === -1) return null;
    
    data.responses[responseIndex] = {
      ...data.responses[responseIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    this.writeFile(STUDENT_RESPONSES_DB, data);
    return data.responses[responseIndex];
  }

  static async deleteStudentResponse(id: string) {
    const data = this.readFile(STUDENT_RESPONSES_DB);
    data.responses = data.responses.filter((response: any) => response.id !== id);
    this.writeFile(STUDENT_RESPONSES_DB, data);
    return true;
  }
}
