// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

// To get the taype of the gemetries (z:zonal, l: linear, p:punctual)
export function figuration(features) {
  let figuration = ["z", "l", "p"];
  let types = features.features.map((d) => d.geometry.type);
  types = Array.from(new Set(types));
  let poly =
    types.indexOf("Polygon") !== -1 || types.indexOf("MultiPolygon") !== -1
      ? figuration[0]
      : "";
  let line =
    types.indexOf("LineString") !== -1 ||
    types.indexOf("MultiLineString") !== -1
      ? figuration[1]
      : "";
  let point =
    types.indexOf("Point") !== -1 || types.indexOf("MultiPoint") !== -1
      ? figuration[2]
      : "";
  let tmp = poly + line + point;
  let result = tmp.length == 1 ? tmp : "composite";
  return result;
}

// To compute polygon centroids
export function getcenters(features, id, projection, largest) {
  const largestPolygon = function (d) {
    var best = {};
    var bestArea = 0;
    d.geometry.coordinates.forEach(function (coords) {
      var poly = { type: "Polygon", coordinates: coords };
      var area = d3.geoArea(poly);
      if (area > bestArea) {
        bestArea = area;
        best = poly;
      }
    });
    return best;
  };

  let centers = new Map(
    features.features
      .map((d) => {
        d.coords = d3.geoCentroid(
          largest == true
            ? d.geometry.type == "Polygon"
              ? d
              : largestPolygon(d)
            : d
        );
        return d;
      })
      .map((d) => [
        d.properties[id],
        projection ? projection(d.coords) : d.coords
      ])
  );

  return centers;
}
