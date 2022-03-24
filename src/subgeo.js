import * as topojsonserver from "topojson-server";
import * as topojsonclient from "topojson-client";
const topojson = Object.assign({}, topojsonserver, topojsonclient);
import { topo2geo } from "./helpers/topo2geo.js";

export function subgeo(_ = {}) {
  const type = _.geojson.type;
  const geojson = topo2geo(_.geojson);
  const field = _.field;
  const operator = _.operator ?? "==";
  const array = !Array.isArray(_.array) ? [_.array] : _.array;

  let result = [];

  if (operator == "==") {
    array.forEach((e) => {
      result.push(geojson.features.filter((d) => d.properties[field] == e));
    });
  }

  if (operator == "!=") {
    array.forEach((e) => {
      result.push(geojson.features.filter((d) => d.properties[field] != e));
    });
  }

  const output = {
    type: "FeatureCollection",
    features: result.flat()
  };

  if (type == "FeatureCollection") {
    return output;
  }
  if (type == "Topology") {
    return topojson.topology({ foo: output });
  }
}
