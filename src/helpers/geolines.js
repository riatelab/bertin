export function geolines() {
  let features = [];
  let arr = [
    ["Equator", 0],
    ["Tropic of Cancer", 23.43656],
    ["Tropic of Capricorn", -23.43636],
    ["Arctic Circle", 66.56345],
    ["Antarctic Circle", -66.56364],
  ];

  arr.forEach((d) => {
    features.push({
      type: "Feature",
      properties: { name: d[0], latitude: d[1] },
      geometry: line(d[1]),
    });
  });

  return { type: "FeatureCollection", features: features };
}

function line(lat) {
  let arr = [];
  let i = -180;
  while (i <= 180) {
    arr.push([i, lat]);
    i += 2.5;
  }
  return { type: "MultiLineString", coordinates: [arr] };
}
