import { tissot as ts } from "../helpers/tissot.js";
import { geoPath } from "d3-geo";

export function tissot(selection, projection, planar, options = {}, clipid) {
  if (!planar) {
    // Variables
    let fill = options.fill ? options.fill : "#d91848";
    let visibility = options.visibility ? options.visibility : "visible";
    let fillOpacity = options.fillOpacity ? options.fillOpacity : 0.5;
    let stroke = options.stroke ? options.stroke : "#d91848";
    let strokeWidth =
      options.strokeWidth != undefined ? options.strokeWidth : 1 / 5;
    let strokeOpacity =
      options.strokeOpacity != undefined ? options.strokeOpacity : 0.6;
    let step = options.step ? options.step : 10;

    // Display layer
    selection
      .append("g")
      .attr("type", "tissot")
      .attr("class", options.id)
      .attr("visibility", visibility)
      .style("fill", fill)
      .style("fill-opacity", fillOpacity)
      .style("stroke", stroke)
      .style("stroke-width", strokeWidth)
      .style("stroke-opacity", strokeOpacity)
      .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid})`)
      .append("path")
      .datum(ts(step))
      .attr("class", "test")
      .attr("d", geoPath(projection));
  }

  // Update function
  //   selection.node().update = update;
  //   function update({
  //     id = null,
  //     attr = null,
  //     value = null,
  //     duration = 0,
  //     delay = 0,
  //   } = {}) {
  //     selection
  //       .select(`g.${id}`)
  //       .transition()
  //       .delay(delay)
  //       .duration(duration)
  //       .attr(getattr(attr), value)
  //       .style(getattr(attr), value);

  //     if (attr == "step") {
  //       selection
  //         .select(`g.${id}`)
  //         .selectAll("path")
  //         .datum(ts(value))
  //         .transition()
  //         .delay(delay)
  //         .duration(duration)
  //         .attr("d", geoPath(projection));
  //     }
  //   }
}
