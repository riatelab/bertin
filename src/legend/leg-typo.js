import { scaleOrdinal } from "d3-scale";
const d3 = Object.assign({}, { scaleOrdinal });

export function legtypo(selection, options = {}, delay = 0, duration = 0) {
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
  let types = options.types;
  let colors = options.colors;

  let getcolor = d3.scaleOrdinal().domain(types).range(colors);
  const span = 3;

  console.log(duration);
  console.log(delay);

  if (x != null && y != null) {
    console.log("legtypo2");

    let leg = selection
      .append("g")
      .attr("class", "bertinlegend")
      .attr("class", options.id);

    if (duration != 0) {
      leg
        .attr("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("opacity", 1);
    }

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
      .data(types)
      .join("rect")
      .attr("x", x)
      .attr("y", (d, i) => y + delta + (h + span) * i)
      .attr("height", h)
      .attr("width", w)
      .attr("fill", (d) => getcolor(d))
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("fill-opacity", fillOpacity);

    leg
      .append("g")
      .selectAll("text")
      .data(types)
      .join("text")
      .attr("x", x + w + fontSize2 / 2)
      .attr("y", y + delta + h / 2)
      //.attr("y", y + h / 2 - (fontSize2 * text.split("\n").length) / 2 + delta)
      .attr("font-size", `${fontSize2}px`)
      .attr("fill", txtcol)
      .attr("dy", (d, i) => (h + span) * i)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "central")
      .text((d) => d);
  }
}
