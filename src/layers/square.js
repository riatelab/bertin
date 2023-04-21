import { min, max, descending } from "d3-array";
import { scaleSqrt } from "d3-scale";
import { select, pointer } from "d3-selection";
import { simulation_squares } from "../helpers/simulation-squares.js";
const d3 = Object.assign(
  {},
  {
    min,
    max,
    descending,
    scaleSqrt,
    select,
    pointer,
  }
);
import { addtooltip, tooltiptype } from "../helpers/tooltip.js";
import { legsquares } from "../legend/leg-squares.js";
import { centroid } from "../helpers/centroid.js";
import { figuration } from "../helpers/figuration.js";
import { colorize } from "../helpers/colorize.js";
import { thickness } from "../helpers/thickness.js";
import { legends } from "../legend/legends.js";

export function square(
  selection,
  projection,
  planar,
  options = {},
  clipid,
  width,
  height
) {
  let cols = [
    "#66c2a5",
    "#fc8d62",
    "#8da0cb",
    "#e78ac3",
    "#a6d854",
    "#ffd92f",
    "#e5c494",
    "#b3b3b3",
  ];
  let geojson = options.geojson;
  let values = options.values;
  let fixmax = options.fixmax != undefined ? options.fixmax : undefined;
  let k = options.k ? options.k : 50;
  let fill = options.fill
    ? options.fill
    : cols[Math.floor(Math.random() * cols.length)];
  let stroke = options.stroke ? options.stroke : "white";
  let strokeWidth =
    options.strokeWidth != undefined ? options.strokeWidth : 0.5;
  let strokeDasharray = options.strokeDasharray
    ? options.strokeDasharray
    : "none";
  let strokeOpacity =
    options.strokeOpacity != undefined ? options.strokeOpacity : 1;
  let fillOpacity = options.fillOpacity != undefined ? options.fillOpacity : 1;
  let dorling = options.dorling ? options.dorling : false;
  let demers = options.demers ? options.demers : false;
  let iteration = options.iteration != undefined ? options.iteration : 200;
  let viewof = options.viewof ? true : false;
  let tooltip = options.tooltip ? options.tooltip : false;
  if (Array.isArray(tooltip)) {
    tooltip = { fields: tooltip };
  }
  if (typeof tooltip == "function" || typeof tooltip == "string") {
    tooltip = { fields: [tooltip] };
  }
  let features;

  if (figuration(geojson) == "p") {
    features = geojson.features;
  } else {
    features = centroid(geojson, { planar: planar }).features;
  }

  const valmax =
    fixmax != undefined
      ? fixmax
      : d3.max(features, (d) => Math.abs(+d.properties[values]));
  let size = d3.scaleSqrt([0, valmax], [0, k * 1.77]);

  // features -> data

  let data = [...features]
    .map((d) => {
      return Object.assign(d.properties, {
        ctrx: projection(d.geometry.coordinates)[0],
        ctry: projection(d.geometry.coordinates)[1],
        _x: projection(d.geometry.coordinates)[0],
        _y: projection(d.geometry.coordinates)[1],
        _size: size(Math.abs(d.properties[values])),
        _padding:
          thickness(features, strokeWidth).getthickness(
            d.properties[strokeWidth.values] || 0
          ) /
            2 +
          0,
      });
    })
    .filter((d) => !isNaN(d._x))
    .filter((d) => !isNaN(d._y))
    .filter((d) => d[values] != null);

  let array = data.map((d) => Math.abs(+d[values]));
  let legval = [
    d3.min(array),
    size.invert(size(d3.max(array)) / 3),
    size.invert(size(d3.max(array)) / 1.5),
    d3.max(array),
  ];

  if (dorling == true || demers == true) {
    const simulation = simulation_squares(data);

    for (let i = 0; i < iteration; i++) {
      simulation.tick();
    }
  }

  // info
  let infoid = options.id
    ? `info_${options.id}`
    : `info_${
        Date.now().toString(36) + Math.random().toString(36).substring(2)
      }`;
  selection.append("g").attr("id", infoid).attr("class", "info");

  // Squares
  let viewdata = {};
  selection
    .append("g")
    .attr("class", options.id)
    .attr(
      "data-layer",
      JSON.stringify({
        _type: options._type ? options._type : "square",
        valmax,
        k,
        demers,
        dorling,
        iteration,
        strokeWidth,
        fill,
        stroke,
        values,
        fixmax,
        legval,
        leg_x: options.leg_x,
        leg_y: options.leg_y,
        leg_round: options.leg_round,
        leg_divisor: options.leg_divisor,
        leg_stroke: options.leg_stroke,
        leg_fill: options.leg_fill,
        leg_strokeWidth: options.leg_strokeWidth,
        leg_txtcol: options.leg_txtcol,
        leg_title: options.leg_title,
        leg_fontSize: options.leg_fontSize,
        leg_fontSize2: options.leg_fontSize2,
        leg_title: options.leg_title,
      })
    )
    .selectAll("squares")
    .data(
      data.sort((a, b) =>
        d3.descending(Math.abs(+a[values]), Math.abs(+b[values]))
      )
    )
    .join("rect")
    .attr("class", "onglobe_coords")
    .attr("fill", (d) => colorize(data, fill).getcol(d[fill.values]))
    .attr("stroke", (d) => colorize(data, stroke).getcol(d[stroke.values]))
    .attr("stroke-width", (d) =>
      thickness(data, strokeWidth).getthickness(
        d[strokeWidth.values] || undefined
      )
    )
    .attr("fill-opacity", fillOpacity)
    .attr("stroke-dasharray", strokeDasharray)
    .attr("stroke-opacity", strokeOpacity)
    .attr("x", (d) => d._x - d._size / 2)
    .attr("y", (d) => d._y - d._size / 2)
    .attr("width", (d) => d._size)
    .attr("height", (d) => d._size)
    .on("touchmove mousemove", function (event, d) {
      if (viewof) {
        d3.select(this)
          .attr("stroke-opacity", strokeOpacity - 0.3)
          .attr("fill-opacity", fillOpacity - 0.3);
        viewdata = d;
        selection.dispatch("input");
        Object.defineProperty(selection.node(), "value", {
          get: () => viewdata,
          configurable: true,
        });
      }
      if (tooltip) {
        d.properties = d;
        selection.select(`#${infoid}`).call(addtooltip, {
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
          type: tooltiptype(d3.pointer(event, this), width, height),
        });
      }
      if (tooltip) {
        selection
          .select(`#${infoid}`)
          .attr("transform", `translate(${d3.pointer(event, this)})`);
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

  // legend (classes)
  legends(geojson, selection, fill, stroke, strokeWidth, options.id);

  // Legend (squares)

  legsquares(
    selection,
    {
      x: options.leg_x,
      y: options.leg_y,
      round: options.leg_round !== undefined ? options.leg_round : undefined,
      divisor: options.leg_divisor,
      k: k,
      fixmax: fixmax,
      stroke: options.leg_stroke,
      fill: options.leg_fill,
      strokeWidth: options.leg_strokeWidth,
      txtcol: options.leg_txtcol,
      title: options.leg_title,
      fontSize: options.leg_fontSize,
      fontSize2: options.leg_fontSize2,
      title: options.leg_title ? options.leg_title : values,
      values: legval,
    },
    options.id
  );
}
