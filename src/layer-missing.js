// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);
import {figuration } from "./figuration.js";
import {addtooltip } from "./tooltip.js";
import {legbox } from "./leg-box.js";

export function layermissing(selection, projection, clipid, options = {}){
  //layermissing = (options = {}) => {
  let geojson = options.geojson;
  let data = options.data;
  let id_geojson = options.id_geojson;
  let id_data = options.id_data;
  let var_data = options.var_data;
  let fill = options.fill ? options.fill : "white";
  let stroke = options.stroke ? options.stroke : "white";
  let strokewidth = options.strokewidth ? options.strokewidth : 0.5;
  let fillopacity = options.fillopacity ? options.fillopacity : 1;

  let ids_geojson = geojson.features.map((d) => d.properties[id_geojson]);
  let ids_data = data.filter((d) => d[var_data] != null).map((d) => d[id_data]);
  let unmatch = ids_geojson.filter((x) => !ids_data.includes(x));
  let missing = geojson.features.filter((d) =>
    unmatch.includes(d.properties[id_geojson])
  );

  // return missing;

  // If lines
  if (figuration(geojson) == "l") {
    stroke = options.stroke ? options.stroke : "white";
    fill = options.fill ? options.fill : "none";
    strokewidth = options.strokewidth ? options.strokewidth : 1;
  }


selection
    .append("g")
    .attr(":inkscape:groupmode", "layer")
    .attr("id", "missing")
    .attr(":inkscape:label", "missing")
    .selectAll("path")
    .data(missing)
    .join("path")
    .attr("d", d3.geoPath(projection))
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokewidth)
    .attr("fill-opacity", fillopacity)
    .attr("clip-path", `url(#clip_${clipid}_rectangle)`)
    .attr("clip-path", `url(#clip_${clipid}_outline)`);

  legbox(selection, {
   x: options.leg_x,
   y: options.leg_y,
   w: options.leg_w,
   h: options.leg_h,
   text: options.leg_text ?  options.leg_text : "Missing data",
   fontsize: options.leg_fontsize2,
   stroke: options.leg_stroke,
   fillopacity: options.leg_fillopacity
     ? options.leg_fillopacity
     : fillopacity,
   fill: fill,
   strokewidth: options.leg_strokewidth,
   txtcol: options.leg_txtcol
 });
}
