import { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { loadModels } from "../utils/faceEngine";
import { getAverageEAR, EAR_BLINK_THRESHOLD } from "../utils/liveness";
import { markAttendance } from "../utils/sheets";

export default function LivenessTest() {
  const videoRef = useRef(null);
  const wasBelowRef = useRef(false);
  const [ear, setEar] = useState(null);
  const [blinkCount, setBlinkCount] = useState(0);

  useEffect(() => {
    loadModels().then(() => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
      });
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!videoRef.current) return;
      const result = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (result) {
        const currentEAR = getAverageEAR(result.landmarks);
        setEar(currentEAR.toFixed(3));

        if (currentEAR < EAR_BLINK_THRESHOLD) {
          wasBelowRef.current = true;
        } else if (wasBelowRef.current && currentEAR >= EAR_BLINK_THRESHOLD) {
          setBlinkCount((c) => c + 1);
          wasBelowRef.current = false;
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl mb-4">Liveness Test (Blink Detection)</h1>
      <video ref={videoRef} autoPlay muted width="320" height="240" className="mx-auto mb-4" />
      <p>Current EAR: {ear ?? "..."}</p>
      <p className="text-2xl font-bold mt-2">Blinks detected: {blinkCount}</p>
      <p className="text-sm text-gray-500 mt-2">Blink naturally and watch the counter.</p>
    </div>
  );
}