import { bubble } from "./bubble.js";
import { grid } from "../helpers/grid.js";
import { geoIdentity } from "d3-geo";

export function regularbubble(
  selection,
  projection,
  options = {},
  clipid,
  width,
  height
) {
  options.geojson = grid({
    geojson: options.geojson,
    projection: projection,
    width: width,
    height: height,
    step: options.step,
    values: options.values,
    blur: options.blur,
  });

  options.values = "value";

  bubble(selection, geoIdentity(), true, options, clipid, width, height);
}
