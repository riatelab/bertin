import { default as geoDistance } from "./geo/distance";
import { default as geoScaleBottom } from "./orient/bottom";
import { default as geoScaleKilometers } from "./units/kilometers";

export default function(){
  let extent = null,
      projection,
      left = 0,
      top = 0,
      orient = geoScaleBottom(),
      radius = geoScaleKilometers.radius,
      units = geoScaleKilometers.units,
      distance,
      tickFormat = d => Math.round(d),
      tickPadding = 2,
      tickSize = 4,
      tickValues,
      labelText,
      labelAnchor = "start",
      zoomFactor = 1,
      zoomClamp = true;

  function scaleBar(context){    
    // If a label has not been explicitly set, set it
    labelText = labelText === null ? null : labelText || units.charAt(0).toUpperCase() + units.slice(1);
    
    // The position and width of the scale bar
    let width = extent[1][0] - extent[0][0],
        height = extent[1][1] - extent[0][1],
        x = extent[0][0] + width * left,
        y = extent[0][1] + height * top,
        start = projection.invert([x, y]);
    
    let barDistance = 0, barWidth = 0;
    
    // If the distance has been set explicitly, calculate the bar's width
    if (distance){
      barDistance = distance;
      barWidth = barDistance / (geoDistance(start, projection.invert([x + 1, y])) * radius);
    }

    // Otherwise, make it an exponent of 10, 10x2, 10x4 or 10x5 with a minimum width of 60px 
    else {
      let dist = .01,
          minWidth = 60 / (zoomClamp ? 1 : zoomFactor),
          iters = 0,
          maxiters = 100,
          multiples = [1, 2, 4, 5];
      
      while (barWidth < minWidth && iters < maxiters){

        for (let i = 0, l = multiples.length; i < l; i++){
          barDistance = dist * multiples[i];
          barWidth = barDistance / (geoDistance(start, projection.invert([x + 1, y])) * radius);
          if (barWidth >= minWidth) break;
        }

        dist *= 10;
        iters++;
      }
    }
    
    // The ticks and elements of the bar
    let max = barDistance / (zoomClamp ? zoomFactor : 1),
        values = tickValues === null ? [] : tickValues ? tickValues : [0, max / 4, max / 2, max],
        scale = dist => dist * barWidth / (barDistance / zoomFactor),
        selection = context.selection ? context.selection() : context,
        label = selection.selectAll(".label").data([labelText]),
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
        tickExit = tick.exit(),
        tickEnter = tick.enter().append("g").attr("class", "tick"),
        line = tick.select("line"),
        text = tick.select("text"),
        rect = tick.select("rect");
    
    selection
        .attr("font-family", "sans-serif")
        .attr("transform", `translate(${[x, y]})`);
    
    path = path.merge(path.enter().insert("path", ".tick")
        .attr("class", "domain")
        .attr("fill", "none")
        .attr("stroke", "currentColor"));
    
    tick = tick.merge(tickEnter);
    
    line = line.merge(tickEnter.append("line")
        .attr("stroke", "currentColor")
        .attr("y2", tickSize * orient));

    text = text.merge(tickEnter.append("text")
        .attr("fill", "currentColor")
        .attr("y", tickSize * orient + tickPadding * orient)
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .attr("dy", `${orient === 1 ? 0.71 : 0}em`));
    
    rect = rect.merge(tickEnter.append("rect")
        .attr("fill", (d, i) => i % 2 === 0 ?  "currentColor" : "#fff")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 0.5)
        .attr("width", (d, i, e) => i === e.length - 1 ? 0 : scale(values[i + 1] - d))
        .attr("y", orient === 1 ? 0 : -tickSize)
        .attr("height", tickSize));
    
    if (context !== selection){
      tick = tick.transition(context);
      path = path.transition(context);
      rect = rect.transition(context);
      
      tickExit = tickExit.transition(context)
          .attr("opacity", 1e-6)
          .attr("transform", d => `translate(${scale(d)})`);
      
      tickEnter
          .attr("opacity", 1e-6)
          .attr("transform", d => `translate(${scale(d)})`);
    }
    
    tickExit.remove();
    
    path
        .attr("d", `M${scale(0)},${tickSize * orient} L${scale(0)},0 L${scale(max)},0 L${scale(max)},${tickSize * orient}`);
    
    tick
        .attr("transform", d => `translate(${scale(d)})`)
        .attr("opacity", 1);
    
    line
        .attr("y2", tickSize * orient);

    text
        .attr("y", tickSize * orient + tickPadding * orient)
        .text(tickFormat);
    
    rect
        .attr("fill", (d, i) => i % 2 === 0 ?  "currentColor" : "#fff")
        .attr("width", (d, i, e) => i === e.length - 1 ? 0 : scale(values[i + 1] - d))
        .attr("y", orient === 1 ? 0 : -tickSize)
        .attr("height", tickSize);
    
    // The label
    if (label === null) {
      label.remove();
    }
    else {
      label.enter().append("text")
          .attr("class", "label")
          .attr("fill", "currentColor")
          .attr("font-size", 12)
          .attr("dy", "-0.32em")
        .merge(label)
          .attr("x", labelAnchor === "start" ? 0 : labelAnchor === "middle" ? scale(max / 2) : scale(max))
          .attr("y", orient === 1 ? 0 : "1.3em")
          .attr("text-anchor", labelAnchor)
          .text(d => d);
    }

  }

  scaleBar.distance = function(_) {
    return arguments.length ? (distance = +_, scaleBar) : distance;
  }
  
  scaleBar.extent = function(_) {
    return arguments.length ? (extent = _, scaleBar) : extent;
  }
  
  scaleBar.label = function(_) {
    return arguments.length ? (labelText = _, scaleBar) : labelText;
  }
  
  scaleBar.labelAnchor = function(_) {
    return arguments.length ? (labelAnchor = _, scaleBar) : labelAnchor;
  }
  
  scaleBar.left = function(_) {
    return arguments.length ? (left = +_ > 1 ? 1 : +_ < 0 ? 0 : +_, scaleBar) : left;
  }
  
  scaleBar.orient = function(_) {
    return arguments.length ? (orient = _(), scaleBar) : (orient === 1 ? "bottom" : "top");
  }
  
  scaleBar.projection = function(_) {
    return arguments.length ? (projection = _, scaleBar) : projection;
  }
  
  scaleBar.radius = function(_) {
    return arguments.length ? (radius = +_, scaleBar) : radius;
  }
  
  scaleBar.size = function(_) {
    return arguments.length ? (extent = [[0, 0], _], scaleBar) : extent[1];
  }

  scaleBar.top = function(_) {
    return arguments.length ? (top = +_ > 1 ? 1 : +_ < 0 ? 0 : +_, scaleBar) : top;
  }
  
  scaleBar.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, scaleBar) : tickFormat;
  }
  
  scaleBar.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, scaleBar) : tickPadding;
  }
  
  scaleBar.tickSize = function(_) {
    return arguments.length ? (tickSize = +_, scaleBar) : tickSize;
  }

  scaleBar.tickValues = function(_) {
    return arguments.length ? (tickValues = _, scaleBar) : tickValues;
  }
  
  scaleBar.units = function(_) {
    return arguments.length ? ({units, radius} = _, scaleBar) : units;
  }
  
  scaleBar.zoomClamp = function(_) {
    return arguments.length ? (zoomClamp = !!_, scaleBar) : zoomClamp;
  }
  
  scaleBar.zoomFactor = function(_) {
    return arguments.length ? (zoomFactor = +_, scaleBar) : zoomFactor;
  }

  return scaleBar;
}