export function table2geo(data, lat, lon) {
  let arr = JSON.parse(JSON.stringify(data));

  let coords = lat;

  // check fields
  if (lat == undefined && lon == undefined && coords == undefined) {
    let checkcoords = [
      "coords",
      "Coords",
      "coord",
      "Coords",
      "Coordinates",
      "coordinates",
      "Coordinate",
      "coordinate",
    ];
    let checklat = ["lat", "Lat", "LAT", "Latitude", "latitude"];
    let checklon = [
      "lon",
      "Lon",
      "LON",
      "lng",
      "Lng",
      "LNG",
      "Longitude",
      "longitude",
    ];

    let keys = [];
    arr.forEach((d) => keys.push(Object.keys(d)));
    keys = Array.from(new Set(keys.flat()));

    lat = checklat.filter((d) => keys.includes(d))[0];
    lon = checklon.filter((d) => keys.includes(d))[0];
    coords = checkcoords.filter((d) => keys.includes(d))[0];
  }

  // case1: lat & lng coords in separate columns
  if (lat && lon) {
    let x = lat;
    let y = lon;

    return {
      type: "FeatureCollection",
      features: data.map((d) => ({
        type: "Feature",
        properties: d,
        geometry: {
          type: "Point",
          coordinates: [+d[y], +d[x]],
        },
      })),
    };
  }

  // case2: lat & lng coords in a single column

  if (coords) {
    return {
      type: "FeatureCollection",
      features: data.map((d) => ({
        type: "Feature",
        properties: d,
        geometry: {
          type: "Point",
          coordinates: getcoords(d[coords]).reverse(),
        },
      })),
    };
  }

  return coords;
}

function txt2coords(str, sep = ",") {
  str = str.replace(/[ ]+/g, "");
  let coords = str
    .split(sep)
    .map((d) => d.replace(",", "."))
    .map((d) => d.replace(/[^\d.-]/g, ""))
    .map((d) => +d);

  if (coords.length != 2) {
    coords = [undefined, undefined];
  }
  return coords;
}

function wkt2coords(str) {
  let result = str.match(/\(([^)]+)\)/g);
  return result === null
    ? [undefined, undefined]
    : result[0]
        .replace(/\s\s+/g, " ")
        .replace("(", "")
        .replace(")", "")
        .trimStart()
        .trimEnd()
        .split(" ")
        .map((d) => d.replace(",", "."))
        .map((d) => +d);
}

function getcoords(str) {
  return str
    ? str.toLowerCase().includes("point")
      ? wkt2coords(str)
      : txt2coords(str)
    : null;
}
