// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);
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
    .attr("transform", (d) => `translate(${coords.get(d[id_data])})`)
    .attr("r", (d) => radius(d[var_data]));
}
