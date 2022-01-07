# bertin.js

![](./img/banner.png)

*Bertin.js is <ins>**under development**</ins> so not necessarily very stable yet. The names of the functions and the parameters are still subject to change. Bugs will be corrected as they occur. New features will be added in the next versions.*

bertin.js is an easy to use wrapper around [d3js](https://github.com/d3/d3) to facilitate the process of making thematic maps. The principle is to work with layers stacked on each other. As in a GIS, the layers that are displayed above are placed at the top in the code, the layers that are displayed below are placed at the bottom in the code. The layers that can be displayed are of several types: header, footer, graticule, outline, choro, typo, prop, shadow, scalebar, text... Each type has its own parameters. This list will be completed gradually.

### Why Bertin ?

Jacques Bertin (1918-2010) was a French cartographer, whose major contribution was a theoretical and practical reflection on all graphic representations (diagrams, maps and graphs), forming the subject of a fundamental treatise, Graphic Semiology, originally published in 1967. Bertin's influence remains strong in the university teaching of cartography today, but also in the circles of statisticians and data visualization specialists.

## 1. Installation

#### <ins>In browser</ins>

Last version

```html
<script src="https://cdn.jsdelivr.net/npm/bertin" charset="utf-8"></script>
```

Pinned version

```html
<script src="https://cdn.jsdelivr.net/npm/bertin@0.2.2" charset="utf-8"></script>
```

#### <ins>In Observable</ins>

Last version

~~~js
bertin = require("bertin/dist/index.min.js")
~~~

Pinned version

~~~js
bertin = require("bertin@0.2.0/dist/index.min.js")
~~~

## 2. How to use?


#### <ins>In browser</ins>

~~~js
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
<script src="https://cdn.jsdelivr.net/npm/d3-geo-projection@4"></script>
<script src="https://cdn.jsdelivr.net/npm/bertin"></script>

<script>

let geojson = "https://raw.githubusercontent.com/neocarto/bertin/main/data/world.geojson"

d3.json(geojson).then(r =>
document.body.appendChild(bertin.draw({
  params: {
    projection: d3.geoVanDerGrinten4()
  },
  layers: [
      {type: "layer", geojson: r,  tooltip: ["ISO3", "NAMEen", ""] },
      {type:"outline"},
      {type:"graticule"}
    ]
})));

</script>
~~~

See examples [here](https://neocarto.github.io/bertin/examples/layer.html) and [there](https://neocarto.github.io/bertin/examples/layer2.html).

#### <ins>In Observable</ins>

The bertin.js library is really easy to use within Observable. You'll find many examples in [this collection](https://observablehq.com/collection/@neocartocnrs/bertin).

## 3. Documentation

<b>draw</b>() is the main function of the library. It allows you to make various thematic maps. It allows to display and overlay different types of layers listed below. The layers written on top are displayed first.

#### <ins>Global parameters</ins>

In the section *params*, we define the global parameters of the map: its size, projection, background color, etc. To have access to a large number of projections, you will need to load the [d3-geo-projection@4](https://github.com/d3/d3-geo-projection) library. This section is optional.

<details><summary>Code</summary>

~~~js
bertin.draw({
  params: {
    projection: d3.geoBertin1953(),
    width: 750,
  },
  layers: [...]
})
~~~

</details>

<details><summary>Parameters</summary>

- <b>projection</b>: a function defining the map projection. Cf d3-geo-projection@4 (default: d3.geoPatterson())
- <b>width</b>: width of the map (default:1000);
- <b>extent</b>: a feature defing the extent e.g. a country (default: null)
- <b>margin</b>: margin around features to be displayed. This option can be usefull if the stroke is very heavy (default: 1)
- <b>background</b>: color of the background (default: "none")

</details>

#### Choro

The *choro* type aims to draw Choropleth maps. This kind of representation is especially suitable for relative quantitative data (rates, indices, densities).[Source](https://github.com/neocarto/bertin/blob/main/src/layer-choro.js). [Example](https://observablehq.com/d/26db505c71cc6606?collection=@neocartocnrs/bertin)

<details><summary>Code</summary>

~~~js
bertin.draw({
  layers: [{
    {
      type: "choro",
      geojson: countries,
      id_geojson: "ISO3_CODE",
      data: maddison,
      id_data: "countrycode",
      var_data: "gdpppc",
      method: "quantile",
      pal: "Blues"
    }]
})
~~~

</details>

<details><summary>Parameters</summary>

- <b>geojson</b>: a geojson (<ins>compulsory<ins>)
- <b>data</b>: a geojson (<ins>compulsory<ins>)
- <b>id_geojson</b>: a string corresponding to the identifier of the features in the properties (<ins>compulsory<ins>)
- <b>id_data</b>: a string corresponding to the identifier of the features (<ins>compulsory<ins>)
- <b>var_data</b>: a string corresponding to the targeted variable (<ins>compulsory<ins>)
- <b>pal</b>: a palette of categorical colors (default: "Blues") [See](https://observablehq.com/@d3/color-schemes)
- <b>nbreaks</b>: Number of classes (default:5)
- <b>breaks</b>: Class breaks (default:null)
- <b>colors</b>: An array of colors (default: null)
- <b>method</b>: A method of classification. Jenks, q6, quantiles, equal (default: quantiles)
- <b>col_missing</b>: Color for missing values (default "#f5f5f5")
- <b>stroke</b>: stroke color (default: "white")
- <b>strokewidth</b>: Stroke width (default: 0.5)
- <b>fillopacity</b>: Fill opacity (dafault: 1)
- <b>tooltip</b>: an array of 3 values defing what to display within the tooltip. The two first values indicates the name of a field in properties. the third value is a string to indicates the unit (default:"")

Parameters of the legend

- <b>leg_x</b>: position in x (if this value is not filled, the legend is not displayed)
- <b>leg_y</b>: position in y (if this value is not filled, the legend is not displayed)
- <b>leg_w</b>: width of the bof (default: 30)
- <b>leg_h</b>: height of the bof (default:20)
- <b>leg_text</b>: text of the box (default: "text of the box")
- <b>leg_fontsize</b>: text font size (default: 10)
- <b>leg_fill</b>: color of the box (same as the layer displayed)
- <b>leg_stroke</b>: stroke of the box (default: "black")
- <b>leg_strokewidth</b>: stroke-width (default: 0.5)
- <b>leg_fillopacity</b>: stroke opacity (same as the layer displayed)
- <b>leg_txtcol</b>: color of the texte (default: "#363636")
- <b>leg_round</b>: Number of digits (default: undefined)
</details>


#### Footer

The *footer* type allows to display text under the map. This is useful to display sources. [Source](https://github.com/neocarto/bertin/blob/main/src/footer.js).

<details><summary>Code</summary>

~~~js
bertin.draw({
  layers: [{
        type: "footer",
        text: "Source: Worldbank, 2021",
        fontsize: 10
  }]
})
~~~

</details>

<details><summary>Parameters</summary>

- <b>text</b>: text to be displayed (default:"")
- <b>anchor</b>: text anchor. start, middle, end (default:"end")
- <b>fontsize</b>: size of the text (default:15)
- <b>fill</b>: color of the text (default:"#9e9696")
- <b>background</b>: background color (default: "white")
- <b>backgroundopacity</b>: background opacity (default: 1)

</details>


#### Graticule

The *graticule* type allows you to display the latitude and longitude lines.[Source](https://github.com/neocarto/bertin/blob/main/src/graticule.js).

<details><summary>Code</summary>

~~~js
bertin.draw({
  layers: [{
        type: "graticule",
        fill: "#644580",
        step:[20,10]
  }]
})
~~~

</details>

<details><summary>Parameters</summary>

- <b>stroke</b>: stroke color (default:"white")
- <b>strokewidth</b>: stroke width (default:0.8)
- <b>strokeopacity</b>: stroke opacity (default:0.5)
- <b>strokedasharray</b>stroke-dasharray (default:2)
- <b>step</b>: gap between graticules. The value can be a number or an array of two values (default:[10, 10])

</details>

#### Header

The *header* type allows to display a title above the map. [Source](https://github.com/neocarto/bertin/blob/main/src/header.js).

<details><summary>Code</summary>

~~~js
bertin.draw({
  layers: [{
        type: "header",
        text: "Title of the map",
        fontsize: 40
  }]
})
~~~

</details>

<details><summary>Parameters</summary>

- <b>text</b>: text to be displayed (default:"")
- <b>anchor</b>: text anchor. start, middle, end (default:"middle")
- <b>fontsize</b>: size of the text (default:20)
- <b>fill</b>: color of the text (default:"#9e9696")
- <b>background</b>: background color (default: "white")
- <b>backgroundopacity</b>: background opacity (default: 1)

</details>

#### Layer

The *layer* type allows to display a simple geojson layer.[Source](https://github.com/neocarto/bertin/blob/main/src/layer-simple.js). [Example](https://observablehq.com/d/d59855d7cc99f6e5?collection=@neocartocnrs/bertin)

<details><summary>Code</summary>

~~~js
bertin.draw({
  layers: [
    {
      type: "layer",
      geojson: *a geojson here*,
      fill: "#e6acdf",
      tooltip: ["CNTR_ID", "CNTR_NAME", ""]
    }
  ]
})
~~~

</details>

<details><summary>Parameters</summary>

- <b>geojson</b>: a geojson (<ins>compulsory<ins>)
- <b>fill</b>: fill color (default: a random color)
- <b>stroke</b>: stroke color (default: "white")
- <b>strokewidth</b> stroke width (default:0.5)
- <b>fillopacity</b>: fill opacity (default:1)
- <b>tooltip</b> an array of 3 values defing what to display within the tooltip. The two first values indicates the name of a field in properties. the third value is a string to indicates the unit (default:"")

Parameters of the legend

- <b>leg_x</b>: position in x (if this value is not filled, the legend is not displayed)
- <b>leg_y</b>: position in y (if this value is not filled, the legend is not displayed)
- <b>leg_w</b>: width of the bof (default: 30)
- <b>leg_h</b>: height of the bof (default:20)
- <b>leg_title</b>: title of the legend (default; null)
- <b>leg_text</b>: text of the box (default: "text of the box")
- <b>leg_fontsize</b>: title legend font size (default: 14)
- <b>leg_fontsize2</b>: values font size (default: 10)
- <b>leg_fill</b>: color of the box (same as the layer displayed)
- <b>leg_stroke</b>: stroke of the box (default: "black")
- <b>leg_strokewidth</b>: stroke-width (default: 0.5)
- <b>leg_fillopacity</b>: stroke opacity (same as the layer displayed)
- <b>leg_txtcol</b>: color of the texte (default: "#363636")

</details>

#### Match

*match()* is a function to evaluate the quality of a join between the data and the background map. It returns a chart. [Source](https://github.com/neocarto/bertin/blob/main/src/match.js) [Example](https://observablehq.com/d/608ed06a679bfeca?collection=@neocartocnrs/bertin)

<details><summary>Code</summary>

~~~js
let testjoin = bertin.match(countries, "ISO3_CODE", maddison, "countrycode")
~~~

*.matched* returns an array containing matched ids

~~~js
testjoin.matched
~~~

*.matched_data* returns an array containing matched data ids

~~~js
testjoin.matched_data
~~~

*.unmatched_data* returns an array containing unmatched data ids

~~~js
testjoin.unmatched_data
~~~

*.unmatched_geom* returns an array containing unmatched geom ids

~~~js
testjoin.unmatched_geom
~~~

</details>

<details><summary>Parameters</summary>

- <b>geojson</b>: a geojson (<ins>compulsory<ins>)
- <b>id_geojson</b>: a string corresponding to the identifier of the features in the properties (<ins>compulsory<ins>)
- <b>data</b>: a geoj (<ins>compulsory<ins>)
- <b>id_data</b>: a string corresponding to the identifier of the features (<ins>compulsory<ins>)

</details>


#### Mashroom

The *mashroom* type is used to draw a map with 2 supperposed proportional semi-circles. This type of representation can be used when 2 data with the same order of magnitude need to be compressed. [Source](https://github.com/neocarto/bertin/blob/main/src/layer-mashroom.js) [Example](https://observablehq.com/d/3c51f698ba19546c?collection=@neocartocnrs/bertin)

<details><summary>Code</summary>

~~~js
  bertin.draw({
    layers: [
      {
        type: "mashroom",
        geojson: mygeojson,
        id_geojson: "ids",
        data: mydata,
        id_data: "ids",
        top_var: "gdp_pct",
        bottom_var: "pop_pct",
        bottom_tooltip: ["name", "pop", "(thousands inh.)"],
        top_tooltip: ["name", "gdp", "(million $)"]
      }
    ]
  })
~~~

</details>

<details><summary>Parameters</summary>

- <b>geojson</b>: a geojson (<ins>compulsory<ins>)
- <b>data</b>: a geoj (<ins>compulsory<ins>)
- <b>id_geojson</b>: a string corresponding to the identifier of the features in the properties (<ins>compulsory<ins>)
- <b>id_data</b>: a string corresponding to the identifier of the features (<ins>compulsory<ins>)
- <b>top_var</b>: a string corresponding to the targeted top variable (<ins>compulsory<ins>)
- <b>top_fill</b>: top fill color (default: "#d64f4f")
- <b>bottom_var</b>: a string corresponding to the targeted bottom variable (<ins>compulsory<ins>)
- <b>bottom_fill</b>: bottom fill color (default: "#4fabd6")
- <b>k</b>: size of the largest semi circle (defaul:50)
- <b>stroke</b>: stroke color (default: "white")
- <b>strokewidth</b>: stroke width (default: 0.5)
- <b>fillopacity</b>: fill opacity (default: 1)
- <b>top_tooltip</b>: an array of 3 values defing what to display within the tooltip. The two first values indicates the name of a field in properties. the third value is a string to indicates the unit (default:"")
- <b>bottom_tooltip</b>: an array of 3 values defing what to display within the tooltip. The two first values indicates the name of a field in properties. the third value is a string to indicates the unit (default:"")

Parameters of the legend

- <b>leg_x</b>: position in x (if this value is not filled, the legend is not displayed)
- <b>leg_y</b>: position in y (if this value is not filled, the legend is not displayed)
- <b>leg_fontsize</b>: title legend font size (default: 14)
- <b>leg_fontsize2</b>: values font size (default: 10)
- <b>leg_round</b>: number of digits after the decimal point (default: undefined)
- <b>leg_txtcol</b>: color of the texte (default: "#363636")
- <b>leg_title</b>: title of the legend (default "Title, year")
- <b>leg_stroke</b>: stroke of the circles (default: "black")
- <b>leg_top_txt</b> title for the top variable (default top_var)
- <b>leg_bottom_txt</b> title for the bottom variable (default bottom_var)
- <b>leg_top_fill</b> color of top semi circles (default same as top_fill)
- <b>leg_bottom_fill</b> color of bottom semi circles (default same as bottom_fill)
- <b>leg_strokewidth</b> stroke width of elements in the legend (default 0.8)

</details>


#### Missing

Sometimes, when making a map by proportional symbols for example, it can be interesting to display in white under the symbols, the countries with missing data. That's what the type *missing* is for. [Source](https://github.com/neocarto/bertin/blob/main/src/layer-missing.js).

<details><summary>Code</summary>

~~~js
bertin.draw({
  layers: [
    {
      type: "missing",
      geojson: countries,
      id_geojson: "ISO3_CODE",
      data: maddison,
      id_data: "countrycode",
      var_data: "pop"
  ]
})
~~~

</details>

<details><summary>Parameters</summary>

- <b>geojson</b>: a geojson (<ins>compulsory<ins>)
- <b>data</b>: a geoj (<ins>compulsory<ins>)
- <b>id_geojson</b>: a string corresponding to the identifier of the features in the properties (<ins>compulsory<ins>)
- <b>id_data</b>: a string corresponding to the identifier of the features (<ins>compulsory<ins>)
- <b>var_data</b>: a string corresponding to the targeted variable (<ins>compulsory<ins>)
- <b>fill</b>: fill color (default: "white")
- <b>stroke</b>: stroke color (default: "white")
- <b>strokewidth</b>: stroke width (default: 0.5)
- <b>fillopacity</b>: fill opacity (default: 1)

Parameters of the legend

- <b>leg_x</b>: position in x (if this value is not filled, the legend is not displayed)
- <b>leg_y</b>: position in y (if this value is not filled, the legend is not displayed)
- <b>leg_w</b>: width of the bof (default: 30)
- <b>leg_h</b>: height of the bof (default:20)
- <b>leg_text</b>: text of the box (default: "text of the box")
- leg_fontsize</b>: text font size (default: 10)
- <b>leg_fill</b>: color of the box (same as the layer displayed)
- <b>leg_stroke</b>: stroke of the box (default: "black")
- <b>leg_strokewidth</b>: stroke-width (default: 0.5)
- <b>leg_fillopacity</b>: stroke opacity (same as the layer displayed)
- <b>leg_txtcol</b>: color of the texte (default: "#363636")

</details>

#### Outline

The *outline* type is used to display the limits of the earth area in the given projection. [Source](https://github.com/neocarto/bertin/blob/main/src/outline.js).

<details><summary>Code</summary>

~~~js
bertin.draw({
  layers: [{
        type: "outline",
        fill: "#4269ad"
  }]
})
~~~

</details>

<details><summary>Parameters</summary>

- <b>fill</b>: fill color of the outline (default: "#add8f7")
- <b>stroke</b>: stroke color (default:"none")
- <b>strokewidth</b>: stroke width (default: 1)

</details>

#### Prop

The *prop* type is used to draw a map by proportional circles. [Source](https://github.com/neocarto/bertin/blob/main/src/layer-prop.js) [Example](https://observablehq.com/d/6648e042f25e7241?collection=@neocartocnrs/bertin)

<details><summary>Code</summary>

~~~js
  bertin.draw({
    layers: [
      {
        type: "prop",
        geojson: countries,
        id_geojson: "ISO3_CODE",
        data: maddison,
        id_data: "countrycode",
        var_data: "pop",
        k: 60,
        tooltip: ["country", "pop", "(inh.)"]
      }
    ]
  })
~~~

</details>

<details><summary>Parameters</summary>

- <b>geojson</b>: a geojson (<ins>compulsory<ins>)
- <b>data</b>: a geoj (<ins>compulsory<ins>)
- <b>id_geojson</b>: a string corresponding to the identifier of the features in the properties (<ins>compulsory<ins>)
- <b>id_data</b>: a string corresponding to the identifier of the features (<ins>compulsory<ins>)
- <b>var_data</b>: a string corresponding to the targeted variable (<ins>compulsory<ins>)
- <b>k</b>: size of the largest circle (defaul:50)
- <b>fill</b>: fill color (default: random color)
- <b>stroke</b>: stroke color (default: "white")
- <b>strokewidth</b>: stroke width (default: 0.5)
- <b>fillopacity</b>: fill opacity (default: 1)
- <b>tooltip</b> an array of 3 values defing what to display within the tooltip. The two first values indicates the name of a field in properties. the third value is a string to indicates the unit (default:"")

Parameters of the legend

- <b>leg_x</b>: position in x (if this value is not filled, the legend is not displayed)
- <b>leg_y</b>: position in y (if this value is not filled, the legend is not displayed)
- <b>leg_fill</b>: color of the circles (default: "none")
- <b>leg_stroke</b>: stroke of the circles (default: "black")
- <b>leg_strokewidth</b>: stoke-width (default: 0.8)
- <b>leg_txtcol</b>: color of the texte (default: "#363636")
- <b>leg_title</b>: title of the legend (default var_data)
- <b>leg_round</b>: number of digits after the decimal point (default: undefined)
- <b>leg_fontsize</b>: title legend font size (default: 14)
- <b>leg_fontsize2</b>: values font size (default: 10)

</details>

#### Scalebar

The *scalebar* type allows to display a scalebar in miles or kilometers. [Source](https://github.com/neocarto/bertin/blob/main/src/scalerbar.js)

<details><summary>Code</summary>

  ~~~js
  bertin.draw({
    layers: [
      {
        type: "scalebar",
        units: "miles"
      },
    ]
  })
  ~~~

</details>

<details><summary>Parameters</summary>

- <b>x</b>: position in x (if this value is not filled, the legend is displayed on the left)
- <b>y</b>: position in x (if this value is not filled, the legend is displayed at the bottom)
- <b>units</b>: distance unit, miles or kilometers (default: "kilimeters")

</details>

#### Shadow

The *shadow* type allows to display a shadow under a layer to give it a relief effect [Source](https://github.com/neocarto/bertin/blob/main/src/shadow.js)

<details><summary>Code</summary>

~~~js
bertin.draw({
  layers: [
    {
      type: "shadow",
      geojson: JPN,
      dx: 5,
      dy: 5
    },
  ]
})
~~~

</details>

<details><summary>Parameters</summary>

- <b>col</b>: color (default: "#35383d")
- <b>dx</b>: shift in x (default: 3)
- <b>dy</b>: shift in y (default: 3)
- <b>stdDeviation</b> blur (default: 1.5)
- <b>opacity</b>: opacity (default: 0.7)

</details>

#### Texts

The *text* type simply allows you to display text anywhere on the map. [Source](https://github.com/neocarto/bertin/blob/main/src/text.js). [Example](https://observablehq.com/d/95fcfac18b213daf?collection=@neocartocnrs/bertin).

<details><summary>Code</summary>

~~~js
bertin.draw({
  layers: [
    {
      type: "text",
      text: "This is my text",
      position: "bottomright",
      fontsize: 20,
      baseline: "middle",
      frame_stroke: "red",
      margin: 4
    }
  ]
})
~~~

</details>

<details><summary>Parameters</summary>

- <b>position</b>: position of the text. It can be an array with x,y coordinates. For example [100,200]. It can be also a string defining the position. "topleft", "top", "topright", "left", "middle", "right", "bottomleft", "bottom", "bottomright" (default: "topleft")
- <b>text</b>: text to display. With the backticks, it is possible to display a text on several lines (default: "Your text here!")
- <b>fontsize</b>: text size (default: 15)
- <b>margin</b>: margin around the text (default: 0)
- <b>anchor</b>: text anchor. start, middle, end (default: "start")
- <b>baseline</b>: alignment baseline. "baseline", "middle", "hanging" (default:"hanging")
- <b>fill</b>: text color (default: "#474342")
- <b>stroke</b>: stroke color (default: "none")
- <b>frame_fill</b>: frame background color (default:"none")
- <b>frame_stroke</b>: frame stroke color (default: "none")
- <b>frame_strokewidth</b>: thickness of the frame contour (default: 1)
- <b>frame_opacity</b>: frame opacity (default: 1)

</details>

#### Typo

The *typo* type allows to realize a qualitative map. [Source](https://github.com/neocarto/bertin/blob/main/src/layer-typo.js) [Examples](https://observablehq.com/d/bf52a76ebafaba98?collection=@neocartocnrs/bertin)

<details><summary>Code</summary>

~~~js
  bertin.draw({
    layers: [
      {
        type: "typo",
        geojson: countries,
        id_geojson: "ISO3_CODE",
        data: maddison,
        id_data: "countrycode",
        var_data: "region"
    ]
  })
~~~

</details>

<details><summary>Parameters</summary>

- <b>geojson</b>: a geojson (<ins>compulsory<ins>)
- <b>data</b>: a geojson (<ins>compulsory<ins>)
- <b>id_geojson</b>: a string corresponding to the identifier of the features in the properties (<ins>compulsory<ins>)
- <b>id_data</b>: a string corresponding to the identifier of the features (<ins>compulsory<ins>)
- <b>var_data</b>: a string corresponding to the targeted variable (<ins>compulsory<ins>)
- <b>colors</b>: An array containig n colors for n types (defaut: null)
- <b>pal</b>: a palette of categorical colors (default: "Tableau10") [See](https://observablehq.com/@d3/color-schemes)
- <b>col_missing</b>: Color for missing values (default "#f5f5f5")
- <b>stroke</b>: sreoke color (default: "white")
- <b>strokewidth</b>: Stroke width (default: 0.5)
- <b>fillopacity</b>: Fill opacity (dafault: 1)
- <b>tooltip</b>: An array of 3 values defing what to display within the tooltip. The two first values indicates the name of a field in properties. the third value is a string to indicates the unit (default:"")

Parameters of the legend

- <b>leg_x</b>: position in x (if this value is not filled, the legend is not displayed)
- <b>leg_y</b>: position in y (if this value is not filled, the legend is not displayed)
- <b>leg_w</b>: width of the bof (default: 30)
- <b>leg_h</b>: height of the bof (default:20)
- <b>leg_title</b>: title of the legend (default; null)
- <b>leg_fontsize</b>: title legend font size (default: 14)
- <b>leg_fontsize2</b>: values font size (default: 10)
- <b>leg_stroke</b>: stroke of the box (default: "black")
- <b>leg_strokewidth</b>: stroke-width (default: 0.5)
- <b>leg_fillopacity</b>: stroke opacity (same as the layer displayed)
- <b>leg_txtcol</b>: color of the texte (default: "#363636")

</details>
