
export function merge(geojson, id_geojson, data, id_data, all = true) {
  let ids_geojson = geojson.features.map((d) => d.properties[id_geojson]);
  let ids_data = data.map((d) => d[id_data]);
  let ids = ids_geojson.filter((x) => ids_data.includes(x));

  const geomfields = Object.keys(geojson.features[0].properties);

  let databyid = d3.index(data, (d) => d[id_data]);

  geojson.features.forEach((d) => {
    const mydata = databyid.get(d.properties[id_geojson]);

    // if same name of variables in geojon and in data
    if (mydata != null) {
      Object.keys(mydata).forEach((x) => {
        if (geomfields.find((e) => e == x) !== undefined) {
          mydata[`_${x}`] = mydata[x];
          delete mydata[x];
        }
      });
    }

    const prop = Object.assign(d.properties, mydata);
    d.properties = prop;
  });

  if (all === false) {
    geojson.features = geojson.features.filter((x) =>
      ids_data.includes(x.properties[id_geojson])
    );
  }

  return geojson;
}
