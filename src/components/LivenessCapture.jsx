import { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { loadModels } from "../utils/faceEngine";
import { getAverageEAR, EAR_BLINK_THRESHOLD } from "../utils/liveness";

export default function LivenessCapture({ onVerified, onTimeout }) {
  const videoRef = useRef(null);
  const wasBelowRef = useRef(false);
  const doneRef = useRef(false);
  const [status, setStatus] = useState("Starting camera...");

  useEffect(() => {
    let stream;
    let interval;
    let timeout;

    function cleanup() {
      clearInterval(interval);
      clearTimeout(timeout);
      if (stream) stream.getTracks().forEach((t) => t.stop());
    }

    loadModels()
      .then(() => navigator.mediaDevices.getUserMedia({ video: true }))
      .then((s) => {
        stream = s;
        videoRef.current.srcObject = s;
        setStatus("Look at the camera and blink naturally...");

        interval = setInterval(async () => {
          if (doneRef.current || !videoRef.current) return;

          const result = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (!result) return;

          const ear = getAverageEAR(result.landmarks);
          if (ear < EAR_BLINK_THRESHOLD) {
            wasBelowRef.current = true;
          } else if (wasBelowRef.current && ear >= EAR_BLINK_THRESHOLD) {
            doneRef.current = true;
            setStatus("Blink detected — verifying...");
            cleanup();
            console.log("Blink detected!");
            onVerified(result.descriptor);
          }
        }, 150);

        timeout = setTimeout(() => {
          if (!doneRef.current) {
            doneRef.current = true;
            cleanup();
            console.log("Timeout reached");
            onTimeout && onTimeout();
          }
        }, 10000);
      })
      .catch((err) => {
        setStatus(`Camera error: ${err.message}`);
      });

    return cleanup;
  }, []);

  return (
    <div className="text-center">
      <video ref={videoRef} autoPlay muted width="320" height="240" className="rounded mx-auto" />
      <p className="mt-2">{status}</p>
    </div>
  );
}