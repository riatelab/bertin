# bertin

***An easy to use wrapper around d3js to facilitate the process of making thematic maps***

## Testing phase

> npm publish --dry-run

https://observablehq.com/d/4113b173ec452c29

## Installation

### In browser

```html
<script src="index.min.js" charset="utf-8"></script>
```

### In observable

~~~js
bertin = require("https://bundle.run/bertin@0.0.34")
~~~

## Documentation

<b>plot</b>() is the main function of the library. It allows you to make various thematic maps. It allows to display and overlay different types of layers listed below. The layers written on top are displayed first.
Plot is the main function of the library. It allows you to make various thematic maps. It allows to display and overlay different types of layers listed below. The layers written on top are displayed first.

#### Global parameters

#### Layers


<details><summary>type: text</summary>
<br/>
The text layer....

Parameters:

- <b>position</b>: position of the text. It can be an array with x,y coordinates. For example [100,200]. It can be also a string defining the position. "topleft", "top", "topright", "left", "middle", "right", "bottomleft", "bottom", "bottomright" (default: "topleft")
- <b>text</b>: text to display. With the backticks, it is possible to display a text on several lines (default: "Your text here!")
- <b>fontsize</b>: text size (default: 15)
- <b>margin</b>: Margin around the text (default: 0)
- <b>anchor</b>: Text anchor. start, middle, end (default: "start")
- <b>baseline</b>: alignment baseline. "baseline", "middle", "hanging" (default:"hanging")
- <b>fill</b>: Text color (default: "#474342")
- <b>stroke</b>: Stroke color (default: "none")
- <b>frame_fill</b>: Frame background color (default:"none")
- <b>frame_stroke</b>: Frame stroke color (default: "none")
- <b>frame_strokewidth</b>: Thickness of the frame contour (default: 1)
- <b>frame_opacity</b>: Frame opacity (default: 1)

Example

https://observablehq.com/d/95fcfac18b213daf

</details>

<details><summary>type: outline</summary>
xxxx
</details>


<details><summary>type: text</summary>
xxxx
</details>

#### Legend

xxxx

_______________


#### Match() [source]() [examples]()

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

Example

~~~js
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="http://localhost/npm_test/bertin/index.min.js"></script>
<script>
  d3.json(
  "https://gisco-services.ec.europa.eu/distribution/v2/countries/geojson/CNTR_RG_60M_2020_4326.geojson"
).then(r =>
document.body.appendChild(bertin.plot({
  layers: [{ type: "layer", geojson: r,  tooltip: ["CNTR_ID", "CNTR_NAME", ""] }]
})));
</script>
~~~

<ins>type: prop</ins>

* All these parameters are optional.*
