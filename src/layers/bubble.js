import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3scale from "d3-scale";
import * as d3array from "d3-array";
import * as d3scalechromatic from "d3-scale-chromatic";
import * as d3force from "d3-force";
const d3 = Object.assign({}, d3selection, d3scalechromatic, d3array, d3geo, d3scale, d3force);

import { topo2geo } from "../helpers/topo2geo.js";
import {addtooltip, tooltiptype } from "../helpers/tooltip.js";
import {legcircles } from "../helpers/leg-circles.js";
import {poly2points } from "../helpers/poly2points.js";
import {figuration } from "../helpers/figuration.js";
import {chorotypo } from "../helpers/chorotypo.js";
import {thickness } from "../helpers/thickness.js";
import {legends } from "../helpers/legends.js";

export function bubble(selection, projection, options = {}, clipid, width, height){
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
  let geojson = topo2geo(options.geojson);
  let values = options.values;
  let fixmax = options.fixmax ?? undefined
  let k = options.k ? options.k : 50;
  let fill = options.fill
    ? options.fill
    : cols[Math.floor(Math.random() * cols.length)];
  let stroke = options.stroke ? options.stroke : "white";
  let strokeWidth = options.strokeWidth ? options.strokeWidth : 0.5;
  let strokeDasharray = options.strokeDasharray ?? "none";
  let strokeOpacity = options.strokeOpacity ?? 1;
  let fillOpacity = options.fillOpacity ? options.fillOpacity : 1;
  let dorling = options.dorling ? options.dorling : false;
  let iteration = options.iteration ? options.iteration : 200;
  let tooltip = options.tooltip ? options.tooltip : false;
  if (Array.isArray(tooltip)) { tooltip = { fields: tooltip }; }
  if (typeof tooltip == "string") { tooltip = { fields: [tooltip] };}
  //let choro = options.choro ? options.choro : undefined;

  let features;

  if (figuration(geojson) == "p") {
    features = geojson.features;
  } else {
    features = poly2points(geojson);
  }

  const valvax = fixmax != undefined ? fixmax : d3.max(features, (d) => Math.abs(+d.properties[values]))
  let radius = d3.scaleSqrt(
    [0, valvax],
    //[0, d3.max(features, (d) => +d.properties[values])],
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
        d3.forceCollide((d) => radius(Math.abs(d.properties[values])) + strokeWidth / 2)
      );

    for (let i = 0; i < iteration; i++) {
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
          d3.descending(Math.abs(+a.properties[values]), Math.abs(+b.properties[values]))
        )
    )
    .join("circle")
    .attr("fill", (d) =>
      chorotypo(features, fill).getcol(d.properties[fill.values] || undefined)
    )
    .attr("stroke", (d) =>
      chorotypo(features, stroke).getcol(d.properties[stroke.values] || undefined)
    )
    .attr("stroke-width", (d) =>
   thickness(features, strokeWidth).getthickness(d.properties[strokeWidth.values] || undefined)
 )
    .attr("fill-opacity", fillOpacity)
    .attr("stroke-dasharray", strokeDasharray)
    .attr("stroke-opacity", strokeOpacity)
    .attr("cx", (d) => (dorling ? d.x : projection(d.geometry.coordinates)[0]))
    .attr("cy", (d) => (dorling ? d.y : projection(d.geometry.coordinates)[1]))
    .attr("r", (d) => radius(Math.abs(d.properties[values])))
    .on("touchmove mousemove", function (event, d) {

  if (tooltip) {
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
          strokeWidth: tooltip.strokeWidth,
          fillOpacity: tooltip.fillOpacity,
          strokeOpacity: tooltip.strokeOpacity,
          col:tooltip.col,
          type: tooltiptype(d3.pointer(event, this), width, height)
        }
      );
    }
    if (tooltip) {
      selection
        .select("#info")
        .attr("transform", `translate(${d3.pointer(event, this)})`);
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

  // legend (classes)
  legends(geojson, selection, fill, stroke, strokeWidth)

  // Legend (circles)
  let array = features.map((d) => Math.abs(+d.properties[values]));
  let legval = [
    d3.min(array),
    radius.invert(radius(d3.max(array)) / 3),
    radius.invert(radius(d3.max(array)) / 1.5),
    d3.max(array)
  ];


  legcircles(selection, {
    x: options.leg_x,
    y: options.leg_y,
    round: options.leg_round !== undefined ? options.leg_round : undefined,
    k: k,
    fixmax:fixmax,
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
