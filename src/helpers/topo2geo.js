import { feature } from "topojson-client";
const topojson = Object.assign({}, { feature });

export function topo2geo(json) {
  if (json.type == "Topology") {
    return topojson.feature(json, Object.keys(json.objects)[0]);
  }
  return JSON.parse(JSON.stringify(json));
}
