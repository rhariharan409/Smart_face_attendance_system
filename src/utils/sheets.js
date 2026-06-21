const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbyulku8Itmqs7qWbdKm8TFdcPgUJzGvnALEXitZrjRnDKAKYi27gJFczlJj2ZtioXw/exec";

export async function markAttendance(name, email) {
  try {
    const response = await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      throw new Error(`Sheets responded with status ${response.status}`);
    }

    return await response.text();
  } catch (err) {
    console.error("Failed to write attendance:", err);

    throw new Error(
      "Could not save attendance. Check your internet connection and try again."
    );
  }
}



