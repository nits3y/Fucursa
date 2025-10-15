import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { Question, ApiResponse, CreateQuestionRequest } from '@/types/database';

// GET /api/questions - Get questions by exam
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId');

    if (!examId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Exam ID is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    const questions = await Database.getQuestionsByExam(examId);
    const response: ApiResponse<Question[]> = {
      success: true,
      data: questions
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch questions'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/questions - Create a new question
export async function POST(request: NextRequest) {
  try {
    const body: CreateQuestionRequest = await request.json();
    const { examId, question, type, options, correctAnswer, points, order, explanation, isRequired } = body;

    // Validate required fields
    if (!examId || !question || !type || !points || order === undefined) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'ExamId, question, type, points, and order are required'
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

    // Validate correct answer for graded questions
    if (type !== 'essay' && !correctAnswer) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Correct answer is required for this question type'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Create new question
    const newQuestion = await Database.createQuestion({
      examId,
      question,
      type,
      options,
      correctAnswer,
      points,
      order,
      explanation,
      isRequired: isRequired ?? true
    });

    const response: ApiResponse<Question> = {
      success: true,
      data: newQuestion,
      message: 'Question created successfully'
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create question'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
