export function horizontal_scroll() {
  const id = this.props.div_id,
    node = document.getElementById(id);
  node.addEventListener("alignmentjs_wheel_event", function(e) {
    node.scrollTo(e.detail.x_pixel, 0);
  });
}

export function vertical_scroll() {
  const id = this.props.div_id,
    node = document.getElementById(id);
  node.addEventListener("alignmentjs_wheel_event", function(e) {
    node.scrollTo(0, e.detail.y_pixel);
  });
}

export function bidirectional_scroll() {
  const id = this.props.div_id,
    node = document.getElementById(id);
  node.addEventListener("alignmentjs_wheel_event", function(e) {
    node.scrollTo(e.detail.x_pixel, e.detail.y_pixel);
  });
}

export function handle_wheel(e) {
  e.preventDefault();
  this.props.scroll_broadcaster.handleWheel(e, this.props.sender);
}
