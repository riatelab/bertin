import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
//import area from "@turf/area";
import intersect from "@turf/intersect";
const turf = Object.assign({}, { booleanPointInPolygon, intersect });

import { range, rollup, ascending, blur2, sum, flatGroup } from "d3-array";
import { geoPath } from "d3-geo";
import { geoProject } from "d3-geo-projection";

const d3 = Object.assign(
  {},
  { geoProject, range, rollup, ascending, blur2, sum, flatGroup, geoPath }
);
import { figuration } from "./figuration.js";
export function grid({
  geojson, // A geojson (dots or polygons)
  values = null, // A field in properties with absolute quantitative values
  projection, // projection
  width, // width of the map
  height, // height of the map
  step = 20, // gap between points
  output = "dots", // dots or squares
  blur = 0, // blur value with d3.blur2()
} = {}) {

  // ---------------
  // Build empty grid
  // ---------------

  let x = d3.range(0 + step / 2, width, step);
  let y = d3.range(0 + step / 2, height, step).reverse();
  const grid_width = x.length;
  const grid_height = y.length;

  // Dot grid
  let grid = x.map((x, i) => y.map((y) => [x, y])).flat();

  // Square grid
  let squaregrid = x
    .map((x, i) =>
      y.map((y) => [
        [x - step / 2, y - step / 2],
        [x + step / 2, y - step / 2],
        [x + step / 2, y + step / 2],
        [x - step / 2, y + step / 2],
        [x - step / 2, y - step / 2],
      ])
    )
    .flat();

  // Values (One or two fields)
  let val;
  let ratio = false;

  if (values !== null && !Array.isArray(values)) {
    val = new Map(
      geojson.features.map((d, i) => {
        return [i, +d.properties[values]];
      })
    );
  } else if (values !== null && Array.isArray(values) && values.length == 1) {
    val = new Map(
      geojson.features.map((d, i) => {
        return [i, +d.properties[values[0]]];
      })
    );
  } else if (values !== null && Array.isArray(values) && values.length == 2) {
    ratio = true;
    val = [
      new Map(
        geojson.features.map((d, i) => {
          return [i, +d.properties[values[0]]];
        })
      ),
      new Map(
        geojson.features.map((d, i) => {
          return [i, +d.properties[values[1]]];
        })
      ),
    ];
  } else {
    val = new Map(geojson.features.map((d, i) => [i, 1]));
  }

  // ---------------
  // POINTS
  // ----------------

  // If dots, affecter toute la valeur au point le plus proche

  if (figuration(geojson) == "p") {
    // get planar coordinates
    let dots = d3.geoProject(geojson, projection);
    dots = dots.features.map((d, i) => [i, d.geometry.coordinates]);

    let squarevalues = [];

    squaregrid.forEach((square) => {
      let squareval = [];
      let squareval_a = [];
      let squareval_b = [];
      dots.forEach((dot) => {
        if (
          turf.booleanPointInPolygon(
            { type: "Point", coordinates: dot[1] },
            { type: "Polygon", coordinates: [square] }
          )
        ) {
          if (ratio) {
            squareval_a.push(val[0].get(dot[0]));
            squareval_b.push(val[1].get(dot[0]));
          } else {
            squareval.push(val.get(dot[0]));
          }
          squareval.push(val.get(dot[0]));
        }
      });
      if (ratio) {
        squarevalues.push(d3.sum(squareval_a) / d3.sum(squareval_b));
      } else {
        squarevalues.push(d3.sum(squareval));
      }
      squarevalues.push(d3.sum(squareval));
    });

    const squarevalues2 = d3.blur2(
      {
        data: squarevalues.map((v) => (v === undefined ? 0 : v)),
        width: grid_width,
        height: grid_height,
      },
      blur
    ).data;

    // Rebuild a geojson
    let features = [];

    if (output == "dots" || output == "dot") {
      grid.forEach((d, i) => {
        features.push({
          type: "Feature",
          properties: { id: i, value: squarevalues2[i] },
          geometry: { type: "Point", coordinates: d },
        });
      });
    }

    if (output == "squares" || output == "square") {
      squaregrid.forEach((d, i) => {
        features.push({
          type: "Feature",
          properties: { id: i, value: squarevalues2[i] },
          geometry: { type: "Polygon", coordinates: [d] },
        });
      });
    }

    let FeatureCollection = {
      type: "FeatureCollection",
      features: features
        .filter((d) => d.properties.value > 0)
        .sort((a, b) => d3.ascending(a.properties.value, b.properties.value)),
    };

    return FeatureCollection;
  }

  // ---------------
  // POLYGONS
  // ----------------

  if (figuration(geojson) == "z") {
    // get planr coordinates
    const polys = d3.geoProject(geojson, projection);
    const polysareas = polys.features.map((d) => d3.geoPath().area(d));

    // Build intersected pieces
    let intersections = [];
    squaregrid.forEach((square, i1) => {
      polys.features.forEach((poly, i2) => {
        let piece = turf.intersect(poly, {
          type: "Polygon",
          coordinates: [square],
        });

        if (piece !== null) {
          let piecarea = d3.geoPath().area(piece);
          let fullarea = polysareas[i2];
          intersections.push({
            id_square: i1,
            id_poly: i2,
            area_piece: piecarea,
            area_poly: fullarea,
            share: piecarea / fullarea,
            feature: piece,
          });
        }
      });
    });

    console.log(intersections);

    // Aggregate values
    let aggr = d3.flatGroup(intersections, (d) => d.id_square);

    let result = [];

    if (ratio) {
      aggr.forEach((d) => {
        result.push([
          d[0],
          d3.sum(d[1].map((d) => d.share * val[0].get(d.id_poly))) /
            d3.sum(d[1].map((d) => d.share * val[1].get(d.id_poly))),
        ]);
      });
    } else {
      aggr.forEach((d) => {
        result.push([
          d[0],
          d3.sum(d[1].map((d) => d.share * val.get(d.id_poly))),
        ]);
      });
    }

    // Get data & blur
    let valbyid = new Map(result);

    let gridval = grid
      .map((d, i) => valbyid.get(i))
      .map((v) => (v === undefined ? 0 : v));

    const gridval2 = d3.blur2(
      {
        data: gridval,
        width: grid_width,
        height: grid_height,
      },
      blur
    ).data;

    // Rebuild geojson

    let features = [];

    if (output == "dots" || output == "dot") {
      grid.forEach((d, i) => {
        features.push({
          type: "Feature",
          properties: { id: i, value: gridval2[i] },
          geometry: { type: "Point", coordinates: d },
        });
      });
    }

    if (output == "squares" || output == "square") {
      squaregrid.forEach((d, i) => {
        features.push({
          type: "Feature",
          properties: { id: i, value: gridval2[i] },
          geometry: { type: "Polygon", coordinates: [d] },
        });
      });
    }

    let FeatureCollection = {
      type: "FeatureCollection",
      features: features
        .filter((d) => d.properties.value > 0)
        .sort((a, b) => d3.ascending(a.properties.value, b.properties.value)),
    };

    return FeatureCollection;
  }
}
