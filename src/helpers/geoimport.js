import { featurecollection } from "./featurecollection.js";
import { figuration } from "./figuration.js";
import { rewind } from "./rewind.js";

export function geoimport(x, options = { rewind: true }) {
  // featurecollection
  let geojson = featurecollection(x);

  // rewind
  let type = figuration(geojson);

  if (type == "z" && options.rewind === true) {
    rewind(geojson, { mutate: true });
  }

  // Disolve if multipoints ?

  // Import csv directly if dots ?

  return geojson;
}
