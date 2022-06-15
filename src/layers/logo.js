// logo

// function loadimg(url) {
//   const img = new Image();
//   //img.crossOrigin = "anonymous";
//   img.src = url;
//   return img;
// }

export function logo(selection, width, height, options = {}) {
  let url =
    options.url ?? "https://github.com/neocarto/bertin/raw/main/img/logo.png";

  let img = new Image();
  img.scr = url;

  let w = options.size ?? 100;
  let h = (img.height * w) / img.width;
  let x = options.x ?? 10;
  let y = options.y ?? height - 10 - h;

  selection
    .append("g")
    .append("image")
    .attr("xlink:href", url)
    .attr("width", w)
    .attr("height", h)
    .attr("x", x)
    .attr("y", y);
}
