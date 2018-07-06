class ScrollBroadcaster {
  /* ScrollBroadcaster is a class used to coordinate the scrolling of multiple DOM elements.
   * It follows the publish–subscribe pattern.
   * 
   * The following conventions/names are used:
   *  - DOM elements have a full width/height described in terms of pixels.
   *  - When only a part of a DOM element is shown/rendered that part is refered to as the viewport.
   *  - Scrolling can be thought of as moving the viewport around the DOM element.
   *  - The location of the viewport on the DOM element is described by the location of the top left corner of the viewport in two ways:
   *      1. pixel: How many pixels over/down from the top left corner of the complete DOM element.
   *      2. fraction: What fraction of the way across/down relative to the complete DOM element.
   *      (NOTE: because the top left corner of the viewport can never reach the bottom or right of the DOM element
   *             the "fraction" will never be 100%... two variables `upper_x_fraction` & `upper_y_fraction` are
   *             therefore used to describe the maximum fraction that the upper left corner can reach.
   */

  constructor(
    full_pixel_dimensions,
    viewport_pixel_dimensions,
    initial_pixels,
    listener_ids
  ) {
    // How many pixels wide/high the full DOM element (this is always the BaseAlignment component).
    this.full_pixel_width = full_pixel_dimensions.width;
    this.full_pixel_height = full_pixel_dimensions.height;
    // How many pixels wide/high the viewport is (again, always the viewport for the BaseAlignment component).
    this.viewport_pixel_width = viewport_pixel_dimensions.width;
    this.viewport_pixel_height = viewport_pixel_dimensions.height;
    // How far the viewport is scrolled over/down.
    this.x_fraction = initial_pixels.x_pixel / this.full_pixel_width || 0;
    this.y_fraction = initial_pixels.y_pixel / this.full_pixel_height || 0;
    // The maximum fraction (i.e. when scrolled all the way right/down).
    this.upper_x_fraction = Math.max(
      1 - this.viewport_pixel_width / this.full_pixel_width,
      0
    );
    this.upper_y_fraction = Math.max(
      1 - this.viewport_pixel_height / this.full_pixel_height,
      0
    );
    // The ids of the DOM elements that are being listned to (an array).
    this.listener_ids = listener_ids;
  }

  setListeners() {
    this.listeners = this.listener_ids.map(id => document.getElementById(id));
  }

  broadcast(x_fraction_candidate, y_fraction_candidate) {
    // Make sure the viewport doens't go off the element.
    this.x_fraction = Math.min(
      Math.max(0, x_fraction_candidate),
      this.upper_x_fraction
    );
    this.y_fraction = Math.min(
      Math.max(0, y_fraction_candidate),
      this.upper_y_fraction
    );
    // The "detail" object contains the location of the top left corner of the viewport in terms of pixel and fraction.
    const detail = {
      x_fraction: this.x_fraction,
      y_fraction: this.y_fraction,
      x_pixel: this.x_fraction * this.full_pixel_width,
      y_pixel: this.y_fraction * this.full_pixel_height
    };
    // Broadcast the current "detail" on the "alignmentjs_wheel_event" channel.
    const wheel_event = new CustomEvent("alignmentjs_wheel_event", {
      detail: detail
    });
    this.listeners.forEach(element => element.dispatchEvent(wheel_event));
  }

  handleWheel(e) {
    // Calculate the new location based on how far has been scrolled.
    const old_x_pixel = this.full_pixel_width * this.x_fraction;
    const old_y_pixel = this.full_pixel_height * this.y_fraction;
    const new_x_pixel = old_x_pixel + e.originalEvent.deltaX;
    const new_y_pixel = old_y_pixel + e.originalEvent.deltaY;
    const x_fraction_candidate = new_x_pixel / this.full_pixel_width;
    const y_fraction_candidate = new_y_pixel / this.full_pixel_height;
    // Broadcast the new location with the broadcaster method.
    this.broadcast(x_fraction_candidate, y_fraction_candidate);
  }
}

module.exports = ScrollBroadcaster;
