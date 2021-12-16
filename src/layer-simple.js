// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);
import {figuration } from "./figuration.js";
import {addtooltip } from "./tooltip.js";
import {legbox } from "./leg-box.js";

export function layersimple(selection, projection, geojson, options = {}) {
  let cols = [
    "#66c2a5",
    "#fc8d62",
    "#8da0cb",
    "#e78ac3",
    "#a6d854",
    "#ffd92f",
    "#e5c494",
    "#b3b3b3"
  ];
  let fill = options.fill
    ? options.fill
    : cols[Math.floor(Math.random() * cols.length)];
  let stroke = options.stroke ? options.stroke : "white";
  let strokewidth = options.strokewidth ? options.strokewidth : 0.5;
  let fillopacity = options.fillopacity ? options.fillopacity : 1;
  let tooltip = options.tooltip ? options.tooltip : "";

  // If lines
  if (figuration(geojson) == "l") {
    stroke = options.stroke
      ? options.stroke
      : cols[Math.floor(Math.random() * cols.length)];
    fill = options.fill ? options.fill : "none";
    strokewidth = options.strokewidth ? options.strokewidth : 1;
  }

  selection
  .append("clipPath")
  .attr("id", "clip")
  .append("path")
  .datum({ type: "Sphere" })
  .attr("d", d3.geoPath(projection));


  selection
    .append("g")
    .attr(":inkscape:groupmode", "layer")
    .attr("id", "simple layer")
    .attr(":inkscape:label", "simple layer")
    .selectAll("path")
    .data(geojson.features)
    .join("path")
    .attr("d", d3.geoPath(projection))
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokewidth)
    .attr("fill-opacity", fillopacity)
    .attr("clip-path", "url(#clip)")
    .on("touchmove mousemove", function (event, d) {
      if (tooltip != "") {
        if (Array.isArray(tooltip)) {
          selection
            .select("#info")
            .call(
              addtooltip,
              `${d.properties[tooltip[0]]}\n${d.properties[tooltip[1]]}\n${
                tooltip[2]
              }`
            );
        } else {
          selection
            .select("#info")
            .call(addtooltip, `${d.properties[tooltip]}`);
        }
      }
      if (tooltip != "") {
        selection
          .select("#info")
          .attr("transform", `translate(${d3.pointer(event, this)})`);
        d3.select(this)
          .attr("stroke-width", strokewidth + 0.5)
          .attr("fill-opacity", fillopacity - 0.3)
          .raise();
      }
    })
    .on("touchend mouseleave", function () {
      selection.select("#info").call(addtooltip, null);
      d3.select(this)
        .attr("stroke-width", strokewidth)
        .attr("fill-opacity", fillopacity)
        .lower();
    });

    // Legend

     legbox(selection, {
       x: options.leg_x,
       y: options.leg_y,
       w: options.leg_w,
       h: options.leg_h,
       title: options.leg_title,
       text: options.leg_text,
       fontsize: options.leg_fontsize,
       fontsize2: options.leg_fontsize2,
       stroke: options.leg_stroke,
       fillopacity: options.leg_fillopacity
         ? options.leg_fillopacity
         : fillopacity,
       fill: options.leg_fill ? options.leg_fill : fill,
       strokewidth: options.leg_strokewidth,
       txtcol: options.leg_txtcol
     });
}
