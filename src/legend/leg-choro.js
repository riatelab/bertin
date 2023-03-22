import { reverse } from "d3-array";
const d3 = Object.assign({}, { reverse });

export function legchoro(selection, options = {}) {
  let x = options.x ? options.x : null;
  let y = options.y ? options.y : null;
  let w = options.w ? options.w : 30;
  let h = options.h ? options.h : 20;
  let title = options.title ? options.title : null;
  let fontSize = options.fontSize ? options.fontSize : 14;
  let fontSize2 = options.fontSize2 ? options.fontSize2 : 10;
  let stroke = options.stroke ? options.stroke : "black";
  let fillOpacity = options.fillOpacity ? options.fillOpacity : 1;
  let strokeWidth = options.strokeWidth ? options.strokeWidth : 0.5;
  let txtcol = options.txtcol ? options.txtcol : "#363636";
  let breaks = options.breaks;
  let colors = options.colors;
  let missing = options.missing;

  const i_missing = missing != null ? colors.length : -1;
  const span = 0;

  const bks =
    missing == null
      ? d3.reverse(breaks)
      : [d3.reverse(breaks), missing[0]].flat();
  const col =
    missing == null
      ? d3.reverse(colors)
      : [d3.reverse(colors), missing[1]].flat();

  if (x != null && y != null) {
    let leg = selection
      .append("g")
      .attr("class", "bertinlegend")
      .attr("class", options.id);

    let delta = 0;
    if (title != null) {
      delta = (title.split("\n").length + 1) * fontSize;
      leg
        .append("g")
        .selectAll("text")
        .data(title.split("\n"))
        .join("text")
        .attr("x", x)
        .attr("y", y)
        .attr("font-size", `${fontSize}px`)
        .attr("dy", (d, i) => i * fontSize)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "hanging")
        .attr("fill", txtcol)
        .text((d) => d);
    }
    leg
      .selectAll("rect")
      .data(col)
      .join("rect")
      .attr("x", x)
      .attr(
        "y",
        (d, i) => y + delta + (h + span) * i + (i === i_missing ? h / 2 : 0)
      )
      .attr("height", h)
      .attr("width", w)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("fill-opacity", fillOpacity)
      .attr("fill", (d) => d);

    leg
      .append("g")
      .selectAll("text")
      .data(bks)
      .join("text")
      .attr("x", x + w + fontSize2 / 2)
      .attr("y", y + delta)
      .attr("font-size", `${fontSize2}px`)
      .attr("fill", txtcol)
      .attr("dy", (d, i) => (h + span) * i)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "central")
      .text((d) => d);
  }
}
