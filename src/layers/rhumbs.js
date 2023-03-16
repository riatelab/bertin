import { getattr } from "../helpers/getattr.js";

// rhumbs
export function rhumbs(selection, width, height, clipid, options = {}) {
  let display = options.display == false ? false : true;
  if (display) {
    let nb = options.nb != undefined ? options.nb : 16;
    let position =
      options.position != undefined
        ? options.position
        : [width / 4, height - height / 4];
    let stroke = options.stroke ? options.stroke : "#394a70";
    let strokeWidth =
      options.strokeWidth != undefined ? options.strokeWidth : 1;
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
      .attr("fill", "none")
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
    selection.node().update = update;
    function update({
      id = null,
      attr = null,
      value = null,
      duration = 0,
    } = {}) {
      selection
        .select(`g.${id}`)
        .transition()
        .duration(duration)
        .attr(getattr(attr), value)
        .style(getattr(attr), value);

      if (attr == "nb") {
        selection
          .select(`g.${id}`)
          .selectAll("polyline")
          .data(getangle(value))
          .join("polyline")
          .transition()
          .duration(duration)
          .attr("points", function (d, i) {
            let x2 = position[0] + Math.cos(d) * size;
            let y2 = position[1] + Math.sin(d) * size;
            return position[0] + "," + position[1] + " " + x2 + "," + y2;
          });
      }

      if (attr == "position") {
        selection
          .select(`g.${id}`)
          .selectAll("polyline")
          .data(angles)
          .join("polyline")
          .transition()
          .duration(duration)
          .attr("points", function (d, i) {
            let x2 = value[0] + Math.cos(d) * size;
            let y2 = value[1] + Math.sin(d) * size;
            return value[0] + "," + value[1] + " " + x2 + "," + y2;
          });
      }
    }
  }
}

function getangle(nb) {
  let angles = [];
  for (let i = 0; i < nb; i++) {
    angles[i] = (360 / nb) * i * (Math.PI / 180);
  }
  return angles;
}
