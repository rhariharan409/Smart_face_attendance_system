import LivenessCapture from "../components/LivenessCapture";

export default function LivenessTest() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl mb-4">
        Combined Liveness Test
      </h1>

      <LivenessCapture
        onVerified={(descriptor) => {
          console.log(
            "Verified! Descriptor length:",
            descriptor.length
          );
        }}
        onTimeout={() => {
          console.log(
            "Timed out, no blink detected"
          );
        }}
      />
    </div>
  );
}