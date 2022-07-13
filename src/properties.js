import {
  table,
  remove,
  keep,
  add,
  filter,
  subset,
  head,
  tail,
} from "geotoolbox";
const geo = Object.assign(
  {},
  { table, remove, keep, add, filter, subset, head, tail }
);
export let properties = {
  table: geo.table,
  remove: function remove({ geojson, field }) {
    return geo.remove({ x: geojson, field });
  },
  keep: function keep({ geojson, field }) {
    return geo.keep({ x: geojson, field });
  },
  add: function add({ geojson, field, expression }) {
    return geo.add({ x: geojson, field, expression });
  },
  filter: function filter({ geojson, expression }) {
    return geo.filter({ x: geojson, expression });
  },
  subset: function subset({ geojson, field, selection, inverse }) {
    return geo.subset({ x: geojson, field, selection, inverse });
  },
  head: function head({ geojson, field, nb }) {
    return geo.head({ x: geojson, field, nb });
  },
  tail: function tail({ geojson, field, nb }) {
    return geo.tail({ x: geojson, field, nb });
  },
};
