import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3scale from "d3-scale";
import * as d3array from "d3-array";
import * as d3scalechromatic from "d3-scale-chromatic";
const d3 = Object.assign({}, d3selection, d3scalechromatic, d3array, d3geo, d3scale);
import {addtooltip } from "./tooltip.js";
import {legtypo } from "./leg-typo.js";

export function layertypo(selection, projection, clipid, options = {}){
  let geojson = options.geojson;
  let data = options.data;
  let id_geojson = options.id_geojson;
  let id_data = options.id_data;
  let var_data = options.var_data;
  let colors = options.colors ? options.colors : null;
  let pal = options.pal ? options.pal : "Tableau10";
  let col_missing = options.col_missing ? options.col_missing : "#f5f5f5";
  let stroke = options.stroke ? options.stroke : "white";
  let strokewidth = options.strokewidth ? options.strokewidth : 0.5;
  let fillopacity = options.fillopacity ? options.fillopacity : 1;
  let tooltip = options.tooltip ? options.tooltip : "";

  let leg_x = options.leg_x ? options.leg_x : null;
  let leg_y = options.leg_y ? options.leg_y : null;
  let leg_w = options.leg_w ? options.leg_w : 30;
  let leg_h = options.leg_h ? options.leg_h : 20;
  let leg_title = options.leg_title ? options.leg_title : null;
  let leg_fontsize = options.leg_fontsize ? options.leg_fontsize : 14;
  let leg_fontsize2 = options.leg_fontsize2 ? options.leg_fontsize2 : 10;
  let leg_stroke = options.leg_stroke ? options.leg_stroke : "black";
  let leg_fillopacity = options.fillopacity ? options.fillopacity : 1;
  let leg_strokewidth = options.leg_strokewidth ? options.leg_strokewidth : 0.5;
  let leg_txtcol = options.leg_txtcol ? options.leg_txtcol : "#363636";

  // Get types only available in the basemap
  let ids_geojson = geojson.features.map((d) => d.properties[id_geojson]);
  let ids_data = data.filter((d) => d[var_data] != null).map((d) => d[id_data]);
  let match = ids_geojson.filter((x) => ids_data.includes(x));
  let merge = data.filter((x) => match.includes(x[id_data]));
  let types = Array.from(new Set(merge.map((d) => d[var_data])));
  let databyid = d3.index(data, (d) => d[id_data]);

  // colors
  if (colors == null) {
    colors = d3[`scheme${pal}`].slice(0, types.length);
  } else {
    colors = colors.slice(0, types.length);
  }
  let getcolor = d3.scaleOrdinal().domain(types).range(colors);
  let cols = new Map(data.map((d) => [d[id_data], getcolor(d[var_data])]));

  let path = d3.geoPath(projection);

  selection
    .append("g")
    .attr(":inkscape:groupmode", "layer")
    .attr("id", "typo layer")
    .attr(":inkscape:label", "typo layer")
    .selectAll("path")
    .data(geojson.features)
    .join("path")
    .attr("d", path)
    .attr("fill", (d) =>
      cols.get(d.properties[id_geojson])
        ? cols.get(d.properties[id_geojson])
        : col_missing
    )
    .attr("stroke", stroke)
    .attr("stroke-width", strokewidth)
    .attr("fill-opacity", fillopacity)
    .attr("clip-path", `url(#clip_${clipid}`)
    .on("touchmove mousemove", function (event, d) {
      if (tooltip != "") {
        if (Array.isArray(tooltip)) {
          selection
            .select("#info")
            .call(
              addtooltip,
              `${databyid.get(d.properties[id_geojson])[tooltip[0]]}\n${
                databyid.get(d.properties[id_geojson])[tooltip[1]]
              }\n${tooltip[2]}`
            );
        } else {
          selection.select("#info").call(addtooltip, `${d[tooltip]}`);
        }
      }
      if (tooltip != "") {
        selection
          .select("#info")
          .attr("transform", `translate(${d3.pointer(event, this)})`);
        d3.select(this)
          .attr("stroke-width", strokewidth + 0.5)
          .attr("fill-opacity", fillopacity - 0.3);
      }
    })
    .on("touchend mouseleave", function () {
      selection.select("#info").call(addtooltip, null);
      d3.select(this)
        .attr("stroke-width", strokewidth)
        .attr("fill-opacity", fillopacity);
    });

    // Legend

    legtypo(selection, {
      x: leg_x,
      y: leg_y,
      w: leg_w,
      h: leg_h,
      stroke: leg_stroke,
      fillopacity: leg_fillopacity,
      strokewidth: leg_strokewidth,
      txtcol: leg_txtcol,
      title: leg_title,
      fontsize: leg_fontsize,
      fontsize2: leg_fontsize2,
      types: types,
      colors: colors
    });

}