import { bubble } from "./bubble.js";
import { regulardots } from "../helpers/regulardots.js";


export function regularbubble(selection, projection, options = {}, clipid, width, height){

options.geojson = regulardots(options.geojson, projection, width, height, options.step ?? 20, options.values)
options.values = "___value"
options.planar = true

console.log(options)

bubble(selection, projection, options, clipid, width, height)}
