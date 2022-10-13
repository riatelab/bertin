import GeoJSONReader from "jsts/org/locationtech/jts/io/GeoJSONReader.js";
import GeoJSONWriter from "jsts/org/locationtech/jts/io/GeoJSONWriter.js";
import UnionOp from "jsts/org/locationtech/jts/operation/union/UnionOp.js";
const jsts = Object.assign({}, { GeoJSONReader, GeoJSONWriter, UnionOp });
import { buffer } from "./buffer.js";

export function union(x, options = {}) {
  let reader = new jsts.GeoJSONReader();
  let data = reader.read(buffer(x));

  if (options.id != null && options.id != undefined) {
    // Union by id
    let ids = Array.from(
      new Set(data.features.map((d) => d.properties[options.id]))
    );

    let result = [];
    ids.forEach((d) => {
      let features = data.features.filter((e) => e.properties[options.id] == d);
      let geom = features[0].geometry;

      for (let i = 1; i < features.length; i++) {
        geom = jsts.UnionOp.union(geom, features[i].geometry);
      }

      result.push({
        type: "Feature",
        properties: { id: d },
        geometry: new jsts.GeoJSONWriter().write(geom),
      });
    });

    return {
      type: "FeatureCollection",
      features: result,
    };
  } else {
    // Union all
    let geom = data.features[0].geometry;
    for (let i = 1; i < data.features.length; i++) {
      geom = jsts.UnionOp.union(geom, data.features[i].geometry);
    }
    const result = new jsts.GeoJSONWriter().write(geom);

    return {
      type: "FeatureCollection",
      features: [{ type: "Feature", properties: {}, geometry: result }],
    };
  }
}
