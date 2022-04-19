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
//  let pal = input.pal ? input.pal : "Blues";
  let colors = input.colors ?? "Blues";
  let nbreaks = input.nbreaks ? input.nbreaks : 5;
  let breaks = input.breaks ? input.breaks : null;
  let k = input.k ? input.k : 1;
  let middle = input.middle ? input.middle : false;
  //let colors = input.colors ? input.colors : null;
  let method = input.method ? input.method : "quantile";
  let col_missing = input.col_missing ? input.col_missing : "#f5f5f5";
  let txt_missing = input.txt_missing ? input.txt_missing : "No data";
  let leg_round = input.leg_round !== undefined ? input.leg_round : undefined;

  if (method == "q6") {
    nbreaks = 6;
  }

  const arr = features.map((d) => +d.properties[values]);
  const val = arr.filter((d) => (d != undefined) & (d != null) && d != "");

  const missing = arr.length == val.length ? null : [txt_missing, col_missing];

  if (breaks == null) {
    breaks = stat.breaks({
      values: val,
      method: method,
      nb: nbreaks,
      k: k,
      middle: middle,
      precision: leg_round
    });
  } else {
    breaks = d3.sort(breaks);
  }


  if (!Array.isArray(colors)){colors = d3[`scheme${colors}`][breaks.length - 1];}


  let b = [...breaks];
  b.pop();
  b.shift();

  return {
    getcol: d3.scaleThreshold(b, colors).unknown(col_missing),
    breaks: breaks,
    colors: colors,
    missing: missing
  };
}

  // typo

  if (typeof input == "object" && input.type == "typo") {
    let values = input.values;
    //let pal = input.pal ? input.pal : "Tableau10";
    let colors = input.colors ?? "Tableau10";
    let col_missing = input.col_missing ? input.col_missing : "#f5f5f5";
    let txt_missing = input.txt_missing ? input.txt_missing : "No data";
    const arr = Array.from(new Set(features.map((d) => d.properties[values])));
    let types = input.types ?? arr.filter((d) => d != "" && (d != null) && (d != undefined));

  if (!Array.isArray(colors)){colors = d3[`scheme${colors}`].slice(0, types.length)}else{colors.slice(0, types.length)}



    // if (colors == null) {
    //   colors = d3[`scheme${pal}`].slice(0, types.length);
    // } else {
    //   colors = colors.slice(0, types.length);
    // }

    return {
        getcol: d3.scaleOrdinal().domain(types).range(colors).unknown(col_missing),
        types: types.length == arr.length ? types : [types, txt_missing].flat(),
        colors: types.length == arr.length ? colors : [colors, col_missing].flat()
      };
  }


  // split

  if (typeof input == "object" && input.type == "split") {
    let values = input.values;
    let split = input.split ?? 0;
    let colors = input.colors ? input.colors : ["#F25842", "#4a7cd9"];
    let col_missing = input.col_missing ? input.col_missing : "#f5f5f5";
    let txt_missing = input.txt_missing ? input.txt_missing : "No data";

    const arr = features.map((d) => d.properties[values]);
    const arr2 = arr.filter((d) => d != "" && d != null && d != undefined);

    const getcol = (val) => {
      if (val >= split) return colors[0];
      if (val < split) return colors[1];
      if (val == undefined || val == "") return col_missing;
    };

    return {
      getcol: getcol,
      types:
        arr.length == arr2.length
          ? [`>= ${split}`, `< ${split}`]
          : [[`>= ${split}`, `< ${split}`], txt_missing].flat(),
      colors: arr.length == arr2.length ? colors : [colors, col_missing].flat()
    };

  }


}
