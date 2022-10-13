import { geoCircle } from "d3-geo";

export function tissot(step) {
  const circle = geoCircle()
    .center((d) => d)
    .radius(step / 4)
    .precision(10);
  const features = [];
  for (let y = -80; y <= 80; y += step) {
    for (let x = -180; x < 180; x += step) {
      features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "MultiPolygon",
          coordinates: [circle([x, y]).coordinates],
        },
      });
    }
  }

  return { type: "FeatureCollection", features: features };
}
