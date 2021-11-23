export function diagnostic(geojson, id_geojson, data, id_data) {
  let ids_geojson = geojson.features.map((d) => d.properties[id_geojson]);
  let ids_data = data.map((d) => d[id_data]);
  // Unmatched elements
  let intersection = ids_geojson.filter((x) => ids_data.includes(x));
  // Elements existing in the basemap but not in the data
  let difference1 = ids_geojson.filter((x) => !ids_data.includes(x));
  // Elements existing in the data but not in the basemap
  let difference2 = ids_data.filter((x) => !ids_geojson.includes(x));
  return [ids_geojson, ids_data, intersection, difference1, difference2];
}
