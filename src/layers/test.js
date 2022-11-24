// Imports
import { geoPath } from "d3-geo";
import { select, pointer } from "d3-selection";
const d3 = Object.assign({}, { select, pointer, geoPath });

// test
export function test(selection, projection, options = {}) {
  let geojson = options.geojson;
  let fill = options.fill;
  let export_properties = options.export_properties ? true : false;

  let viewdata = {};
  selection
    .append("g")
    .selectAll("path")
    .data(geojson.features)
    .join("path")
    .attr("d", d3.geoPath(projection))
    .attr("fill", fill)
    .attr("stroke", "white")
    .attr("stroke-width", 1)
    .on("touchmove mousemove", function (event, d) {
      d3.select(this).attr("fill", "red");
      if (export_properties) {
        selection.dispatch("input");
        viewdata = d.properties;
      }
    })
    .on("touchend mouseleave", function () {
      d3.select(this).attr("fill", "#CCC");
      if (export_properties) {
        viewdata = {};
        selection.dispatch("input");
      }
    });

  if (export_properties) {
    Object.defineProperty(selection.node(), "value", {
      get: () => viewdata,
      configurable: true,
    });
  }
}
