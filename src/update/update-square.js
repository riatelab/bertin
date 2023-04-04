import { legsquares } from "../legend/leg-squares.js";
import { getattr } from "../helpers/getattr.js";
import { legends } from "../legend/legends.js";
import { simulation_squares } from "../helpers/simulation-squares.js";
import { colorize } from "../helpers/colorize.js";
import { thickness } from "../helpers/thickness.js";
import { scaleSqrt } from "d3-scale";
import { min, max } from "d3-array";
const d3 = Object.assign({}, { min, max, scaleSqrt });

export function update_square({
  svg,
  id = null,
  attr = null,
  value = null,
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
  svg.select(`g.${id}`).attr("data-layer", JSON.stringify(datalayer));

  // DORLING
  if (attr == "dorling" || attr == "demers") {
    if (value) {
      const simulation = simulation_squares(node.selectAll("rect").data());

      for (let i = 0; i < datalayer.iteration; i++) {
        simulation.tick();
      }

      node
        .selectAll("rect")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("x", (d) => d._x - d._size / 2)
        .attr("y", (d) => d._y - d._size / 2);
    } else {
      node
        .selectAll("rect")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("x", (d) => d.ctrx - d._size / 2)
        .attr("y", (d) => d.ctry - d._size / 2);
    }
  }

  // VALUES
  else if (attr == "values") {
    let array = node
      .selectAll("rect")
      .data()
      .map((d) => +d[value]);

    datalayer["valmax"] =
      datalayer["fixmax"] != undefined ? datalayer["fixmax"] : d3.max(array);

    let size = d3.scaleSqrt([0, datalayer.valmax], [0, datalayer.k * 1.77]);
    datalayer["legval"] = [
      d3.min(array),
      size.invert(size(d3.max(array)) / 3),
      size.invert(size(d3.max(array)) / 1.5),
      d3.max(array),
    ];

    node.attr("data-layer", JSON.stringify(datalayer));

    if (datalayer.dorling == true || datalayer.demers == true) {
      let data = node.selectAll("rect").data();

      data.forEach((d) => {
        d._size = size(Math.abs(d[datalayer.values]));
      });
      const simulation = simulation_squares(data);
      for (let i = 0; i < datalayer.iteration; i++) {
        simulation.tick();
      }

      node
        .selectAll("rect")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("x", (d) => d._x - size(Math.abs(d[datalayer.values])) / 2)
        .attr("y", (d) => d._y - size(Math.abs(d[datalayer.values])) / 2)
        .attr("width", (d) => size(Math.abs(d[datalayer.values])))
        .attr("height", (d) => size(Math.abs(d[datalayer.values])));
    } else {
      node
        .selectAll("rect")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("x", (d) => d.ctrx - size(Math.abs(d[datalayer.values])) / 2)
        .attr("y", (d) => d.ctry - size(Math.abs(d[datalayer.values])) / 2)
        .attr("width", (d) => size(Math.abs(d[datalayer.values])))
        .attr("height", (d) => size(Math.abs(d[datalayer.values])));
    }

    svg.select(`g.legsquare_${id}`).remove();

    legsquares(
      svg,
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
      id,
      delay + duration / 2,
      duration / 2
    );
  }

  // K (size of squares)
  else if (attr == "k") {
    let size = d3.scaleSqrt([0, datalayer.valmax], [0, datalayer.k * 1.77]);

    // If dorling

    if (datalayer.dorling == true || datalayer.demers == true) {
      let data = node.selectAll("rect").data();

      data.forEach((d) => {
        d._size = size(Math.abs(d[datalayer.values]));
        d.x = d.ctrx;
        d.y = d.ctry;
        d._x = d.ctrx;
        d._y = d.ctry;
      });
      const simulation = simulation_squares(data);
      for (let i = 0; i < datalayer.iteration; i++) {
        simulation.tick();
      }

      node
        .join(data)
        .selectAll("rect")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("x", (d) => d._x - size(Math.abs(d[datalayer.values])) / 2)
        .attr("y", (d) => d._y - size(Math.abs(d[datalayer.values])) / 2)
        .attr("width", (d) => size(Math.abs(d[datalayer.values])))
        .attr("height", (d) => size(Math.abs(d[datalayer.values])));
    } else {
      node
        .selectAll("rect")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("x", (d) => d.ctrx - size(Math.abs(d[datalayer.values])) / 2)
        .attr("y", (d) => d.ctry - size(Math.abs(d[datalayer.values])) / 2)
        .attr("width", (d) => size(Math.abs(d[datalayer.values])))
        .attr("height", (d) => size(Math.abs(d[datalayer.values])));
    }
    svg.select(`g.legsquare_${id}`).remove();

    legsquares(
      svg,
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
      id,
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
          .selectAll("rect")
          .transition()
          .delay(delay)
          .duration(duration)
          .style(attr, value);
        break;
      case "object":
        node
          .selectAll("rect")
          .transition()
          .delay(delay)
          .duration(duration)
          .style(attr, (d) =>
            colorize(node.selectAll("rect").data(), value).getcol(
              d[value.values]
            )
          );
        if (typeof value == "object") {
          legends(
            {
              type: "FeatureCollection",
              features: node.selectAll("rect").data(),
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
  // STROKEWIDTH (TODO)
  else if (attr == "strokeWidth") {
    svg.selectAll(`g.legthickness_${id}`).remove();

    let data = node.selectAll("rect").data();
    data.map((d) => (d.properties = { [value.values]: +d[value.values] }));
    let size = d3.scaleSqrt([0, datalayer.valmax], [0, datalayer.k * 1.77]);

    if (datalayer.dorling == true || datalayer.demers == true) {
      data.forEach((d) => {
        d.x = d.ctrx;
        d.y = d.ctry;
        d._x = d.ctrx;
        d._y = d.ctry;
        d._padding =
          thickness(data, value).getthickness(d.properties[value.values] || 0) /
            2 +
          0;
      });

      const simulation = simulation_squares(data);
      for (let i = 0; i < datalayer.iteration; i++) {
        simulation.tick();
      }

      node
        .join(data)
        .selectAll("rect")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("x", (d) => d._x - size(Math.abs(d[datalayer.values])) / 2)
        .attr("y", (d) => d._y - size(Math.abs(d[datalayer.values])) / 2)
        .style("stroke-width", (d) =>
          thickness(node.selectAll("rect").data(), value).getthickness(
            d[value.values] || undefined
          )
        )
        .attr("stroke-width", (d) =>
          thickness(node.selectAll("rect").data(), value).getthickness(
            d[value.values] || undefined
          )
        );
    } else {
      node
        .selectAll("rect")
        .transition()
        .delay(delay)
        .duration(duration)
        .style("stroke-width", (d) =>
          thickness(node.selectAll("rect").data(), value).getthickness(
            d[value.values] || undefined
          )
        )
        .attr("stroke-width", (d) =>
          thickness(node.selectAll("rect").data(), value).getthickness(
            d[value.values] || undefined
          )
        );
    }

    if (typeof value == "object") {
      legends(
        {
          type: "FeatureCollection",
          features: node.selectAll("rect").data(),
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
      .selectAll("rect")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr(getattr(attr), value)
      .style(getattr(attr), value);
  }
}
