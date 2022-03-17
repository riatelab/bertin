// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3shape from "d3-shape";
//import * as d3geoprojection from "d3-geo-projection";
import * as d3scalechromatic from "d3-scale-chromatic";
import * as d3scale from "d3-scale";
import * as d3force from "d3-force";
const d3 = Object.assign({}, d3selection, d3geo, d3shape, d3scale, d3scalechromatic,  d3force);

import { legbox } from "../helpers/leg-box.js";
import { legends } from "../helpers/legends.js";
import { addtooltip, tooltiptype } from "../helpers/tooltip2.js";
import { poly2points } from "../helpers/poly2points.js";
import { figuration } from "../helpers/figuration.js";
import { chorotypo } from "../helpers/chorotypo.js";
import { thickness } from "../helpers/thickness.js";

//import {thickness } from "./thickness.js";

export function simple2(selection, projection, options = {}, clipid, width, height) {
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
   let fill = options.fill ?? cols[Math.floor(Math.random() * cols.length)];
   let strokeLinecap = options.strokeLinecap ?? "round";
   let strokeLinejoin = options.strokeLinejoin ?? "round";
   let strokeDasharray = options.strokeDasharray ?? "none";
   let stroke = options.stroke ?? "white";
   let strokeWidth = options.strokeWidth ?? 0.5;
   let fillOpacity = options.fillOpacity ?? 1;
   let strokeOpacity = options.strokeOpacity ?? 1;
   let tooltip = options.tooltip ? options.tooltip : "";
   if (Array.isArray(tooltip)) { tooltip = { fields: tooltip }; }
   if (typeof tooltip == "string") { tooltip = { fields: [tooltip] };}
   let symbol = options.symbol ?? "circle";
   let symbol_size = options.symbol_size ?? 40;
   let symbol_iteration = options.symbol_iteration ?? 200
   let symbol_shift = options.symbol_shift ?? 0;

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
       .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid}`)
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
       .attr("stroke-width", (d) =>
      thickness(geojson.features, strokeWidth).getthickness(d.properties[strokeWidth.values] || undefined)
    )
       .attr("fill-opacity", fillOpacity)
       .attr("stroke-opacity", strokeOpacity)
       .attr("stroke-linecap", strokeLinecap)
       .attr("stroke-linejoin", strokeLinejoin)
       .attr("stroke-dasharray", strokeDasharray)
       .on("touchmove mousemove", function (event, d) {

     if (tooltip != "") {
         selection.select("#info").call(
           addtooltip,

           {
             fields: (function () {
               const fields = Array.isArray(tooltip.fields)
                 ? tooltip.fields
                 : [tooltip.fields];
               let result = [];
               fields.forEach((e) => {
                 result.push(
                   e[0] == "$" ? `${d.properties[e.substr(1, e.length)]}` : e
                 );
               });
               return result;
             })(),
             fontWeight: tooltip.fontWeight,
             fontSize: tooltip.fontSize,
             fontStyle: tooltip.fontStyle,
             fill: tooltip.fill,
             stroke: tooltip.stroke,
             type: tooltiptype(d3.pointer(event, this), width, height)
           }
         );
       }
       if (tooltip != "") {
         selection
           .select("#info")
           .attr("transform", `translate(${d3.pointer(event, this)})`);
           d3.select(this)
             .attr("stroke-opacity", strokeOpacity - 0.3)
             .attr("fill-opacity", fillOpacity - 0.3)
             .raise();
       }
     })
     .on("touchend mouseleave", function () {
       selection.select("#info").call(addtooltip, null);
       d3.select(this)
       .attr("stroke-opacity", strokeOpacity)
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
           .attr("stroke-width", (d) =>
      thickness(geojson.features, strokeWidth).getthickness(d.properties[strokeWidth.values] || undefined)
           )
       .attr("fill-opacity", fillOpacity)
       .attr("stroke-opacity", strokeOpacity)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
     .attr("stroke-dasharray", strokeDasharray)
     .on("touchmove mousemove", function (event, d) {

   if (tooltip != "") {
       selection.select("#info").call(
         addtooltip,

         {
           fields: (function () {
             const fields = Array.isArray(tooltip.fields)
               ? tooltip.fields
               : [tooltip.fields];
             let result = [];
             fields.forEach((e) => {
               result.push(
                 e[0] == "$" ? `${d.properties[e.substr(1, e.length)]}` : e
               );
             });
             return result;
           })(),
           fontWeight: tooltip.fontWeight,
           fontSize: tooltip.fontSize,
           fontStyle: tooltip.fontStyle,
           fill: tooltip.fill,
           stroke: tooltip.stroke,
           type: tooltiptype(symbol_shift ? [d.x, d.y] : projection(d.geometry.coordinates), width, height)
         }
       );
     }
     if (tooltip != "") {
       selection
         .select("#info")
        .attr("transform",   `translate(
         ${symbol_shift ? d.x : projection(d.geometry.coordinates)[0]},
         ${symbol_shift ? d.y : projection(d.geometry.coordinates)[1]})`);
         d3.select(this)
           .attr("stroke-opacity", strokeOpacity - 0.3)
           .attr("fill-opacity", fillOpacity - 0.3)
           //.raise();
     }
   })
   .on("touchend mouseleave", function () {
     selection.select("#info").call(addtooltip, null);
     d3.select(this)
     .attr("stroke-opacity", strokeOpacity)
    .attr("fill-opacity", fillOpacity)
    //.lower();
   });


      //  .on("touchmove mousemove", function (event, d) {
      //    if (tooltip != "") {
      //      if (Array.isArray(tooltip)) {
      //        selection
      //          .select("#info")
      //          .call(
      //            addtooltip,
      //            `${d.properties[tooltip[0]]}\n${d.properties[tooltip[1]]}\n${
      //              tooltip[2]
      //            }`
      //          );
      //      } else {
      //        selection
      //          .select("#info")
      //          .call(addtooltip, `${d.properties[tooltip]}`);
      //      }
      //    }
      //    if (tooltip != "") {
      //      selection
      //        .select("#info")
      //        .attr("transform",   `translate(
      // ${symbol_shift ? d.x : projection(d.geometry.coordinates)[0]},
      // ${symbol_shift ? d.y : projection(d.geometry.coordinates)[1]})`);
      //      d3.select(this)
      //        //.attr("stroke-width", strokeWidth + 0.5)
      //         .attr("stroke-opacity", strokeOpacity - 0.3)
      //        .attr("fill-opacity", fillOpacity - 0.3)
      //        .raise();
      //    }
      //  })
      //  .on("touchend mouseleave", function () {
      //    selection.select("#info").call(addtooltip, null);
      //    d3.select(this)
      //      .attr("stroke-opacity", strokeOpacity)
      //      .attr("fill-opacity", fillOpacity)
      //      .lower();
      //  });



   }

   // Legend
   legends(geojson, selection, fill, stroke, strokeWidth)

   // legend (box)
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
