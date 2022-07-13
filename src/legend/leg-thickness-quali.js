import { reverse } from "d3-array";
const d3 = Object.assign({}, { reverse });

export function legthicknessquali(selection, options = {}) {
  let x = options.x ? options.x : null;
  let y = options.y ? options.y : null;
  let w = options.w ? options.w : 30;
  let title = options.title ? options.title : null;
  let fontSize = options.fontSize ? options.fontSize : 14;
  let fontSize2 = options.fontSize2 ? options.fontSize2 : 10;
  let stroke = options.stroke ? options.stroke : "black";
  let strokeOpacity = options.strokeOpacity ? options.strokeOpacity : 1;
  let txtcol = options.txtcol ? options.txtcol : "#363636";
  let categories = options.categories;
  let sizes = options.sizes;

  sizes = d3.reverse(sizes);
  categories = d3.reverse(categories);

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

    const span = 10;

    // y lines
    let y_lines = [];
    let cumul = 0;
    for (let i = 0; i < sizes.length; i++) {
      y_lines.push(y + delta + cumul + sizes[i] / 2 + i * span);
      cumul += sizes[i];
    }

    leg
      .selectAll("line")
      .data(sizes)
      .join("line")
      .attr("x1", x)
      .attr("y1", (d, i) => y_lines[i])
      .attr("x2", x + w)
      .attr("y2", (d, i) => y_lines[i])
      .attr("stroke", stroke)
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke-width", (d) => d);

    leg
      .append("g")
      .selectAll("text")
      .data(categories)
      .join("text")
      .attr("x", x + w + fontSize2 / 2)
      .attr("y", (d, i) => y_lines[i])
      .attr("font-size", `${fontSize2}px`)
      .attr("fill", txtcol)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "central")
      .text((d) => d);
  }
}
