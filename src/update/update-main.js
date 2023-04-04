import { getattr } from "../helpers/getattr.js";
import { update_default } from "./update-default.js";
import { update_tissot } from "./update-tissot.js";
import { update_rhumbs } from "./update-rhumbs.js";
import { update_bubble } from "./update-bubble.js";
import { update_square } from "./update-square.js";
import { update_simple } from "./update-simple.js";
import { update_spikes } from "./update-spikes.js";

export function update_main({
  svg,
  projection,
  width,
  height,
  id = null,
  attr = null,
  value = null,
  legend = null,
  duration = 0,
  delay = 0,
} = {}) {
  //attr = getattr(attr);
  let type = svg.select(`g.${id}`).attr("type");

  switch (type) {
    case "tissot":
      console.log("update tissot");
      update_tissot({ svg, projection, id, attr, value, duration, delay });
      break;
    case "rhumbs":
      console.log("update rhumbs");
      update_rhumbs({ svg, id, attr, width, height, value, duration, delay });
      break;
    case "bubble":
      console.log("update bubble");
      update_bubble({
        svg,
        id,
        attr,
        width,
        height,
        value,
        legend,
        projection,
        duration,
        delay,
      });
      break;
    case "square":
      console.log("update square");
      update_square({
        svg,
        id,
        attr,
        width,
        height,
        value,
        legend,
        projection,
        duration,
        delay,
      });
      break;
    case "spike":
      console.log("update spike");
      update_spikes({
        svg,
        id,
        attr,
        width,
        height,
        value,
        legend,
        projection,
        duration,
        delay,
      });
      break;
    case "simple":
      console.log("update simple");
      update_simple({
        svg,
        id,
        attr,
        width,
        height,
        value,
        duration,
        delay,
        legend,
      });
      break;
    default:
      console.log("update default");
      update_default({ svg, id, attr, value, duration, delay });
  }
}
