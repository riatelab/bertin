import * as d3array from "d3-array";
import * as d3scale from "d3-scale";
const d3 = Object.assign({}, d3scale, d3array);

export function thickness(data, _) {
  if (typeof _ == "number" || typeof _ == "string") {
    return {getthickness: () => +_};
  }

  if (typeof _ == "object" && typeof _ != "number" && typeof _ != "string") {
    let k = _.k ?? 10;
    let values = _.values;
    let fixmax = _.fixmax ?? undefined;

    if ("geometry" in data[0] && "properties" in data[0]) {
      data = data.map((d) => d.properties);
    }

    if (typeof _ == "string" || typeof _ == "number")
      return {
        getcol: (d) => input
      };


    const valmax =
      fixmax == undefined
        ? d3.max(data.map((d) => Math.abs(+d[values])))
        : fixmax;

    const sizemax = d3.scaleLinear().domain([0, valmax]).range([0, k])(valmax)

    return {
      getthickness: d3.scaleLinear().domain([0, valmax]).range([0, k]),
      valmax : valmax,
      sizemax: sizemax
    };


  }
}
