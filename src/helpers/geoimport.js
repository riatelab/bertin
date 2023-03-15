import { featurecollection } from "./featurecollection.js";
import { figuration } from "./figuration.js";
import { table2geo } from "../table2geo.js";
import { rewind } from "./rewind.js";
import { dissolve } from "./dissolve.js";

export function geoimport(x, options = { rewind: false }) {
  // Import csv directly if lat & long or coordinates
  if (
    Array.isArray(x) &&
    typeof x[0].geometry !== "object" &&
    typeof x[0].coordinates !== "object"
  ) {
    return table2geo(x);
  }

  // features or geometries to featureCollection
  let geojson = featurecollection(x);

  // rewind
  let type = figuration(geojson);

  if (type == "z" && options.rewind === true) {
    rewind(geojson, { mutate: true });
  }

  // Disolve if multipoints

  if (type == "p") {
    geojson = dissolve(geojson);
  }

  return geojson;
}
