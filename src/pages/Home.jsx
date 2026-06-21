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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Smart Attendance
          </h1>
          <p className="text-gray-500">Choose your role</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={goStudent}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Student
          </button>

          <button
            onClick={goTeacher}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
          >
            Teacher
          </button>
        </div>
      </div>
    </div>
  );
}
