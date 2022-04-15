import {legchoro } from "./leg-choro.js"
import {legtypo } from "./leg-typo.js";
import {legthicknessabs } from "./leg-thickness-abs.js";
import {legthicknessrel } from "./leg-thickness-rel.js";
import {chorotypo } from "./chorotypo.js";
import {thickness } from "./thickness.js";


export function legends(geojson, selection, fill, stroke, strokeWidth){


if (typeof fill == "object" && fill.type == "choro") {
legchoro(selection, {
    x: fill.leg_x,
    y: fill.leg_y,
    w: fill.leg_w,
    h: fill.leg_h,
    stroke: fill.leg_stroke,
    fillOpacity: fill.leg_fillOpacity,
    strokeWidth: fill.leg_strokeWidth,
    txtcol: fill.leg_txtcol,
    title: fill.leg_title ? fill.leg_title : fill.values,
    fontSize: fill.leg_fontSize,
    fontSize2: fill.leg_fontSize2,
    breaks: chorotypo(geojson.features, fill).breaks,
    colors: chorotypo(geojson.features, fill).colors,
    missing: chorotypo(geojson.features, fill).missing
  });
}

if (typeof stroke == "object" && stroke.type == "choro") {
  legchoro(selection, {
    x: stroke.leg_x,
    y: stroke.leg_y,
    w: stroke.leg_w,
    h: stroke.leg_h,
    stroke: stroke.leg_stroke,
    fillOpacity: stroke.leg_fillOpacity,
    strokeWidth: stroke.leg_strokeWidth,
    txtcol: stroke.leg_txtcol,
    title: stroke.leg_title ? stroke.leg_title : stroke.values,
    fontSize: stroke.leg_fontSize,
    fontSize2: stroke.leg_fontSize2,
    breaks: chorotypo(geojson.features, stroke).breaks,
    colors: chorotypo(geojson.features, stroke).colors,
    missing: chorotypo(geojson.features, stroke).missing
  });
}

if (typeof fill == "object" && (fill.type == "typo" || fill.type == "split")) {
legtypo(selection, {
    x: fill.leg_x,
    y: fill.leg_y,
    w: fill.leg_w,
    h: fill.leg_h,
    stroke: fill.leg_stroke,
    fillOpacity: fill.leg_fillOpacity,
    strokeWidth: fill.leg_strokeWidth,
    txtcol: fill.leg_txtcol,
    title: fill.leg_title ? fill.leg_title : fill.values,
    fontSize: fill.leg_fontSize,
    fontSize2: fill.leg_fontSize2,
    types: chorotypo(geojson.features, fill).types,
    colors: chorotypo(geojson.features, fill).colors
  });
}

if (typeof stroke == "object" && (stroke.type == "typo" || stroke.type == "split")) {
legtypo(selection, {
    x: stroke.leg_x,
    y: stroke.leg_y,
    w: stroke.leg_w,
    h: stroke.leg_h,
    stroke: stroke.leg_stroke,
    fillOpacity: stroke.leg_fillOpacity,
    strokeWidth: stroke.leg_strokeWidth,
    txtcol: stroke.leg_txtcol,
    title: stroke.leg_title ? stroke.leg_title : stroke.values,
    fontSize: stroke.leg_fontSize,
    fontSize2: stroke.leg_fontSize2,
    types: chorotypo(geojson.features, stroke).types,
    colors: chorotypo(geojson.features, stroke).colors
  });
}

if (typeof strokeWidth == "object" && strokeWidth.values != undefined && (strokeWidth.type == "abs" ||strokeWidth.type == undefined)) {
  legthicknessabs(selection, {
  x: strokeWidth.leg_x,
  y: strokeWidth.leg_y,
  valmax: thickness(geojson.features, strokeWidth).valmax,
  sizemax: thickness(geojson.features, strokeWidth).sizemax,
  title: strokeWidth.leg_title ?? strokeWidth.values,
  fontSize: strokeWidth.leg_fontSize,
  fontSize2: strokeWidth.leg_fontSize2,
  fill: strokeWidth.stroke,
  fillOpacity: strokeWidth.fillOpacity,
  txtcol: strokeWidth.leg_txtcol,
  w: strokeWidth.leg_w,
  round: strokeWidth.leg_round
});
}

if (typeof strokeWidth == "object" && strokeWidth.values != undefined && strokeWidth.type == "rel") {
  legthicknessrel(selection, {

    x: strokeWidth.leg_x,
    y: strokeWidth.leg_y,
    breaks:thickness(geojson.features, strokeWidth).breaks,
    sizes: thickness(geojson.features, strokeWidth).sizes,
    w: strokeWidth.leg_w,
    title: strokeWidth.leg_title ?? strokeWidth.values,
    fontSize: strokeWidth.leg_fontSize,
    fontSize2: strokeWidth.leg_fontSize2,
    stroke: strokeWidth.stroke,
    strokeOpacity: strokeWidth.strokeOpacity,
    txtcol: strokeWidth.leg_txtcol

});

}

if (typeof strokeWidth == "object" && strokeWidth.values != undefined && strokeWidth.type == "quali") {
  legthicknessquali(selection, {

    x: strokeWidth.leg_x,
    y: strokeWidth.leg_y,
    categories:thickness(geojson.features, strokeWidth).categories,
    sizes: thickness(geojson.features, strokeWidth).sizes,
    w: strokeWidth.leg_w,
    title: strokeWidth.leg_title ?? "Catégories",
    fontSize: strokeWidth.leg_fontSize,
    fontSize2: strokeWidth.leg_fontSize2,
    stroke: strokeWidth.stroke,
    strokeOpacity: strokeWidth.strokeOpacity,
    txtcol: strokeWidth.leg_txtcol

});

}


}
