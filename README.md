# bertin

bertin.js is an easy to use wrapper around d3js to facilitate the process of making thematic maps for the web.

**<ins>Testing phase</ins>**

> npm publish --dry-run

https://observablehq.com/d/4113b173ec452c29

To load the library:
~~~js
bertin = require("https://bundle.run/bertin@0.0.34")
~~~

### plot()

<ins>Global parameters</ins>

- width: wdth of the map (default: 1000)
- projection: map projection (default: d3.geoPatterson())
- extent: a geojson to determine the extent of the map (default:null)

*All these parameters are optional.*

<ins>type : outline</ins>

* All these parameters are optional.

<ins>type : graticule</ins>

* All these parameters are optional.*

<ins>type : header</ins>

* All these parameters are optional.*

<ins>type : footer</ins>

* All these parameters are optional.*

<ins>type : layer</ins>

* All these parameters are optional.*

<ins>type : prop</ins>

* All these parameters are optional.*


### match()

~~~js
match(geojson, geom_id, data, data_id)
~~~

returns a chart showing the quality of the compatibility between the data and the basemap.


~~~js
match(geojson, geom_id, data, data_id).unmatched_data
~~~

returs an array containing data ids that cannot be joined to the basemap.

On the same principle:

~~~js
match(geojson, geom_id, data, data_id).matched
match(geojson, geom_id, data, data_id).unmatched_geom
match(geojson, geom_id, data, data_id).unmatched_data
match(geojson, geom_id, data, data_id).matched_data
match(geojson, geom_id, data, data_id).matched_geom
~~~
