class ScrollBroadcaster {
  constructor(broadcast_units) {
    if (!Array.isArray(broadcast_units)) {
      if (!broadcast_units.name) {
        broadcast_units.name = "main";
      }
      broadcast_units = [broadcast_units];
    } else if (broadcast_units.length == 1 && !broadcast_units[0].name) {
      broadcast_units.name = "main";
    }
    broadcast_units.forEach(unit => {
      this[unit.name] = {};
      this[unit.name].width = unit.width;
      this[unit.name].height = unit.height;
      this[unit.name].x_pad = unit.x_pad;
      this[unit.name].y_pad = unit.y_pad;
      this[unit.name].bidirectional = unit.bidirectional;
      this[unit.name].horizontal = unit.horizontal;
      this[unit.name].vertical = unit.vertical;
      this[unit.name].x_fraction = unit.x_pixel / unit.width || 0;
      this[unit.name].y_fraction = unit.y_pixel / unit.height || 0;
      this[unit.name].upper_x_fraction =
        Math.max(unit.width - unit.x_pad, 0) / unit.width;
      this[unit.name].upper_y_fraction =
        Math.max(unit.height - unit.y_pad, 0) / unit.height;
    });
  }
  handleWheel(e, sender) {
    const unit = this[sender],
      old_x_pixel = unit.width * unit.x_fraction,
      old_y_pixel = unit.height * unit.y_fraction,
      new_x_pixel = old_x_pixel + e.deltaX,
      new_y_pixel = old_y_pixel + e.deltaY,
      x_fraction_candidate = new_x_pixel / unit.width,
      y_fraction_candidate = new_y_pixel / unit.height;
    this.broadcast(x_fraction_candidate, y_fraction_candidate, sender);
  }
  broadcast(x_fraction_candidate, y_fraction_candidate, sender) {
    const unit = this[sender];
    unit.x_fraction = Math.min(
      Math.max(0, x_fraction_candidate),
      unit.upper_x_fraction
    );
    unit.y_fraction = Math.min(
      Math.max(0, y_fraction_candidate),
      unit.upper_y_fraction
    );
    const detail = {
      x_fraction: unit.x_fraction,
      y_fraction: unit.y_fraction,
      x_pixel: unit.x_fraction * unit.width,
      y_pixel: unit.y_fraction * unit.height,
      sender: sender
    };
    const wheel_event = new CustomEvent("alignmentjs_wheel_event", {
      detail: detail
    });
    unit.bidirectional.forEach(recipient => {
      const element = document.getElementById(recipient);
      element.dispatchEvent(wheel_event);
    });
  }
  location(sender) {
    sender = sender || "main";
    return {
      x_pixel: this[sender].width * this[sender].x_fraction,
      y_pixel: this[sender].height * this[sender].y_fraction,
      x_fraction: this[sender].x_fraction,
      y_fraction: this[sender].y_fraction,
      x_pad: this[sender].x_pad,
      y_pad: this[sender].y_pad
    };
  }
}

export default ScrollBroadcaster;
