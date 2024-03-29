import { legspikes } from "../legend/leg-spikes.js";
import { select, pointers } from "d3-selection";
import { min, max, descending } from "d3-array";
import { scaleLinear } from "d3-scale";
import { geoPath } from "d3-geo";
const d3 = Object.assign(
  {},
  { select, pointers, min, max, descending, scaleLinear, geoPath }
);

import { addtooltip, tooltiptype } from "../helpers/tooltip.js";
import { centroid } from "../helpers/centroid.js";
import { figuration } from "../helpers/figuration.js";
import { colorize } from "../helpers/colorize.js";
import { thickness } from "../helpers/thickness.js";
import { legends } from "../legend/legends.js";

export function spikes(
  selection,
  projection,
  planar,
  options = {},
  clipid,
  width,
  height
) {
  let geojson = options.geojson;
  let values = options.values;
  let k = options.k != undefined ? options.k : 50;
  let w = options.w != undefined ? options.w : 10;
  let fill = options.fill ? options.fill : "#ffa3e3";
  let stroke = options.stroke ? options.stroke : "#a31d88";
  let strokeWidth = options.strokeWidth != undefined ? options.strokeWidth : 1;
  let fillOpacity = options.fillOpacity != undefined ? options.fillOpacity : 1;

  let strokeLinecap = options.strokeLinecap ? options.strokeLinecap : "round";
  let strokeLinejoin = options.strokeLinejoin
    ? options.strokeLinejoin
    : "round";
  let strokeDasharray =
    options.strokeDasharray != undefined ? options.strokeDasharray : "none";
  let strokeOpacity =
    options.strokeOpacity != undefined ? options.strokeOpacity : 1;

  let tooltip = options.tooltip ? options.tooltip : false;
  if (Array.isArray(tooltip)) {
    tooltip = { fields: tooltip };
  }
  if (typeof tooltip == "function" || typeof tooltip == "string") {
    tooltip = { fields: [tooltip] };
  }

  let viewof = options.viewof ? true : false;
  let features;

  let viewdata = {};

  if (figuration(geojson) == "p") {
    features = geojson.features;
  } else {
    features = centroid(geojson, { planar: planar }).features;
  }

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(features.map((d) => +d.properties[values]))])
    .range([0, k]);

  const array = features
    .filter((d) => d.properties[values] != "")
    .map((d) => +d.properties[values]);

  const legval = [
    d3.min(array),
    yScale.invert(k / 3),
    yScale.invert(k / 1.5),
    d3.max(array),
  ];

  let leg = {
    legval,
    leg_x: options.leg_x ? options.leg_x : null,
    leg_y: options.leg_y ? options.leg_y : null,
    leg_title: options.leg_title ? options.leg_title : null,
    leg_fontSize: options.leg_fontSize ? options.leg_fontSize : 14,
    leg_fontSize2: options.leg_fontSize2 ? options.leg_fontSize2 : 10,
    leg_stroke: options.leg_stroke ? options.leg_stroke : stroke,
    fillOpacity: options.fillOpacity,
    leg_fill: options.leg_fill ? options.leg_fill : fill,
    leg_fillOpacity: options.leg_fillOpacity
      ? options.leg_fillOpacity
      : fillOpacity,
    leg_strokeWidth: options.leg_strokeWidth ? options.leg_strokeWidth : 0.5,
    leg_txtcol: options.leg_txtcol ? options.leg_txtcol : "#363636",
    leg_round: options.leg_round !== undefined ? options.leg_round : undefined,
    w,
    k,
  };

  // info
  let infoid = options.id
    ? `info_${options.id}`
    : `info_${
        Date.now().toString(36) + Math.random().toString(36).substring(2)
      }`;
  selection.append("g").attr("id", infoid).attr("class", "info");

  // coords
  features.forEach((d) => {
    d.coords = d3.geoPath(projection).centroid(d.geometry);
  });

  selection
    .append("g")
    .attr("class", options.id)
    .attr(
      "data-layer",
      JSON.stringify({
        _type: "spikes",
        fill,
        stroke,
        strokeWidth,
        values,
        k,
        w,
        leg,
      })
    )
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
    .attr("class", "onglobe_translate")
    .attr("fill", (d) =>
      colorize(features, fill).getcol(d.properties[fill.values])
    )
    .attr("stroke", (d) =>
      colorize(features, stroke).getcol(d.properties[stroke.values])
    )
    .attr("stroke-width", (d) =>
      thickness(features, strokeWidth).getthickness(
        d.properties[strokeWidth.values] || undefined
      )
    )
    .attr("fill-opacity", fillOpacity)
    .attr("stroke-opacity", strokeOpacity)
    .attr("stroke-linecap", strokeLinecap)
    .attr("stroke-linejoin", strokeLinejoin)
    .attr("stroke-dasharray", strokeDasharray)
    .attr(
      "d",
      (d) => `M ${-w / 2}, 0 0, ${0 - yScale(d.properties[values])} ${w / 2}, 0`
    )
    .attr(
      "transform",
      (d) =>
        `translate(
     ${d.coords[0]},
     ${d.coords[1]})`
    )

    .on("touchmove mousemove", function (event, d) {
      if (viewof) {
        d3.select(this)
          .attr("stroke-opacity", strokeOpacity - 0.3)
          .attr("fill-opacity", fillOpacity - 0.3);
        viewdata = d.properties;
        selection.dispatch("input");
        Object.defineProperty(selection.node(), "value", {
          get: () => viewdata,
          configurable: true,
        });
      }
      if (tooltip) {
        selection.select(`#${infoid}`).call(
          addtooltip,

          {
            fields: (function () {
              const fields = tooltip.fields;
              let result = [];
              fields.forEach((e) => {
                let val = "";
                if (typeof e == "function") {
                  val = [d].map(e)[0];
                } else if (typeof e == "string" && e[0] == "$") {
                  val = `${d.properties[e.substring(1, e.length)]}`;
                } else if (typeof e == "string") {
                  val = e;
                }
                result.push(val == "" ? "N/A" : val);
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
            col: tooltip.col,
            type: tooltiptype(d.coords, width, height),
          }
        );
      }
      if (tooltip) {
        selection.select(`#${infoid}`).attr(
          "transform",
          `translate(
                ${
                  projection(d.geometry.coordinates)[0] +
                  d3.pointers(event, this)[0][0]
                },
                ${
                  projection(d.geometry.coordinates)[1] +
                  d3.pointers(event, this)[0][1]
                })`
        );

        d3.select(this)
          .attr("stroke-opacity", strokeOpacity - 0.3)
          .attr("fill-opacity", fillOpacity - 0.3);
      }
    })
    .on("touchend mouseleave", function () {
      if (viewof) {
        viewdata = {};
        selection.dispatch("input");
      }
      selection.select(`#${infoid}`).call(addtooltip, null);
      d3.select(this)
        .attr("stroke-opacity", strokeOpacity)
        .attr("fill-opacity", fillOpacity);
    });

  if (viewof) {
    Object.defineProperty(selection.node(), "value", {
      get: () => viewdata,
      configurable: true,
    });
  }

  // Legends
  legspikes(selection, leg, options.id);
  legends(geojson, selection, fill, stroke, strokeWidth, options.id);
}
