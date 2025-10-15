import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { Exam, ApiResponse } from '@/types/database';

// GET /api/exams/[id] - Get exam by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exam = await Database.getExamById(params.id);
    
    if (!exam) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Exam not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Exam> = {
      success: true,
      data: exam
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch exam'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/exams/[id] - Update exam
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, timeLimit, timeLimitSeconds, timePerQuestion, timingMode, status, instructions, startDate, endDate, maxAttempts, requireEdpCode, edpCodes } = body;

    // Check if exam exists
    const existingExam = await Database.getExamById(params.id);
    if (!existingExam) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Exam not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Update exam
    const updatedExam = await Database.updateExam(params.id, {
      title,
      description,
      timeLimit,
      timeLimitSeconds,
      timePerQuestion,
      timingMode,
      status,
      instructions,
      startDate,
      endDate,
      maxAttempts,
      requireEdpCode,
      edpCodes
    });

    const response: ApiResponse<Exam> = {
      success: true,
      data: updatedExam,
      message: 'Exam updated successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update exam'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/exams/[id] - Delete exam
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if exam exists
    const existingExam = await Database.getExamById(params.id);
    if (!existingExam) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Exam not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Delete exam
    await Database.deleteExam(params.id);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Exam deleted successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete exam'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
