import { getattr } from "../helpers/getattr.js";
import { legends } from "../legend/legends.js";
import { colorize } from "../helpers/colorize.js";
import { thickness } from "../helpers/thickness.js";
import { legspikes } from "../legend/leg-spikes.js";
import { scaleLinear } from "d3-scale";
import { min, max } from "d3-array";
const d3 = Object.assign({}, { min, max, scaleLinear });

export function update_spikes({
  svg,
  id = null,
  attr = null,
  value = null,
  projection,
  legend = null,
  duration = 0,
  delay = 0,
} = {}) {
  let node = svg.select(`g.${id}`);
  let datalayer = JSON.parse(node.attr("data-layer"));
  value =
    typeof value == "object" && typeof datalayer[attr] == "object"
      ? { ...datalayer[attr], ...value }
      : value;
  datalayer[attr] = value;
  if (legend) {
    datalayer.leg.leg_title = legend;
  }
  svg.select(`g.${id}`).attr("data-layer", JSON.stringify(datalayer));

  // VALUES
  if (attr == "values") {
    let features = node.selectAll("path").data();

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(features.map((d) => +d.properties[value]))])
      .range([0, datalayer.k]);

    const array = features
      .filter((d) => d.properties[value] != "")
      .map((d) => +d.properties[value]);

    const legval = [
      d3.min(array),
      yScale.invert(datalayer.k / 3),
      yScale.invert(datalayer.k / 1.5),
      d3.max(array),
    ];

    datalayer.leg.legval = legval;
    svg.select(`g.${id}`).attr("data-layer", JSON.stringify(datalayer));

    node
      .selectAll("path")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr(
        "d",
        (d) =>
          `M ${projection(d.geometry.coordinates)[0] - datalayer.w / 2}, ${
            projection(d.geometry.coordinates)[1]
          } ${projection(d.geometry.coordinates)[0]}, ${
            projection(d.geometry.coordinates)[1] -
            yScale(d.properties[datalayer.values])
          } ${projection(d.geometry.coordinates)[0] + datalayer.w / 2}, ${
            projection(d.geometry.coordinates)[1]
          }`
      );

    svg.select(`g.legspike_${id}`).remove();

    legspikes(svg, datalayer.leg, id, delay + duration / 2, duration / 2);
  }

  // K
  else if (attr == "k") {
    datalayer.leg[attr] = value;
    svg.select(`g.${id}`).attr("data-layer", JSON.stringify(datalayer));

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(
          node
            .selectAll("path")
            .data()
            .map((d) => +d.properties[datalayer.values])
        ),
      ])
      .range([0, value]);

    node
      .selectAll("path")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr(
        "d",
        (d) =>
          `M ${projection(d.geometry.coordinates)[0] - datalayer.w / 2}, ${
            projection(d.geometry.coordinates)[1]
          } ${projection(d.geometry.coordinates)[0]}, ${
            projection(d.geometry.coordinates)[1] -
            yScale(d.properties[datalayer.values])
          } ${projection(d.geometry.coordinates)[0] + datalayer.w / 2}, ${
            projection(d.geometry.coordinates)[1]
          }`
      );

    svg.select(`g.legspike_${id}`).remove();
    legspikes(svg, datalayer.leg, id, delay + duration / 2, duration / 2);
  }

  // FILL OR STROKE
  else if (attr == "fill" || attr == "stroke") {
    svg.selectAll(`g.legbox${attr}_${id}`).remove();

    switch (typeof value) {
      case "string":
        node
          .selectAll("path")
          .transition()
          .delay(delay)
          .duration(duration)
          .style(attr, value);
        break;
      case "object":
        node
          .selectAll("path")
          .transition()
          .delay(delay)
          .duration(duration)
          .style(attr, (d) =>
            colorize(node.selectAll("path").data(), value).getcol(
              d.properties[value.values]
            )
          );

        if (typeof value == "object") {
          legends(
            {
              type: "FeatureCollection",
              features: node.selectAll("path").data(),
            },
            svg,
            attr == "fill" ? value : undefined,
            attr == "stroke" ? value : undefined,
            undefined,
            id,
            delay,
            duration
          );
        }

        break;
    }
  }
  // STROKEWIDTH
  else if (attr == "strokeWidth") {
    svg.selectAll(`g.legthickness_${id}`).remove();

    node
      .selectAll("path")
      .transition()
      .delay(delay)
      .duration(duration)
      .style("stroke-width", (d) =>
        thickness(node.selectAll("path").data(), value).getthickness(
          d.properties[value.values] || undefined
        )
      )
      .attr("stroke-width", (d) =>
        thickness(node.selectAll("path").data(), value).getthickness(
          d.properties[value.values] || undefined
        )
      );

    if (typeof value == "object") {
      legends(
        {
          type: "FeatureCollection",
          features: node.selectAll("path").data(),
        },
        svg,
        undefined,
        undefined,
        value,
        id,
        delay,
        duration
      );
    }
  }

  // OTHER
  else {
    node
      .selectAll("path")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr(getattr(attr), value)
      .style(getattr(attr), value);
  }
}
