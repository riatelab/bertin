// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
import * as d3array from "d3-array";
import * as d3scale from "d3-scale";
import * as d3force from "d3-force";
const d3 = Object.assign({}, d3selection, d3array, d3scale, d3geo, d3geoprojection, d3force);
import {addtooltip } from "./tooltip.js";
import {legcircles } from "./leg-circles.js";
import {poly2points } from "./poly2points.js";
import {figuration } from "./figuration.js";

export function layerdorling(selection, projection, clipid, options = {}){
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
   let values = options.values;
   let k = options.k ? options.k : 50;
   let fill = options.fill
     ? options.fill
     : cols[Math.floor(Math.random() * cols.length)];
   let stroke = options.stroke ? options.stroke : "white";
   let strokewidth = options.strokewidth ? options.strokewidth : 0.5;
   let fillopacity = options.fillopacity ? options.fillopacity : 1;
   let tooltip = options.tooltip ? options.tooltip : "";
   let interation = options.interation ? options.interation : 200;

   let features;

   if (figuration(geojson) == "p") {
     features = geojson.features;
   } else {
     features = poly2points(geojson);
   }

   let radius = d3.scaleSqrt(
     [0, d3.max(features, (d) => +d.properties[values])],
     [0, k]
   );

   //console.log(features);

   const simulation = d3
     .forceSimulation(features)
     .force(
       "x",
       d3.forceX((d) => projection(d.geometry.coordinates)[0])
     )
     .force(
       "y",
       d3.forceY((d) => projection(d.geometry.coordinates)[1])
     )
     .force(
       "collide",
       d3.forceCollide((d) => radius(d.properties[values]))
     );

   for (let i = 0; i < interation; i++) {
     simulation.tick();
   }

   //return features;

   const node = selection
     .append("g")
     .selectAll("circle")
     .data(
       features
         .filter((d) => d.geometry.coordinates != undefined)
         .filter((d) => d.properties[values] != undefined)
         .sort((a, b) =>
           d3.descending(+a.properties[values], +b.properties[values])
         )
     )
     .join("circle")
     .attr("fill", fill)
     .attr("stroke", stroke)
     .attr("stroke-width", strokewidth)
     .attr("fill-opacity", fillopacity)
     .attr("cx", (d) => d.x)
     .attr("cy", (d) => d.y)
     // .attr("cx", (d) => projection(d.geometry.coordinates)[0])
     // .attr("cy", (d) => projection(d.geometry.coordinates)[1])
     .attr("cx", (d) => d.x)
     .attr("cy", (d) => d.y)
     .attr("r", (d) => radius(d.properties[values]))
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
           .attr("fill-opacity", fillopacity - 0.3);
       }
     })
     .on("touchend mouseleave", function () {
       selection.select("#info").call(addtooltip, null);
       d3.select(this)
         .attr("stroke-width", strokewidth)
         .attr("fill-opacity", fillopacity);
     });

   // simulation.on("tick", () => {
   //   node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
   // });

   // Legend
   let array = features.map((d) => +d.properties[values]);
   let legval = [
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
     title: options.leg_title ? options.leg_title : values,
     values: legval
   });
 }
