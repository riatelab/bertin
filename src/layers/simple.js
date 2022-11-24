import { select, pointer } from "d3-selection";
import {
  symbol,
  symbolCircle,
  symbolDiamond,
  symbolCross,
  symbolSquare,
  symbolStar,
  symbolTriangle,
  symbolWye,
} from "d3-shape";
import { forceX, forceY, forceCollide, forceSimulation } from "d3-force";
import { geoPath } from "d3-geo";
const d3 = Object.assign(
  {},
  {
    select,
    pointer,
    forceX,
    forceY,
    forceCollide,
    forceSimulation,
    geoPath,
    symbol,
    symbolCircle,
    symbolDiamond,
    symbolCross,
    symbolSquare,
    symbolStar,
    symbolTriangle,
    symbolWye,
  }
);

import { topo2geo } from "../helpers/topo2geo.js";
import { legsimple } from "../legend/leg-simple.js";
import { legends } from "../legend/legends.js";
import { addtooltip, tooltiptype } from "../helpers/tooltip.js";
import { figuration } from "../helpers/figuration.js";
import { colorize } from "../helpers/colorize.js";
import { thickness } from "../helpers/thickness.js";

export function simple(
  selection,
  projection,
  options = {},
  clipid,
  width,
  height
  //viewofdata
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
    let fill = options.fill
      ? options.fill
      : cols[Math.floor(Math.random() * cols.length)];
    let strokeLinecap = options.strokeLinecap ? options.strokeLinecap : "round";
    let strokeLinejoin = options.strokeLinejoin
      ? options.strokeLinejoin
      : "round";
    let strokeDasharray =
      options.strokeDasharray != undefined ? options.strokeDasharray : "none";
    let stroke = options.stroke ? options.stroke : "white";
    let strokeWidth =
      options.strokeWidth != undefined ? options.strokeWidth : 0.5;
    let fillOpacity =
      options.fillOpacity != undefined ? options.fillOpacity : 1;
    let strokeOpacity =
      options.strokeOpacity != undefined ? options.strokeOpacity : 1;
    let tooltip = options.tooltip ? options.tooltip : false;
    if (Array.isArray(tooltip)) {
      tooltip = { fields: tooltip };
    }
    if (typeof tooltip == "string") {
      tooltip = { fields: [tooltip] };
    }
    let symbol = options.symbol ? options.symbol : "circle";
    let symbol_size =
      options.symbol_size != undefined ? options.symbol_size : 40;
    let symbol_iteration =
      options.symbol_iteration != undefined ? options.symbol_iteration : 200;
    let symbol_shift =
      options.symbol_shift != undefined ? options.symbol_shift : 0;

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
        .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid})`)
        .selectAll("path")
        .data(geojson.features)
        .join("path")
        .attr("d", d3.geoPath(projection))
        .attr("fill", (d) =>
          colorize(geojson.features, fill).getcol(d.properties[fill.values])
        )
        .attr("stroke", (d) =>
          colorize(geojson.features, stroke).getcol(d.properties[stroke.values])
        )
        .attr("stroke-width", (d) =>
          thickness(geojson.features, strokeWidth).getthickness(
            d.properties[strokeWidth.values] || undefined
          )
        )
        .attr("fill-opacity", fillOpacity)
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-dasharray", strokeDasharray)
        .on("touchmove mousemove", function (event, d) {
          viewofdata = "cpicpi"; // TEST
          selection.dispatch("input"); // TEST
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
      options.leg_type = options.symbol ? options.symbol : "circle";

      if (symbol_shift > 0) {
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
      }

      const symbols = new Map([
        ["circle", d3.symbolCircle],
        ["cross", d3.symbolCross],
        ["diamond", d3.symbolDiamond],
        ["square", d3.symbolSquare],
        ["star", d3.symbolStar],
        ["triangle", d3.symbolTriangle],
        ["wye", d3.symbolWye],
      ]);

      selection
        .append("g")
        .selectAll("path")
        .data(geojson.features)
        .join("path")
        .attr("d", d3.symbol().size(symbol_size).type(symbols.get(symbol)))
        .attr(
          "transform",
          (d) =>
            `translate(
       ${symbol_shift ? d.x : projection(d.geometry.coordinates)[0]},
       ${symbol_shift ? d.y : projection(d.geometry.coordinates)[1]})`
        )
        .attr("fill", (d) =>
          colorize(geojson.features, fill).getcol(
            d.properties[fill.values] || undefined
          )
        )
        .attr("stroke", (d) =>
          colorize(geojson.features, stroke).getcol(d.properties[stroke.values])
        )
        .attr("stroke-width", (d) =>
          thickness(geojson.features, strokeWidth).getthickness(
            d.properties[strokeWidth.values]
          )
        )
        .attr("fill-opacity", fillOpacity)
        .attr("stroke-opacity", strokeOpacity)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-dasharray", strokeDasharray)
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
                col: tooltip.col,
                type: tooltiptype(
                  symbol_shift
                    ? [d.x, d.y]
                    : projection(d.geometry.coordinates),
                  width,
                  height
                ),
              }
            );
          }
          if (tooltip) {
            selection.select("#info").attr(
              "transform",
              `translate(
         ${symbol_shift ? d.x : projection(d.geometry.coordinates)[0]},
         ${symbol_shift ? d.y : projection(d.geometry.coordinates)[1]})`
            );
            d3.select(this)
              .attr("stroke-opacity", strokeOpacity - 0.3)
              .attr("fill-opacity", fillOpacity - 0.3);
            //.raise();
          }
        })
        .on("touchend mouseleave", function () {
          selection.select("#info").call(addtooltip, null);
          d3.select(this)
            .attr("stroke-opacity", strokeOpacity)
            .attr("fill-opacity", fillOpacity);
          //.lower();
        });
    }

    // Legend
    legends(geojson, selection, fill, stroke, strokeWidth);

    // legend (simple)
    legsimple(selection, {
      x: options.leg_x,
      y: options.leg_y,
      w: options.leg_w,
      h: options.leg_h,
      symbol_size: symbol_size,
      type: options.leg_type,
      title: options.leg_title,
      text: options.leg_text,
      fontSize: options.leg_fontSize,
      fontSize2: options.leg_fontSize2,
      stroke: options.leg_stroke,
      fillOpacity: options.leg_fillOpacity
        ? options.leg_fillOpacity
        : fillOpacity,
      fill: options.leg_fill ? options.leg_fill : fill,
      strokeWidth: options.leg_strokeWidth,
      txtcol: options.leg_txtcol,
    });
  }
}
