import * as topojsonserver from "topojson-server";
import * as topojsonclient from "topojson-client";
const topojson = Object.assign({}, topojsonserver, topojsonclient);

export function topo2geo(json) {
  if (json.type == "Topology") {
    return topojson.feature(json, Object.keys(json.objects)[0]);
  }
  return json;
}
