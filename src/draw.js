// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

// Helpers
import { getheight } from "./helpers/height.js";
import { figuration } from "./helpers/figuration.js";
import { getcenters } from "./helpers/centroids.js";
import { proj4d3 } from "./helpers/proj4d3.js";

// Layers
import { graticule } from "./layers/graticule.js";
import { outline } from "./layers/outline.js";
import { addfooter } from "./layers/footer.js";
import { addheader } from "./layers/header.js";
import { simple } from "./layers/simple.js";
import { bubble } from "./layers/bubble.js";
import { mushroom } from "./layers/mushroom.js";
import { missing } from "./layers/missing.js";
import { shadow } from "./layers/shadow.js";
import { scalebar } from "./layers/scalebar.js";
import { text } from "./layers/text.js";
import { label } from "./layers/label.js";
import { spikes } from "./layers/spikes.js";
import { dotcartogram } from "./layers/dotcartogram.js";

// Main
export function draw({ params = {}, layers = {} } = {}) {
  // default global paramaters

  let projection = params.projection ? params.projection : d3.geoEquirectangular();

  if (typeof projection === "string") {
    projection = proj4d3(projection);
  }


  let width = params.width ? params.width : 1000;
  let extent = params.extent ? params.extent : null;
  let margin = params.margin ? params.margin : 1;
  let background = params.background;
  let clip = params.clip ?? false // test

  // optimal heights
  let height = getheight(layers, extent, margin, projection, width);
  let headerdelta = 0;
  let header = layers.find((d) => d.type == "header");
  if (header) {
    if (header.text) {
      headerdelta = 25 * header.text.split("\n").length + 10;
    }
    if (header.fontSize) {
      headerdelta = header.fontSize * header.text.split("\n").length + 10;
    }
  }
  let footerdelta = 0;
  let footer = layers.find((d) => d.type == "footer");
  if (footer) {
    if (footer.text) {
      footerdelta = 10 * footer.text.split("\n").length + 10;
    }
    if (footer.fontSize) {
      footerdelta = footer.fontSize * footer.text.split("\n").length + 10;
    }
  }

  // svg document
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height + headerdelta + footerdelta)
    .attr("viewBox", [
      0,
      -headerdelta,
      width,
      height + headerdelta + footerdelta
    ])
    .attr(
      "style",
      `max-width: 100%; height: auto; height: intrinsic; background-color: white;`
    );

  // defs
  let defs = svg.append("defs");


  // font
  defs
    .append("style")
    .attr("type", "text/css")
    .text(
      "@import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Roboto&family=Rubik&family=Ubuntu&display=swap');"
    );

  // Clip
