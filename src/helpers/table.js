// Attribute table

export function table(geojson) {
  return JSON.parse(JSON.stringify(geojson.features.map((d) => d.properties)));
}
