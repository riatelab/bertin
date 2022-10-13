export function km2deg(distance) {
  const earthRadius = 6371.0088;
  const radians = distance / earthRadius;
  const degrees = radians % (2 * Math.PI);
  return (degrees * 180) / Math.PI;
}
