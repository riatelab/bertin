// Imports

import { geoArea, geoCentroid, geoIdentity, geoPath } from "d3-geo";
import { featurecollection } from "./featurecollection.js";

const d3 = Object.assign({}, { geoArea, geoCentroid, geoIdentity, geoPath });
export function centroid(geojson, options = {}) {
  let largest = options.largest === false ? false : true;
  let planar = options.planar === true ? true : false;
  let path = d3.geoPath(d3.geoIdentity());

  geojson = featurecollection(geojson);
  const largestPolygon = function (d) {
    var best = {};
    var bestArea = 0;
    d.geometry.coordinates.forEach(function (coords) {
      var poly = { type: "Polygon", coordinates: coords };
      var area = planar ? path.area(poly) : d3.geoArea(poly);
      if (area > bestArea) {
        bestArea = area;
        best = poly;
      }
    });
    return best;
  };

  let centers = geojson.features.map((d) => {
    if (planar) {
      d.geometry.coordinates = path.centroid(
        largest == true
          ? d.geometry.type == "Polygon"
            ? d
            : largestPolygon(d)
          : d
      );
    } else {
      d.geometry.coordinates = d3.geoCentroid(
        largest == true
          ? d.geometry.type == "Polygon"
            ? d
            : largestPolygon(d)
          : d
      );
    }

    d.geometry.type = "Point";
    return d;
  });

  geojson.features = centers;

  return geojson;
}
