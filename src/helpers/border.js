import { topology } from "topojson-server";
import { neighbors, mesh } from "topojson-client";
const topojson = Object.assign({}, { topology, neighbors, mesh });
import { featurecollection } from "./featurecollection.js";
import * as d3array from "d3-array";
const d3 = Object.assign({}, d3array);

export function border(geojson, options = {}) {
  let geo = featurecollection(geojson);

  if (options.values == undefined && options.id == undefined) {
    const topo = topojson.topology({ d: geo });
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: topojson.mesh(
            topo,
            Object.entries(topo.objects)[0][1],
            (a, b) => a !== b
          ),
        },
      ],
    };
  } else {
    const id = options.id;
    const values = options.values;
    const type = options.type ? options.type : "rel";
    const share = options.share ? options.share : null;

    const topo = topojson.topology({ d: geo });
    const ids = geo.features.map((d) => d.properties[id]);
    const neighbors = topojson.neighbors(topo.objects["d"].geometries);
    const valbyid = new Map(
      geo.features.map((d) => [d.properties[id], d.properties[values]])
    );

    let result = [];
    ids.forEach((e) => {
      let r = neighbors[ids.indexOf(e)].map((i) => ({
        properties: {
          i: e,
          j: ids[i],
          varoptionsi: +valbyid.get(e),
          varoptionsj: +valbyid.get(ids[i]),
          disc:
            type == "rel"
              ? d3.min([+valbyid.get(e), +valbyid.get(ids[i])]) != 0
                ? d3.max([+valbyid.get(e), +valbyid.get(ids[i])]) /
                  d3.min([+valbyid.get(e), +valbyid.get(ids[i])])
                : null
              : d3.max([+valbyid.get(e), +valbyid.get(ids[i])]) -
                d3.min([+valbyid.get(e), +valbyid.get(ids[i])]),
        },
      }));

      r.forEach((e) => {
        let geom = topojson.mesh(
          topo,
          topo.objects["d"],
          (a, b) =>
            (a.properties[id] == e.properties.i) &
            (b.properties[id] == e.properties.j)
        );

        let output = Object.assign({ type: "Feature" }, e);
        result.push(Object.assign(output, { geometry: geom }));
      });
    });

    result.sort((a, b) => d3.descending(a.properties.disc, b.properties.disc));

    const l = result.length;
    result
      .map((d) => d.properties)
      .forEach((e, i) => {
        Object.assign(e, { share: (i + 1) / l });
      });

    if (share != null) {
      result = result.filter((d) => d.properties.share < share);
    }

    geo.features = result;
    return geo;
  }
}
