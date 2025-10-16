import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { StudentResponse, ApiResponse } from '@/types/database';

// GET /api/exams/[id]/responses - Get all responses for an exam
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

    const responses = await Database.getResponsesByExam(params.id);
    
    // Sort responses by submission date (newest first)
    const sortedResponses = responses.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );

    const response: ApiResponse<StudentResponse[]> = {
      success: true,
      data: sortedResponses
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch exam responses'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
