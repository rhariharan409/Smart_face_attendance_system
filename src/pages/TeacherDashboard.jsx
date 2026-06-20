import { useState } from "react";
import CameraCapture from "../components/CameraCapture";

export default function TeacherDashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState([
    { name: "Demo Student", email: "demo@college.edu" },
  ]);
  const [capturing, setCapturing] = useState(false);

  function handleSave(videoElement) {
    console.log("Captured face for:", name, email, videoElement);
    setStudents([...students, { name, email }]);
    setName("");
    setEmail("");
    setCapturing(false);
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Teacher Dashboard</h1>

      <div className="mb-6 border p-4 rounded">
        <h2 className="text-lg mb-2">Add Student</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Student name"
          className="border p-2 mb-2 w-full rounded"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Student email"
          className="border p-2 mb-2 w-full rounded"
        />
        {!capturing ? (
          <button
            onClick={() => setCapturing(true)}
            disabled={!name || !email}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:bg-gray-400"
          >
            Capture Face
          </button>
        ) : (
          <CameraCapture onCapture={handleSave} />
        )}
      </div>

      <h2 className="text-lg mb-2">Students ({students.length})</h2>
      <ul>
        {students.map((s, i) => (
          <li key={i} className="border-b py-1">{s.name} — {s.email}</li>
        ))}
      </ul>
    </div>
  );
}