# d3-geo-scale-bar

d3-geo-scale-bar is a JavaScript library and [D3.js](https://d3js.org/) plugin that makes it easy to add scale bars to maps created with [d3-geo](https://github.com/d3/d3-geo).

## Installing

If you use NPM, `npm install d3-geo-scale-bar`. Otherwise, download the [latest release](https://github.com/HarryStevens/d3-geo-scale-bar/raw/master/build/d3-geo-scale-bar.zip). AMD, CommonJS, and vanilla environments are supported. In vanilla, a d3 global is exported:

```html
<script src="https://unpkg.com/d3-geo-scale-bar@1.1.1/build/d3-geo-scale-bar.min.js"></script>
<script>

const projection = d3.geoMercator()
    .fitSize(width, height], geoJSON);

const scaleBar = d3.geoScaleBar()
    .projection(projection)
    .size([width, height]);

d3.select("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .call(scaleBar);

</script>
```

[Try d3-geo-scale-bar in your browser](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar).

## API Reference

* [Introduction](#introduction)
* [Basic configuration](#basic-configuration)
* [Positioning](#positioning)
* [Sizing](#sizing)
* [Styling](#styling)
* [Zooming](#zooming)

### Introduction

Scale bars help readers understand the geographic extent of maps. A scale bar's [default design](https://bl.ocks.org/HarryStevens/8c8d3a489aa1372e14b8084f94b32464) references the classic checkered design:

[<img alt="Scale Bar Design" src="https://raw.githubusercontent.com/HarryStevens/d3-geo-scale-bar/master/img/default.png">](https://bl.ocks.org/HarryStevens/8c8d3a489aa1372e14b8084f94b32464)

By tweaking the scale bar's configuration and CSS, you can produce [several different scale bar designs](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#styling).

A scale bar consists of a [path element](https://www.w3.org/TR/SVG/paths.html#PathElement) of class "domain", followed by four [g elements](https://www.w3.org/TR/SVG/struct.html#Groups) of class "tick" representing each of the scale bar's ticks. Each tick has a [line element](https://www.w3.org/TR/SVG/shapes.html#LineElement) to draw the tick line, a [text element](https://www.w3.org/TR/SVG/text.html#TextElement) for the tick label, and a [rect element](https://www.w3.org/TR/SVG/shapes.html#RectElement) of alternating black and white fill. There is also another text element of class "label" sitting above the bar that denotes the units.

<a name="geoScaleBar" href="#geoScaleBar">#</a> d3.<b>geoScaleBar</b>() · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L5 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar)

Constructs a new scale bar generator with the default settings.

<a name="_scaleBar" href="#_scaleBar">#</a> <i>scaleBar</i>(<i>context</i>) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L23 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#basicUsage)

Renders the scale bar to the given <i>context</i>, which may be either a [selection](https://github.com/d3/d3-selection) of an SVG [g element](https://www.w3.org/TR/SVG/struct.html#Groups) or a corresponding [transition](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#transitions). Configure the scale bar with [<i>scaleBar</i>.projection](#scaleBar_projection) and [<i>scaleBar</i>.extent](#scaleBar_fitSize) before rendering. Generally, you will use this with <i>selection</i>.[call](https://github.com/d3/d3-selection#selection_call):

```js
const scaleBar = d3.geoScaleBar()
    .projection(projection)
    .size([width, height]);

svg.append("g").call(scaleBar);
```

### Basic configuration

<a name="scaleBar_extent" href="#scaleBar_extent">#</a> <i>scaleBar</i>.<b>extent</b>([<i>extent</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L161 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBar)

If <i>extent</i> is specified, sets the extent of the scale bar generator to the specified bounds and returns the scale bar. The extent is specified as an array [[<i>x0</i>, <i>y0</i>], [<i>x1</i>, <i>y1</i>]], where <i>x0</i> is the left side of the extent, <i>y0</i> is the top, <i>x1</i> is the right, and <i>y1</i> is the bottom. If extent is not specified, returns the current extent which defaults to null. An extent is required to render a scale bar.

<a name="scaleBar_projection" href="#scaleBar_projection">#</a> <i>scaleBar</i>.<b>projection</b>([<i>projection</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L181 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBar)

If <i>projection</i> is specified, sets the [projection](https://github.com/d3/d3-geo#projections) and returns the scale bar. If <i>projection</i> is not specified, returns the current projection. A projection is required to render a scale bar.

<a name="scaleBar_size" href="#scaleBar_size">#</a> <i>scaleBar</i>.<b>size</b>([<i>size</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L189 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBar)

An alias for [<i>scaleBar</i>.extent](#scaleBar_extent) where the minimum x and y of the extent are ⟨0,0⟩. Equivalent to:

```js
scaleBar.extent([[0, 0], size]);
```

### Positioning

<a name="scaleBar_left" href="#scaleBar_left">#</a> <i>scaleBar</i>.<b>left</b>([<i>left</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L173 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarPositioned)

If <i>left</i> is specified, sets the left position to the specified value which must be in the range [0, 1], where 0 is the leftmost side of the scale bar's extent and 1 is the rightmost, and returns the scale bar. If <i>left</i> is not specified, returns the current left position which defaults to 0.

<a name="scaleBar_top" href="#scaleBar_top">#</a> <i>scaleBar</i>.<b>top</b>([<i>top</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L193 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarPositioned)

If <i>top</i> is specified, sets the top position to the specified value which must be in the range [0, 1], where 0 is the top-most side of the scale bar's extent and 1 is the bottom-most, and returns the scale bar. If <i>top</i> is not specified, returns the current top position which defaults to 0.

### Sizing

<a name="scaleBar_distance" href="#scaleBar_distance">#</a> <i>scaleBar</i>.<b>distance</b>([<i>distance</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L162 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarWapo)

If <i>distance</i> is specifed, sets the maximum distance of the scale bar and returns the scale bar. [Defaults](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L40) to the smallest exponent of 10, 10x2, 10x4 or 10x5 that will render the bar at least 60 pixels wide. If <i>distance</i> is not specified, returns the current maximum distance of the scale bar.

<a name="scaleBar_radius" href="#scaleBar_radius">#</a> <i>scaleBar</i>.<b>radius</b>([<i>radius</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L190 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarMoon)

If <i>radius</i> is specifed, sets the radius of the sphere on which the scale bar is placed and returns the scale bar. Defaults to 6371.0088, [the mean radius of Earth in kilometers](https://en.wikipedia.org/wiki/Earth_radius#Mean_radius). If you set [<i>units</i>](#scaleBar_units) to d3.[geoScaleMiles](#geoScaleMiles), the <i>radius</i> will also update to 3958.7613, [the mean radius of Earth in miles](https://en.wikipedia.org/wiki/Earth_radius#Mean_radius). You can set the *radius* to any number you like, useful for [mapping planets other than Earth](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#spaceBars). If <i>radius</i> is not specified, returns the current radius.

<a name="scaleBar_units" href="#scaleBar_units">#</a> <i>scaleBar</i>.<b>units</b>([<i>units</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L218 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarWapo)

If <i>units</i> is specifed, sets the [radius](#scaleBar_radius) of the scale bar to the corresponding units and returns the scale bar. Defaults to [d3.geoScaleKilometers](https://github.com/HarryStevens/d3-geo-scale-bar#geoScaleKilometers), which sets the label to "Kilometers" and the radius to 6371.0088, [the mean radius of Earth in kilometers](https://en.wikipedia.org/wiki/Earth_radius#Mean_radius). Note that the Earth's radius varies depending upon latitude, so if extremely high precision matters, you can [perform your own calculation of the radius](https://web.archive.org/web/20200118181437/https://rechneronline.de/earth-radius/) and pass the output to <i>scaleBar</i>.[radius](#scaleBar_radius).

If <i>units</i> is not specified, returns a string representing the current unit, e.g. "kilometers". The capitalized version of this string will be used for the [label](#scaleBar_label) if no label is specified.

<a name="geoScaleFeet" href="#geoScaleFeet">#</a> d3.<b>geoScaleFeet</b> · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/units/feet.js "Source")

When passed to <i>scaleBar</i>.[units](#scaleBar_units), sets the [radius](scaleBar_radius) to 20902259.664, the mean radius of Earth in feet. The [label](#scaleBar_label) will be set to "Feet" if no label is specified.

<a name="geoScaleKilometers" href="#geoScaleKilometers">#</a> d3.<b>geoScaleKilometers</b> · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/units/kilometers.js "Source")

When passed to <i>scaleBar</i>.[units](#scaleBar_units), sets the [radius](scaleBar_radius) to 6371.0088, the mean radius of Earth in kilometers. The [label](#scaleBar_label) will be set to "Kilometers" if no label is specified. This is the default setting.

<a name="geoScaleMeters" href="#geoScaleMeters">#</a> d3.<b>geoScaleMeters</b> · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/units/meters.js "Source")

When passed to <i>scaleBar</i>.[units](#scaleBar_units), sets the [radius](scaleBar_radius) to 6371008.8, the mean radius of Earth in meters. The [label](#scaleBar_label) will be set to "Meters" if no label is specified.

<a name="geoScaleMiles" href="#geoScaleMiles">#</a> d3.<b>geoScaleMiles</b> · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/units/miles.js "Source")

When passed to <i>scaleBar</i>.[units](#scaleBar_units), sets the [radius](scaleBar_radius) to 3958.7613, the mean radius of Earth in miles. The [label](#scaleBar_label) will be set to "Miles" if no label is specified.

### Styling

<a name="scaleBar_label" href="#scaleBar_label">#</a> <i>scaleBar</i>.<b>label</b>([<i>label</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L170 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarWapo)

If a <i>label</i> string is specified, sets the text in the scale bar's label to the specified string and returns the scale bar. Defaults to the capitalized unit, e.g. "Kilometers". If label is specified as null, removes the label. If <i>label</i> is not specified, returns the current label.

<a name="scaleBar_labelAnchor" href="#scaleBar_labelAnchor">#</a> <i>scaleBar</i>.<b>labelAnchor</b>([<i>anchor</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L174 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarWapo)

If an <i>anchor</i> string is specified, aligns the scale bar's label such that it is either at the "start" of the scale bar, the "middle" of the scale bar, or the "end" of the scale bar, and returns the scale bar. Defaults to "start". If an <i>anchor</i> string is not specified, returns the current anchor.

<a name="scaleBar_orient" href="#scaleBar_orient">#</a> <i>scaleBar</i>.<b>orient</b>([<i>orientation</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L182 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarTop)

If an <i>orientation</i> is specified, styles the bar according to the specified orientation and returns the scale bar. If an <i>orientation</i> is not specified, returns the current orientation as a string, either "top" or "bottom". Defaults to [d3.geoScaleBottom](#geoScaleBottom).

<a name="geoScaleBottom" href="#geoScaleBottom">#</a> d3.<b>geoScaleBottom</b> · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/orient/bottom.js "Source")

When passed to <i>scaleBar</i>.[orient](#scaleBar_orient), orients the scale bar so that the label is on the top and the ticks are on bottom. This is the default orientation.

```js
scaleBar.orient(d3.geoScaleBottom);
```

<a name="geoScaleTop" href="#geoScaleTop">#</a> d3.<b>geoScaleTop</b> · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/orient/top.js "Source")

When passed to <i>scaleBar</i>.[orient](#scaleBar_orient), orients the scale bar so that the label is on the bottom and the ticks are on top.

```js
scaleBar.orient(d3.geoScaleTop);
```

<a name="scaleBar_tickFormat" href="#scaleBar_tickFormat">#</a> <i>scaleBar</i>.<b>tickFormat</b>([<i>formatter</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L202 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarPositioned)

If a <i>formatter</i> function is specified, each tick value is passed through the formatter before being displayed. Defaults to (d, i, e) => Math.round(d), where d is the tick number, i is the tick index, and e is an array of all tick data. If a <i>formatter</i> is not specified, returns the current formatter.

<a name="scaleBar_tickPadding" href="#scaleBar_tickPadding">#</a> <i>scaleBar</i>.<b>tickPadding</b>([<i>padding</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L206 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarTop)

If <i>padding</i> is specified, sets the padding to the specified value in pixels and returns the scale bar. If <i>padding</i> is not specified, returns the current padding which defaults to 2 pixels.

<a name="scaleBar_tickSize" href="#scaleBar_tickSize">#</a> <i>scaleBar</i>.<b>tickSize</b>([<i>size</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L210 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarWapo)

If a <i>size</i> number is specified, sets the vertical tick size of the scale bar in pixels and returns the scale bar. Defaults to 4. If <i>size</i> is not specified, returns the current tick size of the scale bar.

<a name="scaleBar_tickValues" href="#scaleBar_tickValues">#</a> <i>scaleBar</i>.<b>tickValues</b>([<i>values</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L214 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#scaleBarBottom)

If a <i>values</i> array is specified, sets the tick values to the specified values in the array rather than using the scale bar’s automatic tick generator, and returns the scale bar. Defaults to [0, kilometers / 4, kilometers / 2, kilometers]. Passing <i>null</i> removes the values and their associated ticks from the scale bar. If <i>values</i> is not specified, returns the current tick values.

### Zooming

<a name="scaleBar_zoomClamp" href="#scaleBar_zoomClamp">#</a> <i>scaleBar</i>.<b>zoomClamp</b>([<i>clamp</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L222 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#zooming)

If a boolean <i>clamp</i> is specified, sets the scale bar's zooming behavior and returns the scale bar. If clamp is true, the scale bar's width will remain constant as the [zoom factor](#scaleBar_zoomFactor) changes. If clamp is false, the scale bar's width will change with the zoom factor, but the distance represented by the scale bar will remain constant unless the bar becomes too small or too large. If <i>clamp</i> is not specified, returns the current clamp behavior, which defaults to true.

<a name="scaleBar_zoomFactor" href="#scaleBar_zoomFactor">#</a> <i>scaleBar</i>.<b>zoomFactor</b>([<i>k</i>]) · [Source](https://github.com/HarryStevens/d3-geo-scale-bar/blob/master/src/geoScaleBar.js#L226 "Source"), [Example](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#zooming)

If <i>k</i> is specified, zooms the scale bar by the <i>k</i> [scale factor](https://github.com/d3/d3-zoom#zoomTransform) and returns the scale bar. This will commonly [be used](https://observablehq.com/@harrystevens/introducing-d3-geo-scale-bar#zooming) in conjunction with [d3-zoom](https://github.com/d3/d3-zoom):

```js
const zoom = d3.zoom()
  .on("zoom", _ => {
    const t = d3.event.transform;
    
    g.attr("transform", t);
    
    scaleBar.zoomFactor(t.k); // Zoom the scale bar by the k scale factor.
    scaleBarSelection.call(scaleBar);
  });

svg.call(zoom);
```

If <i>k</i> is not specified, returns the current zoom factor.