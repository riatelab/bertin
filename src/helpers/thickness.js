import * as d3array from "d3-array";
import * as d3scale from "d3-scale";
import * as d3interpolate from "d3-interpolate";
const d3 = Object.assign({}, d3interpolate, d3scale, d3array);
import * as stat from "statsbreaks";

export function thickness(data, _) {
  // default

  const type = _.type ?? "linear";

  // If static value

  if (typeof _ == "number" || typeof _ == "string") {
    return { getthickness: () => +_ };
  }

  // If no data
  if (data.length == 0) {
    return {
      getthickness: () => 0,
      valmax: 0,
      sizemax: 0
    };
  }

  // Absolute data (linear scale)

  if (typeof _ != "number" && typeof _ != "string" && type == "linear") {
    let k = _.k ?? 10;
    let values = _.values;
    let fixmax = _.fixmax ?? undefined;
   let fixmin = _.fixmin ?? 0;


    if ("geometry" in data[0] && "properties" in data[0]) {
      data = data.map((d) => d.properties);
    }

    if (typeof _ == "string" || typeof _ == "number")
      return {
        getcol: (d) => _
      };


    if (fixmin == true){fixmin = d3.min(data.map((d) => Math.abs(+d[values])))}

    const v =
      fixmax == undefined
        ? d3.max(data.map((d) => Math.abs(+d[values])))
        : fixmax;

    const valmax = d3.max(data.map((d) => Math.abs(+d[values])));

    return {
      type: type,
      getthickness: d3.scaleLinear().domain([fixmin, v]).range([0, k]),
      valmax: valmax,
      valmin : fixmin,
      sizemax: d3.scaleLinear().domain([fixmin, v]).range([0, k])(valmax)
    };
  }

  // Qualitative data (linear scale)

  if (typeof _ != "number" && typeof _ != "string" && type == "quali") {
    const categories = _.categories;
    const k = _.k ?? 10;
    const sizes = _.sizes ?? d3.quantize(d3.interpolate(1, k), categories.length);

    return {
      type: type,
      categories: categories,
      sizes: sizes,
      getthickness: d3
        .scaleOrdinal()
        .domain(categories)
        .range(sizes)
        .unknown(0)
    };
  }

  // Relative data

  if (typeof _ != "number" && typeof _ != "string" && type == "discr") {
    const values = _.values;
    let sizes = _.sizes;
    let nbreaks = _.nbreaks ?? 5;
    let breaks = _.breaks ?? null;
    let k = _.k ?? 10;
    let nbsd = _.nbsd ?? 1;
    let middle = _.middle ?? false;
    let method = _.method ?? "quantile";
    //let leg_round = _.leg_round !== undefined ? _.leg_round : undefined;

    if (method == "q6") {
      nbreaks = 6;
    }

    const val = data
      .map((d) => +d.properties[values])
      .filter((d) => (d != undefined) && (d != null) && d != "");

    if (breaks == null) {
      breaks = stat.breaks({
        values: val,
        method: method,
        nb: nbreaks,
        k: nbsd,
        middle: middle
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
      getthickness: d3.scaleThreshold(b, sizes).unknown(0)
    };
  }
}
