# Smart Attendance System Using Facial Recognition

## Problem Statement

Traditional attendance marking is time-consuming and prone to proxy attendance.
This project verifies student identity via facial recognition, blocks photo/video
spoofing through liveness detection, restricts marking to within 30 meters of the
classroom, and requires a daily-rotating PIN — before logging attendance automatically
to Google Sheets.

## Tech Stack

- Frontend: React + Vite (PWA)
- Face detection, landmarks, recognition: face-api.js (TensorFlow.js)
- Liveness detection: custom Eye Aspect Ratio (EAR) blink detection
- Database: Firebase Firestore
- Geofencing: Haversine formula via browser Geolocation API
- Attendance log: Google Sheets via Apps Script
- Hosting: Vercel

## How It Works

1. **Teacher Dashboard** — enroll students (name, email, live face capture),
   regenerate the daily PIN.
2. **Student Attendance** — checks location (within 30m), then email + PIN,
   then live face verification with blink-based liveness, then writes to
   Google Sheets only if every check passes.

## Setup

1. Clone the repo, run `npm install`
2. Add your Firebase config to `src/firebase/config.js`
3. Add your Apps Script deployment URL to `src/utils/sheets.js`
4. Place face-api.js model files in `public/models`
5. `npm run dev`

## Known Limitations

- No authentication distinguishing teacher vs. student access — anyone with
  the app URL can reach the teacher dashboard. Firestore rules validate data
  shape but not requester identity.
- Liveness detection (blink check) can be defeated by a video replay of a
  real blink, since it's a known limitation of single-camera RGB-only
  liveness systems without depth sensing or randomized challenges.
- Indoor GPS accuracy (commonly 10-50m) can occasionally cause false
  rejections near the radius boundary.

## Team

- [Suhail Akthar S M] — Computer vision engine (face detection, matching, liveness)
- [Hariharan R] — Frontend, camera UI, PWA
- [Devendiran K] — Backend, Firebase, geolocation, PIN system, Sheets integration
