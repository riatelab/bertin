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
import { getheight } from "./height.js";
import { figuration } from "./figuration.js";
import { getcenters } from "./centroids.js";
import { shadow } from "./shadow.js";
import { addscalebar } from "./scalebar.js";

//import { plotHeader, plotFooter, plotGraticule, plotOutline, getHeight} from "./helpers/layout.js";

export function plot({ params = {}, layers = {} } = {}) {
  // default global paramaters

  let projection = params.projection ? params.projection : d3.geoPatterson();
  let width = params.width ? params.width : 1000;
  let extent = params.extent ? params.extent : null;
  let background = params.background;

  // optimal heights
  let height = getheight(layers, extent, projection, width);
  let heightHeader = 0;
  let header = layers.find((d) => d.type == "header");
  if (header) {
    if (header.text) {
      heightHeader = 20;
    }
    if (header.fontsize) {
      heightHeader = header.fontsize;
    }
  }
  let heightFooter = 0;
  let footer = layers.find((d) => d.type == "footer");
  if (footer) {
    if (footer.text) {
      heightFooter = 20;
    }
    if (footer.fontsize) {
      heightFooter = footer.fontsize;
    }
  }

  // svg document
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height + heightHeader + heightFooter)
    .attr("viewBox", [
      0,
      -heightHeader,
      width,
      height + heightHeader + heightFooter
    ])
    .attr(
      "style",
      `max-width: 100%; height: auto; height: intrinsic; background-color: white;`
    );

  // defs
  let defs = svg.append("defs");

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

  // clipPath
  // svg
  //   .append("clipPath")
  //   .attr("id", "clip")
  //   .append("rect")
  //   .attr("x", 0)
  //   .attr("y", 0)
  //   .attr("width", width)
  //   .attr("height", height);

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
      addgraticule(svg, projection, {
        stroke: layer.stroke,
        strokewidth: layer.strokewidth,
        strokeopacity: layer.strokeopacity,
        strokedasharray: layer.strokedasharray,
        step: layer.step
      });
    }

    // simple layers
    if (layer.type == "layer") {
      layersimple(svg, projection, layer.geojson, {
        fill: layer.fill,
        stroke: layer.stroke,
        strokewidth: layer.strokewidth,
        fillopacity: layer.fillopacity,
        tooltip: layer.tooltip
      });
    }

    // missing
    if (layer.type == "missing") {
      layermissing(svg, projection, {
        geojson: layer.geojson,
        id_geojson: layer.id_geojson,
        data: layer.data,
        id_data: layer.id_data,
        var_data: layer.var_data,
        fill: layer.fill,
        stroke: layer.stroke,
        strokewidth: layer.strokewidth,
        fillopacity: layer.fillopacity
      });
    }

    // shadow
    if (layer.type == "shadow") {
      shadow(svg, projection, layer.geojson, defs, {
        col: layer.col,
        dx: layer.dx,
        dy: layer.dy,
        opacity: layer.opacity,
        stdDeviation: layer.stdDeviation
      });
    }

    // prop layers
    if (layer.type == "prop") {
      layerprop(svg, projection, {
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
        tooltip: layer.tooltip
      });
    }

    // Header
    if (layer.type == "header") {
      addheader(svg, width, {
        fontsize: layer.fontsize,
        text: layer.text,
        fill: layer.fill
      });
    }

    // Footer
    if (layer.type == "footer") {
      addfooter(svg, width, height, {
        fontsize: layer.fontsize,
        text: layer.text,
        fill: layer.fill
      });
    }
  });

  // -----------------------------------------

  // Scalebar
  let scalebar = layers.find((d) => d.type == "scalebar");
  if (scalebar) {
    addscalebar(svg, projection, width, height, {
      dist: scalebar.dist,
      x: scalebar.x,
      y: scalebar.y
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
