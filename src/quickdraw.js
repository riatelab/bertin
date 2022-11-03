import { draw } from "./draw.js";
import { figuration } from "./helpers/figuration.js";

export function quickdraw(layers, w = 1000, m = 5) {
  let cols = [
    "#66c2a5",
    "#fc8d62",
    "#8da0cb",
    "#e78ac3",
    "#a6d854",
    "#ffd92f",
    "#e5c494",
    "#b3b3b3",
  ];

  let used = [];

  if (Array.isArray(layers)) {
    let myarray = [];
    layers.forEach((x) => {
      let remainingcols = cols.filter((x) => !used.includes(x));

      let col;
      if (remainingcols.length > 0) {
        col = remainingcols[Math.floor(Math.random() * remainingcols.length)];
        used.push(col);
      } else {
        col = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
      }

      let stroke;
      let fill;

      // Auto colors
      if (figuration(x) == "l") {
        stroke = col;
        fill = "none";
      }

      if (figuration(x) == "p" || figuration(x) == "z") {
        stroke = "none";
        fill = col;
      }

      myarray.push({
        type: "layer",
        geojson: x,
        fill,
        stroke,
      });
    });

    return draw({ params: { margin: m, width: w }, layers: myarray });
  } else {
    return draw({
      params: { margin: m, width: w },
      layers: [
        {
          type: "layer",
          geojson: layers,
        },
      ],
    });
  }
}

// import { draw } from "./draw.js";

// export function quickdraw(layers, w = 1000, m = 5){
//   if (Array.isArray(layers)) {
//     let myarray = [];
//     layers.forEach((x) => myarray.push({ type: "layer", geojson: x }));

//     return draw({ params: { margin: m, width: w }, layers: myarray });
//   } else {
//     return draw({
//       params: { margin: m, width: w },
//       layers: [
//         {
//           type: "layer",
//           geojson: layers
//         }
//       ]
//     });
//   }
// }
