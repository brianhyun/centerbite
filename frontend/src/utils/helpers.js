export const milesToDegrees = (miles) => {
  const earthRadius = 3963; // Earth's radius in miles
  const radians = miles / earthRadius;
  const degrees = (radians * 180) / Math.PI;
  return degrees;
};
