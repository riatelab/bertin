// Footer
export function addfooter(selection, width, height, options = {}) {
  let fontSize;
  if (options.text) {
    fontSize = 10;
  }
  if (options.fontSize) {
    fontSize = options.fontSize;
  }
  let text = options.text ? options.text : "";
  let fill = options.fill ? options.fill : "#9e9696";
  let background = options.background ? options.background : "white";
  let backgroundOpacity = options.backgroundOpacity
    ? options.backgroundOpacity
    : 1;
  let anchor = options.anchor ? options.anchor : "end";

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

  let footer = selection
    .append("g")
    .attr("class", options.id)
    .attr("data-layer", JSON.stringify({ _type: "footer" }));

  footer
    .append("rect")
    .attr("x", 0)
    .attr("y", height)
    .attr("width", width)
    .attr("height", delta + 10)
    .attr("fill", background)
    .attr("fill-opacity", backgroundOpacity);

  footer
    // .append("a")
    // .attr("xlink:href", "http://www.lemonde.fr")
    .selectAll("text")
    .data(options.text.split("\n"))
    .join("text")
    .attr("x", x)
    .attr("y", height + 5)
    .attr("font-size", `${fontSize}px`)
    .attr("dy", (d, i) => i * fontSize)
    .attr("text-anchor", anchor)
    .attr("dominant-baseline", "hanging")
    .attr("fill", fill)
    .attr("font-family", "sans-serif")
    .attr("fill-opacity", 1);
  // .text((d) => d)
  // .on("click", function () {
  //   window.open("http://www.lemonde.fr");
  // })
  // .style("cursor", "pointer");
}
