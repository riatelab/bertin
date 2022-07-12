// UNUSED

// // Imports
// import * as d3selection from "d3-selection";
// import * as d3geo from "d3-geo";
// import * as d3geoprojection from "d3-geo-projection";
// const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

// // To compute polygon centroids
// export function getcenters(features, id, projection, largest) {
//   const largestPolygon = function (d) {
//     var best = {};
//     var bestArea = 0;
//     d.geometry.coordinates.forEach(function (coords) {
//       var poly = { type: "Polygon", coordinates: coords };
//       var area = d3.geoArea(poly);
//       if (area > bestArea) {
//         bestArea = area;
//         best = poly;
//       }
//     });
//     return best;
//   };

//   let centers = new Map(
//     features.features
//       .map((d) => {
//         d.coords = d3.geoCentroid(
//           largest == true
//             ? d.geometry.type == "Polygon"
//               ? d
//               : largestPolygon(d)
//             : d
//         );
//         return d;
//       })
//       .map((d) => [
//         d.properties[id],
//         projection ? projection(d.coords) : d.coords
//       ])
//   );

//   return centers;
// }
