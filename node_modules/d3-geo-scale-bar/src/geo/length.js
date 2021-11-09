// Adapted from d3-geo by Mike Bostock
// Source: https://github.com/d3/d3-geo/blob/master/src/length.js
// License: https://github.com/d3/d3-geo/blob/master/LICENSE

import adder from "./adder.js";
import stream from "./stream.js";

let lengthSum = adder(),
      lambda0,
      sinPhi0,
      cosPhi0;

const lengthStream = {
  sphere: _ => {},
  point: _ => {},
  lineStart: lengthLineStart,
  lineEnd: _ => {},
  polygonStart: _ => {},
  polygonEnd: _ => {}
};

function lengthLineStart() {
  lengthStream.point = lengthPointFirst;
  lengthStream.lineEnd = lengthLineEnd;
}

function lengthLineEnd() {
  lengthStream.point = lengthStream.lineEnd = _ => {};
}

function lengthPointFirst(lambda, phi) {
  lambda *= Math.PI / 180, phi *= Math.PI / 180;
  lambda0 = lambda, sinPhi0 = Math.sin(phi), cosPhi0 = Math.cos(phi);
  lengthStream.point = lengthPoint;
}

function lengthPoint(lambda, phi) {
  lambda *= Math.PI / 180, phi *= Math.PI / 180;
  const sinPhi = Math.sin(phi),
        cosPhi = Math.cos(phi),
        delta = Math.abs(lambda - lambda0),
        cosDelta = Math.cos(delta),
        sinDelta = Math.sin(delta),
        x = cosPhi * sinDelta,
        y = cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDelta,
        z = sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDelta;
  lengthSum.add(Math.atan2(Math.sqrt(x * x + y * y), z));
  lambda0 = lambda, sinPhi0 = sinPhi, cosPhi0 = cosPhi;
}

export default function(object) {
  lengthSum.reset();
  stream(object, lengthStream);
  return +lengthSum;
}