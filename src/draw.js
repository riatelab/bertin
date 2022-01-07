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
import { layertypo } from "./layer-typo.js";
import { layerchoro } from "./layer-choro.js";
import {layermashroom} from "./layer-mashroom.js";
import { layermissing } from "./layer-missing.js";
import { getheight } from "./height.js";
import { figuration } from "./figuration.js";
import { getcenters } from "./centroids.js";
import { shadow } from "./shadow.js";
import { addscalebar } from "./scalebar.js";
import { addtext } from "./text.js";

//import { plotHeader, plotFooter, plotGraticule, plotOutline, getHeight} from "./helpers/layout.js";

export function draw({ params = {}, layers = {} } = {}) {
  // default global paramaters

  let projection = params.projection ? params.projection : d3.geoPatterson();
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
    if (header.fontsize) {
      headerdelta = header.fontsize * header.text.split("\n").length + 10;
    }
  }
  let footerdelta = 0;
  let footer = layers.find((d) => d.type == "footer");
  if (footer) {
    if (footer.text) {
      footerdelta = 10 * footer.text.split("\n").length + 10;
    }
    if (footer.fontsize) {
      footerdelta = footer.fontsize * footer.text.split("\n").length + 10;
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
      stroke: "none",
      strokewidth: "none"
    });
  }

  // ----------------------------------------
  layers.reverse().forEach((layer) => {
    // Graticule
    if (layer.type == "graticule") {
      addgraticule(svg, projection, clipid, {
        stroke: layer.stroke,
        strokewidth: layer.strokewidth,
        strokeopacity: layer.strokeopacity,
        strokedasharray: layer.strokedasharray,
        step: layer.step
      });
    }

    // simple layers
    if (layer.type == "layer") {
      layersimple(svg, projection, clipid, layer.geojson, {
        fill: layer.fill,
        stroke: layer.stroke,
        strokewidth: layer.strokewidth,
        fillopacity: layer.fillopacity,
        tooltip: layer.tooltip,
        leg_x: layer.leg_x,
        leg_y: layer.leg_y,
        leg_w: layer.leg_w,
        leg_h: layer.leg_h,
        leg_title: layer.leg_title,
        leg_text: layer.leg_text,
        leg_fontsize: layer.leg_fontsize,
        leg_fontsize2: layer.leg_fontsize2,
        leg_stroke: layer.leg_stroke,
        leg_fillopacity: layer.leg_fillopacity,
        leg_fill: layer.leg_fill,
        leg_strokewidth: layer.leg_strokewidth,
        leg_txtcol: layer.leg_txtcol
      });
    }

    // typo layers
if (layer.type == "typo") {
  layertypo(svg, projection, clipid,  {
    geojson: layer.geojson,
    data: layer.data,
    id_geojson: layer.id_geojson,
    id_data: layer.id_data,
    var_data: layer.var_data,
    colors: layer.colors,
    pal: layer.pal,
    col_missing: layer.col_missing,
    stroke: layer.stroke,
    strokewidth: layer.strokewidth,
    fillopacity: layer.fillopacity,
    tooltip: layer.tooltip,
    leg_x: layer.leg_x,
    leg_y: layer.leg_y,
    leg_title: layer.leg_title,
    leg_fontsize: layer.leg_fontsize,
    leg_fontsize2: layer.leg_fontsize2,
    leg_stroke: layer.leg_stroke,
    leg_fillopacity: layer.leg_fillopacity,
    leg_strokewidth: layer.leg_strokewidth,
    leg_txtcol: layer.leg_txtcol

  });
}


// typo layers
if (layer.type == "mashroom") {
layermashroom(svg, projection, clipid,  {
    geojson:layer.geojson,
    data:layer.data,
    id_geojson:layer.id_geojson,
    id_data:layer.id_data,
    top_var:layer.top_var,
    top_fill:layer.top_fill,
    bottom_var:layer.bottom_var,
    bottom_fill:layer.bottom_fill,
    k:layer.k,
    stroke:layer.stroke,
    strokewidth:layer.strokewidth,
    fillopacity:layer.fillopacity,
    top_tooltip:layer.top_tooltip,
    bottom_tooltip:layer.bottom_tooltip,
    leg_x:layer.leg_x,
    leg_y:layer.leg_y,
    leg_fontsize:layer.leg_fontsize,
    leg_fontsize2:layer.leg_fontsize2,
    leg_round:layer.leg_round,
    leg_txtcol:layer.leg_txtcol,
    leg_title:layer.leg_title,
    leg_top_txt:layer.leg_top_txt,
    leg_bottom_txt:layer.leg_bottom_txt,
    leg_top_fill:layer.leg_top_fill,
    leg_bottom_fill:layer.leg_bottom_fill,
    leg_stroke:layer.leg_stroke,
    leg_strokewidth:layer.leg_strokewidth
});
}

// choro layers
if (layer.type == "choro") {
  layerchoro(svg, projection, clipid, {
    geojson: layer.geojson,
    data: layer.data,
    id_geojson: layer.id_geojson,
    id_data: layer.id_data,
    var_data: layer.var_data,
    pal: layer.pal,
    nbreaks: layer.nbreaks,
    breaks: layer.breaks,
    colors: layer.colors,
    method: layer.method,
    col_missing: layer.col_missing,
    stroke: layer.stroke,
    strokewidth: layer.strokewidth,
    fillopacity: layer.fillopacity,
    tooltip: layer.tooltip,
    leg_x: layer.leg_x,
    leg_y: layer.leg_y,
    leg_w: layer.leg_w,
    leg_h: layer.leg_h,
    leg_title: layer.leg_title,
    leg_text: layer.leg_text,
    leg_fontsize: layer.leg_fontsize,
    leg_fontsize2: layer.leg_fontsize2,
    leg_stroke: layer.leg_stroke,
    leg_fillopacity: layer.leg_fillopacity,
    leg_fill: layer.leg_fill,
    leg_strokewidth: layer.leg_strokewidth,
    leg_txtcol: layer.leg_txtcol,
    leg_round: layer.leg_round

  });
}


    // text note
if (layer.type == "text") {
  addtext(svg, width, height, {
    position: layer.position,
    text: layer.text,
    fill: layer.fill,
    stroke: layer.stroke,
    fontsize: layer.fontsize,
    margin: layer.margin,
    anchor: layer.anchor, // start, middle, end
    baseline: layer.baseline, // baseline, middle, hanging
    frame_fill: layer.frame_fill,
    frame_stroke: layer.frame_stroke,
    frame_opacity: layer.frame_opacity,
    frame_strokewidth: layer.frame_strokewidth
  });
}


    // missing
    if (layer.type == "missing") {
      layermissing(svg, projection, clipid, {
        geojson: layer.geojson,
        id_geojson: layer.id_geojson,
        data: layer.data,
        id_data: layer.id_data,
        var_data: layer.var_data,
        fill: layer.fill,
        stroke: layer.stroke,
        strokewidth: layer.strokewidth,
        fillopacity: layer.fillopacity,
        leg_x: layer.leg_x,
        leg_y: layer.leg_y,
        leg_w: layer.leg_w,
        leg_h: layer.leg_h,
        leg_text: layer.leg_text,
        leg_fontsize: layer.leg_fontsize,
        leg_stroke: layer.leg_stroke,
        leg_fillopacity: layer.fillopacity,
        leg_fill: layer.fill,
        leg_strokewidth: layer.leg_strokewidth,
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
        id_geojson: layer.id_geojson,
        data: layer.data,
        id_data: layer.id_data,
        var_data: layer.var_data,
        k: layer.k,
        fill: layer.fill,
        stroke: layer.stroke,
        strokewidth: layer.strokewidth,
        fillopacity: layer.fillopacity,
        tooltip: layer.tooltip,
        leg_x: layer.leg_x,
        leg_y: layer.leg_y,
        leg_stroke: layer.leg_stroke,
        leg_fill: layer.leg_fill,
        leg_strokewidth: layer.leg_strokewidth,
        leg_txtcol: layer.leg_txtcol,
        leg_title: layer.leg_title,
        leg_fontsize: layer.leg_fontsize,
        leg_fontsize2: layer.leg_fontsize2,
        leg_round: layer.leg_round
      });
    }

    // Header
    if (layer.type == "header") {
      addheader(svg, width, {
        fontsize: layer.fontsize,
        text: layer.text,
        fill: layer.fill,
        background: layer.background,
        backgroundopacity: layer.backgroundopacity,
        anchor: layer.anchor
      });
    }

    // Footer
    if (layer.type == "footer") {
      addfooter(svg, width, height, {
        fontsize: layer.fontsize,
        text: layer.text,
        fill: layer.fill,
        background: layer.background,
        backgroundopacity: layer.backgroundopacity,
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
      strokewidth: outline.strokewidth
    });
  }

  // Tootltip
 svg.append("g").attr("id", "info").attr("class", "info");

  // build
  return Object.assign(svg.node(), {});
}
