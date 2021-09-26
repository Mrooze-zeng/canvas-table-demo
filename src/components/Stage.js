export default class Stage {
  constructor({ width = 250, height = 250 }) {
    let ratio = window.devicePixelRatio || 1;
    this.width = width * ratio;
    this.height = height * ratio;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
    this.ctx = this.canvas.getContext("2d");
    this.children = [];
    this.ctx.scale(ratio, ratio);
  }
  addLayer(...layers) {
    this.children = this.children.concat(layers).reverse();
    this.render();
    return this;
  }
  render(x = 0, y = 0) {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.children.forEach((layer) => {
      !layer.parent && layer.setParent(this);
      layer.updatePosition(x, y);
      layer.draw(x, y);
    });
    this.ctx.restore();
  }
  insertCanvas(wrapper = HTMLElement) {
    if (!wrapper.querySelector("canvas")) {
      wrapper.appendChild(this.canvas);
    }
  }
}
