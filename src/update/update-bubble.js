import { legcircles } from "../legend/leg-circles.js";
import { getattr } from "../helpers/getattr.js";
import { legends } from "../legend/legends.js";
import { simulation_circles } from "../helpers/simulation-circles.js";
import { colorize } from "../helpers/colorize.js";
import { thickness } from "../helpers/thickness.js";
import { scaleSqrt } from "d3-scale";
import { min, max } from "d3-array";
const d3 = Object.assign({}, { min, max, scaleSqrt });

export function update_bubble({
  svg,
  id = null,
  attr = null,
  value = null,
  legend = null,
  projection,
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
  svg.select(`g.${id}`).attr("data-layer", JSON.stringify(datalayer));

  // DORLING
  if (attr == "dorling") {
    let radius = d3.scaleSqrt([0, datalayer.valmax], [0, datalayer.k]);

    let features = node.selectAll("circle").data();

    if (value) {
      const simulation = simulation_circles(
        features,
        datalayer.values,
        datalayer.strokeWidth,
        radius,
        projection
      );

      for (let i = 0; i < datalayer.iteration; i++) {
        simulation.tick();
      }

      node
        .selectAll("circle")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);
    } else {
      node
        .selectAll("circle")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("cx", (d) => projection(d.geometry.coordinates)[0])
        .attr("cy", (d) => projection(d.geometry.coordinates)[1]);
    }
  }

  // VALUES
  else if (attr == "values") {
    let array = node
      .selectAll("circle")
      .data()
      .map((d) => +d.properties[value]);

    datalayer["valmax"] =
      datalayer["fixmax"] != undefined ? datalayer["fixmax"] : d3.max(array);

    let radius = d3.scaleSqrt([0, datalayer.valmax], [0, datalayer.k]);
    datalayer["legval"] = [
      d3.min(array),
      radius.invert(radius(d3.max(array)) / 3),
      radius.invert(radius(d3.max(array)) / 1.5),
      d3.max(array),
    ];

    svg.select(`g.${id}`).attr("data-layer", JSON.stringify(datalayer));

    if (datalayer.dorling == true) {
      let features = node.selectAll("circle").data();

      const simulation = simulation_circles(
        features,
        datalayer.values,
        datalayer.strokeWidth,
        radius,
        projection
      );

      for (let i = 0; i < datalayer.iteration; i++) {
        simulation.tick();
      }

      node
        .selectAll("circle")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => radius(Math.abs(d.properties[datalayer.values])));
    } else {
      node
        .selectAll("circle")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("r", (d) => radius(Math.abs(d.properties[datalayer.values])));
    }
    svg.select(`g.legcircle_${id}`).remove();

    legcircles(
      svg,
      id,
      {
        x: datalayer.leg_x,
        y: datalayer.leg_y,
        round:
          datalayer.leg_round !== undefined ? datalayer.leg_round : undefined,
        divisor: datalayer.leg_divisor,
        k: datalayer.k,
        fixmax: datalayer.fixmax,
        stroke: datalayer.leg_stroke,
        fill: datalayer.leg_fill,
        strokeWidth: datalayer.leg_strokeWidth,
        txtcol: datalayer.leg_txtcol,
        title: datalayer.leg_title,
        fontSize: datalayer.leg_fontSize,
        fontSize2: datalayer.leg_fontSize2,
        title: legend
          ? legend
          : datalayer.leg_title
          ? datalayer.leg_title
          : datalayer.values,
        values: datalayer.legval,
      },
      delay + duration / 2,
      duration / 2
    );
  }

  // K (size of circles)
  else if (attr == "k") {
    let radius = d3.scaleSqrt([0, datalayer.valmax], [0, datalayer.k]);

    // If dorling

    if (datalayer.dorling == true) {
      let features = node.selectAll("circle").data();

      const simulation = simulation_circles(
        features,
        datalayer.values,
        datalayer.strokeWidth,
        radius,
        projection
      );

      for (let i = 0; i < datalayer.iteration; i++) {
        simulation.tick();
      }

      node
        .selectAll("circle")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => radius(Math.abs(d.properties[datalayer.values])));
    } else {
      node
        .selectAll("circle")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("r", (d) => radius(Math.abs(d.properties[datalayer.values])));
    }

    svg.selectAll(`g.legcircle_${id}`).remove();

    legcircles(
      svg,
      id,
      {
        x: datalayer.leg_x,
        y: datalayer.leg_y,
        round:
          datalayer.leg_round !== undefined ? datalayer.leg_round : undefined,
        divisor: datalayer.leg_divisor,
        k: value,
        fixmax: datalayer.fixmax,
        stroke: datalayer.leg_stroke,
        fill: datalayer.leg_fill,
        strokeWidth: datalayer.leg_strokeWidth,
        txtcol: datalayer.leg_txtcol,
        title: datalayer.leg_title,
        fontSize: datalayer.leg_fontSize,
        fontSize2: datalayer.leg_fontSize2,
        title: legend
          ? legend
          : datalayer.leg_title
          ? datalayer.leg_title
          : datalayer.values,
        values: datalayer.legval,
      },
      delay + duration / 2,
      duration / 2
    );
  }

  // FILL OR STROKE
  else if (attr == "fill" || attr == "stroke") {
    svg.selectAll(`g.legbox${attr}_${id}`).remove();

    switch (typeof value) {
      case "string":
        node
          .selectAll("circle")
          .transition()
          .delay(delay)
          .duration(duration)
          .style(attr, value);
        break;
      case "object":
        node
          .selectAll("circle")
          .transition()
          .delay(delay)
          .duration(duration)
          .style(attr, (d) =>
            colorize(node.selectAll("circle").data(), value).getcol(
              d.properties[value.values]
            )
          );

        if (typeof value == "object") {
          legends(
            {
              type: "FeatureCollection",
              features: node.selectAll("circle").data(),
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

    if (datalayer.dorling == true) {
      let features = node.selectAll("circle").data();

      const simulation = simulation_circles(
        features,
        datalayer.values,
        datalayer.strokeWidth,
        d3.scaleSqrt([0, datalayer.valmax], [0, datalayer.k]),
        projection
      );

      for (let i = 0; i < datalayer.iteration; i++) {
        simulation.tick();
      }

      node
        .selectAll("circle")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .style("stroke-width", (d) =>
          thickness(node.selectAll("circle").data(), value).getthickness(
            d.properties[value.values] || undefined
          )
        )
        .attr("stroke-width", (d) =>
          thickness(node.selectAll("circle").data(), value).getthickness(
            d.properties[value.values] || undefined
          )
        );
    } else {
      node
        .selectAll("circle")
        .transition()
        .delay(delay)
        .duration(duration)
        .style("stroke-width", (d) =>
          thickness(node.selectAll("circle").data(), value).getthickness(
            d.properties[value.values] || undefined
          )
        )
        .attr("stroke-width", (d) =>
          thickness(node.selectAll("circle").data(), value).getthickness(
            d.properties[value.values] || undefined
          )
        );
    }

    if (typeof value == "object") {
      legends(
        {
          type: "FeatureCollection",
          features: node.selectAll("circle").data(),
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
      .selectAll("circle")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr(getattr(attr), value)
      .style(getattr(attr), value);
  }
}
