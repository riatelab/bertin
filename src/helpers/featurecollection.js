import { feature } from "topojson-client";
const topojson = Object.assign({}, { feature });

export function featurecollection(x) {
  x = JSON.parse(JSON.stringify(x));

  if (x.type == "Topology" && !Array.isArray(x)) {
    return topojson.feature(x, Object.keys(x.objects)[0]);
  }

  if (x.type == "FeatureCollection" && !Array.isArray(x)) {
    return x;
  } else if (
    Array.isArray(x) &&
    x[0]["type"] != undefined &&
    x[0]["properties"] != undefined &&
    x[0]["geometry"] != undefined
  ) {
    return { type: "FeatureCollection", features: x };
  } else if (
    Array.isArray(x) &&
    x[0]["type"] != undefined &&
    x[0]["coordinates"] != undefined
  ) {
    return {
      type: "FeatureCollection",
      features: x.map((d) => ({
        type: "Feature",
        properties: {},
        geometry: d,
      })),
    };
  } else if (
    typeof x == "object" &&
    [
      "Point",
      "LineString",
      "Polygon",
      "MultiPoint",
      "MultiLineString",
      "MultiPolygon",
    ].includes(x.type)
  ) {
    return {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: {}, geometry: x }],
    };
  } else if (typeof x == "object" && x.type == "Feature") {
    return {
      type: "FeatureCollection",
      features: [x],
    };
  } else {
    return x;
  }
}
