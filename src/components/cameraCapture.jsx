import { useRef, useEffect } from "react";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    if (onCapture) onCapture(video); // pass the live video element up
  }

  return (
    <div>
      <video ref={videoRef} autoPlay muted width="320" height="240" className="rounded mx-auto" />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <button
        onClick={handleCapture}
        className="bg-green-600 text-white px-4 py-2 rounded mt-2 w-full"
      >
        Capture
      </button>
    </div>
  );
}