// proj4d3() is a function developped by @fil. See https://observablehq.com/@fil/proj4js-d3
import proj4 from "proj4";
import * as d3geo from "d3-geo";
const d3 = Object.assign({}, d3geo);

export function proj4d3(proj4string) {
  const degrees = 180 / Math.PI;
   const radians = 1 / degrees;
   const raw = proj4(proj4string);
   const p = function (lambda, phi) {
     return raw.forward([lambda * degrees, phi * degrees]);
   };
   p.invert = function (x, y) {
     return raw.inverse([x, y]).map(function (d) {
       return d * radians;
     });
   };
   const projection = d3.geoProjection(p).scale(1);
   projection.raw = raw;


   return projection;
}
