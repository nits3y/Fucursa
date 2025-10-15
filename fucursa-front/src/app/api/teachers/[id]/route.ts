import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { Teacher, ApiResponse } from '@/types/database';

// GET /api/teachers/[id] - Get teacher by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teacher = await Database.getTeacherById(params.id);
    
    if (!teacher) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Teacher not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Teacher> = {
      success: true,
      data: teacher
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch teacher'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/teachers/[id] - Update teacher
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email, department } = body;

    // Check if teacher exists
    const existingTeacher = await Database.getTeacherById(params.id);
    if (!existingTeacher) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Teacher not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingTeacher.email) {
      const emailExists = await Database.getTeacherByEmail(email);
      if (emailExists) {
        const response: ApiResponse<null> = {
          success: false,
          error: 'Email already exists'
        };
        return NextResponse.json(response, { status: 409 });
      }
    }

    // Update teacher
    const updatedTeacher = await Database.updateTeacher(params.id, {
      name,
      email,
      department
    });

    const response: ApiResponse<Teacher> = {
      success: true,
      data: updatedTeacher,
      message: 'Teacher updated successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update teacher'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/teachers/[id] - Delete teacher
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if teacher exists
    const existingTeacher = await Database.getTeacherById(params.id);
    if (!existingTeacher) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Teacher not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Delete teacher
    await Database.deleteTeacher(params.id);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Teacher deleted successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete teacher'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
