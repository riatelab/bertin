import { geoAzimuthalEquidistant } from "d3-geo";
const d3 = Object.assign({}, { geoAzimuthalEquidistant });

export function Polar() {
  const projection = d3
    .geoAzimuthalEquidistant()
    .scale(190)
    .rotate([0, -90])
    .clipAngle(150);

  return projection;
}
