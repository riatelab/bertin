import { rounding } from "../helpers/rounding.js";
import { descending } from "d3-array";
import { scaleLinear } from "d3-scale";
const d3 = Object.assign({}, { descending, scaleLinear });

export function legspikes(selection, _ = {}, id, delay = 0, duration = 0) {
  console.log(_);

  if (_.leg_x != null && _.leg_y != null) {
    const yScale = d3.scaleLinear().domain([0, _.legval[3]]).range([0, _.k]);

    let leg = selection
      .append("g")
      .attr("class", "bertinlegend")
      .attr("class", "legspike_" + id);

    if (duration != 0) {
      leg
        .attr("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("opacity", 1);
    }

    let delta = 0;
    if (_.leg_title != null) {
      delta = (_.leg_title.split("\n").length + 1) * _.leg_fontSize;
      leg
        .append("g")
        .selectAll("text")
        .data(_.leg_title.split("\n"))
        .join("text")
        .attr("x", _.leg_x)
        .attr("y", _.leg_y)
        .attr("font-size", `${_.leg_fontSize}px`)
        .attr("dy", (d, i) => i * _.leg_fontSize)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "hanging")
        .attr("fill", _.leg_txtcol)
        .text((d) => d);
    }

    leg
      .append("g")
      .selectAll("path")
      .data(_.legval.sort(d3.descending))
      .join("path")
      .attr("d", (d) => `M ${-_.w / 2},0 0,${-yScale(d)} ${_.w / 2},0`)
      .attr("fill", typeof _.leg_fill == "object" ? "white" : _.leg_fill)
      .attr("fill-opacity", _.leg_fillOpacity)
      .attr("stroke", typeof _.leg_stroke == "object" ? "black" : _.leg_stroke)
      .attr("stroke-width", 1)
      .attr(
        "transform",
        (d, i) =>
          `translate(${_.leg_x + _.w / 2 + (_.w + 5) * i},${
            _.leg_y +
            _.k +
            (_.leg_title ? _.leg_title.split("\n").length + 1 : 1) *
              _.leg_fontSize
          })`
      );

    leg
      .append("g")
      .selectAll("text")
      .data(_.legval.sort(d3.descending))
      .join("text")
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .attr(
        "transform",
        (d, i) =>
          `translate(${_.leg_x + _.w / 2 + (_.w + 5) * i},${
            _.leg_y +
            _.k +
            (_.leg_title ? _.leg_title.split("\n").length + 1 : 1) *
              _.leg_fontSize +
            _.leg_fontSize2 / 2
          }) rotate(90)`
      )
      .attr("font-size", `${_.leg_fontSize2}px`)
      .attr("fill", _.leg_txtcol)
      .text((d) => rounding(d, _.leg_round));
  }
}
