// Imports
import * as d3selection from "d3-selection";
const d3 = Object.assign({}, d3selection);

// outline
export function rhumbs(selection, width, height, clipid, options = {}) {
  let nb = options.nb ?? 16;
  let position = options.position ?? [height / 4, width - width / 4];
  let stroke = options.stroke ?? "#394a70";
  let strokeWidth = options.strokeWidth ?? 1;
  let strokeOpacity = options.strokeOpacity ?? 0.3;
  let strokeDasharray = options.strokeDasharray ?? [3, 2];

  let angles = [];
  for (let i = 0; i < nb; i++) {
    angles[i] = (360 / nb) * i * (Math.PI / 180);
  }

  selection
    .append("g")
    .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid}`)
    .selectAll("polyline")
    .data(angles)
    .enter()
    .append("polyline")
    .attr("fill", "none")
    .attr("stroke", stroke)
    .attr("stroke-opacity", strokeOpacity)
    .attr("stroke-width", strokeWidth)
    .attr("stroke-dasharray", strokeDasharray)
    .attr("points", function (d, i) {
      let x2 = position[0] + Math.cos(d) * width;
      let y2 = position[1] + Math.sin(d) * width;
      return position[0] + "," + position[1] + " " + x2 + "," + y2;
    });
}
