// Imports
import { geoPath } from "d3-geo";
import { select, pointer } from "d3-selection";
const d3 = Object.assign({}, { select, pointer, geoPath });

// test
export function test(selection, projection, options = {}) {
  let geojson = options.geojson;
  let fill = options.fill;
  let view_properties = options.view_properties ? true : false;

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
      if (view_properties) {
        d3.select(this)
          .attr("stroke-opacity", strokeOpacity - 0.3)
          .attr("fill-opacity", fillOpacity - 0.3);
        viewdata = d.properties;
        selection.dispatch("input");
        Object.defineProperty(selection.node(), "value", {
          get: () => viewdata,
          configurable: true,
        });
      }
    })
    .on("touchend mouseleave", function () {
      if (view_properties) {
        viewdata = {};
        selection.dispatch("input");
      }
    });

  if (view_properties) {
    Object.defineProperty(selection.node(), "value", {
      get: () => viewdata,
      configurable: true,
    });
  }
}
