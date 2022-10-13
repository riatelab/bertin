// Remove fields
export function remove({ x, field }) {
  let data = [...x.features.map((d) => ({ ...d.properties }))];
  data.forEach((d) => {
    if (Array.isArray(field)) {
      field.forEach((e) => delete d[e]);
    } else {
      delete d[field];
    }
  });
  let output = JSON.parse(JSON.stringify(x));
  output.features.map((d, i) => (d.properties = { ...data[i] }));
  return output;
}
