export function isNumber(value) {
  return value !== null && value !== "" && isFinite(value);
}
