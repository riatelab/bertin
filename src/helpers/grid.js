import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
//import area from "@turf/area";
import bbox from "@turf/bbox";
import intersect from "@turf/intersect";
import RBush from 'rbush';
const turf = Object.assign({}, { booleanPointInPolygon, intersect, bbox });

import { range, rollup, ascending, blur2, sum, flatGroup } from "d3-array";
import { geoPath } from "d3-geo";
import { geoProject } from "d3-geo-projection";

const d3 = Object.assign(
  {},
  { geoProject, range, rollup, ascending, blur2, sum, flatGroup, geoPath }
);
import { figuration } from "./figuration.js";

// Function that returns the bbox of a GeoJSON feature/geometry
// in the format expected by the rbush library.
const getBbox = (feature) => {
  const t = turf.bbox(feature);
  return {
    minX: t[0],
    minY: t[1],
    maxX: t[2],
    maxY: t[3],
  };
};

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
  const grid_height = x.length;
  const grid_width = y.length;

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
        }
      });
      if (ratio) {
        squarevalues.push(d3.sum(squareval_a) / d3.sum(squareval_b));
      } else {
        squarevalues.push(d3.sum(squareval));
      }
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

    // Create an RTree
    const polysRTree = new RBush();
    polysRTree.load( //
      polys.features.map((d, i) => {
        const b = getBbox(d);
        // We store the index of the feature alongside the bbox,
        // so we can retrieve the feature later.
        b.ix = i;
        return b;
     }),
    );

    // Build intersected pieces
    let intersections = [];
    squaregrid.forEach((square, i1) => {
      // Geojson geometry for the square
      const squaregeo = { type: "Polygon", coordinates: [square] };
      // Get polygons whose bbox intersects the square
      const result = polysRTree.search(getBbox(squaregeo));
      result.forEach((d) => {
        const id_poly = d.ix;
        const poly = polys.features[id_poly];
        let piece = turf.intersect(poly, squaregeo);

        if (piece !== null) {
          let piecarea = d3.geoPath().area(piece);
          let fullarea = polysareas[id_poly];
          intersections.push({
            id_square: i1,
            id_poly: id_poly,
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
