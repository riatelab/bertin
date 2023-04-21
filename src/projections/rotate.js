import { eulerAngles } from "./euler.js";
import { drag } from "d3-drag";
import { geoPath } from "d3-geo";
import { pointer } from "d3-selection";
const d3 = Object.assign({}, { geoPath, drag, pointer });
export function rotate(svg, projection) {
  let p0, o0;

  function refresh() {
    // Simple path
    svg.selectAll(".onglobe").attr("d", d3.geoPath(projection));

    // Bubbles
    svg
      .selectAll(".onglobe_coords")
      .attr("cx", (d) => d3.geoPath(projection).centroid(d.geometry)[0])
      .attr("cy", (d) => d3.geoPath(projection).centroid(d.geometry)[1])
      .attr("x", (d) => d3.geoPath(projection).centroid(d.geometry)[0])
      .attr("y", (d) => d3.geoPath(projection).centroid(d.geometry)[1])
      .attr("visibility", (d) =>
        isNaN(d3.geoPath(projection).centroid(d.geometry)[0])
          ? "hidden"
          : "visible"
      );

    svg
      .selectAll(".onglobe_translate")
      .attr(
        "transform",
        (d) =>
          `translate(
         ${d3.geoPath(projection).centroid(d.geometry)[0]},
         ${d3.geoPath(projection).centroid(d.geometry)[1]})`
      )
      .attr("visibility", (d) =>
        isNaN(d3.geoPath(projection).centroid(d.geometry)[0])
          ? "hidden"
          : "visible"
      );
  }

  function dragStart(event) {
    p0 = projection.invert(d3.pointer(event, this));
    o0 = projection.rotate();
  }

  function dragged(event) {
    o0 = projection.rotate();

    var p1 = projection.invert(d3.pointer(event, this)),
      o1 = eulerAngles(p0, p1, o0);

    projection.rotate(o1);
    refresh();
  }

  let drag = d3.drag().on("start", dragStart).on("drag", dragged);

  svg.call(drag);
}
