// Subset
export function subset({ x, field, selection, inverse = false }) {
  let features = [...x.features];
  selection = !Array.isArray(selection) ? [selection] : selection;

  if (inverse) {
    selection = Array.from(
      new Set(features.map((d) => d.properties[field]))
    ).filter((d) => !selection.includes(d));
  }
  let result = [];

  selection.forEach((e) => {
    result.push(features.filter((d) => d.properties[field] == e));
  });

  let output = JSON.parse(JSON.stringify(x));
  output.features = result.flat();
  return output;
}
