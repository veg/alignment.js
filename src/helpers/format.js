export default function(dimensions) {
  if (!dimensions) return null;
  return dimensions.join("px ") + "px";
}
