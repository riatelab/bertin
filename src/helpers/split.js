import * as d3 from "d3-geo";

// Multi part to single part geometries

export function split(geojson) {
  let result = [];
  geojson.features.forEach((d) => {
    result.push(sp(d));
  });

  const keys = Object.keys(geojson).filter((e) => e != "features");
  const obj = {};
  keys.forEach((d) => {
    obj[d] = geojson[d];
  });
  obj.features = result.flat();

  return obj;
}

function sp(feature) {
  let result = [];
  //const area = d3.geoArea(feature);
  feature.geometry.coordinates.forEach((d) => {
    result.push({
      type: "Feature",
      //   __total: area,
      //   __part: d3.geoArea(d),
      //   __share: d3.geoArea(d) / area,
      properties: feature.properties,
      geometry: {
        type: feature.geometry.type.replace("Multi", ""),
        coordinates: d,
      },
    });
  });

  return result;
}
