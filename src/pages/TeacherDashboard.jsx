import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import CameraCapture from "../components/CameraCapture";
import { loadModels, getFaceDescriptor } from "../utils/faceEngine";
import { regenerateDailyPIN, getTodayPIN } from "../utils/pin";


export default function TeacherDashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [pin, setPin] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        console.log("Loading face models...");
        await loadModels();
        console.log("Face models loaded!");
        setModelsLoaded(true);

        await loadStudents();
        const data = await getTodayPIN();
        setPin(data?.pin || null);

      } catch (err) {
        console.error("Model loading error:", err);
      }
    }

    init();
  }, []);

  async function handleRegeneratePIN() {
    const newPin = await regenerateDailyPIN();
    setPin(newPin);
  }

  async function loadStudents() {
    const snap = await getDocs(collection(db, "students"));
    setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  async function handleSave(videoElement) {
    setSaving(true);
    const descriptor = await getFaceDescriptor(videoElement);
    if (!descriptor) {
      alert("No face detected. Make sure your face is clearly visible and try again.");
      setSaving(false);
      return;
    }
    await addDoc(collection(db, "students"), {
      name,
      email,
      faceDescriptor: Array.from(descriptor),
      classId: "CSE-A",
    });
    await loadStudents();
    setName("");
    setEmail("");
    setCapturing(false);
    setSaving(false);
  }

  async function handleRemove(id) {
    await deleteDoc(doc(db, "students", id));
    await loadStudents();
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Teacher Dashboard</h1>
      <div className="mb-6 border p-4 rounded bg-yellow-50 text-center">
        <h2 className="text-lg mb-2">Today's PIN</h2>

        <p className="text-3xl font-bold tracking-widest">
          {pin ?? "—"}
        </p>

        <button
          onClick={handleRegeneratePIN}
          className="bg-yellow-600 text-white px-4 py-2 rounded mt-2"
        >
          Regenerate PIN
        </button>
      </div>
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
        ) : saving ? (
          <p className="text-center py-2">Saving...</p>
        ) : (
          <CameraCapture onCapture={handleSave} />
        )}
      </div>

      <h2 className="text-lg mb-2">Students ({students.length})</h2>
      <ul>
        {students.map((s) => (
          <li key={s.id} className="border-b py-1 flex justify-between items-center">
            <span>{s.name} — {s.email}</span>
            <button onClick={() => handleRemove(s.id)} className="text-red-600 text-sm">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}