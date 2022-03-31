// proj4d3() is a function developped by @fil. See https://observablehq.com/@fil/proj4js-d3
import proj4 from "proj4";
//const proj4 = Object.assign({}, proj4);

import * as d3geo from "d3-geo";
const d3 = Object.assign({}, d3geo);


let epsg2154 = "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
let epsg3035 = "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +units=m +no_defs"
let epsg3857 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs"
let epsg27700 = "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs"
let epsg42304 = "+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +datum=NAD83 +units=m +no_defs "

proj4.defs([ ['EPSG:2154', `+title=France Lambert93 ${epsg2154}`] ])
proj4.defs([ ['EPSG:3035', `+title=Europa (ETRS89/LAEA) ${epsg3035}`] ])
proj4.defs([ ['EPSG:3857', `+title=WGS 84 / Pseudo-Mercator ${epsg3857}`] ])
proj4.defs([ ['EPSG:27700', `+title=British National Grid -- United Kingdom ${epsg27700}`] ])
proj4.defs([ ['EPSG:42304', `+title=NAD83 / NRCan LCC Canada ${epsg42304}`] ])


export function proj4d3(proj4string) {
  // from Philippe Rivière : https://observablehq.com/@fil/proj4js-d3
  let raw

  if (+proj4string == proj4string)
    raw = proj4('EPSG:' + proj4string)

  if (!raw)
    raw = proj4(proj4string)

  const degrees = 180 / Math.PI,
    radians = 1 / degrees,
    p = function(lambda, phi) {
      return raw.forward([lambda * degrees, phi * degrees])
    }
  p.invert = function(x, y) {
    return raw.inverse([x, y]).map(function(d) {
      return d * radians
    })
  }
  const projection = d3.geoProjection(p).scale(1)
  projection.raw = raw
  return projection
}
