import { db } from "../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";

export function generatePIN() {
  return Math.floor(
    1000 + Math.random() * 9000
  ).toString();
}

export async function regenerateDailyPIN() {
  const pin = generatePIN();

  const today =
    new Date().toLocaleDateString();

  await setDoc(
    doc(db, "dailyPIN", "current"),
    {
      pin,
      date: today
    }
  );

  return pin;
}

export async function getTodayPIN() {
  const snap = await getDoc(
    doc(db, "dailyPIN", "current")
  );

  return snap.exists()
    ? snap.data()
    : null;
}