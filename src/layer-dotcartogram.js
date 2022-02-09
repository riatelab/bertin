import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3array from "d3-array";
import * as d3force from "d3-force";
const d3 = Object.assign({}, d3selection, d3array, d3geo, d3force);
import {addtooltip } from "./tooltip.js";
import {legchoro } from "./leg-choro.js"
import {legtypo } from "./leg-typo.js";
import {poly2points } from "./poly2points.js";
import {figuration } from "./figuration.js";
import {chorotypo } from "./chorotypo.js";

export function dotcartogram(selection, projection, clipid, options = {}){
  let cols = [
    "#66c2a5",
    "#fc8d62",
    "#8da0cb",
    "#e78ac3"
  ];

  let geojson = options.geojson;
  let values = options.values;
  let radius = options.radius ?? 4;
  let nbmax = options.nbmax ?? 200
  let onedot = options.onedot ?? Math.round(d3.sum(geojson.features.map((d) => +d.properties[values])) / nbmax)
  let span = options.span ?? 0.5
  let fill = options.fill ?? cols[Math.floor(Math.random() * cols.length)];
  let stroke = options.stroke ?? "none";
  let strokeWidth = options.strokeWidth ?? 0;
  let fillOpacity = options.fillOpacity ?? 1;
  let tooltip = options.tooltip ?? "";
  let iteration = options.iteration ?? 200;

  let features;

  if (figuration(geojson) == "p") {
    features = geojson.features;
  } else {
    features = poly2points(geojson);
  }

  // Dissolve

  let dots = [];
  for (let i = 0; i <= features.length - 1; i++) {
    let nb = Math.round(+features[i].properties[values] / onedot);
    for (let j = 1; j <= nb; j++) {
      dots.push({ ...features[i] });
    }
  }

  // Simulation

    const simulation = d3
      .forceSimulation(dots)
      .force(
        "x",
        d3.forceX((d) => projection(d.geometry.coordinates)[0] )
      )
      .force(
        "y",
        d3.forceY((d) => projection(d.geometry.coordinates)[1])
      )
      .force(
        "collide",
        d3.forceCollide(radius + span + strokeWidth / 2)
      );

    for (let i = 0; i < iteration; i++) {
      simulation.tick();
    }

  // Draw

  selection
    .append("g")
    .selectAll("circle")
    .data(
      dots
        .filter((d) => d.geometry.coordinates != undefined)
        )
    .join("circle")
    .attr("fill", (d) =>
      chorotypo(dots, fill).getcol(d.properties[fill.values] || undefined)
    )
    .attr("stroke", (d) =>
      chorotypo(dots, stroke).getcol(d.properties[stroke.values] || undefined)
    )
    .attr("stroke-width", strokeWidth)
    .attr("fill-opacity", fillOpacity)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", radius)
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
                .attr("fill-opacity", fillOpacity - 0.3);
            }
          })
          .on("touchend mouseleave", function () {
            selection.select("#info").call(addtooltip, null);
            d3.select(this)
              .attr("stroke-width", strokeWidth)
              .attr("fill-opacity", fillOpacity);
          });


// legend

const leg_x = options.leg_x ?? null
const leg_y = options.leg_y ?? null
const leg_title = options.leg_title ?? "leg_title"
const leg_fontSize = options.leg_fontSize ?? 14
const leg_fontSize2 = options.leg_fontSize2 ?? 10
const leg_txtcol = options.leg_txtcol ?? "#363636"
const leg_stroke = options.leg_stroke ?? stroke
const leg_strokeWidth = options.leg_strokeWidth ?? strokeWidth
const leg_fill = typeof fill == "string" ? fill : options.leg_fill
const leg_txt = options.leg_txt ?? onedot

  if (leg_x != null && leg_y != null) {
let delta = 0
let leg = selection.append("g");
if (leg_title != null) {
  delta = (leg_title.split("\n").length + 1) * leg_fontSize;
  leg
    .append("g")
    .selectAll("text")
    .data(leg_title.split("\n"))
    .join("text")
    .attr("x", leg_x)
    .attr("y", leg_y)
    .attr("font-size", `${leg_fontSize}px`)
    .attr("dy", (d, i) => i * leg_fontSize)
    .attr("text-anchor", "start")
    .attr("dominant-baseline", "hanging")
    .attr("fill", leg_txtcol)
    .text((d) => d);
}
    leg
      .append("circle")
      .attr("r", radius)
      .attr("fill", leg_fill)
      .attr("stroke", leg_stroke)
      .attr("stroke-width", leg_strokeWidth)
      .attr("cx",leg_x + radius)
      .attr("cy", leg_y + radius * 2 + (leg_title.split("\n").length ) * leg_fontSize)


      leg
        .append("text")
        .attr("fill", leg_txtcol)
        .attr("font-size", `${leg_fontSize2}px`)
        .attr("dominant-baseline", "middle")
        .attr("x",leg_x + radius * 2 + leg_fontSize2)
        .attr("y", leg_y + radius * 2 + (leg_title.split("\n").length) * leg_fontSize)
        .text(leg_txt)

}

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
              breaks: chorotypo(dots, fill).breaks,
              colors: chorotypo(dots, fill).colors
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
              breaks: chorotypo(dots, stroke).breaks,
              colors: chorotypo(dots, stroke).colors
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
              types: chorotypo(dots, fill).types,
              colors: chorotypo(dots, fill).colors
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
              types: chorotypo(dots, stroke).types,
              colors: chorotypo(dots, stroke).colors
            });
          }


}
