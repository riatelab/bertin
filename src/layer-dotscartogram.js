import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3array from "d3-array";
import * as d3force from "d3-force";
const d3 = Object.assign({}, d3selection, d3array, d3geo, d3force);
import {addtooltip } from "./tooltip.js";
import {legchoro } from "./leg-choro.js"
import {legtypo } from "./leg-typo.js";
import {poly2points } from "./poly2points.js";
import {figuration } from "./figuration.js";
import {chorotypo } from "./chorotypo.js";

export function dotscartogram(selection, projection, clipid, options = {}){
  let cols = [
    "#66c2a5",
    "#fc8d62",
    "#8da0cb",
    "#e78ac3",
    "#a6d854",
    "#ffd92f",
    "#e5c494",
    "#b3b3b3"
  ];

  let geojson = options.geojson;
  let values = options.values;
  let radius = options.radius ?? 4;
  let onedot = options.onedot ?? Math.round(d3.sum(geojson.features.map((d) => +d.properties[values])) / 500)
  let span = options.span ?? 0
  let fill = options.fill ?? cols[Math.floor(Math.random() * cols.length)];
  let stroke = options.stroke ?? "white";
  let strokeWidth = options.strokeWidth ?? 0.5;
  let fillOpacity = options.fillOpacity ?? 1;
  let tooltip = options.tooltip ?? "";
  let iteration = options.iteration ?? 200;

  let features;

  if (figuration(geojson) == "p") {
    features = geojson.features;
  } else {
    features = poly2points(geojson);
  }

  // Dissolve

  let dots = [];
  for (let i = 0; i <= features.length - 1; i++) {
    let nb = Math.round(+features[i].properties[values] / onedot);
    for (let j = 1; j <= nb; j++) {
      dots.push({ ...features[i] });
    }
  }

  // Simulation

    const simulation = d3
      .forceSimulation(dots)
      .force(
        "x",
        d3.forceX((d) => projection(d.geometry.coordinates)[0] )
      )
      .force(
        "y",
        d3.forceY((d) => projection(d.geometry.coordinates)[1])
      )
      .force(
        "collide",
        d3.forceCollide(radius + span + strokeWidth / 2)
      );

    for (let i = 0; i < iteration; i++) {
      simulation.tick();
    }

  // Draw

  selection
    .append("g")
    .selectAll("circle")
    .data(
      dots
        .filter((d) => d.geometry.coordinates != undefined)
        )
    .join("circle")
    .attr("fill", (d) =>
      chorotypo(dots, fill).getcol(d.properties[fill.values] || undefined)
    )
    .attr("stroke", (d) =>
      chorotypo(dots, stroke).getcol(
        d.properties[stroke.values] || undefined
      )
    )
    .attr("stroke-width", strokeWidth)
    .attr("fill-opacity", fillOpacity)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", radius)
    .on("touchmove mousemove", function (event, d) {
            if (tooltip != "") {
              if (Array.isArray(tooltip)) {
                selection
                  .select("#info")
                  .call(
                    addtooltip,
                    `${d.properties[tooltip[0]]}\n${d.properties[tooltip[1]]}\n${
                      tooltip[2]
                    }`
                  );
              } else {
                selection
                  .select("#info")
                  .call(addtooltip, `${d.properties[tooltip]}`);
              }
            }
            if (tooltip != "") {
              selection
                .select("#info")
                .attr("transform", `translate(${d3.pointer(event, this)})`);
              d3.select(this)
                .attr("stroke-width", strokeWidth + 0.5)
                .attr("fill-opacity", fillOpacity - 0.3);
            }
          })
          .on("touchend mouseleave", function () {
            selection.select("#info").call(addtooltip, null);
            d3.select(this)
              .attr("stroke-width", strokeWidth)
              .attr("fill-opacity", fillOpacity);
          });
}
