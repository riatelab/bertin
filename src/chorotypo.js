import * as d3scalechromatic from "d3-scale-chromatic";
import * as d3array from "d3-array";
import * as d3scale from "d3-scale";
const d3 = Object.assign({}, d3scalechromatic, d3scale, d3array);
import * as stat from "statsbreaks";

export function chorotypo(features, input){
  if (typeof input == "string")
    return {
      getcol: (d) => input
    };

  // choropleth
  if (typeof input == "object" && input.type == "choro") {
    let values = input.values;
    let pal = input.pal ? input.pal : "Blues";
    let nbreaks = input.nbreaks ? input.nbreaks : 5;
    let breaks = input.breaks ? input.breaks : null;
    let colors = input.colors ? input.colors : null;
    let method = input.method ? input.method : "quantile";
    let col_missing = input.col_missing ? input.col_missing : "#f5f5f5";
    let leg_round = input.leg_round !== undefined ? input.leg_round : undefined;

    if (method == "q6") {
      nbreaks = 6;
    }
    if (breaks == null) {
      breaks = stat.breaks({
        values: features.map((d) => +d.properties[values]),
        method: method,
        nb: nbreaks,
        precision: leg_round
      });
    } else {
      breaks = d3.sort(breaks);
    }

    if (colors == null) {
      colors = d3[`scheme${pal}`][nbreaks];
    }

    let b = [...breaks];
    b.pop();
    b.shift();

    // return d3.scaleThreshold(b, colors).unknown("#col_missing");

    return {
      getcol: d3.scaleThreshold(b, colors).unknown(col_missing),
      breaks: breaks,
      colors: colors
    };
  }

  // typo

  if (typeof input == "object" && input.type == "typo") {
    let values = input.values;
    let pal = input.pal ? input.pal : "Tableau10";
    let colors = input.colors ? input.colors : null;
    let col_missing = input.col_missing ? input.col_missing : "#f5f5f5";

    let types = Array.from(
      new Set(features.map((d) => d.properties[values]))
    );

    if (colors == null) {
      colors = d3[`scheme${pal}`].slice(0, types.length);
    } else {
      colors = colors.slice(0, types.length);
    }

    return {
      getcol: d3
        .scaleOrdinal()
        .domain(types)
        .range(colors)
        .unknown(col_missing),
      types: types,
      colors: colors
    };
  }
}
