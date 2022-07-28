import { topo2geo } from "../helpers/topo2geo.js";
import { centroid } from "geotoolbox";
import { figuration } from "../helpers/figuration.js";

export function label(selection, projection, planar, options = {}, clipid) {
  let display = options.display == false ? false : true;
  if (display) {
    let geojson = topo2geo(options.geojson);
    let values = options.values;
    let fill = options.fill ? options.fill : "#474342";
    let fontSize = options.fontSize ? options.fontSize : 10;
    let fontFamily = options.fontFamily ? options.fontFamily : "Robotto";
    let textDecoration = options.textDecoration
      ? options.textDecoration
      : "none";
    let fontWeight = options.fontWeight ? options.fontWeight : "normal";
    let fontStyle = options.fontStyle ? options.fontStyle : "normal";
    let opacity = options.opacity != undefined ? options.opacity : 1;
    let halo = options.halo == true ? true : false;
    let halo_style = options.halo_style
      ? options.halo_style
      : ["white", 4, 0.5];

    //const features = centroid(geojson, { planar: planar }).features;

    let features;
    if (figuration(geojson) == "p") {
      features = geojson.features;
    } else {
      features = centroid(geojson, { planar: planar }).features;
    }

    selection
      .append("g")
      .selectAll("text")
      .data(
        features
          .filter((d) => d.geometry.coordinates != undefined)
          .filter((d) => d.properties[values] != undefined)
      )
      .join("text")
      .attr("x", (d) => projection(d.geometry.coordinates)[0])
      .attr("y", (d) => projection(d.geometry.coordinates)[1])
      .attr("fill", fill)
      .attr("opacity", opacity)
      .attr("font-size", fontSize)
      .attr("font-family", fontFamily)
      .attr("font-style", fontStyle)
      .attr("text-decoration", textDecoration)
      .attr("font-weight", fontWeight)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("paint-order", "stroke")
      .attr("stroke", halo ? halo_style[0] : "none")
      .attr("stroke-width", halo ? halo_style[1] : 0)
      .attr("stroke-opacity", halo ? halo_style[2] : 0)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .text((d) => d.properties[values]);
  }
}
