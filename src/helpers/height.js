import { geoPath, geoBounds } from "d3-geo";
const d3 = Object.assign({}, { geoPath, geoBounds });

export function getheight(layers, extent, margin, projection, planar, width) {
  let ref;

  const geojsons = layers
    .map((d) => d.geojson)
    .filter((d) => d !== undefined).length;

  const types = layers.map((d) => d.type);

  // case1:  if outline is defined -> world extent
  if (
    !extent &&
    (types.includes("outline") ||
      types.includes("tissot") ||
      types.includes("geolines")) &&
    !planar
  ) {
    ref = { type: "Sphere" };
  }

  // case2 : extent defined by layers
  if (
    (!extent &&
      geojsons > 0 &&
      !types.includes("outline") &&
      !types.includes("tissot") &&
      !types.includes("geolines")) ||
    planar
  ) {
    let l = layers.map((d) => d.geojson).filter((d) => d !== undefined);
    let all = [];

    l.forEach((d) => all.push(d.features));

    ref = {
      type: "FeatureCollection",
      features: all.flat(),
    };
  }

  // case 3: ony tiles -> world extent
  if (!extent && geojsons == 0 && types.includes("tiles")) {
    ref = { type: "Sphere" };
  }

  // case 4: defined extent in params
  if (extent) {
    ref = extent;
  }

  // Adapt scale
  const [[x0, y0], [x1, y1]] = d3
    .geoPath(projection.fitWidth(width - margin[1] - margin[3], ref))
    .bounds(ref);

  let trans = projection.translate();

  projection.translate([trans[0] + margin[3], trans[1] + margin[0]]);

  // Return
  return {
    height: Math.ceil(y1 - y0) + margin[0] + margin[2],
    bbox: d3.geoBounds(ref),
  };
}
