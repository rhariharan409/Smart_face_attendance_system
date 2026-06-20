import { useRef, useEffect, useState } from "react";
import { loadModels, getFaceDescriptor, getDistance } from "../utils/faceEngine";

export default function FaceTest() {
  const videoRef = useRef(null);
  const [reference, setReference] = useState(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    loadModels().then(() => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
      });
    });
  }, []);

  async function captureReference() {
    const descriptor = await getFaceDescriptor(videoRef.current);
    setReference(descriptor);
    setResult("Reference captured. Now click 'Capture & Compare'.");
  }

  async function captureAndCompare() {
    if (!reference) return setResult("Capture a reference face first.");
    const descriptor = await getFaceDescriptor(videoRef.current);
    if (!descriptor) return setResult("No face detected.");
    const distance = getDistance(reference, descriptor);
    setResult(`Distance: ${distance.toFixed(3)}`);
  }

  return (
    <div className="p-6 text-center">
      <h1 className="text-xl mb-4">Face Matching Test</h1>
      <video ref={videoRef} autoPlay muted width="320" height="240" className="mx-auto mb-4" />
      <button onClick={captureReference} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">
        Capture Reference
      </button>
      <button onClick={captureAndCompare} className="bg-green-600 text-white px-4 py-2 rounded">
        Capture & Compare
      </button>
      <p className="mt-4 text-lg">{result}</p>
    </div>
  );
}