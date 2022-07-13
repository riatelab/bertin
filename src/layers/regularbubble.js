import { bubble } from "./bubble.js";
import { regulardots } from "../helpers/regulardots.js";

export function regularbubble(
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
  options.planar = true;

  bubble(selection, projection, options, clipid, width, height);
}
