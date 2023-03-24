import { getattr } from "../helpers/getattr.js";
import { update_default } from "./update-default.js";
import { update_tissot } from "./update-tissot.js";
import { update_rhumbs } from "./update-rhumbs.js";
import { update_bubble } from "./update-bubble.js";
import { update_simple } from "./update-simple.js";

export function update_main({
  svg,
  projection,
  width,
  height,
  id = null,
  attr = null,
  value = null,
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
        projection,
        duration,
        delay,
      });
      break;
    case "simple":
      console.log("update simple");
      update_simple({ svg, id, attr, width, height, value, duration, delay });
      break;
    default:
      console.log("update default");
      update_default({ svg, id, attr, value, duration, delay });
  }
}
