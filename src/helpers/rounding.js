export function rounding(value, precision){

let output
  if (precision >= 0) {
    output = +value.toFixed(precision);
  }
  if (precision < 0) {
    output =
      Math.round(value / +(1 + "0".repeat(Math.abs(precision)))) *
      +(1 + "0".repeat(Math.abs(precision)));
  }
  if (precision == undefined) {
  output = value;
}
  return output;
}
