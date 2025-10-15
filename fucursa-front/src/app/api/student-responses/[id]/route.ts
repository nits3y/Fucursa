import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { StudentResponse, ApiResponse } from '@/types/database';

// GET /api/student-responses/[id] - Get student response by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studentResponse = await Database.getStudentResponseById(params.id);
    
    if (!studentResponse) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Student response not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<StudentResponse> = {
      success: true,
      data: studentResponse
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch student response'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// PUT /api/student-responses/[id] - Update student response (for grading)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { score, percentage, status } = body;

    // Check if student response exists
    const existingResponse = await Database.getStudentResponseById(params.id);
    if (!existingResponse) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Student response not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Update student response
    const updatedResponse = await Database.updateStudentResponse(params.id, {
      score,
      percentage,
      status: status || 'graded'
    });

    const response: ApiResponse<StudentResponse> = {
      success: true,
      data: updatedResponse,
      message: 'Student response updated successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update student response'
    };
    return NextResponse.json(response, { status: 500 });
  }
}

// DELETE /api/student-responses/[id] - Delete student response
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if student response exists
    const existingResponse = await Database.getStudentResponseById(params.id);
    if (!existingResponse) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Student response not found'
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Delete student response
    await Database.deleteStudentResponse(params.id);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Student response deleted successfully'
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete student response'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
