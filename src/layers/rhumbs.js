import { getangle } from "../helpers/getangle.js";

// rhumbs
export function rhumbs(selection, width, height, clipid, options = {}) {
  let visibility = options.visibility ? options.visibility : "visible";
  let nb = options.nb != undefined ? options.nb : 16;
  let position =
    options.position != undefined
      ? options.position
      : [width / 4, height - height / 4];
  let stroke = options.stroke ? options.stroke : "#394a70";
  let strokeWidth = options.strokeWidth != undefined ? options.strokeWidth : 1;
  let strokeOpacity =
    options.strokeOpacity != undefined ? options.strokeOpacity : 0.3;
  let strokeDasharray = options.strokeDasharray
    ? options.strokeDasharray
    : [3, 2];

  let angles = getangle(nb);

  let size = Math.max(width, height);

  selection
    .append("g")
    .attr("class", options.id)
    .attr("data-layer", JSON.stringify({ _type: "rhumbs" }))
    .attr("fill", "none")
    .attr("visibility", visibility)
    .attr("stroke", stroke)
    .attr("stroke-opacity", strokeOpacity)
    .attr("stroke-width", strokeWidth)
    .attr("stroke-dasharray", strokeDasharray)
    .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid})`)
    .selectAll("polyline")
    .data(angles)
    .join("polyline")
    .attr("points", function (d, i) {
      let x2 = position[0] + Math.cos(d) * size;
      let y2 = position[1] + Math.sin(d) * size;
      return position[0] + "," + position[1] + " " + x2 + "," + y2;
    });

  // Update function

  // selection.node().update = update;
  // function update({
  //   id = null,
  //   attr = null,
  //   value = null,
  //   duration = 0,
  //   delay = 0,
  // } = {}) {
  //   selection
  //     .select(`g.${id}`)
  //     .transition()
  //     .delay(delay)
  //     .duration(duration)
  //     .attr(getattr(attr), value)
  //     .style(getattr(attr), value);

  //   let node = selection.select(`g.${id}`);

  //   if (attr == "nb") {
  //     let node = selection.select(`g.${id}`);
  //     let pos = node.selectAll("polyline").nodes()[0].animatedPoints[0];

  //     selection
  //       .select(`g.${id}`)
  //       .selectAll("polyline")
  //       .data(getangle(value))
  //       .join("polyline")
  //       .transition()
  //       .delay(delay)
  //       .duration(duration)
  //       .attr("points", function (d, i) {
  //         let x2 = pos.x + Math.cos(d) * size;
  //         let y2 = pos.y + Math.sin(d) * size;
  //         return pos.x + "," + pos.y + " " + x2 + "," + y2;
  //       });
  //   }

  //   if (attr == "position") {
  //     let node = selection.select(`g.${id}`);
  //     selection
  //       .select(`g.${id}`)
  //       .selectAll("polyline")
  //       .data(getangle(node.selectAll("polyline").size()))
  //       .join("polyline")
  //       .transition()
  //       .delay(delay)
  //       .duration(duration)
  //       .attr("points", function (d, i) {
  //         let x2 = value[0] + Math.cos(d) * size;
  //         let y2 = value[1] + Math.sin(d) * size;
  //         return value[0] + "," + value[1] + " " + x2 + "," + y2;
  //       });
  //   }
  // }
}
