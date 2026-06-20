import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentAttendance from "./pages/StudentAttendance";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentAttendance />} />
      </Routes>
    </BrowserRouter>
  );
}