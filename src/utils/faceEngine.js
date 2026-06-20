import * as faceapi from "face-api.js";

export async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
  await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
}

export async function getFaceDescriptor(videoOrImageElement) {
  const result = await faceapi
    .detectSingleFace(videoOrImageElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  return result ? result.descriptor : null;
}

export function getDistance(descriptor1, descriptor2) {
  return faceapi.euclideanDistance(descriptor1, descriptor2);
}

export const MATCH_THRESHOLD = 0.5; // replace with YOUR Day 2 number if different

export function findBestMatch(capturedDescriptor, students) {
  let bestMatch = null;
  let bestDistance = Infinity;

  for (const student of students) {
    const storedDescriptor = new Float32Array(student.faceDescriptor);

    const distance = getDistance(
      capturedDescriptor,
      storedDescriptor
    );
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = student;
    }
  }

  if (bestDistance < MATCH_THRESHOLD) {
    return { match: bestMatch, distance: bestDistance };
  }
  return { match: null, distance: bestDistance };
}