import { simple } from "./simple.js";
import { grid } from "../helpers/grid.js";
import { geoIdentity } from "d3-geo";

// TODO
// values : Possibiliter de rentrer un array de 2 stocks

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
  });

  simple(selection, geoIdentity(), options, clipid, width, height);
}
