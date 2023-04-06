import { simple } from "./simple.js";
import { grid } from "../helpers/grid.js";
import { geoIdentity } from "d3-geo";

export function regulargrid(
  selection,
  projection,
  options = {},
  clipid,
  width,
  height
) {
  options.geojson = grid({
    geojson: options.geojson,
    output: "square",
    projection: projection,
    width: width,
    height: height,
    step: options.step,
    values: options.values,
    blur: options.blur,
    geoprocessing: options.geoprocessing,
    operator: options.operator,
  });

  if (options.fill == undefined) {
    options.fill = { nbreaks: 6, method: "quantile", colors: "Blues" };
  }

  if (typeof options.fill == "object" && options.fill.values == undefined) {
    options.fill.values = "value";
  }

  if (typeof options.fill == "object" && options.fill.type == undefined) {
    options.fill.type = "choro";
  }

  options._type = "regulargrid";

  simple(selection, geoIdentity(), options, clipid, width, height);
}
