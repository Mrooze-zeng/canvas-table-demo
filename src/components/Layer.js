import Base from "./Base";

export default class Layer extends Base {
  constructor(props = {}) {
    super(props);
    const { ctx } = props;
    this.ctx = ctx;
    this.children = [];
  }
  add(...elments) {
    this.children = this.children.concat(elments);
    this.children.forEach((elment) => {
      elment.setParent(this);
    });
    this.draw();
    return this;
  }
  setEvent() {
    this.on("click,move", (type = "", args = {}) => {
      this.children.forEach((elment) => {
        elment.isCurrentElement(elment, args) && elment.trigger(type, args);
      });
    });
  }
  draw(x = 0, y = 0) {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.children.forEach((elment) => {
      elment.updatePosition(x, y);
      elment.draw(x, y);
    });
    this.setEvent();
  }
}
