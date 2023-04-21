import { tissot as ts } from "../helpers/tissot.js";
import { geoPath } from "d3-geo";

export function tissot(selection, projection, planar, options = {}, clipid) {
  if (!planar) {
    // Variables
    let fill = options.fill ? options.fill : "#d91848";
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
      .attr("class", options.id)
      .attr("data-layer", JSON.stringify({ _type: "tissot" }))
      .style("fill", fill)
      .style("fill-opacity", fillOpacity)
      .style("stroke", stroke)
      .style("stroke-width", strokeWidth)
      .style("stroke-opacity", strokeOpacity)
      .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid})`)
      .append("path")
      .datum(ts(step))
      .attr("class", "test")
      .attr("d", geoPath(projection))
      .attr("class", "onglobe");
  }
}
