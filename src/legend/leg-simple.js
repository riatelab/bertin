import * as d3selection from "d3-selection";
import * as d3scale from "d3-scale";
import * as d3shape from "d3-shape";
const d3 = Object.assign({}, d3scale, d3selection, d3shape);

export function legsimple(selection, options = {}) {
  let type = options.type ?? "box";
  let x = options.x ? options.x : null;
  let y = options.y ? options.y : null;
  let w = options.w ?? 30;
  let h = options.h ?? 20;
  let title = options.title ? options.title : null;
  let text = options.text ? options.text : `text of the box`;
  let fontSize = options.fontSize ? options.fontSize : 14;
  let fontSize2 = options.fontSize2 ? options.fontSize2 : 10;
  let stroke = options.stroke ? options.stroke : "black";
  let fill = options.fill ? options.fill : "#CCCCCC";
  let fillOpacity = options.fillOpacity ? options.fillOpacity : 1;
  let strokeWidth = options.strokeWidth ? options.strokeWidth : 0.5;
  let txtcol = options.txtcol ? options.txtcol : "#363636";

  if (x != null && y != null) {
    let leg = selection.append("g").attr("class", "bertinlegend");

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

    // Box
    if (type == "box") {
      leg
        .append("rect")
        .attr("x", x)
        .attr("y", y + delta)
        .attr("height", h)
        .attr("width", w)
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("fill-opacity", fillOpacity);

      leg
        .append("g")
        .selectAll("text")
        .data(text.split("\n"))
        .join("text")
        .attr("x", x + w + fontSize2 / 2)
        .attr(
          "y",
          y + h / 2 - (fontSize2 * text.split("\n").length) / 2 + delta
        )
        .attr("font-size", `${fontSize2}px`)
        .attr("dy", (d, i) => i * fontSize2)
        .attr("fill", txtcol)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "hanging")
        .text((d) => d);
    }

    // Symbol

    const symbols = [
      "circle",
      "cross",
      "diamond",
      "square",
      "star",
      "triangle",
      "wye",
    ];

    if (symbols.includes(type)) {
      const size = options.symbol_size;

      leg
        .append("path")
        .attr("x", x)
        .attr("y", y + delta)
        .attr(
          "d",
          d3.symbol().size(size).type(d3.symbols[symbols.indexOf(type)])
        )
        .attr("transform", `translate(${x + Math.sqrt(size)},${y + delta})`)
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("fill-opacity", fillOpacity);

      leg
        .append("g")
        .selectAll("text")
        .data(text.split("\n"))
        .join("text")
        .attr("x", x + Math.sqrt(size) * 2 + fontSize2 / 2)
        .attr("y", y + delta)
        .attr("font-size", `${fontSize2}px`)
        .attr("dy", (d, i) => i * fontSize2)
        .attr("fill", txtcol)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .text((d) => d);
    }

    // leg
    //   .append("circle")
    //   .attr("cx", x)
    //   .attr("cy", y)
    //   .attr("r", 4)
    //   .attr("fill", "red");
  }
}
