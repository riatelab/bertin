// From d3-geo by Mike Bostock
// Source: https://github.com/d3/d3-geo/blob/master/src/distance.js
// License: https://github.com/d3/d3-geo/blob/master/LICENSE

import length from "./length.js";

const coordinates = [null, null],
      object = {type: "LineString", coordinates: coordinates};

export default function(a, b) {
  coordinates[0] = a;
  coordinates[1] = b;
  return length(object);
}