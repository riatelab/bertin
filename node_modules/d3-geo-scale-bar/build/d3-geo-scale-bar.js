// https://github.com/HarryStevens/d3-geo-scale-bar Version 1.1.1. Copyright 2020 Harry Stevens.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

  // Adds floating point numbers with twice the normal precision.
  // Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
  // Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
  // 305–363 (1997).
  // Code adapted from GeographicLib by Charles F. F. Karney,
  // http://geographiclib.sourceforge.net/
  // ...which was taken from d3-geo by Mike Bostock
  // Source: https://github.com/d3/d3-geo/blob/master/src/adder.js
  // License: https://github.com/d3/d3-geo/blob/master/LICENSE
  function adder () {
    return new Adder();
  }

  function Adder() {
    this.reset();
  }

  Adder.prototype = {
    constructor: Adder,
    reset: function reset() {
      this.s = // rounded value
      this.t = 0; // exact error
    },
    add: function add(y) {
      _add(temp, y, this.t);

      _add(this, temp.s, this.s);

      if (this.s) this.t += temp.t;else this.s = temp.t;
    },
    valueOf: function valueOf() {
      return this.s;
    }
  };
  var temp = new Adder();

  function _add(adder, a, b) {
    var x = adder.s = a + b,
        bv = x - a,
        av = x - bv;
    adder.t = a - av + (b - bv);
  }

  // From d3-geo by Mike Bostock
  // Source: https://github.com/d3/d3-geo/blob/master/src/stream.js
  // License: https://github.com/d3/d3-geo/blob/master/LICENSE
  function streamGeometry(geometry, stream) {
    if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
      streamGeometryType[geometry.type](geometry, stream);
    }
  }

  var streamObjectType = {
    Feature: function Feature(object, stream) {
      streamGeometry(object.geometry, stream);
    },
    FeatureCollection: function FeatureCollection(object, stream) {
      var features = object.features,
          i = -1,
          n = features.length;

      while (++i < n) {
        streamGeometry(features[i].geometry, stream);
      }
    }
  };
  var streamGeometryType = {
    Sphere: function Sphere(object, stream) {
      stream.sphere();
    },
    Point: function Point(object, stream) {
      object = object.coordinates;
      stream.point(object[0], object[1], object[2]);
    },
    MultiPoint: function MultiPoint(object, stream) {
      var coordinates = object.coordinates,
          i = -1,
          n = coordinates.length;

      while (++i < n) {
        object = coordinates[i], stream.point(object[0], object[1], object[2]);
      }
    },
    LineString: function LineString(object, stream) {
      streamLine(object.coordinates, stream, 0);
    },
    MultiLineString: function MultiLineString(object, stream) {
      var coordinates = object.coordinates,
          i = -1,
          n = coordinates.length;

      while (++i < n) {
        streamLine(coordinates[i], stream, 0);
      }
    },
    Polygon: function Polygon(object, stream) {
      streamPolygon(object.coordinates, stream);
    },
    MultiPolygon: function MultiPolygon(object, stream) {
      var coordinates = object.coordinates,
          i = -1,
          n = coordinates.length;

      while (++i < n) {
        streamPolygon(coordinates[i], stream);
      }
    },
    GeometryCollection: function GeometryCollection(object, stream) {
      var geometries = object.geometries,
          i = -1,
          n = geometries.length;

      while (++i < n) {
        streamGeometry(geometries[i], stream);
      }
    }
  };

  function streamLine(coordinates, stream, closed) {
    var i = -1,
        n = coordinates.length - closed,
        coordinate;
    stream.lineStart();

    while (++i < n) {
      coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
    }

    stream.lineEnd();
  }

  function streamPolygon(coordinates, stream) {
    var i = -1,
        n = coordinates.length;
    stream.polygonStart();

    while (++i < n) {
      streamLine(coordinates[i], stream, 1);
    }

    stream.polygonEnd();
  }

  function stream (object, stream) {
    if (object && streamObjectType.hasOwnProperty(object.type)) {
      streamObjectType[object.type](object, stream);
    } else {
      streamGeometry(object, stream);
    }
  }

  // Adapted from d3-geo by Mike Bostock
  var lengthSum = adder(),
      lambda0,
      sinPhi0,
      cosPhi0;
  var lengthStream = {
    sphere: function sphere(_) {},
    point: function point(_) {},
    lineStart: lengthLineStart,
    lineEnd: function lineEnd(_) {},
    polygonStart: function polygonStart(_) {},
    polygonEnd: function polygonEnd(_) {}
  };

  function lengthLineStart() {
    lengthStream.point = lengthPointFirst;
    lengthStream.lineEnd = lengthLineEnd;
  }

  function lengthLineEnd() {
    lengthStream.point = lengthStream.lineEnd = function (_) {};
  }

  function lengthPointFirst(lambda, phi) {
    lambda *= Math.PI / 180, phi *= Math.PI / 180;
    lambda0 = lambda, sinPhi0 = Math.sin(phi), cosPhi0 = Math.cos(phi);
    lengthStream.point = lengthPoint;
  }

  function lengthPoint(lambda, phi) {
    lambda *= Math.PI / 180, phi *= Math.PI / 180;
    var sinPhi = Math.sin(phi),
        cosPhi = Math.cos(phi),
        delta = Math.abs(lambda - lambda0),
        cosDelta = Math.cos(delta),
        sinDelta = Math.sin(delta),
        x = cosPhi * sinDelta,
        y = cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDelta,
        z = sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDelta;
    lengthSum.add(Math.atan2(Math.sqrt(x * x + y * y), z));
    lambda0 = lambda, sinPhi0 = sinPhi, cosPhi0 = cosPhi;
  }

  function length (object) {
    lengthSum.reset();
    stream(object, lengthStream);
    return +lengthSum;
  }

  // From d3-geo by Mike Bostock
  var coordinates = [null, null],
      object = {
    type: "LineString",
    coordinates: coordinates
  };
  function geoDistance (a, b) {
    coordinates[0] = a;
    coordinates[1] = b;
    return length(object);
  }

  function geoScaleBottom () {
    return 1;
  }

  var geoScaleKilometers = {
    units: "kilometers",
    radius: 6371.0088
  };

  function geoScaleBar () {
    var extent = null,
        projection,
        left = 0,
        top = 0,
        orient = geoScaleBottom(),
        radius = geoScaleKilometers.radius,
        units = geoScaleKilometers.units,
        distance,
        tickFormat = function tickFormat(d) {
      return Math.round(d);
    },
        tickPadding = 2,
        tickSize = 4,
        tickValues,
        labelText,
        labelAnchor = "start",
        zoomFactor = 1,
        zoomClamp = true;

    function scaleBar(context) {
      // If a label has not been explicitly set, set it
      labelText = labelText === null ? null : labelText || units.charAt(0).toUpperCase() + units.slice(1); // The position and width of the scale bar

      var width = extent[1][0] - extent[0][0],
          height = extent[1][1] - extent[0][1],
          x = extent[0][0] + width * left,
          y = extent[0][1] + height * top,
          start = projection.invert([x, y]);
      var barDistance = 0,
          barWidth = 0; // If the distance has been set explicitly, calculate the bar's width

      if (distance) {
        barDistance = distance;
        barWidth = barDistance / (geoDistance(start, projection.invert([x + 1, y])) * radius);
      } // Otherwise, make it an exponent of 10, 10x2, 10x4 or 10x5 with a minimum width of 60px 
      else {
          var dist = .01,
              minWidth = 60 / (zoomClamp ? 1 : zoomFactor),
              iters = 0,
              maxiters = 100,
              multiples = [1, 2, 4, 5];

          while (barWidth < minWidth && iters < maxiters) {
            for (var i = 0, l = multiples.length; i < l; i++) {
              barDistance = dist * multiples[i];
              barWidth = barDistance / (geoDistance(start, projection.invert([x + 1, y])) * radius);
              if (barWidth >= minWidth) break;
            }

            dist *= 10;
            iters++;
          }
        } // The ticks and elements of the bar


      var max = barDistance / (zoomClamp ? zoomFactor : 1),
          values = tickValues === null ? [] : tickValues ? tickValues : [0, max / 4, max / 2, max],
          scale = function scale(dist) {
        return dist * barWidth / (barDistance / zoomFactor);
      },
          selection = context.selection ? context.selection() : context,
          label = selection.selectAll(".label").data([labelText]),
          path = selection.selectAll(".domain").data([null]),
          tick = selection.selectAll(".tick").data(values, scale).order(),
          tickExit = tick.exit(),
          tickEnter = tick.enter().append("g").attr("class", "tick"),
          line = tick.select("line"),
          text = tick.select("text"),
          rect = tick.select("rect");

      selection.attr("font-family", "sans-serif").attr("transform", "translate(".concat([x, y], ")"));
      path = path.merge(path.enter().insert("path", ".tick").attr("class", "domain").attr("fill", "none").attr("stroke", "currentColor"));
      tick = tick.merge(tickEnter);
      line = line.merge(tickEnter.append("line").attr("stroke", "currentColor").attr("y2", tickSize * orient));
      text = text.merge(tickEnter.append("text").attr("fill", "currentColor").attr("y", tickSize * orient + tickPadding * orient).attr("font-size", 10).attr("text-anchor", "middle").attr("dy", "".concat(orient === 1 ? 0.71 : 0, "em")));
      rect = rect.merge(tickEnter.append("rect").attr("fill", function (d, i) {
        return i % 2 === 0 ? "currentColor" : "#fff";
      }).attr("stroke", "currentColor").attr("stroke-width", 0.5).attr("width", function (d, i, e) {
        return i === e.length - 1 ? 0 : scale(values[i + 1] - d);
      }).attr("y", orient === 1 ? 0 : -tickSize).attr("height", tickSize));

      if (context !== selection) {
        tick = tick.transition(context);
        path = path.transition(context);
        rect = rect.transition(context);
        tickExit = tickExit.transition(context).attr("opacity", 1e-6).attr("transform", function (d) {
          return "translate(".concat(scale(d), ")");
        });
        tickEnter.attr("opacity", 1e-6).attr("transform", function (d) {
          return "translate(".concat(scale(d), ")");
        });
      }

      tickExit.remove();
      path.attr("d", "M".concat(scale(0), ",").concat(tickSize * orient, " L").concat(scale(0), ",0 L").concat(scale(max), ",0 L").concat(scale(max), ",").concat(tickSize * orient));
      tick.attr("transform", function (d) {
        return "translate(".concat(scale(d), ")");
      }).attr("opacity", 1);
      line.attr("y2", tickSize * orient);
      text.attr("y", tickSize * orient + tickPadding * orient).text(tickFormat);
      rect.attr("fill", function (d, i) {
        return i % 2 === 0 ? "currentColor" : "#fff";
      }).attr("width", function (d, i, e) {
        return i === e.length - 1 ? 0 : scale(values[i + 1] - d);
      }).attr("y", orient === 1 ? 0 : -tickSize).attr("height", tickSize); // The label

      if (label === null) {
        label.remove();
      } else {
        label.enter().append("text").attr("class", "label").attr("fill", "currentColor").attr("font-size", 12).attr("dy", "-0.32em").merge(label).attr("x", labelAnchor === "start" ? 0 : labelAnchor === "middle" ? scale(max / 2) : scale(max)).attr("y", orient === 1 ? 0 : "1.3em").attr("text-anchor", labelAnchor).text(function (d) {
          return d;
        });
      }
    }

    scaleBar.distance = function (_) {
      return arguments.length ? (distance = +_, scaleBar) : distance;
    };

    scaleBar.extent = function (_) {
      return arguments.length ? (extent = _, scaleBar) : extent;
    };

    scaleBar.label = function (_) {
      return arguments.length ? (labelText = _, scaleBar) : labelText;
    };

    scaleBar.labelAnchor = function (_) {
      return arguments.length ? (labelAnchor = _, scaleBar) : labelAnchor;
    };

    scaleBar.left = function (_) {
      return arguments.length ? (left = +_ > 1 ? 1 : +_ < 0 ? 0 : +_, scaleBar) : left;
    };

    scaleBar.orient = function (_) {
      return arguments.length ? (orient = _(), scaleBar) : orient === 1 ? "bottom" : "top";
    };

    scaleBar.projection = function (_) {
      return arguments.length ? (projection = _, scaleBar) : projection;
    };

    scaleBar.radius = function (_) {
      return arguments.length ? (radius = +_, scaleBar) : radius;
    };

    scaleBar.size = function (_) {
      return arguments.length ? (extent = [[0, 0], _], scaleBar) : extent[1];
    };

    scaleBar.top = function (_) {
      return arguments.length ? (top = +_ > 1 ? 1 : +_ < 0 ? 0 : +_, scaleBar) : top;
    };

    scaleBar.tickFormat = function (_) {
      return arguments.length ? (tickFormat = _, scaleBar) : tickFormat;
    };

    scaleBar.tickPadding = function (_) {
      return arguments.length ? (tickPadding = +_, scaleBar) : tickPadding;
    };

    scaleBar.tickSize = function (_) {
      return arguments.length ? (tickSize = +_, scaleBar) : tickSize;
    };

    scaleBar.tickValues = function (_) {
      return arguments.length ? (tickValues = _, scaleBar) : tickValues;
    };

    scaleBar.units = function (_) {
      var _ref;

      return arguments.length ? ((_ref = _, units = _ref.units, radius = _ref.radius, _ref), scaleBar) : units;
    };

    scaleBar.zoomClamp = function (_) {
      return arguments.length ? (zoomClamp = !!_, scaleBar) : zoomClamp;
    };

    scaleBar.zoomFactor = function (_) {
      return arguments.length ? (zoomFactor = +_, scaleBar) : zoomFactor;
    };

    return scaleBar;
  }

  function top () {
    return -1;
  }

  var feet = {
    units: "feet",
    radius: 20902259.664
  };

  var meters = {
    units: "meters",
    radius: 6371008.8
  };

  var miles = {
    units: "miles",
    radius: 3958.7613
  };

  exports.geoScaleBar = geoScaleBar;
  exports.geoScaleBottom = geoScaleBottom;
  exports.geoScaleTop = top;
  exports.geoScaleFeet = feet;
  exports.geoScaleKilometers = geoScaleKilometers;
  exports.geoScaleMeters = meters;
  exports.geoScaleMiles = miles;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
