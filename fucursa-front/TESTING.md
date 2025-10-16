# Fucursa Testing Guide

## 🧪 How to Test the Application

### 1. **Teacher Login**
- **Email**: `yestinprado@gmail.com`
- **Password**: `print(pass)`
- Click "Teacher Login" on the homepage
- You'll be redirected to the dashboard

### 2. **Student Exam Access**
- Click "Join Exam" on the homepage
- **Full Name**: Enter in format "Last Name, First Name" (e.g., "Smith, John")
- **Exam ID**: Use `exam_1704067200000_xyz789abc`
- Click "Join Exam"

### 3. **Expected Behavior**

#### ✅ **Valid Exam ID**
- Should successfully load the exam
- Shows "Mathematics Final Exam" with 4 questions
- Timer starts counting down
- Fullscreen mode activates

#### ❌ **Invalid Exam ID**
- Shows error: "Exam not found. Please check the exam ID and try again."
- Modal stays open for retry
- No infinite loading

#### ❌ **Inactive Exam**
- Shows error: "This exam is not currently active. Please contact your teacher."
- Redirects back to homepage

### 4. **Test Cases**

| Test Case | Exam ID | Expected Result |
|-----------|---------|----------------|
| Valid Active Exam | `exam_1704067200000_xyz789abc` | ✅ Loads exam successfully |
| Invalid Exam ID | `INVALID123` | ❌ "Exam not found" error |
| Empty Exam ID | (empty) | ❌ "Please enter the exam ID" error |
| Wrong Name Format | "John Smith" | ❌ "Please enter your name in the format: Last Name, First Name" |

### 5. **Dashboard Functionality**

#### ✅ **Teacher Dashboard Features**
- **View Exam**: Click the eye icon → Opens exam details page
- **Edit Exam**: Click the pencil icon → Opens edit modal
- **Delete Exam**: Click the trash icon → Confirms deletion
- **Copy Link**: Click "Copy Link" → Copies exam URL to clipboard
- **Create Exam**: Click "Create New Exam" → Opens creation modal

#### ✅ **Exam Details Page**
- Shows exam information, questions, and student responses
- Displays statistics and submission data
- Only accessible by the exam owner

### 6. **Database Files**
The system uses JSON files for data storage:
- `src/database/teachers.json` - Teacher accounts
- `src/database/exams.json` - Exam metadata
- `src/database/questions.json` - Question bank
- `src/database/student_responses.json` - Student submissions

### 7. **API Endpoints**
- `GET /api/exams/[id]` - Get exam by ID
- `GET /api/exams/[id]/questions` - Get exam questions
- `POST /api/student-responses` - Submit exam response

### 8. **Error Handling**
- ✅ Exam not found → Clear error message
- ✅ Exam inactive → Status-specific error
- ✅ No questions → Helpful error message
- ✅ Network errors → Graceful fallback
- ✅ Invalid input → Validation errors

## 🚀 Quick Start
1. Run `npm run dev`
2. Open `http://localhost:3000`
3. Test teacher login or student exam access
4. Check console for any errors
