// tail
export function tail({ x, field, nb = 10 }) {
  let features = [...x.features];
  features = features
    .filter((d) => d.properties[field] != "")
    .filter((d) => d.properties[field] != null)
    .filter((d) => d.properties[field] != undefined)
    .filter((d) => d.properties[field] != +Infinity)
    .filter((d) => d.properties[field] != -Infinity)
    .filter((d) => d.properties[field] != NaN);

  let head = features.sort(
    (a, b) => +a.properties[field] - +b.properties[field]
  );
  features = features.slice(0, nb);
  let output = JSON.parse(JSON.stringify(x));
  output.features = features;
  return output;
}
