import Base from "./Base";
import Stage from "./Stage";

export default class Layer extends Base {
  prevLayer = null;
  nextLayer = null;
  children = [];
  constructor(props = {}) {
    super(props);
  }
  add(...elments) {
    this.children = this.children.concat(elments).sort((elment) => {
      return elment.column.fixed ? 1 : -1;
    });
    return this;
  }
  setNeighborLayer(prev = null, next = null) {
    this.prevLayer = prev;
    this.nextLayer = next;
  }
  getPrevLayer() {
    return this.prevLayer;
  }
  getNextLayer() {
    return this.nextLayer;
  }
  getCeils() {
    return this.children;
  }
  getCurrentCeil({ x = 0, y = 0 }) {
    let currentElement = null;
    this.children.forEach((element, index) => {
      if (element.isCurrentElement(element, { x, y })) {
        element.setNeighborCeil(
          this.children[index + 1],
          this.children[index - 1],
        );
        currentElement = element;
      }
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
  getFixedCeils() {
    return this.children.filter((ceil) => {
      return ceil.fixed && ceil.fixed.includes("left");
    });
  }
  getUnfixedCeils() {
    return this.children.filter((ceil) => {
      return !ceil.fixed || (ceil.fixed && !ceil.fixed.includes("left"));
    });
  }
  getViewportCeils() {
    const unfixedCeils = this.getUnfixedCeils().sort((a, b) => {
      return a.x - b.x;
    });
    const firstCeilIndex = unfixedCeils.findIndex((ceil) => {
      return ceil.x >= 0;
    });
    let lastCeilIndex = unfixedCeils.findIndex((ceil) => {
      return ceil.x + ceil.width >= this.stage.width;
    });
    if (lastCeilIndex < 0) {
      lastCeilIndex = unfixedCeils.length - 1;
    }
    const size = lastCeilIndex - firstCeilIndex;
    let output = unfixedCeils.slice(
      Math.max(0, firstCeilIndex - 5 * size),
      Math.min(unfixedCeils.length, lastCeilIndex + 5 * size),
    );
    return output.concat(this.getFixedCeils());
  }
  draw(x = 0, y = 0) {
    this.updatePosition(x, y);
    if (this.isVisible() || this.type === Stage.LayerType.HEADER) {
      // this.drawBackground();
      this.drawLine();
      this.getViewportCeils();
      this.getViewportCeils().forEach((elment) => {
        elment.draw(x, y);
      });
    }
  }
}
