import { square } from "./square.js";
import { grid } from "../helpers/grid.js";
import { geoIdentity } from "d3-geo";

export function regularsquare(
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
    geoprocessing: options.geoprocessing,
    operator: options.operator,
  });

  options.values = "value";
  options._type = "regularsquare";
  square(selection, geoIdentity(), true, options, clipid, width, height);
}
