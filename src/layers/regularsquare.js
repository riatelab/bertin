import { square } from "./square.js";
import { regulardots } from "../helpers/regulardots.js";
import { geoIdentity } from "d3-geo";

export function regularsquare(
  selection,
  projection,
  options = {},
  clipid,
  width,
  height
) {
  options.geojson = regulardots(
    options.geojson,
    projection,
    width,
    height,
    options.step != undefined ? options.step : 20,
    options.values
  );
  options.values = "___value";

  square(selection, geoIdentity(), true, options, clipid, width, height);
}
