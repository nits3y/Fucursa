import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { StudentResponse, ApiResponse, SubmitExamRequest, Question } from '@/types/database';

// GET /api/student-responses - Get student responses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId');
    const studentId = searchParams.get('studentId');

    let responses;
    if (examId) {
      responses = await Database.getResponsesByExam(examId);
    } else if (studentId) {
      responses = await Database.getResponsesByStudent(studentId);
    } else {
      responses = await Database.getStudentResponses();
    }

    const response: ApiResponse<StudentResponse[]> = {
      success: true,
      data: responses
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch student responses'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/student-responses - Submit exam response
export async function POST(request: NextRequest) {
  try {
    const body: SubmitExamRequest = await request.json();
    const { examId, studentInfo, answers, timeSpent, isAutoSubmitted, securityWarnings } = body;

    // Validate required fields
    if (!examId || !studentInfo || !answers) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ExamId, studentInfo, and answers are required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Check if exam exists
    const exam = await Database.getExamById(examId);
    if (!exam) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Exam not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Check if student has already submitted a response for this exam
    const existingResponses = await Database.getResponsesByExam(examId);
    const studentIdentifier = studentInfo.email?.toLowerCase() || studentInfo.fullName?.toLowerCase();
    
    const alreadySubmitted = existingResponses.some((resp: StudentResponse) => {
      const existingIdentifier = resp.studentEmail?.toLowerCase() || resp.studentName?.toLowerCase();
      // Check by email (primary) or by full name (fallback)
      return (
        (studentInfo.email && resp.studentEmail && 
         studentInfo.email.toLowerCase() === resp.studentEmail.toLowerCase()) ||
        (studentInfo.fullName && resp.studentName && 
         studentInfo.fullName.toLowerCase() === resp.studentName.toLowerCase())
      );
    });

    if (alreadySubmitted) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'You have already submitted a response for this exam. Each student can only submit once.'
      };
      return NextResponse.json(response, { status: 409 }); // 409 Conflict
    }

    // Get exam questions to calculate score
    const questions = await Database.getQuestionsByExam(examId);
    let score = 0;
    let totalPoints = 0;

    // Calculate score for auto-gradable questions
    questions.forEach((question: Question) => {
      totalPoints += question.points;
      const studentAnswer = answers[question.id];
      
      if (studentAnswer && question.correctAnswer) {
        // Auto-grade multiple choice, true-false, identification, short-answer, and fill-in-blank
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
          // Exact match for multiple choice and true-false
          if (studentAnswer === question.correctAnswer) {
            score += question.points;
          }
        } else if (question.type === 'identification' || question.type === 'short-answer' || question.type === 'fill-in-blank') {
          // Case-insensitive match for text-based questions
          if (studentAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
            score += question.points;
          }
        }
        // Essay questions need manual grading
      }
    });

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    // Create student response
    const newResponse = await Database.createStudentResponse({
      examId,
      studentId: studentInfo.studentId || `student_${Date.now()}`,
      studentName: studentInfo.fullName,
      studentEmail: studentInfo.email,
      answers,
      score,
      totalPoints,
      percentage,
      timeSpent: timeSpent || 0,
      isAutoSubmitted: isAutoSubmitted || false,
      securityWarnings: securityWarnings || 0,
      status: 'submitted'
    });

    const response: ApiResponse<StudentResponse> = {
      success: true,
      data: newResponse,
      message: 'Exam submitted successfully'
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to submit exam response'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
