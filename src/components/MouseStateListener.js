export default class MouseStateListener {
  constructor({ target = HTMLCanvasElement }) {
    this.target = target;
  }
  setUpListener(trigger = function () {}) {
    this.trigger = trigger;
    this.isDrawing = false;
    this.x = 0;
    this.y = 0;
    this.target.addEventListener("mousedown", this.handleMouseDown.bind(this));
    this.target.addEventListener("mousemove", this.handleMouseMove.bind(this));
    this.target.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }
  handleMouseDown(e) {
    const { left, top } = e.target.getBoundingClientRect();
    this.x = e.clientX - left;
    this.y = e.clientY - top;
    console.log(e.type);
    this.isDrawing = true;
  }
  handleMouseMove(e) {
    const { left, top } = e.target.getBoundingClientRect();
    if (this.isDrawing) {
      this.trigger(this.x, this.y, e.clientX - left, e.clientY - top);
      this.x = e.clientX - left;
      this.y = e.clientY - top;
    }
  }
  handleMouseUp(e) {
    const { left, top } = e.target.getBoundingClientRect();
    if (this.isDrawing) {
      this.trigger(this.x, this.y, e.clientX - left, e.clientY - top);
      this.x = 0;
      this.y = 0;
      this.isDrawing = false;
    }
  }
  destory() {
    this.target.removeEventListener(
      "mousedown",
      this.handleMouseDown.bind(this),
    );
    this.target.removeEventListener(
      "mousemove",
      this.handleMouseMove.bind(this),
    );
    this.target.removeEventListener("mouseup", this.handleMouseUp.bind(this));
  }
}
