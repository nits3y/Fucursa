import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { ApiResponse, ExamStats } from '@/types/database';

// GET /api/stats - Get overall statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');

    // Get all data
    const exams = teacherId ? await Database.getExamsByTeacher(teacherId) : await Database.getExams();
    const responses = await Database.getStudentResponses();
    
    // Filter responses by teacher's exams if teacherId is provided
    const teacherExamIds = teacherId ? exams.map(exam => exam.id) : [];
    const filteredResponses = teacherId 
      ? responses.filter(response => teacherExamIds.includes(response.examId))
      : responses;

    // Calculate statistics
    const totalExams = exams.length;
    const activeExams = exams.filter(exam => exam.status === 'active').length;
    const completedExams = exams.filter(exam => exam.status === 'completed').length;
    const totalStudents = new Set(filteredResponses.map(response => response.studentId)).size;
    const totalResponses = filteredResponses.length;
    
    // Calculate average score
    const gradedResponses = filteredResponses.filter(response => response.status === 'graded' && response.percentage !== undefined);
    const averageScore = gradedResponses.length > 0 
      ? Math.round(gradedResponses.reduce((sum, response) => sum + (response.percentage || 0), 0) / gradedResponses.length)
      : 0;

    const stats: ExamStats = {
      totalExams,
      activeExams,
      completedExams,
      totalStudents,
      totalResponses,
      averageScore
    };

    const response: ApiResponse<ExamStats> = {
      success: true,
      data: stats
    };
    return NextResponse.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch statistics'
    };
    return NextResponse.json(response, { status: 500 });
  }
}
