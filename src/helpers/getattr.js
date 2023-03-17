export function getattr(attr) {
  const dico = new Map([
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["fillOpactity", "fill-opacity"],
    ["strokeDasharray", "stroke-dasharray"],
  ]);

  let result = dico.get(attr);
  return result ? result : attr;
}
