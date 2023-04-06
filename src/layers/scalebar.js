import * as geoScaleBar from "d3-geo-scale-bar";
const d3 = Object.assign({}, geoScaleBar);

export function scalebar(
  selection,
  projection,
  planar,
  width,
  height,
  options = {}
) {
  if (!planar) {
    let x = options.x ? options.x : 20;
    let y = options.y ? options.y : height - 30;
    let units = options.units ? options.units : "kilometers";

    x = x / width;
    y = y / height;

    const scaleBar = d3
      .geoScaleBar()
      .projection(projection)
      .size([width, height])
      .left(x)
      .top(y)
      .label(units == "miles" ? "Miles" : "Km")
      .units(units == "miles" ? d3.geoScaleMiles : d3.geoScaleKilometers)
      .orient(d3.geoScaleBottom)
      .tickPadding(5)
      .tickSize(0);

    selection
      .append("g")
      .attr("class", options.id)
      .attr("data-layer", JSON.stringify({ _type: "scalebar" }))
      .attr("transform", `translate(${x}, ${y})`)
      .append("g")
      .call(scaleBar);
  }
}
