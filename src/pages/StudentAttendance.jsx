import { useState } from "react";
import CameraCapture from "../components/CameraCapture";

export default function StudentAttendance() {
  const [started, setStarted] = useState(false);
  const [email, setEmail] = useState("");

  function handleCapture(videoElement) {
    console.log("Captured face for verification, email:", email, videoElement);
    alert("Captured! Verification logic gets wired in on Day 3.");
  }

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl mb-4">Mark My Attendance</h1>
      {!started ? (
        <button
          onClick={() => setStarted(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded w-full"
        >
          Mark My Attendance
        </button>
      ) : (
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="College email"
            className="border p-2 mb-4 w-full rounded"
          />
          <CameraCapture onCapture={handleCapture} />
        </div>
      )}
    </div>
  );
}