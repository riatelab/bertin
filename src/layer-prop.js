// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
import * as d3array from "d3-array";
import * as d3scale from "d3-scale";
import {addtooltip } from "./tooltip.js";
import {legcircles } from "./leg-circles.js";

const d3 = Object.assign({}, d3selection, d3array,d3scale, d3geo, d3geoprojection);
import {getcenters } from "./centroids.js";

export function layerprop(selection, projection, options = {}) {
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
  let geojson = options.geojson;
  let data = options.data;
  let id_geojson = options.id_geojson;
  let id_data = options.id_data;
  let var_data = options.var_data;
  let k = options.k ? options.k : 50;
  let fill = options.fill
    ? options.fill
    : cols[Math.floor(Math.random() * cols.length)];
  let stroke = options.stroke ? options.stroke : "white";
  let strokewidth = options.strokewidth ? options.strokewidth : 0.5;
  let fillopacity = options.fillopacity ? options.fillopacity : 1;
  let tooltip = options.tooltip ? options.tooltip : "";
  //let radius = options.radius ? options.radius : 40;

  let coords = getcenters(geojson, id_geojson, projection, true);
  //let stockbyid = new Map(data.map((d) => [d[id_data], +d[var_data]]));
  let radius = d3.scaleSqrt([0, d3.max(data, (d) => +d[var_data])], [0, k]);

  selection
    .append("g")
    .selectAll("circle")
    .data(
      data
        .sort((a, b) => d3.descending(+a[var_data], +b[var_data]))
        .filter((d) => coords.get(d[id_data]) != undefined)
    )
    .join("circle")
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokewidth)
    .attr("fill-opacity", fillopacity)
    //.attr("transform", (d) => `translate(${coords.get(d[id_data])})`)
    .attr("cx", (d) => coords.get(d[id_data])[0])
    .attr("cy", (d) => coords.get(d[id_data])[1])
    .attr("r", (d) => radius(d[var_data]))
    .on("touchmove mousemove", function (event, d) {
      if (tooltip != "") {
        if (Array.isArray(tooltip)) {
          selection
            .select("#info")
            .call(
              addtooltip,
              `${d[tooltip[0]]}\n${d[tooltip[1]]}\n${tooltip[2]}`
            );
        } else {
          selection.select("#info").call(addtooltip, `${d[tooltip]}`);
        }
      }
      if (tooltip != "") {
        selection
          .select("#info")
          .attr("transform", `translate(${d3.pointer(event, this)})`);
        d3.select(this)
          .attr("stroke-width", strokewidth + 0.5)
          .attr("fill-opacity", fillopacity - 0.3);
      }
    })
    .on("touchend mouseleave", function () {
      selection.select("#info").call(addtooltip, null);
      d3.select(this)
        .attr("stroke-width", strokewidth)
        .attr("fill-opacity", fillopacity);
    });

    // Legend
  let array = data.map((d) => +d[var_data]);
  let values = [
    d3.min(array),
    radius.invert(k / 3),
    radius.invert(k / 1.5),
    //radius.invert(k / 3),
    d3.max(array)
  ];

  legcircles(selection, {
    x: options.leg_x,
    y: options.leg_y,
    round: options.leg_round,
    k: k,
    stroke: options.leg_stroke,
    fill: options.leg_fill,
    strokewidth: options.leg_strokewidth,
    txtcol: options.leg_txtcol,
    title: options.leg_title,
    fontsize: options.leg_fontsize,
    fontsize2: options.leg_fontsize2,
    title: options.leg_title ? options.leg_title : var_data,
    values: values
  });
}
