import { BrowserRouter, Routes, Route } from "react-router-dom";
import LivenessTest from "./pages/LivenessTest";

import Home from "./pages/Home";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentAttendance from "./pages/StudentAttendance";
import FaceTest from "./pages/FaceTest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentAttendance />} />
        <Route path="/facetest" element={<FaceTest />} />
        <Route path="/livenesstest"element={<LivenessTest />} />
      </Routes>
    </BrowserRouter>
  );
}