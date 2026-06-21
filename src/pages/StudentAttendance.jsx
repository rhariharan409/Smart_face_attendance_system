import { useState } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { isWithinRadius } from "../utils/geo";
import { getTodayPIN } from "../utils/pin";
import { getDistance, MATCH_THRESHOLD } from "../utils/faceEngine";
import { markAttendance } from "../utils/sheets";
import LivenessCapture from "../components/LivenessCapture";

const RADIUS_METERS = 50;

export default function StudentAttendance() {
  const [stage, setStage] = useState("idle");
  const [email, setEmail] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [claimedStudent, setClaimedStudent] = useState(null);
  const [message, setMessage] = useState("");

  async function handleStart() {
    setStage("checking-location");
    setMessage("Checking your location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const configSnap = await getDoc(
          doc(db, "classConfig", "main")
        );

        if (!configSnap.exists()) {
          setMessage(
            "Classroom location not configured. Contact your teacher."
          );
          setStage("error");
          return;
        }

        const { lat, lng } = configSnap.data();

        const within = isWithinRadius(
          pos.coords.latitude,
          pos.coords.longitude,
          lat,
          lng,
          RADIUS_METERS
        );

        if (!within) {
          setMessage(
            "You're outside the classroom radius. Attendance can only be marked in class."
          );
          setStage("error");
          return;
        }

        setStage("enter-details");
      },
      (err) => {
        setMessage(
          `Location error: ${err.message}. Please enable location access.`
        );
        setStage("error");
      }
    );
  }

  async function handleDetailsSubmit() {
    setMessage("");

    const q = query(
      collection(db, "students"),
      where("email", "==", email.trim())
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      setMessage(
        "Email not found. Ask your teacher to enroll you first."
      );
      return;
    }

    const pinData = await getTodayPIN();

    if (!pinData || enteredPin !== pinData.pin) {
      setMessage(
        "Incorrect PIN. Ask your teacher for today's PIN."
      );
      return;
    }

    setClaimedStudent(snap.docs[0].data());

    setStage("verifying");
  }

  async function handleVerified(descriptor) {
    const storedDescriptor =
      new Float32Array(claimedStudent.faceDescriptor);

    const distance = getDistance(
      descriptor,
      storedDescriptor
    );

    if (distance >= MATCH_THRESHOLD) {
      setMessage(
        `Face doesn't match the enrolled photo for ${email}. Please try again.`
      );
      setStage("error");
      return;
    }

    await markAttendance(
      claimedStudent.name,
      claimedStudent.email
    );

    setMessage(
      `✅ Attendance marked for ${claimedStudent.name}!`
    );

    setStage("success");
  }

  function handleTimeout() {
    setMessage(
      "No blink detected in time. Please try again."
    );
    setStage("error");
  }

  function reset() {
    setStage("idle");
    setEmail("");
    setEnteredPin("");
    setClaimedStudent(null);
    setMessage("");
  }

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl mb-4">
        Mark My Attendance
      </h1>

      {stage === "idle" && (
        <button
          onClick={handleStart}
          className="bg-blue-600 text-white px-6 py-3 rounded w-full"
        >
          Mark My Attendance
        </button>
      )}

      {stage === "checking-location" && (
        <p>{message}</p>
      )}

      {stage === "enter-details" && (
        <div>
          <input
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="College email"
            className="border p-2 mb-2 w-full rounded"
          />

          <input
            value={enteredPin}
            onChange={(e) =>
              setEnteredPin(e.target.value)
            }
            maxLength={4}
            placeholder="Today's PIN"
            className="border p-2 mb-2 w-full rounded text-center text-xl tracking-widest"
          />

          <button
            onClick={handleDetailsSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Continue
          </button>

          {message && (
            <p className="text-red-600 mt-2">
              {message}
            </p>
          )}
        </div>
      )}

      {stage === "verifying" && (
        <LivenessCapture
          onVerified={handleVerified}
          onTimeout={handleTimeout}
        />
      )}

      {stage === "success" && (
        <p className="text-green-600 font-medium text-lg">
          {message}
        </p>
      )}

      {stage === "error" && (
        <div>
          <p className="text-red-600 mb-4">
            {message}
          </p>

          <button
            onClick={reset}
            className="bg-gray-600 text-white px-4 py-2 rounded w-full"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}