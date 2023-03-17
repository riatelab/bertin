export function getangle(nb) {
  let angles = [];
  for (let i = 0; i < nb; i++) {
    angles[i] = (360 / nb) * i * (Math.PI / 180);
  }
  return angles;
}
