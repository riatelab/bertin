import * as d3selection from "d3-selection";
const d3 = Object.assign({}, d3selection);


export function tooltiptype(pointer, width, height){
  const x_margin = 0.25 * width
  const y_margin = 0.20 * height

  if (pointer[0] < x_margin && pointer[1] <y_margin) { return "bottomright";}
  if (pointer[0] > width - x_margin && pointer[1] <y_margin) { return "bottomleft";}
  if (pointer[0] < x_margin && pointer[1] > height - y_margin) { return "topright";}
  if (pointer[0] > width - x_margin && pointer[1] > height - y_margin) { return "topleft";}
  if (pointer[1] > height - y_margin) { return "top";}
  if (pointer[0] < x_margin) {  return "right";}
  if (pointer[0] > width - x_margin) { return "left";}
  return "bottom";
}



export function addtooltip(g, params) {
  if (!params) return g.style("display", "none");

  // Params by default

  const fields =
    Array.isArray(params.fields) == true ? params.fields : [params.fields];
  const fill = params.fill ?? "#fcf7e6";
  const stroke = params.stroke ?? "#4a4d4b";
  const type = params.type ?? "bottom";

  const l = fields.length;

  let fontWeight = params.fontWeight;
  if (fontWeight == undefined && l == 1) { fontWeight = ["bold"]; }
  if (fontWeight == undefined && l > 1) { fontWeight = ["bold"].concat(Array(l - 1).fill("normal")); }
  if (typeof fontWeight === "string") { fontWeight = Array(l).fill(fontWeight);}

  let fontSize = params.fontSize;
  if (fontSize == undefined && l == 1) { fontSize = [18]; }
  if (fontSize == undefined && l > 1) { fontSize = [18].concat(Array(l - 1).fill(12));  }
  if (typeof fontSize === "number") { fontSize = Array(l).fill(fontSize);}

  let fontStyle = params.fontStyle;
  if (fontStyle == undefined) { fontStyle = Array(l).fill("normal"); }
  if (typeof fontStyle === "string") { fontStyle = Array(l).fill(fontStyle);}

  // Display tooltip

  g.style("display", null)
    .style("pointer-events", "none")
    .style("font", "8px sans-serif");

  const path = g
    .selectAll("path")
    .data([null])
    .join("path")
    .attr("fill", fill)
    .attr("stroke", stroke);

  const text = g
    .selectAll("text")
    .data([null])
    .join("text")
    .call((text) =>
      text
        .selectAll("tspan")
        .data(fields)
        .join("tspan")
        .attr("x", 0)
        //.attr("y", (d, i) => `${i * +fontSize[i]}px`)
        .attr(
          "y",
          (d, i) =>
            `${fontSize.slice(0, i + 1).reduce((a, b) => a + b, 0) + 3 * i}px`
        )

        .style("font-weight", (_, i) => fontWeight[i])
        .style("font-size", (_, i) => `${fontSize[i]}px`)
        .style("font-style", (_, i) => fontStyle[i])
        .style("fill", "#4d4545")
        .text((d) => d)
    );

  const { x, y, width: w, height: h } = text.node().getBBox();
  fields: "$NAMEen";
  // Layout

  switch (type) {
    case "bottom":
      text.attr("transform", `translate(${-w / 2},${15 - y})`);
      path.attr(
        "d",
        `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`
      );
      break;
    case "top":
      text.attr("transform", `translate(${-w / 2},${-15 - y - h})`);
      path.attr(
        "d",
        `M${-w / 2 - 10},-5H-5l5,5l5,-5H${w / 2 + 10}v${-h - 20}h-${w + 20}z`
      );
      break;
    case "left":
      text.attr("transform", `translate(${-w - 15},${-y - h / 2})`);
      path.attr(
        "d",
        `M0,0l-5,5v${h / 2}h${-w - 20}v${-h - 10}h${w + 20}v${h / 2}z`
      );
      break;
    case "right":
      text.attr("transform", `translate(${15},${-y - h / 2})`);
      path.attr( "d",`M0,0l5,5v${h / 2}h${w + 20}v${-h - 10}h${-w - 20}v${h / 2}z`);
      break;
    case "topleft":
      text.attr("transform", `translate(${-w - 10},${-15 - y - h})`);
      path.attr("d", `M0,0v${-h - 5 - 20}h${-w - 20}v${h + 20}h${w + 15}z`);
      break;
    case "topright":
      text.attr("transform", `translate(${10},${-15 - y - h})`);
      path.attr("d", `M0,0v${-h - 5 - 20}h${w + 20}v${h + 20}h${-w - 15}z`);
      break;
    case "bottomleft":
      text.attr("transform", `translate(${-w - 10},${15 - y})`);
      path.attr("d", `M0,0v${+h + 5 + 20}h${-w - 20}v${-h - 20}h${+w + 15}z`);
      break;
    case "bottomright":
      text.attr("transform", `translate(${10},${15 - y})`);
      path.attr("d", `M0,0v${+h + 5 + 20}h${w + 20}v${-h - 20}h${-w - 15}z`);
      break;
  }
}
