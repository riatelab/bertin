// logo
export function logo(selection, width, height, options = {}) {
  let url = options.url
    ? options.url
    : "https://github.com/neocarto/bertin/raw/main/img/logo.png";

  let position = options.position ? options.position : "left";

  const img = new Image();
  img.src = url;

  img.onload = () => {
    let x;
    let y;
    let w = options.size != undefined ? options.size : 100;
    let h = (img.height * w) / img.width;

    switch (position) {
      case "left":
        x = 10;
        y = height - 10 - h;
        break;
      case "middle":
        x = width / 2 - w / 2;
        y = height - 10 - h;
        break;
      case "right":
        x = width - 10 - w;
        y = height - 10 - h;
        break;
      default:
        x = position[0];
        y = position[1];
    }

    selection
      .append("g")
      .attr("class", options.id)
      .attr("data-layer", JSON.stringify({ _type: "logo" }))
      .append("image")
      .attr("xlink:href", url)
      .attr("width", w)
      .attr("height", h)
      .attr("x", x)
      .attr("y", y);
  };
}
