// based on Jacob Rus code
// See https://observablehq.com/@jrus/sphere-resample

// import * as d3geo from "d3-geo";
import { geoEquirectangularRaw } from "d3-geo";
const d3 = Object.assign({}, { geoEquirectangularRaw });

export function bbox(bounds) {
  let λ0 = bounds[0][0];
  let φ0 = bounds[0][1];
  let λ1 = bounds[1][0];
  let φ1 = bounds[1][1];

  const x = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { id: 1 },
        geometry: {
          type: "Polygon",
          coordinates:
            φ0 === -90
              ? [
                  [
                    [λ0, φ1],
                    [λ1, φ1],
                  ],
                ] // Antarctica
              : [
                  [
                    [λ0, φ0],
                    [λ0, φ1],
                    [(λ1 += (λ1 < λ0) * 360), φ1],
                    [λ1, φ0],
                    [λ0, φ0],
                  ],
                ],
        },
      },
    ],
  };
  return inverseResampleJSON(d3.geoEquirectangularRaw, 0.02)(x);
}

const inverseResampleJSON = (projection, delta) => {
  const maxDepth = 16,
    radians = Math.PI / 180,
    dd = Math.tan((radians * delta) / 2) ** 2;

  const resampleLineTo = function (w0, u0, w1, u1, ll01, depth, array) {
    if (depth--) {
      var w2 = planar_midpoint(w0, w1),
        λφ2 = projection.invert(...w2),
        u2 = cartesian(λφ2),
        ll02 = stereo_length2(u2, u0),
        ll12 = stereo_length2(u2, u1),
        AA = stereo_area2(u2, u0, u1),
        hh = (AA * (1 + 0.25 * ll01) * (1 + 0.25 * ll01)) / (dd * ll01),
        ww = 2 * ((ll02 - ll12) / ll01) * ((ll02 - ll12) / ll01);
      if (((hh + ww > 1) & (ll02 + ll12 > dd)) | (ll02 + ll12 > 0.25)) {
        resampleLineTo(w0, u0, w2, u2, ll02, depth, array);
        array.push(λφ2);
        resampleLineTo(w2, u2, w1, u1, ll12, depth, array);
      }
    }
  };

  const resampleChain = (pointarray) => {
    let outarray = [];
    let w0 = pointarray[0],
      λφ0 = projection.invert(...w0),
      u0 = cartesian(λφ0);
    outarray.push(λφ0);
    for (var i = 1, n = pointarray.length; i < n; i++) {
      let w1 = pointarray[i],
        λφ1 = projection.invert(...w1),
        u1 = cartesian(λφ1);
      resampleLineTo(
        w0,
        u0,
        w1,
        u1,
        stereo_length2(u0, u1),
        maxDepth,
        outarray
      );
      outarray.push(λφ1);
      (w0 = w1), (u0 = u1);
    }
    return outarray;
  };
  let project = (w) => projection.invert(...w);
  let mapInPlace = (fn) => (array) =>
    array.forEach((e, i) => (array[i] = fn(e)));

  let convert,
    convertType = {
      Point: (o) => (o.coordinates = project(o.coordinates)),
      MultiPoint: (o) => mapInPlace(project)(o.coordinates),
      LineString: (o) => (o.coordinates = resampleChain(o.coordinates)),
      Polygon: (o) => mapInPlace(resampleChain)(o.coordinates),
      MultiLineString: (o) => mapInPlace(resampleChain)(o.coordinates),
      MultiPolygon: (o) => o.coordinates.forEach(mapInPlace(resampleChain)),
      Feature: (o) => convert(o.geometry),
      GeometryCollection: (o) => o.geometries.forEach(convert),
      FeatureCollection: (o) => o.features.forEach(convert),
    };
  convert = (o) => (convertType?.[o?.type]?.(o), o);

  return function (json) {
    json = JSON.parse(JSON.stringify(json)); // make deep copy
    return convert(json);
  };
};

const stereo_area2 = ([x0, y0, z0], [x1, y1, z1], [x2, y2, z2]) => {
  var p =
      x0 * ((y1 - y0) * (z2 - z0) - (y2 - y0) * (z1 - z0)) +
      y0 * ((z1 - z0) * (x2 - x0) - (z2 - z0) * (x1 - x0)) +
      z0 * ((x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0)),
    q = (x0 + x2) * (x0 + x1) + (y0 + y2) * (y0 + y1) + (z0 + z2) * (z0 + z1);
  return (p * p + !(q * q)) / (q * q); // adding !(q*q) means q==0 => return Infinity
};

const planar_midpoint = ([x0, y0], [x1, y1]) => [
  0.5 * (x0 + x1),
  0.5 * (y0 + y1),
];

const radians = Math.PI / 180;
const cartesian = ([λ, φ]) => [
  Math.cos(radians * φ) * Math.cos(radians * λ),
  Math.cos(radians * φ) * Math.sin(radians * λ),
  Math.sin(radians * φ),
];

const stereo_length2 = ([x0, y0, z0], [x1, y1, z1]) => {
  var pxy = x0 * (y1 - y0) - (x1 - x0) * y0,
    pyz = y0 * (z1 - z0) - (y1 - y0) * z0,
    pzx = z0 * (x1 - x0) - (z1 - z0) * x0,
    q = x0 * (x1 + x0) + y0 * (y1 + y0) + z0 * (z1 + z0);
  return (pxy * pxy + pyz * pyz + pzx * pzx + !(q * q)) / (q * q); // adding !(q*q) means q==0 => return Infinity
};
