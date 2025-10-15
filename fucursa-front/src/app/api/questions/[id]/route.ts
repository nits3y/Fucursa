import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { Question, ApiResponse } from '@/types/database';

// GET /api/questions/[id] - Get question by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const question = await Database.getQuestionById(params.id);
    
    if (!question) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Question not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Question> = {
      success: true,
      data: question
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch question'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/questions/[id] - Update question
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { question, type, options, correctAnswer, points, order, explanation, isRequired } = body;

    // Check if question exists
    const existingQuestion = await Database.getQuestionById(params.id);
    if (!existingQuestion) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Question not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Update question
    const updatedQuestion = await Database.updateQuestion(params.id, {
      question,
      type,
      options,
      correctAnswer,
      points,
      order,
      explanation,
      isRequired
    });

    const response: ApiResponse<Question> = {
      success: true,
      data: updatedQuestion,
      message: 'Question updated successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update question'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/questions/[id] - Delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if question exists
    const existingQuestion = await Database.getQuestionById(params.id);
    if (!existingQuestion) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Question not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Delete question
    await Database.deleteQuestion(params.id);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Question deleted successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete question'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
