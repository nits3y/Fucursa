import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { Teacher, ApiResponse } from '@/types/database';

// GET /api/teachers - Get all teachers
export async function GET() {
  try {
    const teachers = await Database.getTeachers();
    const response: ApiResponse<Teacher[]> = {
      success: true,
      data: teachers
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch teachers'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// POST /api/teachers - Create a new teacher
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, department } = body;

    // Validate required fields
    if (!name || !email || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Name, email, and password are required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Check if teacher already exists
    const existingTeacher = await Database.getTeacherByEmail(email);
    if (existingTeacher) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Teacher with this email already exists'
      };
      return NextResponse.json(response, { status: 409 });
    }

    // Create new teacher
    const newTeacher = await Database.createTeacher({
      name,
      email,
      password,
      department
    });

    const response: ApiResponse<Teacher> = {
      success: true,
      data: newTeacher,
      message: 'Teacher created successfully'
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create teacher'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
