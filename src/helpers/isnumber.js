export function isNumber(value) {
  return (
    value !== null &&
    value !== "" &&
    typeof value !== "boolean" &&
    isFinite(value)
  );
}
