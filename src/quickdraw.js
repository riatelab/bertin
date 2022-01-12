import { draw } from "./draw.js";

export function quickdraw(layers, w = 1000, m = 5){
  if (Array.isArray(layers)) {
    let myarray = [];
    layers.forEach((x) => myarray.push({ type: "layer", geojson: x }));

    return draw({ params: { margin: m, width: w }, layers: myarray });
  } else {
    return draw({
      params: { margin: m, width: w },
      layers: [
        {
          type: "layer",
          geojson: layers
        }
      ]
    });
  }
}
