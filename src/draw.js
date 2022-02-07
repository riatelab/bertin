// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

import { addgraticule } from "./graticule.js";
import { addoutline } from "./outline.js";
import { addfooter } from "./footer.js";
import { addheader } from "./header.js";
import { layersimple } from "./layer-simple.js";
import { layerprop } from "./layer-prop.js";
import { bubble } from "./layer-bubble.js";
import { layertypo } from "./layer-typo.js";
import { layerchoro } from "./layer-choro.js";
import {layermushroom} from "./layer-mushroom.js";
import { layermissing } from "./layer-missing.js";
import { getheight } from "./height.js";
import { figuration } from "./figuration.js";
import { getcenters } from "./centroids.js";
import { shadow } from "./shadow.js";
import { addscalebar } from "./scalebar.js";
import { addtext } from "./text.js";
import { layerlabel } from "./layer-label.js";
import { layerspikes } from "./layer-spikes.js";
import { layerdorling } from "./layer-dorling.js";
import { dotscartogram } from "./layer-dotscartogram.js";
import { proj4d3 } from "./proj4d3.js";

//import { plotHeader, plotFooter, plotGraticule, plotOutline, getHeight} from "./helpers/layout.js";

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
  const clipid = Date.now().toString(36) + Math.random().toString(36).substr(2);
  svg
    .append("clipPath")
    .attr("id", `clip_${clipid}`)
    .append("path")
    .datum({ type: "Sphere" })
    .attr("d", d3.geoPath(projection));

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
  let outline = layers.find((d) => d.type == "outline");
  if (outline) {
    addoutline(svg, projection, {
      fill: outline.fill,
      fillOpacity:outline.fillOpacity,
      stroke: "none",
      strokeWidth: "none"
    });
  }

  // ----------------------------------------
  layers.reverse().forEach((layer) => {
    // Graticule
    if (layer.type == "graticule") {
      addgraticule(svg, projection, clipid, {
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        strokeOpacity: layer.strokeOpacity,
        strokeDasharray: layer.strokeDasharray,
        step: layer.step
      });
    }

    // simple layers
    if (layer.type == "layer" || layer.type == "simple" || layer.type == undefined) {
      layersimple(svg, projection, clipid, layer.geojson, {
        fill: layer.fill,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        fillOpacity: layer.fillOpacity,
        symbol: layer.symbol,
        symbol_size: layer.symbol_size,
        symbol_interation: layer.symbol_interation,
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
      });
    }

    // spikes layers

    if (layer.type == "spikes") {
    layerspikes(svg, projection, clipid, {
    geojson: layer.geojson,
    values: layer.values,
    k: layer.k,
    w: layer.w,
    fill: layer.fill,
    stroke: layer.stroke,
    strokeWidth: layer.strokeWidth,
    fillOpacity: layer.fillOpacity,
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
  });
}

    // typo layers
    if (layer.type == "typo") {
      layertypo(svg, projection, clipid, {
        geojson: layer.geojson,
        values: layer.values,
        colors: layer.colors,
        pal: layer.pal,
        col_missing: layer.col_missing,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        fillOpacity: layer.fillOpacity,
        tooltip: layer.tooltip,
        leg_x: layer.leg_x,
        leg_y: layer.leg_y,
        leg_title: layer.leg_title,
        leg_fontSize: layer.leg_fontSize,
        leg_fontSize2: layer.leg_fontSize2,
        leg_stroke: layer.leg_stroke,
        leg_fillOpacity: layer.leg_fillOpacity,
        leg_strokeWidth: layer.leg_strokeWidth,
        leg_txtcol: layer.leg_txtcol
      });
    }

    // choro layers
    if (layer.type == "choro") {
      layerchoro(svg, projection, clipid, {
        geojson: layer.geojson,
        values: layer.values,
        pal: layer.pal,
        nbreaks: layer.nbreaks,
        breaks: layer.breaks,
        colors: layer.colors,
        method: layer.method,
        col_missing: layer.col_missing,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        fillOpacity: layer.fillOpacity,
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
        leg_txtcol: layer.leg_txtcol,
        leg_round: layer.leg_round
      });
    }

    // mushroom layer

    if (layer.type == "mushroom") {
      layermushroom(svg, projection, clipid, {
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
      });
    }

    // labels layer

if (layer.type == "label") {
  layerlabel(svg, projection, clipid, {
    geojson: layer.geojson,
    values: layer.values,
    fill: layer.fill,
    fontSize: layer.fontSize,
    fontFamily: layer.fontFamily,
    textDecoration: layer.textDecoration,
    fontWeight: layer.fontWeight,
    fontStyle: layer.fontStyle,
    opacity: layer.opacity
  });
}

    // text note
    if (layer.type == "text") {
      addtext(svg, width, height, {
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
      layermissing(svg, projection, clipid, {
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
      });
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

    // prop layers
    if (layer.type == "prop") {
      layerprop(svg, projection, clipid, {
        geojson: layer.geojson,
        values: layer.values,
        k: layer.k,
        fill: layer.fill,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        fillOpacity: layer.fillOpacity,
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
      });
    }

    // Dots cartogram

    if (layer.type == "dotscartogram") {
      dotscartogram(svg, projection, clipid, {
        geojson: layer.geojson,
        values: layer.values,
        radius: layer.radius,
        onedot: layer.onedot,
        span: layer.span,
        fill: layer.fill,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        fillOpacity: layer.fillOpacity,
        iteration: layer.iteration,
        tooltip: layer.tooltip,
      });
    }

    // Bubbles

    if (layer.type == "bubble") {
      bubble(svg, projection, clipid, {
        geojson: layer.geojson,
        values: layer.values,
        k: layer.k,
        fixmax: layer.fixmax,
        fill: layer.fill,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        fillOpacity: layer.fillOpacity,
        dorling: layer.dorling,
        interation: layer.interation,
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
      });
    }

    // dorling layers
    if (layer.type == "dorling") {
      layerdorling(svg, projection, clipid, {
        geojson: layer.geojson,
        values: layer.values,
        k: layer.k,
        fill: layer.fill,
        stroke: layer.stroke,
        strokeWidth: layer.strokeWidth,
        fillOpacity: layer.fillOpacity,
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
      });
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
  let scalebar = layers.find((d) => d.type == "scalebar");
  if (scalebar) {
    addscalebar(svg, projection, width, height, {
      x: scalebar.x,
      y: scalebar.y,
      units: scalebar.units
    });
  }

  // Outline (stroke)
  if (outline) {
    addoutline(svg, projection, {
      fill: "none",
      stroke: outline.stroke,
      strokeWidth: outline.strokeWidth
    });
  }

  // Tootltip
  svg.append("g").attr("id", "info").attr("class", "info");

  // build
  return Object.assign(svg.node(), {});
}
