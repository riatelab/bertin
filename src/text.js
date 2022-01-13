import * as d3selection from "d3-selection";
const d3 = Object.assign({}, d3selection);

export function addtext(selection, width, height, options = {}){
  let position = options.position ? options.position : "topright";
    let text = options.text ? options.text : "Your text here!";
    let fontSize = options.fontSize ? options.fontSize : 15;
    let margin = options.margin ? options.margin : 0;
    let anchor = options.anchor ? options.anchor : "start"; // start, middle, end
    let baseline = options.baseline ? options.baseline : "baseline"; // baseline, middle, hanging
    let fill = options.fill ? options.fill : "#474342";
    let stroke = options.stroke ? options.stroke : "none";
    let frame_fill = options.frame_fill ? options.frame_fill : "none";
    let frame_stroke = options.frame_stroke ? options.frame_stroke : "none";
    let frame_strokeWidth = options.strokeWidth ? options.strokeWidth : 1;
    let frame_opacity = options.frame_opacity ? options.frame_opacity : 1;
    let x;
    let y;

    switch (position) {
      case "topleft":
        anchor = "start";
        baseline = "hanging";
        x = 5;
        y = 5;
        break;
      case "topright":
        anchor = "end";
        baseline = "hanging";
        x = width - 5;
        y = 5;
        break;
      case "top":
        anchor = "middle";
        baseline = "hanging";
        x = width / 2;
        y = 5;
        break;
      case "left":
        anchor = "start";
        baseline = "middle";
        x = 5;
        y = height / 2;
        break;
      case "middle":
        anchor = "middle";
        baseline = "middle";
        x = width / 2;
        y = height / 2;
        break;
      case "right":
        anchor = "end";
        baseline = "middle";
        x = width - 5;
        y = height / 2;
        break;
      case "bottomleft":
        anchor = "start";
        baseline = "baseline";
        x = 5;
        y = height - 5;
        break;
      case "bottom":
        anchor = "middle";
        baseline = "baseline";
        x = width / 2;
        y = height - 5;
        break;
      case "bottomright":
        anchor = "end";
        baseline = "baseline";
        x = width - 5;
        y = height - 5;
        break;
      default:
        x = position[0];
        y = position[1];
    }

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
      .attr("font-size", `${fontSize}px`)
      .text(txt[i]);
    selection.node().appendChild(tmp.node());
    document.body.appendChild(selection.node());
    const w = tmp.node().getBBox().width;
    document.body.removeChild(selection.node());
    tmp.remove();

    let h = fontSize * count.length;

    if (baseline == "hanging") {
      delta = 0;
      margin_y = margin;
    }
    if (baseline == "middle") {
      delta = (fontSize * txt.length) / 2;
      margin_y = 0;
    }
    if (baseline == "baseline") {
      delta = fontSize * txt.length;
      margin_y = -margin;
    }

    if (anchor == "start") {
      delta2 = 0;
      margin_x = margin;
    }

    if (anchor == "middle") {
      delta2 = w / 2;
      margin_x = 0;
    }
    if (anchor == "end") {
      delta2 = w;
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
      .attr("height", h + margin * 2)
      .attr("width", w + margin * 2)
      .attr("fill", frame_fill)
      .attr("stroke-width", frame_strokeWidth)
      .attr("fill-opacity", frame_opacity)
      .attr("stroke", frame_stroke);

    l.selectAll("text")
      .data(txt)
      .join("text")
      .attr("x", x + margin_x)
      .attr("y", y - +delta + margin_y)
      .attr("font-size", `${fontSize}px`)
      .attr("dy", (d, i) => i * fontSize)
      .attr("text-anchor", anchor)
      .attr("alignment-baseline", "hanging")
      .attr("fill", fill)
      .attr("stroke", stroke)
      .text((d) => d);

    //return svg.node();
  }