let clipid = null
if (clip){ // test
  clipid = Date.now().toString(36) + Math.random().toString(36).substr(2);
  svg
    .append("clipPath")
    .attr("id", `clip_${clipid}`)
    .append("path")
    .datum({ type: "Sphere" })
    .attr("d", d3.geoPath(projection));
} // test

  // Background color
  if (background) {
    svg
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .attr("fill", background);
  }

  // Outline (fill)
  let o = layers.find((d) => d.type == "outline");
  if (o) {
    outline(svg, projection, {
      fill: o.fill,
      fillOpacity: o.fillOpacity,
      stroke: "none",
      strokeWidth: "none"
    });
  }

  // ----------------------------------------
  layers.reverse().forEach((layer) => {
    // Graticule
    if (layer.type == "graticule") {
      graticule(svg, projection, {
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        strokeOpacity: layer.strokeOpacity,
        strokeDasharray: layer.strokeDasharray,
        strokeLinecap: layer.strokeLinecap,
        strokeLinejoin: layer.strokeLinejoin,
        step: layer.step
      }, clipid);
    }

    // simple layers
    if (layer.type == "layer" || layer.type == "simple" || layer.type == undefined) {
      simple(svg, projection, {
        geojson: layer.geojson,
        fill: layer.fill,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        strokeLinecap: layer.strokeLinecap,
        strokeLinejoin: layer.strokeLinejoin,
        fillOpacity: layer.fillOpacity,
        strokeOpacity: layer.strokeOpacity,
        strokeDasharray: layer.strokeDasharray,
        symbol: layer.symbol,
        symbol_size: layer.symbol_size,
        symbol_iteration: layer.symbol_iteration,
        symbol_shift: layer.symbol_shift,
        tooltip: layer.tooltip,
        leg_x: layer.leg_x,
        leg_y: layer.leg_y,
        leg_w: layer.leg_w,
        leg_h: layer.leg_h,
        leg_title: layer.leg_title,
        leg_text: layer.leg_text,
        leg_fontSize: layer.leg_fontSize,
        leg_fontSize2: layer.leg_fontSize2,
        leg_stroke: layer.leg_stroke,
        leg_fillOpacity: layer.leg_fillOpacity,
        leg_fill: layer.leg_fill,
        leg_strokeWidth: layer.leg_strokeWidth,
        leg_txtcol: layer.leg_txtcol
      }, clipid);
    }

    // spikes layers

    if (layer.type == "spikes") {
    spikes(svg, projection, {
    geojson: layer.geojson,
    values: layer.values,
    k: layer.k,
    w: layer.w,
    fill: layer.fill,
    stroke: layer.stroke,
    strokeWidth: layer.strokeWidth,
    fillOpacity: layer.fillOpacity,
    strokeLinecap: layer.strokeLinecap,
    strokeLinejoin: layer.strokeLinejoin,
    strokeDasharray: layer.strokeDasharray,
    strokeOpacity: layer.strokeOpacity,
    tooltip: layer.tooltip,
    leg_x: layer.leg_x,
    leg_y: layer.leg_y,
    leg_w: layer.leg_w,
    leg_h: layer.leg_h,
    leg_title: layer.leg_title,
    leg_fontSize: layer.leg_fontSize,
    leg_fontSize2: layer.leg_fontSize2,
    leg_stroke: layer.leg_stroke,
    leg_fillOpacity: layer.leg_fillOpacity,
    leg_strokeWidth: layer.leg_strokeWidth,
    leg_txtcol: layer.leg_txtcol,
    leg_round:layer.leg_round
  }, clipid);
}

    // mushroom layer

    if (layer.type == "mushroom") {
      mushroom(svg, projection, {
        geojson: layer.geojson,
        top_values: layer.top_values,
        bottom_values: layer.bottom_values,
        top_fill: layer.top_fill,
        bottom_fill: layer.bottom_fill,
        k: layer.k,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        fillOpacity: layer.fillOpacity,
        top_tooltip: layer.top_tooltip,
        bottom_tooltip: layer.bottom_tooltip,
        leg_x: layer.leg_x,
        leg_y: layer.leg_y,
        leg_fontSize: layer.leg_fontSize,
        leg_fontSize2: layer.leg_fontSize2,
        leg_round: layer.leg_round,
        leg_txtcol: layer.leg_txtcol,
        leg_title: layer.leg_title,
        leg_top_txt: layer.leg_top_txt,
        leg_bottom_txt: layer.leg_bottom_txt,
        leg_top_fill: layer.leg_top_fill,
        leg_bottom_fill: layer.leg_bottom_fill,
        leg_stroke: layer.leg_stroke,
        leg_strokeWidth: layer.leg_strokeWidth
      }, clipid);
    }

    // labels layer

if (layer.type == "label") {
  label(svg, projection, {
    geojson: layer.geojson,
    values: layer.values,
    fill: layer.fill,
    fontSize: layer.fontSize,
    fontFamily: layer.fontFamily,
    textDecoration: layer.textDecoration,
    fontWeight: layer.fontWeight,
    fontStyle: layer.fontStyle,
    opacity: layer.opacity
  }, clipid);
}

    // text note
    if (layer.type == "text") {
      text(svg, width, height, {
        position: layer.position,
        text: layer.text,
        fill: layer.fill,
        stroke: layer.stroke,
        fontSize: layer.fontSize,
        fontFamily: layer.fontFamily,
        textDecoration: layer.textDecoration,
        fontWeight: layer.fontWeight,
        fontStyle: layer.fontStyle,
        margin: layer.margin,
        anchor: layer.anchor, // start, middle, end
        baseline: layer.baseline, // baseline, middle, hanging
        frame_fill: layer.frame_fill,
        frame_stroke: layer.frame_stroke,
        frame_opacity: layer.frame_opacity,
        frame_strokeWidth: layer.frame_strokeWidth
      });
    }

    // missing
    if (layer.type == "missing") {
      missing(svg, projection, {
        geojson: layer.geojson,
        values: layer.values,
        fill: layer.fill,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        fillOpacity: layer.fillOpacity,
        leg_x: layer.leg_x,
        leg_y: layer.leg_y,
        leg_w: layer.leg_w,
        leg_h: layer.leg_h,
        leg_text: layer.leg_text,
        leg_fontSize: layer.leg_fontSize,
        leg_stroke: layer.leg_stroke,
        leg_fillOpacity: layer.fillOpacity,
        leg_fill: layer.fill,
        leg_strokeWidth: layer.leg_strokeWidth,
        leg_txtcol: layer.leg_txtcol
      }, clipid);
    }

    // shadow
    if (layer.type == "shadow") {
      shadow(svg, projection, layer.geojson, clipid, defs, {
        col: layer.col,
        dx: layer.dx,
        dy: layer.dy,
        opacity: layer.opacity,
        stdDeviation: layer.stdDeviation
      });
    }

  // Dots cartogram

    if (layer.type == "dotcartogram") {
      dotcartogram(svg, projection, {
        geojson: layer.geojson,
        values: layer.values,
        radius: layer.radius,
        nbmax: layer.nbmax,
        onedot: layer.onedot,
        span: layer.span,
        fill: layer.fill,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        fillOpacity: layer.fillOpacity,
        strokeDasharray: layer.strokeDasharray,
        strokeOpacity: layer.strokeOpacity,
        iteration: layer.iteration,
        tooltip: layer.tooltip,
        leg_x: layer.leg_x,
        leg_y: layer.leg_y,
        leg_title: layer.leg_title,
        leg_fontSize: layer.leg_fontSize,
        leg_fontSize2: layer.leg_fontSize2,
        leg_txtcol: layer.leg_txtcol,
        leg_stroke: layer.leg_stroke,
        leg_strokeWidth: layer.leg_strokeWidth,
        leg_fill: layer.leg_fill,
        leg_txt: layer.leg_txt

      }, clipid);
    }

    // Bubbles

    if (layer.type == "bubble") {
      bubble(svg, projection,  {
        geojson: layer.geojson,
        values: layer.values,
        k: layer.k,
        fixmax: layer.fixmax,
        fill: layer.fill,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        fillOpacity: layer.fillOpacity,
        strokeDasharray: layer.strokeDasharray,
        strokeOpacity: layer.strokeOpacity,
        dorling: layer.dorling,
        iteration: layer.iteration,
        tooltip: layer.tooltip,
        leg_x: layer.leg_x,
        leg_y: layer.leg_y,
        leg_stroke: layer.leg_stroke,
        leg_fill: layer.leg_fill,
        leg_strokeWidth: layer.leg_strokeWidth,
        leg_txtcol: layer.leg_txtcol,
        leg_title: layer.leg_title,
        leg_fontSize: layer.leg_fontSize,
        leg_fontSize2: layer.leg_fontSize2,
        leg_round: layer.leg_round
      }, clipid);
    }

    // Header
    if (layer.type == "header") {
      addheader(svg, width, {
        fontSize: layer.fontSize,
        text: layer.text,
        fill: layer.fill,
        background: layer.background,
        backgroundOpacity: layer.backgroundOpacity,
        anchor: layer.anchor
      });
    }

    // Footer
    if (layer.type == "footer") {
      addfooter(svg, width, height, {
        fontSize: layer.fontSize,
        text: layer.text,
        fill: layer.fill,
        background: layer.background,
        backgroundOpacity: layer.backgroundOpacity,
        anchor: layer.anchor
      });
    }
  });

  // -----------------------------------------

  // Scalebar
  let s = layers.find((d) => d.type == "scalebar");
  if (s) {
    scalebar(svg, projection, width, height, {
      x: s.x,
      y: s.y,
      units: s.units
    });
  }

  // Outline (stroke)
  if (o) {
    outline(svg, projection, {
      fill: "none",
      stroke: o.stroke,
      strokeWidth: o.strokeWidth
    });
  }

  // Tootltip
  svg.append("g").attr("id", "info").attr("class", "info");

  // build
  return Object.assign(svg.node(), {});
}
