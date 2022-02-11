// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3shape from "d3-shape";
//import * as d3geoprojection from "d3-geo-projection";
import * as d3scalechromatic from "d3-scale-chromatic";
import * as d3scale from "d3-scale";
import * as d3force from "d3-force";
const d3 = Object.assign({}, d3selection, d3geo, d3shape, d3scale, d3scalechromatic,  d3force);
// import {figuration } from "./figuration.js";
// // import {addtooltip } from "./tooltip.js";
import {legbox } from "./leg-box.js";
// // import {chorotypo} from "./chorotypo.js";
// // import {legchoro } from "./leg-choro.js"
// // import {legtypo } from "./leg-typo.js";


import {addtooltip } from "./tooltip.js";
import {legchoro } from "./leg-choro.js"
import {legtypo } from "./leg-typo.js";
import {poly2points } from "./poly2points.js";
import {figuration } from "./figuration.js";
import {chorotypo } from "./chorotypo.js";

//import {thickness } from "./thickness.js";

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
   let symbol_iteration = options.symbol_iteration
     ? options.symbol_iteration
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
       .attr("fill", (d) =>
         chorotypo(geojson.features, fill).getcol(d.properties[fill.values] || undefined)
       )
       .attr("stroke", (d) =>
         chorotypo(geojson.features, stroke).getcol(d.properties[stroke.values] || undefined)
       )
       .attr("stroke-width", strokeWidth)
    //    .attr("stroke-width", (d) =>
    //   thickness(data, strokeWidth)(d[strokeWidth.values])
    // );
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

     for (let i = 0; i < symbol_iteration; i++) {
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
       .attr("fill", (d) =>
             chorotypo(geojson.features, fill).getcol(d.properties[fill.values] || undefined)
           )
           .attr("stroke", (d) =>
             chorotypo(geojson.features, stroke).getcol(d.properties[stroke.values] || undefined)
           )
       .attr("stroke-width", strokeWidth)
       .attr("fill-opacity", fillOpacity)
       //.attr("clip-path", `url(#clip_${clipid}`)
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

   // legend (classes)

   if (typeof fill == "object" && fill.type == "choro") {
     legchoro(selection, {
       x: fill.leg_x,
       y: fill.leg_y,
       w: fill.leg_w,
       h: fill.leg_h,
       stroke: fill.leg_stroke,
       fillOpacity: fill.leg_fillOpacity,
       strokeWidth: fill.leg_strokeWidth,
       txtcol: fill.leg_txtcol,
       title: fill.leg_title ? fill.leg_title : fill.values,
       fontSize: fill.leg_fontSize,
       fontSize2: fill.leg_fontSize2,
       breaks: chorotypo(geojson.features, fill).breaks,
       colors: chorotypo(geojson.features, fill).colors
     });
   }

   if (typeof stroke == "object" && stroke.type == "choro") {
     legchoro(selection, {
       x: stroke.leg_x,
       y: stroke.leg_y,
       w: stroke.leg_w,
       h: stroke.leg_h,
       stroke: stroke.leg_stroke,
       fillOpacity: stroke.leg_fillOpacity,
       strokeWidth: stroke.leg_strokeWidth,
       txtcol: stroke.leg_txtcol,
       title: stroke.leg_title ? stroke.leg_title : stroke.values,
       fontSize: stroke.leg_fontSize,
       fontSize2: stroke.leg_fontSize2,
       breaks: chorotypo(geojson.features, stroke).breaks,
       colors: chorotypo(geojson.features, stroke).colors
     });
   }

   if (typeof fill == "object" && fill.type == "typo") {
     legtypo(selection, {
       x: fill.leg_x,
       y: fill.leg_y,
       w: fill.leg_w,
       h: fill.leg_h,
       stroke: fill.leg_stroke,
       fillOpacity: fill.leg_fillOpacity,
       strokeWidth: fill.leg_strokeWidth,
       txtcol: fill.leg_txtcol,
       title: fill.leg_title ? fill.leg_title : fill.values,
       fontSize: fill.leg_fontSize,
       fontSize2: fill.leg_fontSize2,
       types: chorotypo(geojson.features, fill).types,
       colors: chorotypo(geojson.features, fill).colors
     });
   }

   if (typeof stroke == "object" && fill.type == "stroke") {
     legtypo(selection, {
       x: stroke.leg_x,
       y: stroke.leg_y,
       w: stroke.leg_w,
       h: stroke.leg_h,
       stroke: stroke.leg_stroke,
       fillOpacity: stroke.leg_fillOpacity,
       strokeWidth: stroke.leg_strokeWidth,
       txtcol: stroke.leg_txtcol,
       title: stroke.leg_title ? fill.leg_title : fill.values,
       fontSize: stroke.leg_fontSize,
       fontSize2: stroke.leg_fontSize2,
       types: chorotypo(geojson.features, stroke).types,
       colors: chorotypo(geojson.features, stroke).colors
     });
   }


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
