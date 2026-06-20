const SHEETS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyulku8Itmqs7qWbdKm8TFdcPgUJzGvnALEXitZrjRnDKAKYi27gJFczlJj2ZtioXw/exec";

export async function markAttendance(
  name,
  email
) {
  const response =
    await fetch(
      SHEETS_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "text/plain;charset=utf-8",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      }
    );

  return response.text();
}