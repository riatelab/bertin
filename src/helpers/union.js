import { topology } from "topojson-server";
import { merge } from "topojson-client";
const topojson = Object.assign({}, { topology, merge });

export function union(x) {
  let topo = topojson.topology({ foo: x });
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: topojson.merge(topo, topo.objects.foo.geometries),
      },
    ],
  };
}
