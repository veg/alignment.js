class ScrollBroadcaster {
  constructor(
    full_pixel_dimensions,
    viewport_pixel_dimensions,
    initial_pixels,
    listener_ids
  ) {
    this.full_pixel_width = full_pixel_dimensions.width;
    this.full_pixel_height = full_pixel_dimensions.height;
    this.viewport_pixel_width = viewport_pixel_dimensions.width;
    this.viewport_pixel_height = viewport_pixel_dimensions.height;
    this.x_fraction = initial_pixels.x_pixel / this.full_pixel_width || 0;
    this.y_fraction = initial_pixels.y_pixel / this.full_pixel_height || 0;
    this.upper_x_fraction = Math.max(
      1 - this.viewport_pixel_width / this.full_pixel_width,
      0
    );
    this.upper_y_fraction = Math.max(
      1 - this.viewport_pixel_height / this.full_pixel_height,
      0
    );
    this.listener_ids = listener_ids;
  }
  setListeners() {
    this.listeners = this.listener_ids.map(id => document.getElementById(id));
  }
  broadcast(x_fraction, y_fraction) {
    this.x_fraction = Math.min(Math.max(0, x_fraction), this.upper_x_fraction);
    this.y_fraction = Math.min(Math.max(0, y_fraction), this.upper_y_fraction);
    const detail = {
        x_fraction: this.x_fraction,
        y_fraction: this.y_fraction,
        x_pixel: this.x_fraction * this.full_pixel_width,
        y_pixel: this.y_fraction * this.full_pixel_height
      },
      wheel_event = new CustomEvent("alignmentjs_wheel_event", {
        detail: detail
      });
    this.listeners.forEach(element => element.dispatchEvent(wheel_event));
  }
  handleWheel(e) {
    const old_x_pixel = this.full_pixel_width * this.x_fraction,
      old_y_pixel = this.full_pixel_height * this.y_fraction,
      new_x_pixel = old_x_pixel + e.originalEvent.deltaX,
      new_y_pixel = old_y_pixel + e.originalEvent.deltaY,
      x_fraction_candidate = new_x_pixel / this.full_pixel_width,
      y_fraction_candidate = new_y_pixel / this.full_pixel_height;
    this.broadcast(x_fraction_candidate, y_fraction_candidate);
  }
}

module.exports = ScrollBroadcaster;
