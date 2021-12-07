import * as d3selection from "d3-selection";
const d3 = Object.assign({}, d3selection);

export function addtext(selection, options = {}){
  let x = options.x;
  let y = options.y;
  let text = options.text ? options.text : "Your text here!";
  let fontsize = options.fontsize ? options.fontsize : 15;
  let margin = options.margin ? options.margin : 0;
  let anchor = options.anchor ? options.anchor : "start"; // start, middle, end
  let baseline = options.baseline ? options.baseline : "baseline"; // baseline, middle, hanging
  let fill = options.fill ? options.fill : "#474342";
  let stroke = options.stroke ? options.stroke : "none";
  let frame_fill = options.frame_fill ? options.frame_fill : "none";
  let frame_stroke = options.frame_stroke ? options.frame_stroke : "none";
  let frame_strokewidth = options.strokewidth ? options.strokewidth : 1;
  let frame_opacity = options.frame_opacity ? options.frame_opacity : 1;

  let margin_x;
  let margin_y;
  let delta;
  let delta2;

  let txt = text.split("\n");
  let count = [];
  txt.forEach((e) => count.push(e.length));
  let i = count.indexOf(Math.max(...count));

  let tmp = selection
    .append("text")
    .attr("font-size", `${fontsize}px`)
    .text(txt[i]);
  selection.node().appendChild(tmp.node());
  document.body.appendChild(selection.node());
  const { width } = tmp.node().getBBox();
  document.body.removeChild(selection.node());
  tmp.remove();

  let height = fontsize * count.length;

  if (baseline == "hanging") {
    delta = 0;
    margin_y = margin;
  }
  if (baseline == "middle") {
    delta = (fontsize * txt.length) / 2;
    margin_y = 0;
  }
  if (baseline == "baseline") {
    delta = fontsize * txt.length;
    margin_y = -margin;
  }

  if (anchor == "start") {
    delta2 = 0;
    margin_x = margin;
  }

  if (anchor == "middle") {
    delta2 = width / 2;
    margin_x = 0;
  }
  if (anchor == "end") {
    delta2 = width;
    margin_x = -margin;
  }

  let l = selection
    .append("g")
    .attr(":inkscape:groupmode", "layer")
    .attr("id", "note")
    .attr(":inkscape:label", "note");

  // l.append("circle")
  //   .attr("cx", x)
  //   .attr("cy", y)
  //   .attr("r", 2)
  //   .attr("fill", "#5277bf");

  l.append("rect")
    .attr("x", x - margin - delta2 + margin_x)
    .attr("y", y - margin - delta + margin_y)
    .attr("height", height + margin * 2)
    .attr("width", width + margin * 2)
    .attr("fill", frame_fill)
    .attr("stroke-width", frame_strokewidth)
    .attr("fill-opacity", frame_opacity)
    .attr("stroke", frame_stroke);

  l.selectAll("text")
    .data(txt)
    .join("text")
    .attr("x", x + margin_x)
    .attr("y", y - +delta + margin_y)
    .attr("font-size", `${fontsize}px`)
    .attr("dy", (d, i) => i * fontsize)
    .attr("text-anchor", anchor)
    .attr("alignment-baseline", "hanging")
    .attr("fill", fill)
    .attr("stroke", stroke)
    .text((d) => d);

  //return svg.node();
}
