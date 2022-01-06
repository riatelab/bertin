// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
import * as d3array from "d3-array";
import * as d3scale from "d3-scale";
import {addtooltip } from "./tooltip.js";
import {legcircles } from "./leg-circles.js";

const d3 = Object.assign({}, d3selection, d3array, d3scale, d3geo, d3geoprojection);
import {getcenters } from "./centroids.js";

export function layermashroom(selection, projection, clipid, options = {}) {
  let geojson = options.geojson;
  let data = options.data;
  let id_geojson = options.id_geojson;
  let id_data = options.id_data;
  let top_var = options.top_var;
  let top_fill = options.top_fill ? options.top_fill : "#d64f4f";
  let bottom_var = options.bottom_var;
  let bottom_fill = options.bottom_fill ? options.bottom_fill : "#4fabd6";
  let k = options.k ? options.k : 50;
  let stroke = options.stroke ? options.stroke : "white";
  let strokewidth = options.strokewidth ? options.strokewidth : 0.5;
  let fillopacity = options.fillopacity ? options.fillopacity : 1;
  let top_tooltip = options.top_tooltip ? options.top_tooltip : "";
  let bottom_tooltip = options.bottom_tooltip ? options.bottom_tooltip : "";

  let leg_x = options.leg_x ? options.leg_x : null;
  let leg_y = options.leg_y ? options.leg_y : null;
  let leg_fontsize = options.leg_fontsize ? options.leg_fontsize : 14;
  let leg_fontsize2 = options.leg_fontsize2 ? options.leg_fontsize2 : 10;
  let leg_round = options.leg_round ? options.leg_round : undefined;
  let leg_txtcol = options.leg_txtcol ? options.leg_txtcol : "#363636";
  let leg_title = options.leg_title ? options.leg_title : `Title, year`;
  let leg_top_txt = options.leg_top_txt ? options.leg_top_txt : top_var;
  let leg_bottom_txt = options.leg_bottom_txt
    ? options.leg_bottom_txt
    : bottom_var;

  let leg_top_fill = options.leg_top_fill ? options.leg_top_fill : top_fill;
  let leg_bottom_fill = options.leg_bottom_fill
    ? options.leg_bottom_fill
    : bottom_fill;
  let leg_stroke = options.leg_stroke ? options.leg_stroke : leg_txtcol;
  let leg_strokewidth = options.leg_strokewidth ? options.leg_strokewidth : 0.8;
  let coords = getcenters(geojson, id_geojson, projection, true);

  const max_top = d3.max(data, (d) => +d[top_var]);
  const max_bottom = d3.max(data, (d) => +d[bottom_var]);
  let radius = d3.scaleSqrt([0, Math.max(max_top, max_bottom)], [0, k]);

  data = data
    .sort((a, b) => d3.descending(+a[top_var], +b[top_var]))
    .filter((d) => coords.get(d[id_data]) != undefined);

  for (let i = 0; i < data.length; i++) {
    const centers = coords.get(data[i][id_data]);
    const r_top = radius(data[i][top_var]);
    const r_bottom = radius(data[i][bottom_var]);
    const r_max = Math.max(r_top, r_bottom);

    // TOP

    selection
      .append("circle")
      .attr("cx", centers[0])
      .attr("cy", centers[1])
      .attr("r", r_top)
      .style("fill", top_fill)
      .attr("stroke", stroke)
      .attr("stroke-width", strokewidth)
      .attr("clip-path", "url(#top-clip_" + clipid + i + ")")
      .on("touchmove mousemove", function (event) {
        if (top_tooltip != "") {
          if (Array.isArray(top_tooltip)) {
            selection
              .select("#info")
              .call(
                addtooltip,
                `${data[i][top_tooltip[0]]}\n${data[i][top_tooltip[1]]}\n${
                  top_tooltip[2]
                }`
              );
          }
          //else {
          //   selection.select("#info").call(addtooltip, `${d[tooltip]}`);
          // }
        }
        if (top_tooltip != "") {
          selection
            .select("#info")
            .attr("transform", `translate(${d3.pointer(event, this)})`);
          d3.select(this)
            .attr("stroke-width", strokewidth + 0.5)
            .attr("fill-opacity", fillopacity - 0.3);
        }
      })
      .on("touchend mouseleave", function () {
        selection.select("#info").call(addtooltip, null);
        d3.select(this)
          .attr("stroke-width", strokewidth)
          .attr("fill-opacity", fillopacity);
      });

    selection
      .append("clipPath")
      .attr("id", "top-clip_" + clipid + i)
      .append("rect")
      .attr("x", centers[0] - r_top - strokewidth)
      .attr("y", centers[1] + -r_top - strokewidth)
      .attr("height", r_top + strokewidth)
      .attr("width", r_top * 2 + strokewidth * 2);

    // BOTTOM

    selection
      .append("circle")
      .attr("cx", centers[0])
      .attr("cy", centers[1])
      .attr("r", r_bottom)
      .style("fill", bottom_fill)
      .attr("stroke", stroke)
      .attr("stroke-width", strokewidth)
      .attr("clip-path", "url(#bottom-clip_" + clipid + i + ")")
      .on("touchmove mousemove", function (event) {
        if (bottom_tooltip != "") {
          if (Array.isArray(bottom_tooltip)) {
            selection
              .select("#info")
              .call(
                addtooltip,
                `${data[i][bottom_tooltip[0]]}\n${
                  data[i][bottom_tooltip[1]]
                }\n${bottom_tooltip[2]}`
              );
          }
          //else {
          //   selection.select("#info").call(addtooltip, `${d[tooltip]}`);
          // }
        }
        if (bottom_tooltip != "") {
          selection
            .select("#info")
            .attr("transform", `translate(${d3.pointer(event, this)})`);
          d3.select(this)
            .attr("stroke-width", strokewidth + 0.5)
            .attr("fill-opacity", fillopacity - 0.3);
        }
      })
      .on("touchend mouseleave", function () {
        selection.select("#info").call(addtooltip, null);
        d3.select(this)
          .attr("stroke-width", strokewidth)
          .attr("fill-opacity", fillopacity);
      });

    selection
      .append("clipPath")
      .attr("id", "bottom-clip_" + clipid + i)
      .append("rect")
      .attr("x", centers[0] - r_bottom - strokewidth)
      .attr("y", centers[1])
      .attr("height", r_bottom + strokewidth)
      .attr("width", r_bottom * 2 + strokewidth * 2)
      .attr("fill", "none")
      .attr("stroke", "red");

    selection
      .append("line")
      .attr("x1", centers[0] - r_max)
      .attr("x2", centers[0] + r_max)
      .attr("y1", centers[1])
      .attr("y2", centers[1])
      .attr("stroke", stroke)
      .attr("stroke-width", strokewidth);
  }

  // Legend

  if (leg_x != null && leg_y != null) {
    const span = 30;
    const span2 = 3;
    const radiusmax = radius(Math.max(+max_top, +max_bottom));

    // Leg top

    let legtop = selection.append("g");
    const top_rmax = radius(d3.max(data, (d) => +d[top_var]));
    let top_array = data.map((d) => +d[top_var]);
    let top_values = [
      radius.invert(top_rmax / 3),
      radius.invert(top_rmax / 1.5),
      d3.max(top_array)
    ];

    legtop
      .selectAll("circle")
      .data(top_values.sort(d3.descending))
      .join("circle")
      .attr("cx", leg_x + radiusmax)
      .attr(
        "cy",
        leg_y + top_rmax + (leg_title.split("\n").length + 1) * leg_fontsize
      )
      .attr("r", (d) => radius(d))
      .attr("fill", leg_top_fill)
      .attr("stroke", leg_stroke)
      .attr("stroke-width", leg_strokewidth)
      .attr("clip-path", "url(#legtop-clip_" + clipid + ")");

    legtop
      .append("clipPath")
      .attr("id", "legtop-clip_" + clipid)
      .append("rect")
      .attr("x", leg_x - leg_strokewidth + radiusmax - top_rmax)
      .attr(
        "y",
        leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize -
          leg_strokewidth
      )
      .attr("height", top_rmax + leg_strokewidth)
      .attr("width", top_rmax * 2 + leg_strokewidth * 2);

    legtop
      .selectAll("line")
      .data(top_values)
      .join("line")
      .attr("x1", leg_x + radiusmax)
      .attr(
        "y1",
        (d) =>
          // leg_y +
          // radiusmax * 2 -
          // radius(d) * 2 +
          // (leg_title.split("\n").length + 1) * leg_fontsize
          leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          top_rmax -
          radius(d)
      )
      .attr("x2", leg_x + radiusmax * 2 + leg_fontsize)
      .attr(
        "y2",
        (d) =>
          leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          top_rmax -
          radius(d)
      )
      .attr("stroke", leg_stroke)
      .attr("stroke-width", leg_strokewidth)
      .attr("stroke-dasharray", 2);

    // top values

    legtop
      .selectAll("text")
      .data(top_values)
      .join("text")
      .attr("x", leg_x + radiusmax * 2 + leg_fontsize + leg_fontsize2 / 2)
      .attr(
        "y",
        (d) =>
          leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          top_rmax -
          radius(d)
      )
      .attr("font-size", leg_fontsize2)
      .attr("alignment-baseline", "central")
      .attr("fill", leg_txtcol)
      .text((d) =>
        leg_round !== undefined || leg_round !== 0 ? d.toFixed(leg_round) : d
      );

    // leg bottom
    let legbottom = selection.append("g");

    const bottom_rmax = radius(d3.max(data, (d) => +d[bottom_var]));
    let bottom_array = data.map((d) => +d[bottom_var]);
    let bottom_values = [
      radius.invert(bottom_rmax / 3),
      radius.invert(bottom_rmax / 1.5),
      d3.max(bottom_array)
    ];

    legbottom
      .selectAll("circle")
      .data(bottom_values.sort(d3.descending))
      .join("circle")
      .attr("cx", leg_x + radiusmax)
      .attr(
        "cy",
        leg_y +
          top_rmax +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          span
      )
      .attr("r", (d) => radius(d))
      .attr("fill", leg_bottom_fill)
      .attr("stroke", leg_stroke)
      .attr("stroke-width", leg_strokewidth)
      .attr("clip-path", "url(#legbottom-clip_" + clipid + ")");

    legbottom
      .append("clipPath")
      .attr("id", "legbottom-clip_" + clipid)
      .append("rect")
      .attr("x", leg_x - leg_strokewidth + radiusmax - bottom_rmax)
      .attr(
        "y",
        leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          span +
          top_rmax
      )
      .attr("height", bottom_rmax + leg_strokewidth)
      .attr("width", bottom_rmax * 2 + leg_strokewidth * 2);

    legbottom
      .selectAll("line")
      .data(bottom_values)
      .join("line")
      .attr("x1", leg_x + radiusmax)
      .attr(
        "y1",
        (d) =>
          leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          top_rmax +
          span +
          radius(d)
      )
      .attr("x2", leg_x + radiusmax * 2 + leg_fontsize)
      .attr(
        "y2",
        (d) =>
          leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          top_rmax +
          span +
          radius(d)
      )
      .attr("stroke", leg_stroke)
      .attr("stroke-width", leg_strokewidth)
      .attr("stroke-dasharray", 2);

    // bottom values

    legbottom
      .selectAll("text")
      .data(bottom_values)
      .join("text")
      .attr("x", leg_x + radiusmax * 2 + leg_fontsize + leg_fontsize2 / 2)
      .attr(
        "y",
        (d) =>
          leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          top_rmax +
          span +
          radius(d)
      )
      .attr("font-size", leg_fontsize2)
      .attr("alignment-baseline", "central")
      .attr("fill", leg_txtcol)
      .text((d) =>
        leg_round !== undefined || leg_round !== 0 ? d.toFixed(leg_round) : d
      );

    // leg title
    let leg = selection.append("g");

    leg
      .append("line")
      .attr("x1", leg_x + radiusmax - top_rmax)
      .attr("x2", leg_x + radiusmax + top_rmax)
      .attr(
        "y1",
        leg_y + (leg_title.split("\n").length + 1) * leg_fontsize + top_rmax
      )
      .attr(
        "y2",
        leg_y + (leg_title.split("\n").length + 1) * leg_fontsize + top_rmax
      )
      .attr("stroke", leg_txtcol)
      .attr("stroke-width", leg_strokewidth);

    leg
      .append("line")
      .attr("x1", leg_x + radiusmax - bottom_rmax)
      .attr("x2", leg_x + radiusmax + bottom_rmax)
      .attr(
        "y1",
        leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          top_rmax +
          span
      )
      .attr(
        "y2",
        leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          top_rmax +
          span
      )
      .attr("stroke", leg_txtcol)
      .attr("stroke-width", leg_strokewidth);

    leg
      .append("g")
      .selectAll("text")
      .data(leg_title.split("\n"))
      .join("text")
      .attr("x", leg_x)
      .attr("y", leg_y)
      .attr("font-size", `${leg_fontsize}px`)
      .attr("dy", (d, i) => i * leg_fontsize)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "hanging")
      .attr("fill", leg_txtcol)
      .text((d) => d);

    leg
      .append("text")
      .attr("x", leg_x + radiusmax)
      .attr(
        "y",
        leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          top_rmax +
          span2
      )
      .text(leg_top_txt)
      .attr("fill", leg_txtcol)
      .attr("font-size", `${leg_fontsize2}px`)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "hanging");

    leg
      .append("text")
      .attr("x", leg_x + radiusmax)
      .attr(
        "y",
        leg_y +
          (leg_title.split("\n").length + 1) * leg_fontsize +
          top_rmax +
          span -
          span2
      )
      .text(leg_bottom_txt)
      .attr("fill", leg_txtcol)
      .attr("font-size", `${leg_fontsize2}px`)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "baseline");
  }
}
