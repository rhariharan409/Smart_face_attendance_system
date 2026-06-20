function testPermissions() {
  navigator.geolocation.getCurrentPosition(
    (pos) =>
      alert(
        `Location OK: ${pos.coords.latitude}, ${pos.coords.longitude}`
      ),
    (err) => alert(`Location Error: ${err.message}`)
  );

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(() => alert("Camera OK"))
    .catch((err) => alert(`Camera Error: ${err.message}`));
}

export default function Home() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl mb-4">
        Smart Attendance System
      </h1>

      <button
        onClick={testPermissions}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Test Camera & Location
      </button>
    </div>
  );
}