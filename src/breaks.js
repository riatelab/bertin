import * as Jenks from "jenks";
import * as d3scale from "d3-scale";
import * as d3array from "d3-array";
const d3 = Object.assign({}, d3array, d3scale);

getbreaks = (data, method, nbclass) => {
  let breaks = [];

  // Jenks
  if (method == "jenks") {
    breaks = new Jenks.Jenks(data, nbclass).naturalBreak();
  }

  // Q6
  if (method == "q6") {
    breaks = [
      d3.quantile(data, 0),
      d3.quantile(data, 0.05),
      d3.quantile(data, 0.25),
      d3.quantile(data, 0.5),
      d3.quantile(data, 0.75),
      d3.quantile(data, 0.95),
      d3.quantile(data, 1)
    ];
  }

  // Equal
  if (method == "equal") {
    breaks = [d3.min(data), d3.max(data)];
    const r = (breaks[1] - breaks[0]) / nbclass; // raison
    let tmp = breaks[0];
    for (let i = 0; i < nbclass - 1; i++) {
      breaks.push(tmp + r);
      tmp = tmp + r;
    }
  }

  // Quantiles
  if (method == "quantile") {
    const q = 1 / nbclass;
    for (let i = 0; i <= nbclass; i++) {
      breaks.push(d3.quantile(data, q * i));
    }
  }

  // // sd
  // if (method == "sd") {
  //   const avg = d3.mean(data);
  //   const sd = d3.deviation(data);
  // }

  return d3.sort(breaks);
}
