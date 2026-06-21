import { useNavigate } from "react-router-dom";

const TEACHER_USERNAME = "AI_COE";
const TEACHER_PASSWORD = "ML007";

export default function Home() {
  const navigate = useNavigate();

  const goStudent = () => {
    navigate("/student");
  };

  const goTeacher = () => {
    const username = prompt("Enter teacher username:");
    if (username === null) return;

    const password = prompt("Enter teacher password:");
    if (password === null) return;

    if (
      username.trim() === TEACHER_USERNAME &&
      password.trim() === TEACHER_PASSWORD
    ) {
      navigate("/teacher");
    } else {
      alert("Invalid teacher credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-2xl shadow-slate-900/40">
        <h1 className="text-3xl font-semibold text-center mb-6">
          Smart Attendance
        </h1>
        <p className="text-sm text-slate-400 text-center mb-8">
          Select your role to continue.
        </p>

        <div className="space-y-4">
          <button
            onClick={goStudent}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 px-5 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
          >
            Student
          </button>

          <button
            onClick={goTeacher}
            className="w-full rounded-2xl border border-slate-600 bg-slate-800 px-5 py-4 text-lg font-semibold text-slate-100 shadow-lg shadow-slate-900/30 transition hover:border-slate-400 hover:bg-slate-700"
          >
            Teacher
          </button>
        </div>
      </div>
    </div>
  );
}
