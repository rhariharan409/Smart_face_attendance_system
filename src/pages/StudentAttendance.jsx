import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import {loadModels, getFaceDescriptor, findBestMatch } from "../utils/faceEngine";
import CameraCapture from "../components/CameraCapture";

export default function StudentAttendance() {
  const [started, setStarted] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        console.log("Loading face models...");
        await loadModels();
        console.log("Face models loaded!");
        setModelsLoaded(true);
      } catch (err) {
        console.error("Model loading failed:", err);
        setStatus("Failed to load face recognition models.");
      }
    }

    init();
  }, []);

  async function handleCapture(videoElement) {
    if (!modelsLoaded) {
      setStatus("Face models are still loading...");
      return;
    }
    setVerifying(true);
    setStatus("Checking face...");

    const descriptor = await getFaceDescriptor(videoElement);
    if (!descriptor) {
      setStatus("No face detected. Please try again.");
      setVerifying(false);
      return;
    }

    const snap = await getDocs(collection(db, "students"));
    const students = snap.docs.map((d) => d.data());

    const { match, distance } = findBestMatch(descriptor, students);

    if (match) {
      setStatus(`✅ Identity verified: ${match.name} (distance: ${distance.toFixed(3)})`);
    } else {
      setStatus(`❌ Face not recognized (closest distance: ${distance.toFixed(3)})`);
    }
    setVerifying(false);
  }

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl mb-4">Mark My Attendance</h1>
      {!started ? (
            <button
              onClick={() => setStarted(true)}
              disabled={!modelsLoaded}
              className="bg-blue-600 text-white px-6 py-3 rounded w-full disabled:bg-gray-400"
            >
              {modelsLoaded ? "Mark My Attendance" : "Loading Face Models..."}
            </button>
      ) : (
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="College email"
            className="border p-2 mb-4 w-full rounded"
          />
          {verifying ? <p>Checking...</p> : <CameraCapture onCapture={handleCapture} />}
          {status && <p className="mt-4 font-medium">{status}</p>}
        </div>
      )}
    </div>
  );
}