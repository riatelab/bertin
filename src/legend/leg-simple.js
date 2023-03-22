import {
  symbol,
  symbolCircle,
  symbolDiamond,
  symbolCross,
  symbolSquare,
  symbolStar,
  symbolTriangle,
  symbolWye,
} from "d3-shape";
const d3 = Object.assign(
  {},
  {
    symbol,
    symbolCircle,
    symbolDiamond,
    symbolCross,
    symbolSquare,
    symbolStar,
    symbolTriangle,
    symbolWye,
  }
);

export function legsimple(selection, options = {}, id) {
  let type = options.type ? options.type : "box";
  let x = options.x ? options.x : null;
  let y = options.y ? options.y : null;
  let w = options.w != undefined ? options.w : 30;
  let h = options.h != undefined ? options.h : 20;
  let title = options.title ? options.title : null;
  let text = options.text ? options.text : `leg_text`;
  let fontSize = options.fontSize != undefined ? options.fontSize : 14;
  let fontSize2 = options.fontSize2 != undefined ? options.fontSize2 : 10;
  let stroke = options.stroke ? options.stroke : "black";
  let fill = options.fill ? options.fill : "#CCCCCC";
  let fillOpacity = options.fillOpacity != undefined ? options.fillOpacity : 1;
  let strokeWidth =
    options.strokeWidth != undefined ? options.strokeWidth : 0.5;
  let txtcol = options.txtcol ? options.txtcol : "#363636";

  if (x != null && y != null) {
    let leg = selection
      .append("g")
      .attr("class", "bertinlegend")
      .attr("class", "leg_" + id);

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

    const symbols = new Map([
      ["circle", d3.symbolCircle],
      ["cross", d3.symbolCross],
      ["diamond", d3.symbolDiamond],
      ["square", d3.symbolSquare],
      ["star", d3.symbolStar],
      ["triangle", d3.symbolTriangle],
      ["wye", d3.symbolWye],
    ]);

    if (symbols.has(type)) {
      const size = options.symbol_size;

      leg
        .append("path")
        .attr("x", x)
        .attr("y", y + delta)
        .attr("d", d3.symbol().size(size).type(symbols.get(type)))
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
  }
}
