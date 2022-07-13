// header
export function addheader(selection, width, options = {}) {
  let fontSize;
  if (options.text) {
    fontSize = 25;
  }
  if (options.fontSize) {
    fontSize = options.fontSize;
  }
  let text = options.text ? options.text : "";
  let fill = options.fill ? options.fill : "#9e9696";
  let background = options.background ? options.background : "white";
  let backgroundOpacity =
    options.backgroundOpacity != undefined ? options.backgroundOpacity : 1;
  let anchor = options.anchor ? options.anchor : "middle";

  const delta = fontSize * text.split("\n").length;

  let x;
  if (anchor == "start") {
    x = 5;
  }
  if (anchor == "middle") {
    x = width / 2;
  }
  if (anchor == "end") {
    x = width - 5;
  }

  let header = selection.append("g");

  header
    .append("rect")
    .attr("x", 0)
    .attr("y", 0 - delta - 10)
    .attr("width", width)
    .attr("height", delta + 10)
    .attr("fill", background)
    .attr("fill-opacity", backgroundOpacity);

  header
    .selectAll("text")
    .data(options.text.split("\n"))
    .join("text")
    .attr("x", x)
    //.attr("y", -delta - 5)
    .attr("y", -delta - 5)
    .attr("font-size", `${fontSize}px`)
    .attr("dy", (d, i) => i * fontSize + fontSize / 2)
    .attr("text-anchor", anchor)
    .attr("dominant-baseline", "central")
    .attr("fill", fill)
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("fill-opacity", 1)
    .text((d) => d);
}
