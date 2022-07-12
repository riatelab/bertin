import { index } from "d3-array";
const d3 = Object.assign({}, index);
import { topo2geo } from "./helpers/topo2geo.js";

export function merge(geojson, id_geojson, data, id_data, all = true) {
  let output = JSON.parse(JSON.stringify(topo2geo(geojson)));
  let data2 = JSON.parse(JSON.stringify(data));

  let ids_geojson = output.features.map((d) => d.properties[id_geojson]);
  let ids_data = data.map((d) => d[id_data]);
  let ids = ids_geojson.filter((x) => ids_data.includes(x));

  let geomfields = Object.keys(output.features[0].properties);

  if (Object.keys(data2[0]).includes(id_data)) {
    let databyid = d3.index(data2, (d) => d[id_data]);
    output.features.forEach((d) => {
      const mydata = databyid.get(d.properties[id_geojson]);

      // if same name of variables in geojson and in data
      if (mydata != null) {
        Object.keys(mydata).forEach((x) => {
          if (geomfields.find((e) => e == x) !== undefined) {
            mydata[`_${x}`] = mydata[x];
            delete mydata[x];
          }
        });
      }
      d.properties = Object.assign(d.properties, mydata);
    });

    if (all === false) {
      output.features = output.features.filter((x) =>
        ids_data.includes(x.properties[id_geojson])
      );
    }
  }

  return output;
}
