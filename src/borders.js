import * as topojsonclient from "topojson-client";
import * as topojsonserver from "topojson-server";
const topojson = Object.assign({}, topojsonclient, topojsonserver);

export function borders({ geojson, id, values, type = "rel", share = null }) {
  const topo = topojson.topology({ d: geojson });
  const ids = geojson.features.map((d) => d.properties[id]);
  const neighbors = topojson.neighbors(topo.objects["d"].geometries);
  const valbyid = new Map(
    geojson.features.map((d) => [d.properties[id], d.properties[values]])
  );

  let result = [];
  ids.forEach((e) => {
    let r = neighbors[ids.indexOf(e)].map((i) => ({
      properties: {
        i: e,
        j: ids[i],
        var_i: +valbyid.get(e),
        var_j: +valbyid.get(ids[i]),
        disc:
          type == "rel"
            ? +valbyid.get(ids[i]) != 0
              ? +valbyid.get(e) / +valbyid.get(ids[i])
              : null
            : +valbyid.get(e) - +valbyid.get(ids[i])
      }
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

  return { type: "FeatureCollection", features: result };
}
