import { border as x } from "./helpers/border.js";

export function borders({ geojson, id, values, type = "rel", share = null }) {
  if (id == undefined || values == undefined) {
    return x(geojson);
  } else {
    return x(geojson, { id, values, type, share });
  }
}
