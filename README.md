# bertin

bertin.js is an easy to use wrapper around d3js to facilitate the process of making thematic maps for the web. It works within [Observable](https://observablehq.com/)

**<ins>Testing phase</ins>**

> npm publish --dry-run

https://observablehq.com/d/4113b173ec452c29

To load the library:
~~~js
bertin = require("https://bundle.run/bertin@0.0.34")
~~~

### Match() [source]() [examples]()

**match()** returns a chart showing the quality of the compatibility between the data and the basemap.

~~~js
match(geojson, geom_id, data, data_id)
~~~

with

- geojson: a geojson
- geom_id: id for geometries
- data: data file in json
- data_id: id for data

~~~js
match(countries, geom_id, maddison, data_id).unmatched_data
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


### plot()

<ins>Global parameters</ins>

- width: wdth of the map (default: 1000)
- projection: map projection (default: d3.geoPatterson())
- extent: a geojson to determine the extent of the map (default:null)

*All these parameters are optional.*

<ins>type: outline</ins>

* All these parameters are optional.

<ins>type: graticule</ins>

* All these parameters are optional.*

<ins>type: header</ins>

* All these parameters are optional.*

<ins>type: footer</ins>

* All these parameters are optional.*

<ins>type: layer</ins>

* All these parameters are optional.*

<ins>type: prop</ins>

* All these parameters are optional.*

<ins>type: text</ins>

<details><summary>type: text</summary>
<p>

Required

- x: position in x
- y: position in y
- text: text to display. With the backticks, it is possible to display a text on several lines (default: "Your text here!")

Optional

- fontsize: text size (default: 15)
- margin: Margin around the text (default: 0)
- anchor: Text anchor. start, middle, end (default: "start")
- baseline: alignment baseline. "baseline", "middle", "hanging" (default:"hanging")
- fill: Text color (default: "#474342")
- stroke Stroke color (default: "none")
- frame_fill: Frame background color (default:"none")
- frame_stroke: Frame stroke color (default: "none")
- frame_strokewidth. Thickness of the frame contour (default: 1)
- frame_opacity: Frame opacity (default: 1)

Example

~~~js

~~~

</p>
</details>
