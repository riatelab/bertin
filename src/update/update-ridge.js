import { getattr } from "../helpers/getattr.js";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { geoPath } from "d3-geo";

const d3 = Object.assign(
  {},
  {
    geoPath,
    max,
    scaleLinear,
  }
);

export function update_ridge({
  svg,
  id = null,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  let node = svg.select(`g.${id}`);
  let datalayer = JSON.parse(node.attr("data-layer"));

  if (attr == "k") {
    let ycoords = Array.from(new Set(datalayer.mygrid.map((d) => d.y)));

    let scale = d3
      .scaleLinear()
      .domain([0, d3.max(datalayer.mygrid.map((d) => d.value))])
      .range([0, value]);

    let features = [];

    ycoords.forEach((y) => {
      let coords = [];
      datalayer.mygrid
        .filter((d) => d.y == y)
        .forEach((d) => coords.push([d.x, d.y - scale(d.value)]));

      let linetring = {
        type: "LineString",
        coordinates: coords,
      };

      features.push({
        type: "Feature",
        properties: { y },
        geometry: linetring,
      });
    });

    if (duration == 0 && delay == 0) {
      node
        .join(features)
        .selectAll("path")
        .data(features)
        .join("path")
        .attr("d", d3.geoPath());
    } else {
      node
        .join(features)
        .selectAll("path")
        .data(features)
        .join("path")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("d", d3.geoPath());
    }
  } else {
    node
      .selectAll("path")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr(getattr(attr), value)
      .style(getattr(attr), value);
  }
}
