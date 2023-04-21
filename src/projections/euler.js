export function eulerAngles(v0, v1, o0) {
  let t = quatMultiply(
    euler2quat(o0),
    quaternion(lonlat2xyz(v0), lonlat2xyz(v1))
  );
  return quat2euler(t);
}

function quat2euler(t) {
  if (!t) return;

  return [
    (Math.atan2(
      2 * (t[0] * t[1] + t[2] * t[3]),
      1 - 2 * (t[1] * t[1] + t[2] * t[2])
    ) *
      180) /
      Math.PI,
    (Math.asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1])))) *
      180) /
      Math.PI,
    (Math.atan2(
      2 * (t[0] * t[3] + t[1] * t[2]),
      1 - 2 * (t[2] * t[2] + t[3] * t[3])
    ) *
      180) /
      Math.PI,
  ];
}

function quatMultiply(q1, q2) {
  if (!q1 || !q2) return;

  var a = q1[0],
    b = q1[1],
    c = q1[2],
    d = q1[3],
    e = q2[0],
    f = q2[1],
    g = q2[2],
    h = q2[3];

  return [
    a * e - b * f - c * g - d * h,
    b * e + a * f + c * h - d * g,
    a * g - b * h + c * e + d * f,
    a * h + b * g - c * f + d * e,
  ];
}

function lonlat2xyz(coord) {
  let lon = (coord[0] * Math.PI) / 180;
  let lat = (coord[1] * Math.PI) / 180;
  let x = Math.cos(lat) * Math.cos(lon);
  let y = Math.cos(lat) * Math.sin(lon);
  let z = Math.sin(lat);
  return [x, y, z];
}

function cross(v0, v1) {
  return [
    v0[1] * v1[2] - v0[2] * v1[1],
    v0[2] * v1[0] - v0[0] * v1[2],
    v0[0] * v1[1] - v0[1] * v1[0],
  ];
}

function dot(v0, v1) {
  for (var i = 0, sum = 0; v0.length > i; ++i) sum += v0[i] * v1[i];
  return sum;
}

function quaternion(v0, v1) {
  if (v0 && v1) {
    let w = cross(v0, v1), // vector pendicular to v0 & v1
      w_len = Math.sqrt(dot(w, w)); // length of w
    if (w_len == 0) return;
    let theta = 0.5 * Math.acos(Math.max(-1, Math.min(1, dot(v0, v1)))),
      qi = (w[2] * Math.sin(theta)) / w_len,
      qj = (-w[1] * Math.sin(theta)) / w_len,
      qk = (w[0] * Math.sin(theta)) / w_len,
      qr = Math.cos(theta);

    return theta && [qr, qi, qj, qk];
  }
}

function euler2quat(e) {
  if (!e) return;
  let roll = (0.5 * e[0] * Math.PI) / 180,
    pitch = (0.5 * e[1] * Math.PI) / 180,
    yaw = (0.5 * e[2] * Math.PI) / 180,
    sr = Math.sin(roll),
    cr = Math.cos(roll),
    sp = Math.sin(pitch),
    cp = Math.cos(pitch),
    sy = Math.sin(yaw),
    cy = Math.cos(yaw),
    qi = sr * cp * cy - cr * sp * sy,
    qj = cr * sp * cy + sr * cp * sy,
    qk = cr * cp * sy - sr * sp * cy,
    qr = cr * cp * cy + sr * sp * sy;

  return [qr, qi, qj, qk];
}
