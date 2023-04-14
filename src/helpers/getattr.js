export function getattr(attr) {
  const dico = new Map([
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["fillOpacity", "fill-opacity"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
  ]);

  let result = dico.get(attr);
  return result ? result : attr;
}
