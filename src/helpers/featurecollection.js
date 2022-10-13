export function featurecollection(x) {
  x = JSON.parse(JSON.stringify(x));
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
  } else {
    return x;
  }
}
