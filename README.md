# Fucursa  
**An Online Exam Platform with Anti-Cheating Measures**  

Fucursa is an online exam platform designed for secure and fair assessments. It prevents students from switching tabs, using **Alt+Tab**, or exiting fullscreen during an exam session. Once the exam enters fullscreen mode, the test begins automatically with a **time limit** set by the teacher.  

---

## ✨ Features  

### 👨‍🎓 For Students  
- **Secure Exam Mode** – Prevents tab switching, Alt+Tab, and exiting fullscreen.  
- **Auto Start on Fullscreen** – The exam starts as soon as fullscreen mode is enabled.  
- **Join Exam Modal** – Students can join by entering:  
  - **Full Name** (Last Name, First Name)  
  - **Exam ID**  
- **Time-Limited Exams** – Countdown timer ensures fair exam duration.  

### 👩‍🏫 For Teachers  
- **Login Dashboard** – Access to all created exams.  
- **Exam Management** – Create new exams, view, and manage existing ones.  
- **Real-Time Control** – Assign time limits and monitor exam sessions.  

---

## 🖥️ App Flow  

1. **Startup Screen**  
   - Options: `Login` (for teachers) or `Join Exam` (for students).  

2. **Student Flow**  
   - Click `Join Exam` → Modal appears.  
   - Enter **Full Name** + **Exam ID**.  
   - Screen goes fullscreen → Exam begins with timer.  

3. **Teacher Flow**  
   - Click `Login` → Enter teacher credentials.  
   - Dashboard displays all created exams.  
   - Option to **add new exams** with title, description, and time limit.  

---

## 🚀 Tech Stack (Suggested)  
- **Frontend:** React / HTML / CSS / JavaScript  
- **Backend:** Node.js / Express (or your preferred backend)  
- **Database:** MongoDB / MySQL / PostgreSQL  
- **Authentication:** JWT-based login system  
- **Security:** Fullscreen lock + Tab-switch prevention  

---

## ⚙️ Installation & Setup  

```bash
# Clone the repository
git clone https://github.com/your-username/fucursa.git

# Navigate into the project
cd fucursa

# Install dependencies
npm install

# Run the development server
npm run dev
