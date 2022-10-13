import { table } from "./helpers/table.js";
import { remove } from "./helpers/remove.js";
import { keep } from "./helpers/keep.js";
import { add } from "./helpers/add.js";
import { filter } from "./helpers/filter.js";
import { subset } from "./helpers/subset.js";
import { head } from "./helpers/head.js";
import { tail } from "./helpers/tail.js";

const prop = Object.assign(
  {},
  { table, remove, keep, add, filter, subset, head, tail }
);
export let properties = {
  table: prop.table,
  remove: function remove({ geojson, field }) {
    return prop.remove({ x: geojson, field });
  },
  keep: function keep({ geojson, field }) {
    return prop.keep({ x: geojson, field });
  },
  add: function add({ geojson, field, expression }) {
    return prop.add({ x: geojson, field, expression });
  },
  filter: function filter({ geojson, expression }) {
    return prop.filter({ x: geojson, expression });
  },
  subset: function subset({ geojson, field, selection, inverse }) {
    return prop.subset({ x: geojson, field, selection, inverse });
  },
  head: function head({ geojson, field, nb }) {
    return prop.head({ x: geojson, field, nb });
  },
  tail: function tail({ geojson, field, nb }) {
    return prop.tail({ x: geojson, field, nb });
  },
};
