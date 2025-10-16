import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { Question, ApiResponse } from '@/types/database';

// GET /api/exams/[id]/questions - Get all questions for an exam
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if exam exists
    const exam = await Database.getExamById(params.id);
    if (!exam) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Exam not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const questions = await Database.getQuestionsByExam(params.id);
    
    // Sort questions by order
    const sortedQuestions = questions.sort((a: Question, b: Question) => a.order - b.order);

    const response: ApiResponse<Question[]> = {
      success: true,
      data: sortedQuestions
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch exam questions'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
