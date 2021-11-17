import * as d3selection from "d3-selection";
import * as geoScaleBar from "d3-geo-scale-bar"
const d3 = Object.assign({}, d3selection, geoScaleBar);


export function addscalebar(selection, projection, width, height, options = {}) {
  let dist = options.dist ? options.dist : 100;
   let x = options.x ? options.x : 0.1;
   let y = options.y ? options.y : 0.9;

   const scaleBar = d3
     .geoScaleBar()
     .projection(projection)
     //.size([0, 0])
     .size([width, height])
     .left(x)
     .top(y)
     .units(d3.geoScaleKilometers)
     .distance(dist)
     .label(`${dist} km`)
     .labelAnchor("middle")
     .tickSize(null)
     .tickValues(null);

   selection
     .append("g")
     .attr("transform", `translate(${x}, ${y})`)
     .append("g")
     .call(scaleBar);
 }
