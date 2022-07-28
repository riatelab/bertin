import { tile } from "d3-tile";
import { geoPath } from "d3-geo";
const d3 = Object.assign({}, { tile, geoPath });

import { text } from "./text.js";

export function tiles(selection, width, height, projection, options = {}) {
  let display = options.display == false ? false : true;
  if (display) {
    let opacity = options.opacity != undefined ? options.opacity : 1;
    let tileSize = options.tileSize != undefined ? options.tileSize : 512;
    let github = options.zoomDelta != undefined ? options.zoomDelta : 0;
    let clip = options.clip != undefined ? options.clip : undefined;
    let style = options.style ? options.style : "opentopomap";
    let zoomDelta = options.zoomDelta != undefined ? options.zoomDelta : 1;
    let increasetilesize =
      options.increasetilesize != undefined ? options.increasetilesize : 1;
    let source = options.source ? options.source : "bottomright";

    // styles: https://leaflet-extras.github.io/leaflet-providers/preview/
    const styles = [
      {
        name: "openstreetmap",
        provider: "OpenStreetMap contributors",
        url: (x, y, z) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
      },
      {
        name: "opentopomap",
        provider: "OpenStreetMap contributors",
        url: (x, y, z) => `https://tile.opentopomap.org/${z}/${x}/${y}.png`,
      },
      {
        name: "worldterrain",
        provider: "USGS, Esri, TANA, DeLorme, and NPS",
        url: (x, y, z) =>
          `https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/${z}/${y}/${x}.png`,
      },
      {
        name: "worldimagery",
        provider:
          "Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        url: (x, y, z) =>
          `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}.png`,
      },
      {
        name: "worldStreet",
        provider:
          "Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
        url: (x, y, z) =>
          `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/${z}/${y}/${x}.png`,
      },
      {
        name: "worldphysical",
        provider: "Esri, US National Park Service",
        url: (x, y, z) =>
          `https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/${z}/${y}/${x}`,
      },
      {
        name: "shadedrelief",
        provider: "ESRI",
        url: (x, y, z) =>
          `https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/${z}/${y}/${x}.png`,
      },
      {
        name: "oceanbasemap",
        provider:
          "GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri",
        url: (x, y, z) =>
          `https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/${z}/${y}/${x}.png`,
      },
    ];

    let url = styles.find((d) => d.name == style).url;

    let tile = d3
      .tile()
      .size([width, height])
      .scale(projection.scale() * 2 * Math.PI)
      .translate(projection([0, 0]))
      .tileSize(tileSize)
      .zoomDelta(zoomDelta);

    const id =
      Date.now().toString(36) + Math.random().toString(36).substring(2);

    if (clip) {
      selection
        .append("clipPath")
        .attr("id", `tileclip_${id}`)
        .append("path")
        .datum(clip)
        .attr("d", d3.geoPath(projection));
    }

    selection
      .append("g")
      .attr("clip-path", `url(#tileclip_${id}`)
      .selectAll("image")
      .data(tile())
      .join("image")
      .attr("xlink:href", (d) => url(d[0], d[1], d[2]))
      .attr("x", (d) => Math.round((d[0] + tile().translate[0]) * tile().scale))
      .attr("y", (d) => Math.round((d[1] + tile().translate[1]) * tile().scale))
      .attr("width", tile().scale + increasetilesize + "px")
      .attr("height", tile().scale + increasetilesize + "px")
      .attr("opacity", opacity);

    text(
      selection,
      width,
      height,
      (options = {
        text: `Source: ${styles.find((d) => d.name == style).provider}`,
        position: source,
        fontSize: 12,
        fill: "white",
        frame_fill: "black",
        frame_opacity: 0.3,
        fontFamily: "Roboto",
        margin: 6,
      })
    );
  }
}
