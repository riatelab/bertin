import { stringtod3proj } from "./stringtod3proj.js";
import { Polar } from "./polar.js";
import { HoaXiaoguang } from "./hoaxiaoguang.js";
import { Spilhaus } from "./spilhaus.js";

import { proj4d3 } from "./proj4d3.js";
import { geoEquirectangular, geoIdentity } from "d3-geo";
const d3 = Object.assign({}, { geoEquirectangular, geoIdentity });

// This function define the rules concerning projections

export function getproj(projection) {
  /* DEFAULT - the projection is not defined.
  The default projection is d3.geoEquirectangular().
 */

  if (projection === null || projection === undefined || projection === "") {
    return d3.geoEquirectangular();
  }

  /* FUNCTION - if the projection is a d3.js function (outside bertin.js).
  then, the function is used directly.*/

  if (typeof projection === "function") {
    return projection;
  }

  //   STRINGS
  if (typeof projection === "string") {
    projection = projection.replace(/\s/g, "");

    /* CUSTOM projections*/
    if (projection == "Polar") {
      return Polar();
    }
    if (projection == "HoaXiaoguang") {
      return HoaXiaoguang();
    }
    if (projection == "Spilhaus") {
      return Spilhaus();
    }

    /* USER projection - if he geometries use a projection system,
  they are displayed in this projection. Then it is impossible 
  to reproject them on the fly. And you ca't use outline layer.*/

    if (projection === "user") {
      return d3.geoIdentity().reflectY(true);
    }

    /* +PROJ & EPSG - in this case, proj4 and proj4d3 is used.  */

    if (
      projection.substring(0, 5) === "+proj" ||
      projection.substring(0, 5) === "epsg:"
    ) {
      return proj4d3(projection);
    }

    /* D3.GEO - a d3.js function within a string, 
  then, it is interpreted roughly as a d3.js function. See projections/d3proj.js. 
  In this case, projections are managed inside bertin.js. See projection/d3proj.js*/

    if (
      projection !== "user" &&
      projection.substring(0, 5) !== "+proj" &&
      projection.substring(0, 5) !== "epsg:"
    ) {
      return stringtod3proj(projection);
    }
  }

  /* TILES - if a tiles layer is used,
   the projection is automatically set to d3.geoMercator().
   The geometries must be in geographic coordinates for this.
   If the geometries are already projected, tiles are not used. 
   This part is managed in draw.js. */

  // Custom cases
}
