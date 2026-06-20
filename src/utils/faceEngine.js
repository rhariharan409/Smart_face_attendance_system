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