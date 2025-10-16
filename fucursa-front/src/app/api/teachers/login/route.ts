import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { LoginRequest, ApiResponse, Teacher } from '@/types/database';

// POST /api/teachers/login - Teacher login
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Email and password are required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Find teacher by email
    const teacher = await Database.getTeacherByEmail(email);
    if (!teacher) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid email or password'
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Check password (in a real app, you'd hash passwords)
    if (teacher.password !== password) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid email or password'
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Remove password from response
    const { password: _, ...teacherWithoutPassword } = teacher;

    const response: ApiResponse<Omit<Teacher, 'password'>> = {
      success: true,
      data: teacherWithoutPassword,
      message: 'Login successful'
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Login failed'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
