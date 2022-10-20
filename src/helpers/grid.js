import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import area from "@turf/area";
import intersect from "@turf/intersect";
const turf = Object.assign({}, { booleanPointInPolygon, area, intersect });

import { range, rollup, ascending, blur2, sum, flatGroup } from "d3-array";
import { geoProject } from "d3-geo-projection";
import { figuration } from "./figuration.js";
const d3 = Object.assign(
  {},
  { geoProject, range, rollup, ascending, blur2, sum, flatGroup }
);

export function grid({
  geojson, // A geojson (dots or polygons)
  values = null, // A field in properties with absolute quantitative values
  projection, // projection
  width, // width of the map
  height, // height of the map
  step = 20, // gap between points
  output = "dots",
  blur = 0, // blur value with d3.blur2()
} = {}) {
  // TODO : SI value non renseignée, mettre la valeur 1.

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

  // Values
  let val;
  if (values !== null) {
    val = new Map(
      geojson.features.map((d, i) => {
        return [i, +d.properties[values]];
      })
    );
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
    let squarecount = [];

    squaregrid.forEach((square) => {
      let squareval = [];
      dots.forEach((dot) => {
        if (
          turf.booleanPointInPolygon(
            { type: "Point", coordinates: dot[1] },
            { type: "Polygon", coordinates: [square] }
          )
        ) {
          squareval.push(val.get(dot[0]));
        }
      });
      squarevalues.push(d3.sum(squareval));
      squarecount.push(squareval.length);
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
    const polysareas = polys.features.map((d) => turf.area(d));

    // Build intersected pieces
    let intersections = [];
    squaregrid.forEach((square, i1) => {
      polys.features.forEach((poly, i2) => {
        let piece = turf.intersect(poly, {
          type: "Polygon",
          coordinates: [square],
        });

        if (piece !== null) {
          let piecarea = turf.area(piece);
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

    // Aggregate values
    let aggr = d3.flatGroup(intersections, (d) => d.id_square);

    let result = [];
    aggr.forEach((d) => {
      result.push([
        d[0],
        d3.sum(d[1].map((d) => d.share * val.get(d.id_poly))),
      ]);
    });

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
          properties: { id: i, value: valbyid.get(i) },
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
