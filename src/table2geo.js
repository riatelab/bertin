export function table2geo(data, lat, lon){
  return {
    type: "FeatureCollection",
    features: data.map((d) => ({
      type: "Feature",
      properties: d,
      geometry: {
        type: "Point",
        coordinates: [+d[lon], +d[lat]]
      }
    }))
  };
}
