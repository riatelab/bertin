import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3geoprojection);

// Approximative projection of HoaXiaoguang (thanks to Fil/@recifs)

export function HoaXiaoguang() {
  const projection = d3
    .geoHufnagel()
    .a(0.8)
    .b(0.35)
    .psiMax(50)
    .ratio(1.6)
    .angle(90)
    .rotate([110, -200, 90]);
  return projection;
}
