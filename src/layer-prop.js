import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);
import {getcenters} from "./utils.js";
export function propLayer(selection, projection, features, options = {}){
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
  let id = options.id;
  let fill = options.fill
    ? options.fill
    : cols[Math.floor(Math.random() * cols.length)];
  let stroke = options.stroke ? options.stroke : "white";
  let strokewidth = options.strokewidth ? options.strokewidth : 0.5;
  let fillopacity = options.fillopacity ? options.fillopacity : 1;
  let radius = options.radius ? options.radius : 40;

  let coords = getcenters(features, id, d3.geoPatterson(), true);

  selection
    .append("g")
    .selectAll("circle")
    .data(features.features)
    .join("circle")
    .attr("id", (d) => d.properties[id])
    .attr("fill", "red")
    .attr("transform", (d) => `translate(${coords.get(d.properties[id])})`)
    .attr("r", radius);
}
