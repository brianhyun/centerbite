export const calculateArithmeticCenter = (coordinates) => {
  const center = { latitude: 0, longitude: 0 };
  const numPoints = coordinates.length;

  for (const coordinate of coordinates) {
    center.latitude += coordinate.latitude;
    center.longitude += coordinate.longitude;
  }

  center.latitude /= numPoints;
  center.longitude /= numPoints;

  return center;
};

export const calculateGeometricMedian = (points) => {
  // Initial guess for the geometric median
  let median = { latitude: 0, longitude: 0 };
  let prevMedian = { latitude: Infinity, longitude: Infinity }; // Previous estimate for comparison

  // Weiszfeld's algorithm
  const epsilon = 1e-6; // Convergence criterion
  while (
    Math.abs(median.latitude - prevMedian.latitude) > epsilon ||
    Math.abs(median.longitude - prevMedian.longitude) > epsilon
  ) {
    let sumWeights = 0;
    let weightedSumLat = 0;
    let weightedSumLng = 0;

    for (const point of points) {
      const distance = Math.sqrt(
        Math.pow(point.latitude - median.latitude, 2) +
          Math.pow(point.longitude - median.longitude, 2)
      );

      const weight = 1 / distance;
      sumWeights += weight;
      weightedSumLat += point.latitude * weight;
      weightedSumLng += point.longitude * weight;
    }

    prevMedian = { ...median }; // Save previous estimate
    median.latitude = weightedSumLat / sumWeights;
    median.longitude = weightedSumLng / sumWeights;
  }

  return median;
};
