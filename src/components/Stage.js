export default class Stage {
  constructor({ width = 250, height = 250 }) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.children = [];
  }
  addLayer(...layers) {
    this.children = this.children.concat = layers;
    this.render();
    return this;
  }
  render(x = 0, y = 0) {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.width, this.height);
    // this.ctx.translate(x, y);
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
