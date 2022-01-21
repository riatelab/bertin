// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3shape from "d3-shape";
import * as d3geoprojection from "d3-geo-projection";
import * as d3force from "d3-force";
const d3 = Object.assign({}, d3selection, d3geo, d3shape, d3geoprojection, d3force);
import {figuration } from "./figuration.js";
import {addtooltip } from "./tooltip.js";
import {legbox } from "./leg-box.js";

export function layersimple(selection, projection, clipid, geojson, options = {}) {
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
   let strokeWidth = options.strokeWidth ? options.strokeWidth : 0.5;
   let fillOpacity = options.fillOpacity ? options.fillOpacity : 1;
   let tooltip = options.tooltip ? options.tooltip : "";
   let symbol = options.symbol ? options.symbol : "circle";
   let symbol_size = options.symbol_size ? options.symbol_size : 40;
   let symbol_interation = options.symbol_interation
     ? options.symbol_interation
     : 200;
   let symbol_shift = options.symbol_shift ? options.symbol_shift : 0;

   // If lines
   if (figuration(geojson) == "l") {
     stroke = options.stroke
       ? options.stroke
       : cols[Math.floor(Math.random() * cols.length)];
     fill = options.fill ? options.fill : "none";
     strokeWidth = options.strokeWidth ? options.strokeWidth : 1;
   }

   // If lines or polygons
   if (figuration(geojson) == "l" || figuration(geojson) == "z") {
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
       .attr("stroke-width", strokeWidth)
       .attr("fill-opacity", fillOpacity)
       .attr("clip-path", `url(#clip_${clipid}`)
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
             .attr("stroke-width", strokeWidth + 0.5)
             .attr("fill-opacity", fillOpacity - 0.3)
             .raise();
         }
       })
       .on("touchend mouseleave", function () {
         selection.select("#info").call(addtooltip, null);
         d3.select(this)
           .attr("stroke-width", strokeWidth)
           .attr("fill-opacity", fillOpacity)
           .lower();
       });
   }

   // If points
   if (figuration(geojson) == "p") {
     const simulation = d3
       .forceSimulation(geojson.features)
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
         d3.forceCollide(Math.sqrt(symbol_size) / 2 + symbol_shift / 2)
       );

     for (let i = 0; i < symbol_interation; i++) {
       simulation.tick();
     }

     const symbols = [
       "circle",
       "cross",
       "diamond",
       "square",
       "star",
       "triangle",
       "wye"
     ];

     selection
       .append("g")
       .attr(":inkscape:groupmode", "layer")
       .attr("id", "simple layer")
       .attr(":inkscape:label", "simple layer")
       .selectAll("path")
       .data(geojson.features)
       .join("path")
       .attr(
         "d",
         d3.symbol().size(symbol_size).type(d3.symbols[symbols.indexOf(symbol)])
       )
       .attr(
         "transform",
         (d) =>
           `translate(
       ${symbol_shift ? d.x : projection(d.geometry.coordinates)[0]},
       ${symbol_shift ? d.y : projection(d.geometry.coordinates)[1]})`
       )
       .attr("fill", fill)
       .attr("stroke", stroke)
       .attr("stroke-width", strokeWidth)
       .attr("fill-opacity", fillOpacity)
       .attr("clip-path", `url(#clip_${clipid}`)
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
             .attr("transform",   `translate(
      ${symbol_shift ? d.x : projection(d.geometry.coordinates)[0]},
      ${symbol_shift ? d.y : projection(d.geometry.coordinates)[1]})`);
           d3.select(this)
             .attr("stroke-width", strokeWidth + 0.5)
             .attr("fill-opacity", fillOpacity - 0.3)
             .raise();
         }
       })
       .on("touchend mouseleave", function () {
         selection.select("#info").call(addtooltip, null);
         d3.select(this)
           .attr("stroke-width", strokeWidth)
           .attr("fill-opacity", fillOpacity)
           .lower();
       });
   }

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
     fillOpacity: options.leg_fillOpacity
       ? options.leg_fillOpacity
       : fillOpacity,
     fill: options.leg_fill ? options.leg_fill : fill,
     strokeWidth: options.leg_strokeWidth,
     txtcol: options.leg_txtcol
   });
 }
