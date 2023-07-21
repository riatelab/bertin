import { select, pointers } from "d3-selection";
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
    pointers,
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
  let fillOpacity = options.fillOpacity != undefined ? options.fillOpacity : 1;
  let strokeOpacity =
    options.strokeOpacity != undefined ? options.strokeOpacity : 1;
  let tooltip = options.tooltip ? options.tooltip : false;
  if (Array.isArray(tooltip)) {
    tooltip = { fields: tooltip };
  }
  if (typeof tooltip == "function" || typeof tooltip == "string") {
    tooltip = { fields: [tooltip] };
  }

  let symbol = options.symbol ? options.symbol : "circle";
  let symbol_size = options.symbol_size != undefined ? options.symbol_size : 40;
  let symbol_iteration =
    options.symbol_iteration != undefined ? options.symbol_iteration : 200;
  let symbol_shift =
    options.symbol_shift != undefined ? options.symbol_shift : 0;
  let viewof = options.viewof ? true : false;

  let leg = {
    x: options.leg_x,
    y: options.leg_y,
    w: options.leg_w,
    h: options.leg_h,
    symbol_size: symbol_size,
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
    symbol: options.symbol,
    symbol_size: options.symbol_size,
    symbol_iteration: options.symbol_iteration,
    symbol_shift: options.symbol_shift,
    viewof: options.viewof,
  };

  // viewof data
  let viewdata = {};

  // tooltip
  let infoid = options.id
    ? `info_${options.id}`
    : `info_${
        Date.now().toString(36) + Math.random().toString(36).substring(2)
      }`;
  selection.append("g").attr("id", infoid).attr("class", "info");

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
      .attr("class", options.id)
      .attr(
        "data-layer",
        JSON.stringify({
          _type: options._type ? options._type : "simple",
          fill,
          stroke,
          strokeWidth,
          leg,
        })
      )
      .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid})`)
      .selectAll("path")
      .data(geojson.features)
      .join("path")
      .attr("d", d3.geoPath(projection))
      .attr("class", "onglobe")
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
            type: tooltiptype(d3.pointers(event, this)[0], width, height),
          });
        }
        if (tooltip) {
          selection
            .select(`#${infoid}`)
            .attr("transform", `translate(${d3.pointers(event, this)[0]})`);
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
          .attr("fill-opacity", fillOpacity)
          .lower();
      });
  }
  // If points
  if (figuration(geojson) == "p") {
    leg.type = options.symbol ? options.symbol : "circle";

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

    // coords
    geojson.features.forEach((d) => {
      d.coords = d3.geoPath(projection).centroid(d.geometry);
    });

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
      .attr("class", options.id)
      .attr(
        "data-layer",
        JSON.stringify({
          _type: options._type ? options._type : "simple",
          fill,
          stroke,
          strokeWidth,
          leg,
          symbol,
          symbol_size,
        })
      )
      .selectAll("path")
      .data(geojson.features)
      .join("path")
      .attr("class", "onglobe_translate")
      .attr("d", d3.symbol().size(symbol_size).type(symbols.get(symbol)))
      .attr(
        "transform",
        (d) =>
          `translate(
       ${symbol_shift ? d.x : d.coords[0]},
       ${symbol_shift ? d.y : d.coords[1]})`
      )

      .attr("fill", (d) =>
        colorize(geojson.features, fill).getcol(
          d.properties[fill.values] || undefined
        )
      )
      .attr("visibility", (d) => (isNaN(d.coords[0]) ? "hidden" : "visible"))
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
        if (viewof) {
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
              type: tooltiptype(
                symbol_shift ? [d.x, d.y] : projection(d.geometry.coordinates),
                width,
                height
              ),
            }
          );
        }
        if (tooltip) {
          selection.select(`#${infoid}`).attr(
            "transform",
            `translate(
         ${symbol_shift ? d.x : projection(d.geometry.coordinates)[0]},
         ${symbol_shift ? d.y : projection(d.geometry.coordinates)[1]})`
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
  }

  // define exported propertes
  if (viewof) {
    Object.defineProperty(selection.node(), "value", {
      get: () => viewdata,
      configurable: true,
    });
  }

  // Legend
  legends(geojson, selection, fill, stroke, strokeWidth, options.id);

  // legend (simple)
  legsimple(selection, leg, options.id);
}
