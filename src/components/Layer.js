import Base from "./Base";

export default class Layer extends Base {
  constructor(props = {}) {
    super(props);
    this.children = [];
  }
  add(...elments) {
    this.children = this.children.concat(elments).reverse();
    return this;
  }
  getCurrentCeil({ x = 0, y = 0 }) {
    let currentElement = null;
    this.children.forEach((element) => {
      element.isCurrentElement(element, { x, y }) && (currentElement = element);
    });
    return currentElement;
  }
  drawLine() {
    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.borderColor;
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(this.x + this.width, this.y);
    this.ctx.stroke();
  }
  drawBackground() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  draw(x = 0, y = 0) {
    this.updatePosition(x, y);
    // this.drawBackground();
    this.drawLine();
    this.children.forEach((elment) => {
      elment.draw(x, y);
    });
  }
}
