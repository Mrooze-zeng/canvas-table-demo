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
    this.getViewportChildren().forEach((layer) => {
      !layer.parent && layer.setParent(this);
      layer.updatePosition(x, y);
      layer.draw(x, y);
    });
  }
  getViewportChildren() {
    //viewport 上下200条
    const allBodyLayer = this.children.filter((layer) => layer.name === "body");
    const headerLayer = this.children.filter(
      (layer) => layer.name === "header",
    );
    const i = allBodyLayer.findIndex((layer) => {
      return layer.y >= 0 && layer.y <= this.height;
    });
    const upChildren = allBodyLayer.slice(
      i,
      Math.min(100, allBodyLayer.length - i) + i,
    );
    const downChildren = allBodyLayer.slice(Math.max(0, i - 100), i);
    const ouput = downChildren.concat(upChildren);
    return ouput.concat(headerLayer);
  }
  insertCanvas(wrapper = HTMLElement) {
    if (!wrapper.querySelector("canvas")) {
      wrapper.appendChild(this.canvas);
    }
  }
}
