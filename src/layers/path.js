import { create } from "d3-selection";
const d3 = Object.assign(
  {},
  {
    create,
  }
);

// path
export function path(selection, width, height, options = {}, clipid) {
  let style = options.style ? options.style : "fit";
  let margin = options.margin ? options.margin : 0;
  let d = options.d;
  let rotate = options.rotate ? options.rotate : 0;
  let fill = options.fill ? options.fill : "#4a4a4a";
  let strokeLinecap = options.strokeLinecap ? options.strokeLinecap : "round";
  let strokeLinejoin = options.strokeLinejoin
    ? options.strokeLinejoin
    : "round";
  let strokeDasharray =
    options.strokeDasharray != undefined ? options.strokeDasharray : "none";
  let stroke = options.stroke ? options.stroke : "#2e2e2e";
  let strokeWidth = options.strokeWidth != undefined ? options.strokeWidth : 1;
  let fillOpacity = options.fillOpacity != undefined ? options.fillOpacity : 1;
  let strokeOpacity =
    options.strokeOpacity != undefined ? options.strokeOpacity : 1;

  let x = options.x ? options.x : 0;
  let y = options.y ? options.y : 0;
  let scale = options.scale ? options.scale : 1;

  let tmp = selection.append("path").attr("d", d);
  let objsize = getsize(tmp);
  tmp.remove();

  if (!Array.isArray(margin)) {
    margin = [margin, margin, margin, margin];
  }
  // Fit in the top left corner

  let sel = selection
    .append("g")
    .attr("class", options.id)
    .attr("data-layer", JSON.stringify({ _type: "path" }));

  if (style == "fit") {
    sel
      .append("path")
      .attr("fill", fill)
      .attr("fill-opacity", fillOpacity)
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-dasharray", strokeDasharray)
      .attr("d", d)
      .attr(
        "transform",
        `translate(${x - objsize.x * scale + margin[3]},${
          y - objsize.y * scale + margin[0]
        })  scale(${scale}) rotate(${rotate} ${objsize.x + objsize.width / 2} ${
          objsize.y + objsize.height / 2
        })`
      );
  }

  // Display as it is

  if (style == "raw") {
    sel
      .append("path")
      .attr("fill", fill)
      .attr("fill-opacity", fillOpacity)
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-dasharray", strokeDasharray)
      .attr("d", d)
      .attr(
        "transform",
        `translate(${x},${y}) scale(${scale}) rotate(${rotate} ${
          objsize.x + objsize.width / 2
        } ${objsize.y + objsize.height / 2} )`
      );
  }

  // Repeat the path on the page

  if (style == "repeat") {
    let nbx = width / (objsize.width * scale + margin[1] + margin[3]);
    let nby = height / (objsize.height * scale + margin[0] + margin[2]);

    let mypatern = sel.attr(
      "clip-path",
      clipid == null ? `none` : `url(#clip_${clipid})`
    );

    for (let i = 0; i <= nbx; i++) {
      for (let j = 0; j <= nby; j++) {
        mypatern
          .append("path")
          .attr("fill", fill)
          .attr("fill-opacity", fillOpacity)
          .attr("stroke-opacity", strokeOpacity)
          .attr("stroke", stroke)
          .attr("stroke-width", strokeWidth)
          .attr("stroke-linecap", strokeLinecap)
          .attr("stroke-linejoin", strokeLinejoin)
          .attr("stroke-dasharray", strokeDasharray)
          .attr("d", d)
          .attr(
            "transform",
            `translate(${
              x +
              margin[3] -
              objsize.x * scale +
              i * (objsize.width * scale + margin[1] + margin[3])
            },${
              y +
              margin[0] -
              objsize.y * scale +
              j * (objsize.height * scale + margin[0] + margin[2])
            })  scale(${scale}) rotate(${rotate} ${
              objsize.x + objsize.width / 2
            } ${objsize.y + objsize.height / 2})`
          );
      }
    }
  }
}

function getsize(elt) {
  const clonetxt = elt.clone(true);
  const svg = d3.create("svg");
  svg.node().appendChild(clonetxt.node());
  document.body.appendChild(svg.node());
  const { x, y, width, height } = clonetxt.node().getBBox();
  document.body.removeChild(svg.node());
  let dims = { x, y, width, height };
  return dims;
}
