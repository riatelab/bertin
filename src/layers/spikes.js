import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
import * as d3array from "d3-array";
import * as d3scale from "d3-scale";
const d3 = Object.assign({}, d3selection, d3array, d3scale, d3geo, d3geoprojection);

import {addtooltip } from "../helpers/tooltip.js";
import {rounding } from "../helpers/rounding.js";
import {poly2points } from "../helpers/poly2points.js";
import {figuration } from "../helpers/figuration.js";
import { chorotypo } from "../helpers/chorotypo.js";
import { thickness } from "../helpers/thickness.js";
import { legends } from "../helpers/legends.js";

export function spikes(selection, projection, options = {}, clipid) {
  let geojson = options.geojson;
  let values = options.values;
  let k = options.k !== undefined ? options.k : 50;
  let w = options.w !== undefined ? options.w : 10;
  let fill = options.fill ? options.fill : "#ffa3e3";
  let stroke = options.stroke ? options.stroke : "#a31d88";
  let strokeWidth = options.strokeWidth ? options.strokeWidth : 1;
  let fillOpacity = options.fillOpacity ? options.fillOpacity : 1;

  let strokeLinecap = options.strokeLinecap ?? "round";
  let strokeLinejoin = options.strokeLinejoin ?? "round";
  let strokeDasharray = options.strokeDasharray ?? "none";
  let strokeOpacity = options.strokeOpacity ?? 1;

  let tooltip = options.tooltip ? options.tooltip : "";
  let leg_x = options.leg_x ? options.leg_x : null;
  let leg_y = options.leg_y ? options.leg_y : null;
  let leg_w = options.leg_w ? options.leg_w : 30;
  let leg_h = options.leg_h ? options.leg_h : 20;
  let leg_title = options.leg_title ? options.leg_title : null;
  let leg_fontSize = options.leg_fontSize ? options.leg_fontSize : 14;
  let leg_fontSize2 = options.leg_fontSize2 ? options.leg_fontSize2 : 10;
  let leg_stroke = options.leg_stroke ? options.leg_stroke : "black";
  let leg_fillOpacity = options.fillOpacity ? options.fillOpacity : 1;
  let leg_strokeWidth = options.leg_strokeWidth ? options.leg_strokeWidth : 0.5;
  let leg_txtcol = options.leg_txtcol ? options.leg_txtcol : "#363636";
  let leg_round =
    options.leg_round !== undefined ? options.leg_round : undefined;
  let features;

  if (figuration(geojson) == "p") {
    features = geojson.features;
  } else {
    features = poly2points(geojson);
  }

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(features.map((d) => +d.properties[values]))])
    .range([0, k]);

  selection
    .append("g")
    .selectAll("path")
    .data(
      features
        .filter((d) => d.geometry.coordinates != undefined)
        .filter((d) => d.properties[values] != undefined)
        .sort((a, b) =>
          d3.descending(+a.properties[values], +b.properties[values])
        )
    )
    .join("path")
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
    .attr("stroke-opacity", strokeOpacity)
    .attr("stroke-linecap", strokeLinecap)
    .attr("stroke-linejoin", strokeLinejoin)
    .attr("stroke-dasharray", strokeDasharray)
    .attr(
      "d",
      (d) =>
        `M ${projection(d.geometry.coordinates)[0] - w / 2}, ${
          projection(d.geometry.coordinates)[1]
        } ${projection(d.geometry.coordinates)[0]}, ${
          projection(d.geometry.coordinates)[1] - yScale(d.properties[values])
        } ${projection(d.geometry.coordinates)[0] + w / 2}, ${
          projection(d.geometry.coordinates)[1]
        }`
    )
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

  // Legend

  const array = features
    .filter((d) => d.properties[values] != "")
    .map((d) => +d.properties[values]);
  const legval = [
    d3.min(array),
    yScale.invert(k / 3),
    yScale.invert(k / 1.5),
    d3.max(array)
  ];

  if (leg_x != null && leg_y != null) {
    let leg = selection.append("g");

    let delta = 0;
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
      .append("g")
      .selectAll("path")
      .data(legval.sort(d3.descending))
      .join("path")
      .attr("d", (d) => `M ${-w / 2},0 0,${-yScale(d)} ${w / 2},0`)
      .attr("fill", typeof fill == "object" ? "white" : fill)
      .attr("stroke", typeof stroke == "object" ? "black" : stroke)
      .attr("stroke-width", 1)
      .attr(
            "transform",
            (d, i) =>
              `translate(${leg_x + w / 2 + (w + 5) * i},${
                leg_y + k + (leg_title.split("\n").length + 1) * leg_fontSize
              })`
      );

    leg
      .append("g")
      .selectAll("text")
      .data(legval.sort(d3.descending))
      .join("text")
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr(
          "transform",
          (d, i) =>
            `translate(${leg_x + w / 2 + (w + 5) * i},${
              leg_y +
              k +
              (leg_title.split("\n").length + 1) * leg_fontSize +
              leg_fontSize2 / 2
            }) rotate(90)`
        )
      .attr("font-size", `${leg_fontSize2}px`)
      .attr("fill", leg_txtcol)
      .text((d) => rounding(d, leg_round));

    //);
  }

  // Legend
  legends(geojson, selection, fill, stroke, strokeWidth)
}
