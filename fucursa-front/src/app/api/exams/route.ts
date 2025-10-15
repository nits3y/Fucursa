import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { Exam, ApiResponse, CreateExamRequest } from '@/types/database';

// GET /api/exams - Get all exams or exams by teacher
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    let exams;
    if (teacherId) {
      exams = await Database.getExamsByTeacher(teacherId);
    } else {
      exams = await Database.getExams();
    }

    const response: ApiResponse<Exam[]> = {
      success: true,
      data: exams
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch exams'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/exams - Create a new exam
export async function POST(request: NextRequest) {
  try {
    const body: CreateExamRequest & { teacherId: string } = await request.json();
    const { title, description, teacherId, timeLimit, timeLimitSeconds, timePerQuestion, timingMode, instructions, startDate, endDate, maxAttempts } = body;

    // Validate required fields
    if (!title || !description || !teacherId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Title, description, and teacherId are required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Check if teacher exists
    const teacher = await Database.getTeacherById(teacherId);
    if (!teacher) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Teacher not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Create new exam
    const newExam = await Database.createExam({
      title,
      description,
      teacherId,
      timeLimit: timeLimit || Math.ceil((timePerQuestion || 60) / 60),
      timeLimitSeconds,
      timePerQuestion,
      timingMode: timingMode || 'per-question',
      instructions,
      startDate,
      endDate,
      maxAttempts,
      status: 'draft'
    });

    const response: ApiResponse<Exam> = {
      success: true,
      data: newExam,
      message: 'Exam created successfully'
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create exam'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
