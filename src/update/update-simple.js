import { getattr } from "../helpers/getattr.js";
import { legends } from "../legend/legends.js";
import { colorize } from "../helpers/colorize.js";
import { thickness } from "../helpers/thickness.js";
import { legsimple } from "../legend/leg-simple.js";
import { min, max } from "d3-array";
import {
  symbol,
  symbolCircle,
  symbolDiamond,
  symbolCross,
  symbolSquare,
  symbolStar,
  symbolTriangle,
  symbolWye,
} from "d3-shape";
const d3 = Object.assign(
  {},
  {
    min,
    max,
    symbol,
    symbolCircle,
    symbolDiamond,
    symbolCross,
    symbolSquare,
    symbolStar,
    symbolTriangle,
    symbolWye,
  }
);

export function update_simple({
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

  // FILL OR STROKE
  if (attr == "fill" || attr == "stroke") {
    svg.selectAll(`g.legbox_${id}`).remove();
    svg.selectAll(`g.legbox${attr}_${id}`).remove();

    switch (typeof value) {
      case "string":
        node
          .selectAll("path")
          .transition()
          .delay(delay)
          .duration(duration)
          .style(attr, value);

        if (datalayer.leg.x > 0 && datalayer.leg.y > 0) {
          if (legend) {
            datalayer.leg.text = legend;
          }

          datalayer.leg[attr] = value;
          svg.select(`g.legbox_${id}`).remove();
          legsimple(svg, datalayer.leg, id, delay, duration);
        }

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
  } else if (attr == "symbol_size" || attr == "symbol") {
    svg.selectAll(`g.legbox_${id}`).remove();

    const symbols = new Map([
      ["circle", d3.symbolCircle],
      ["cross", d3.symbolCross],
      ["diamond", d3.symbolDiamond],
      ["square", d3.symbolSquare],
      ["star", d3.symbolStar],
      ["triangle", d3.symbolTriangle],
      ["wye", d3.symbolWye],
    ]);

    if (attr == "symbol_size") {
      node
        .selectAll("path")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("d", d3.symbol().size(value).type(symbols.get(datalayer.symbol)));
    } else {
      datalayer.leg.type = value;
      node
        .selectAll("path")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr(
          "d",
          d3.symbol().size(datalayer.symbol_size).type(symbols.get(value))
        );
    }

    if (datalayer.leg.x > 0 && datalayer.leg.y > 0) {
      if (legend) {
        datalayer.leg.text = legend;
      }

      datalayer[attr] = value;
      datalayer.leg[attr] = value;

      svg.select(`g.legbox_${id}`).remove();
      legsimple(svg, datalayer.leg, id, delay, duration);
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
