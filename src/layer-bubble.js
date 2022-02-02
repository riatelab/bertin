import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3scale from "d3-scale";
import * as d3array from "d3-array";
import * as d3scalechromatic from "d3-scale-chromatic";
import * as d3force from "d3-force";
const d3 = Object.assign({}, d3selection, d3scalechromatic, d3array, d3geo, d3scale, d3force);
import {addtooltip } from "./tooltip.js";
import {legchoro } from "./leg-choro.js"
import {legtypo } from "./leg-typo.js";
import {legcircles } from "./leg-circles.js";
import {poly2points } from "./poly2points.js";
import {figuration } from "./figuration.js";
import {chorotypo } from "./chorotypo.js";

export function bubble(selection, projection, clipid, options = {}){
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
  let strokeWidth = options.strokeWidth ? options.strokeWidth : 0.5;
  let fillOpacity = options.fillOpacity ? options.fillOpacity : 1;
  let dorling = options.dorling ? options.dorling : false;
  let interation = options.interation ? options.interation : 200;
  let tooltip = options.tooltip ? options.tooltip : "";
  //let choro = options.choro ? options.choro : undefined;

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

  // Simulation

  if (dorling == true) {
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
        d3.forceCollide((d) => radius(d.properties[values]) + strokeWidth / 2)
      );

    for (let i = 0; i < interation; i++) {
      simulation.tick();
    }
  }

  // Bubbles

  selection
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
    .attr("fill", (d) =>
      chorotypo(geojson, fill).getcol(d.properties[fill.values] || undefined)
    )
    .attr("stroke", (d) =>
      chorotypo(geojson, stroke).getcol(d.properties[stroke.values] || undefined)
    )
    .attr("stroke-width", strokeWidth)
    .attr("fill-opacity", fillOpacity)
    .attr("cx", (d) => (dorling ? d.x : projection(d.geometry.coordinates)[0]))
    .attr("cy", (d) => (dorling ? d.y : projection(d.geometry.coordinates)[1]))
    .attr("r", (d) => radius(d.properties[values]))
    .attr("clip-path", `url(#clip_${clipid}_rectangle)`)    .on("touchmove mousemove", function (event, d) {
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
      breaks: chorotypo(geojson, fill).breaks,
      colors: chorotypo(geojson, fill).colors
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
      breaks: chorotypo(geojson, stroke).breaks,
      colors: chorotypo(geojson, stroke).colors
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
      types: chorotypo(geojson, fill).types,
      colors: chorotypo(geojson, fill).colors
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
      types: chorotypo(geojson, stroke).types,
      colors: chorotypo(geojson, stroke).colors
    });
  }

  // Legend (circles)
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
    round: options.leg_round !== undefined ? options.leg_round : undefined,
    k: k,
    stroke: options.leg_stroke,
    fill: options.leg_fill,
    strokeWidth: options.leg_strokeWidth,
    txtcol: options.leg_txtcol,
    title: options.leg_title,
    fontSize: options.leg_fontSize,
    fontSize2: options.leg_fontSize2,
    title: options.leg_title ? options.leg_title : values,
    values: legval
  });
}
