import { forceX, forceY, forceCollide, forceSimulation } from "d3-force";
import { quadtree } from "d3-quadtree";
const d3 = Object.assign(
  {},
  { quadtree, forceX, forceY, forceCollide, forceSimulation }
);

export function simulation_squares(data) {
  return d3
    .forceSimulation(data)
    .force(
      "_x",
      d3.forceX((d) => d._x)
    )
    .force(
      "_y",
      d3.forceY((d) => d._y)
    )
    .force("collide", squareForceCollide());
}

function squareForceCollide() {
  let nodes;

  function force(alpha) {
    const quad = d3.quadtree(
      nodes,
      (d) => d._x,
      (d) => d._y
    );
    for (const d of nodes) {
      quad.visit((q, x1, y1, x2, y2) => {
        let updated = false;
        if (q.data && q.data !== d) {
          let x = d._x - q.data._x,
            y = d._y - q.data._y,
            xSpacing = d._padding + (q.data._size + d._size) / 2,
            ySpacing = d._padding + (q.data._size + d._size) / 2,
            absX = Math.abs(x),
            absY = Math.abs(y),
            l,
            lx,
            ly;

          if (absX < xSpacing && absY < ySpacing) {
            l = Math.sqrt(x * x + y * y);

            lx = (absX - xSpacing) / l;
            ly = (absY - ySpacing) / l;

            // the one that's barely within the bounds probably triggered the collision
            if (Math.abs(lx) > Math.abs(ly)) {
              lx = 0;
            } else {
              ly = 0;
            }
            d._x -= x *= lx;
            d._y -= y *= ly;
            q.data.x += x;
            q.data.y += y;

            updated = true;
          }
        }
        return updated;
      });
    }
  }

  force.initialize = (_) => (nodes = _);

  return force;
}
