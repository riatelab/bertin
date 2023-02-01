import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
//import area from "@turf/area";
import bbox from "@turf/bbox";
import intersect from "@turf/intersect";
import RBush from "rbush";
const turf = Object.assign({}, { booleanPointInPolygon, intersect, bbox });

import {
  range,
  rollup,
  ascending,
  blur2,
  sum,
  mean,
  flatGroup,
} from "d3-array";
import { geoPath } from "d3-geo";
import { geoProject } from "d3-geo-projection";

const d3 = Object.assign(
  {},
  { geoProject, range, rollup, ascending, blur2, sum, mean, flatGroup, geoPath }
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
  blur = 0, // blur value with d3.blur2(),
  keep = false,
  operator = "sum",
  geoprocessing = "intersection",
} = {}) {
  // empty grid
  let grid = buildgrid(step, width, height);

  // check if there are one or two values to consider
  let ratio = getratio(values);

  // values by id
  let val = valbyid(geojson, values);

  // computation (3 methods)
  let result;

  if (figuration(geojson) == "p") {
    result = dotcompute(geojson, grid, val, projection, ratio, operator);
  }

  if (figuration(geojson) == "z") {
    if (geoprocessing == "dotinpoly") {
      result = polydotcompute(geojson, grid, val, projection, ratio, operator);
    }
    if (geoprocessing == "intersection") {
      result = intersectcompute(
        geojson,
        grid,
        step,
        val,
        projection,
        ratio,
        operator
      );
    }
  }

  //return result;

  // blur

  if (blur > 0) {
    result = smooth(result, blur, grid.width, grid.height);
  }

  // Return a FeatureCollection
  return buildgeo(result, grid, output, keep);
}

// -------------------------------
// HELPERS
// -------------------------------

// build empty grid
function buildgrid(step, width, height) {
  let x = d3.range(0 + step / 2, width, step);
  let y = d3.range(0 + step / 2, height, step).reverse();

  return {
    dots: x.map((x, i) => y.map((y) => [x, y])).flat(),
    squares: x
      .map((x, i) =>
        y.map((y) => [
          [x - step / 2, y - step / 2],
          [x + step / 2, y - step / 2],
          [x + step / 2, y + step / 2],
          [x - step / 2, y + step / 2],
          [x - step / 2, y - step / 2],
        ])
      )
      .flat(),
    width: y.length,
    height: x.length,
  };
}

// value by id (One or two fields)
function valbyid(geojson, values) {
  let val;
  if (values !== null && values != undefined && !Array.isArray(values)) {
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

  return val;
}

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

// check if there are one or two values to consider
function getratio(x) {
  let ratio = false;

  if (Array.isArray(x) && x.length == 2) {
    ratio = true;
  }
  return ratio;
}

// Computation when geojson is dots

function dotcompute(geojson, grid, val, projection, ratio, operator) {
  let dots = d3.geoProject(geojson, projection);
  dots = dots.features.map((d, i) => [i, d.geometry.coordinates]);

  let squarevalues = [];

  grid.squares.forEach((square) => {
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
      if (operator == "sum") {
        squarevalues.push(d3.sum(squareval));
      } else {
        squarevalues.push(d3.mean(squareval));
      }
    }
  });

  return squarevalues.map((v) => (v === undefined ? 0 : v));
}

// Computation when geojson is polygons (dot in poly method)

function polydotcompute(geojson, grid, val, projection, ratio, operator) {
  const polys = d3.geoProject(geojson, projection);
  const polysareas = polys.features.map((d) => d3.geoPath().area(d));

  let result = [];

  grid.dots.forEach((d, i) => {
    for (let j = 0; j < polys.features.length; j++) {
      if (
        turf.booleanPointInPolygon(
          { type: "Point", coordinates: d },
          polys.features[j]
        )
      ) {
        result.push([i, j]);
        j = polys.features.length;
      }
    }
  });

  let nbbycounytry = d3.rollup(
    result,
    (v) => v.length,
    (d) => d[1]
  );

  result = result.map((d) => {
    if (operator == "sum") {
      let nb = nbbycounytry.get(d[1]) != undefined ? nbbycounytry.get(d[1]) : 1;
      if (ratio) {
        return [d[0], val[0].get(d[1]) / nb / (val[1].get(d[1]) / nb)];
      } else {
        return [d[0], val.get(d[1]) / nb];
      }
    } else {
      if (ratio) {
        let nb =
          nbbycounytry.get(d[1]) != undefined ? nbbycounytry.get(d[1]) : 1;
        return [d[0], val[0].get(d[1]) / nb / (val[1].get(d[1]) / nb)];
      } else {
        return [d[0], val.get(d[1])];
      }
    }
  });

  let valbyid = new Map(result);

  let gridval = grid.dots
    .map((d, i) => valbyid.get(i))
    .map((v) => (v === undefined ? 0 : v));

  return gridval;
}

// Computation when geojson is polygons (intersection method)
function intersectcompute(
  geojson,
  grid,
  step,
  val,
  projection,
  ratio,
  operator
) {
  const polys = d3.geoProject(geojson, projection);
  const polysareas = polys.features.map((d) => d3.geoPath().area(d));
  const squarearea = step * step;
  // Create an RTree
  const polysRTree = new RBush();
  polysRTree.load(
    //
    polys.features.map((d, i) => {
      const b = getBbox(d);
      // We store the index of the feature alongside the bbox,
      // so we can retrieve the feature later.
      b.ix = i;
      return b;
    })
  );

  let intersections = [];

  grid.squares.forEach((square, i1) => {
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
          share2: piecarea / squarearea,
          feature: piece,
        });
      }
    });
  });

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
    let sh = operator == "sum" ? "share" : "share2";
    aggr.forEach((d) => {
      result.push([d[0], d3.sum(d[1].map((d) => d[sh] * val.get(d.id_poly)))]);
    });
  }

  let valbyid = new Map(result);

  let gridval = grid.dots
    .map((d, i) => valbyid.get(i))
    .map((v) => (v === undefined ? 0 : v));

  return gridval;
}

// blur
function smooth(x, blur, w, h) {
  return d3.blur2(
    {
      data: x.map((v) => (v === undefined ? 0 : v)),
      width: w,
      height: h,
    },
    blur
  ).data;
}

// Rebuild geojson

function buildgeo(data, grid, output, keep) {
  let features = [];

  if (output == "dots" || output == "dot") {
    grid.dots.forEach((d, i) => {
      features.push({
        type: "Feature",
        properties: { id: i, value: data[i] },
        geometry: { type: "Point", coordinates: d },
      });
    });
  }

  if (output == "squares" || output == "square") {
    grid.squares.forEach((d, i) => {
      features.push({
        type: "Feature",
        properties: { id: i, value: data[i] },
        geometry: { type: "Polygon", coordinates: [d] },
      });
    });
  }

  if (keep == true) {
    return {
      type: "FeatureCollection",
      features: features.sort((a, b) =>
        d3.ascending(a.properties.value, b.properties.value)
      ),
    };
  } else {
    return {
      type: "FeatureCollection",
      features: features
        .filter((d) => d.properties.value > 0)
        .sort((a, b) => d3.ascending(a.properties.value, b.properties.value)),
    };
  }
}
