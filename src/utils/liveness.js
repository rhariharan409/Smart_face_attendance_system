function euclideanDist(p1, p2) {
  return Math.sqrt(
    (p1.x - p2.x) ** 2 +
    (p1.y - p2.y) ** 2
  );
}

function calculateEAR(eyePoints) {
  const vertical1 = euclideanDist(
    eyePoints[1],
    eyePoints[5]
  );

  const vertical2 = euclideanDist(
    eyePoints[2],
    eyePoints[4]
  );

  const horizontal = euclideanDist(
    eyePoints[0],
    eyePoints[3]
  );

  return (
    (vertical1 + vertical2) /
    (2 * horizontal)
  );
}

export function getAverageEAR(
  landmarks
) {
  const leftEAR =
    calculateEAR(
      landmarks.getLeftEye()
    );

  const rightEAR =
    calculateEAR(
      landmarks.getRightEye()
    );

  return (
    leftEAR + rightEAR
  ) / 2;
}

export const EAR_BLINK_THRESHOLD =
  0.29;
