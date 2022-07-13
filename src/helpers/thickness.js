import { min, max } from "d3-array";
import { scaleLinear, scaleOrdinal, scaleThreshold } from "d3-scale";
import { interpolate, quantize } from "d3-interpolate";
const d3 = Object.assign(
  {},
  { min, max, scaleLinear, scaleOrdinal, scaleThreshold, quantize, interpolate }
);

import * as stat from "statsbreaks";

export function thickness(data, _) {
  // default

  const type = _.type ? _.type : "linear";

  // If static value

  if (typeof _ == "number" || typeof _ == "string") {
    return { getthickness: () => +_ };
  }

  // If no data
  if (data.length == 0) {
    return {
      getthickness: () => 0,
      valmax: 0,
      sizemax: 0,
    };
  }

  // Absolute data (linear scale)

  if (typeof _ != "number" && typeof _ != "string" && type == "linear") {
    let k = _.k != undefined ? _.k : 10;
    let values = _.values;
    let fixmax = _.fixmax != undefined ? _.fixmax : undefined;
    let fixmin = _.fixmin != undefined ? _.fixmin : 0;

    if ("geometry" in data[0] && "properties" in data[0]) {
      data = data.map((d) => d.properties);
    }

    if (typeof _ == "string" || typeof _ == "number")
      return {
        getcol: (d) => _,
      };

    if (fixmin == true) {
      fixmin = d3.min(data.map((d) => Math.abs(+d[values])));
    }

    const v =
      fixmax == undefined
        ? d3.max(data.map((d) => Math.abs(+d[values])))
        : fixmax;

    const valmax = d3.max(data.map((d) => Math.abs(+d[values])));

    return {
      type: type,
      getthickness: d3.scaleLinear().domain([fixmin, v]).range([0, k]),
      valmax: valmax,
      valmin: fixmin,
      sizemax: d3.scaleLinear().domain([fixmin, v]).range([0, k])(valmax),
    };
  }

  // Qualitative data (linear scale)

  if (typeof _ != "number" && typeof _ != "string" && type == "quali") {
    const categories = _.categories;
    const k = _.k != undefined ? _.k : 10;
    const sizes = _.sizes
      ? _.sizes
      : d3.quantize(d3.interpolate(1, k), categories.length);

    return {
      type: type,
      categories: categories,
      sizes: sizes,
      getthickness: d3
        .scaleOrdinal()
        .domain(categories)
        .range(sizes)
        .unknown(0),
    };
  }

  // Relative data

  if (typeof _ != "number" && typeof _ != "string" && type == "discr") {
    const values = _.values;
    let sizes = _.sizes;
    let nbreaks = _.nbreaks != undefined ? _.nbreaks : 5;
    let breaks = _.breaks ? _.breaks : null;
    let k = _.k != undefined ? _.k : 10;
    let nbsd = _.nbsd != undefined ? _.nbsd : 1;
    let middle = _.middle == true ? true : false;
    let method = _.method ? _.method : "quantile";

    if (method == "q6") {
      nbreaks = 6;
    }

    const val = data
      .map((d) => +d.properties[values])
      .filter((d) => d != undefined && d != null && d != "");

    if (breaks == null) {
      breaks = stat.breaks({
        values: val,
        method: method,
        nb: nbreaks,
        k: nbsd,
        middle: middle,
        //precision: leg_round
      });
    } else {
      breaks = d3.sort(breaks);
    }

    if (sizes == null) {
      sizes = d3.quantize(d3.interpolate(1, k), breaks.length - 1);
    }

    let b = [...breaks];
    b.pop();
    b.shift();

    return {
      type: type,
      breaks: breaks,
      sizes: sizes,
      getthickness: d3.scaleThreshold(b, sizes).unknown(0),
    };
  }
}
