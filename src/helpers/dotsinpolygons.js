import bbox from "@turf/bbox";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { randomPosition } from "@turf/random";

export function dotsinpolygons(geojson, values, dotvalue) {
  let result = [];
  geojson.features.forEach((d) => {
    result.push(dotsinpolygon(d, values, dotvalue));
  });

  const keys = Object.keys(geojson).filter((e) => e != "features");
  const obj = {};
  keys.forEach((d) => {
    obj[d] = geojson[d];
  });
  obj.features = result.flat();

  return obj;
}

function dotsinpolygon(feature, values, dotvalue) {
  let points = [];
  let hits = 0;
  let count = 0;

  const nbdots = Math.round(+feature.properties[values] / dotvalue);
  const bounds = bbox(feature);

  while (hits < nbdots && count < nbdots * 10) {
    const coords = randomPosition(bounds);
    const randomPoint = {
      type: "Feature",
      properties: feature.properties,
      geometry: { type: "Point", coordinates: coords },
    };

    if (booleanPointInPolygon(randomPoint, feature)) {
      points.push(randomPoint);
      hits++;
    }
    count++;
  }

  return JSON.parse(JSON.stringify(points));
}
