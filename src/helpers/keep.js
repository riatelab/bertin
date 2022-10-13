import { remove } from "./remove.js";

// Keep only theses fields
export function keep({ x, field }) {
  // Get all keys
  let keys = [];
  x.features
    .map((d) => d.properties)
    .forEach((d) => {
      keys.push(Object.keys(d));
    });
  keys = Array.from(new Set(keys.flat()));

  // Fields to be removed
  let diff = keys.filter((k) => !field.includes(k));
  return remove({ x, field: diff });
}
