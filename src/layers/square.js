import { min, max, descending } from "d3-array";
import { quadtree } from "d3-quadtree";
import { scaleSqrt } from "d3-scale";
import { select, pointer } from "d3-selection";
import { forceX, forceY, forceCollide, forceSimulation } from "d3-force";
const d3 = Object.assign(
  {},
  {
    min,
    max,
    descending,
    scaleSqrt,
    select,
    pointer,
    forceX,
    forceY,
    forceCollide,
    forceSimulation,
    quadtree,
  }
);
import { topo2geo } from "../helpers/topo2geo.js";
import { addtooltip, tooltiptype } from "../helpers/tooltip.js";
import { legsquares } from "../legend/leg-squares.js";
import { centroid } from "geotoolbox";
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
  let display = options.display == false ? false : true;
  if (display) {
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
    let geojson = topo2geo(options.geojson);
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
    let fillOpacity =
      options.fillOpacity != undefined ? options.fillOpacity : 1;
    let dorling = options.dorling ? options.dorling : false;
    let demers = options.demers ? options.demers : false;
    let iteration = options.iteration != undefined ? options.iteration : 200;
    let tooltip = options.tooltip ? options.tooltip : false;
    if (Array.isArray(tooltip)) {
      tooltip = { fields: tooltip };
    }
    if (typeof tooltip == "string") {
      tooltip = { fields: [tooltip] };
    }

    let features;

    if (figuration(geojson) == "p") {
      features = geojson.features;
    } else {
      features = centroid(geojson, { planar: planar }).features;
    }

    const valvax =
      fixmax != undefined
        ? fixmax
        : d3.max(features, (d) => Math.abs(+d.properties[values]));
    let size = d3.scaleSqrt([0, valvax], [0, k * 1.77]);

    // features -> data

    let data = [...features]
      .map((d) => {
        return Object.assign(d.properties, {
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

    if (dorling == true || demers == true) {
      // Collide function (for squares)

      function squareForceCollide() {
        let nodes;

        function force(alpha) {
          const quad = d3.quadtree(
            nodes,
            (d) => d._x,
            (d) => d._y
          );
          for (const d of nodes) {
            quad.visit((q, x1, y1, x2, y2) => {
              let updated = false;
              if (q.data && q.data !== d) {
                let x = d._x - q.data._x,
                  y = d._y - q.data._y,
                  xSpacing = d._padding + (q.data._size + d._size) / 2,
                  ySpacing = d._padding + (q.data._size + d._size) / 2,
                  absX = Math.abs(x),
                  absY = Math.abs(y),
                  l,
                  lx,
                  ly;

                if (absX < xSpacing && absY < ySpacing) {
                  l = Math.sqrt(x * x + y * y);

                  lx = (absX - xSpacing) / l;
                  ly = (absY - ySpacing) / l;

                  // the one that's barely within the bounds probably triggered the collision
                  if (Math.abs(lx) > Math.abs(ly)) {
                    lx = 0;
                  } else {
                    ly = 0;
                  }
                  d._x -= x *= lx;
                  d._y -= y *= ly;
                  q.data.x += x;
                  q.data.y += y;

                  updated = true;
                }
              }
              return updated;
            });
          }
        }

        force.initialize = (_) => (nodes = _);

        return force;
      }

      // simulation

      const simulation = d3
        .forceSimulation(data)
        .force(
          "_x",
          d3.forceX((d) => d._x)
        )
        .force(
          "_y",
          d3.forceY((d) => d._y)
        )
        .force("collide", squareForceCollide());

      for (let i = 0; i < iteration; i++) {
        simulation.tick();
      }
    }
    // Squares

    selection
      .append("g")
      .selectAll("squares")
      .data(
        data.sort((a, b) =>
          d3.descending(Math.abs(+a[values]), Math.abs(+b[values]))
        )
      )
      .join("rect")
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
                  result.push(e[0] == "$" ? `${d[e.substr(1, e.length)]}` : e);
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
            }
          );
        }
        if (tooltip) {
          selection
            .select("#info")
            .attr("transform", `translate(${d3.pointer(event, this)})`);
          d3.select(this)
            .attr("stroke-opacity", strokeOpacity - 0.3)
            .attr("fill-opacity", fillOpacity - 0.3);
        }
      })
      .on("touchend mouseleave", function () {
        selection.select("#info").call(addtooltip, null);
        d3.select(this)
          .attr("stroke-opacity", strokeOpacity)
          .attr("fill-opacity", fillOpacity);
      });

    // legend (classes)
    legends(geojson, selection, fill, stroke, strokeWidth);

    // Legend (squares)

    let array = data.map((d) => Math.abs(+d[values]));
    let legval = [
      d3.min(array),
      size.invert(size(d3.max(array)) / 3),
      size.invert(size(d3.max(array)) / 1.5),
      d3.max(array),
    ];

    legsquares(selection, {
      x: options.leg_x,
      y: options.leg_y,
      round: options.leg_round !== undefined ? options.leg_round : undefined,
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
    });
  }
}
