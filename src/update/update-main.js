import { update_geolines } from "./update-geolines.js";
import { update_tissot } from "./update-tissot.js";
import { update_rhumbs } from "./update-rhumbs.js";
import { update_bubble } from "./update-bubble.js";
import { update_square } from "./update-square.js";
import { update_simple } from "./update-simple.js";
import { update_spikes } from "./update-spikes.js";
import { update_header } from "./update-header.js";
import { update_footer } from "./update-footer.js";
import { update_shadow } from "./update-shadow.js";
import { update_ridge } from "./update-ridge.js";

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
  if (attr == "visibility") {
    let val = value ? 1 : 0;

    if (val) {
      svg
        .selectAll(
          `g.${id}, #info_${id}, g.legbox_${id}, g.legboxfill_${id}, g.legboxstroke_${id}, g.legthickness_${id}, g.legcircle_${id}, g.legsquare_${id}, g.legspike_${id}, g.legmushroom_${id}, info_${id},  g.legdotcartogram_${id}`
        )
        .attr("visibility", "visible")
        .transition()
        .delay(delay)
        .duration(duration)
        .style("opacity", 1)
        .attr("opacity", 1);
    } else {
      svg
        .selectAll(
          `g.${id}, #info_${id}, g.legbox_${id}, g.legboxfill_${id}, g.legboxstroke_${id}, g.legthickness_${id}, g.legcircle_${id}, g.legsquare_${id}, g.legspike_${id}, g.legmushroom_${id}, info_${id},  g.legdotcartogram_${id}`
        )
        .transition()
        .delay(delay)
        .duration(duration)
        .style("opacity", 0)
        .attr("opacity", 0)
        .transition()
        .attr("visibility", "hidden");
    }
  } else {
    let type = JSON.parse(svg.select(`g.${id}`).attr("data-layer"))._type;

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
      case "spikes":
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
      case "shadow":
        console.log("update shadow");
        update_shadow({
          svg,
          id,
          attr,
          value,
          duration,
          delay,
        });
        break;
      case "ridge":
        console.log("update ridge");
        update_ridge({
          svg,
          id,
          attr,
          value,
          duration,
          delay,
          width,
        });
        break;

      case "header":
        console.log("update header");
        update_header({ svg, id, attr, value, duration, delay });
        break;
      case "footer":
        console.log("update footer");
        update_footer({ svg, id, attr, value, duration, delay });
        break;
      case "graticule":
      case "geolines":
        console.log("update default");
        update_geolines({
          svg,
          id,
          attr,
          value,
          duration,
          delay,
        });
        break;
    }
  }
}
