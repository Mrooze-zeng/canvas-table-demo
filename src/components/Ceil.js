import Base from "./Base";
export default class Ceil extends Base {
  constructor(props = {}) {
    super(props);
  }
  setEvent() {
    this.on("click", (event = "", args = {}) => {
      console.log("click on ceil", this);
      this.onFocus(this);
    });
    this.on("move", (event = "", args = { x: 0, y: 0 }) => {
      console.log("move...", args);
      this.update(args);
    });
    // this.on("hover", (event = "", args = { x: 0, y: 0 }) => {
    //   console.log("hover...", args, this);
    // });
  }
  drawBorder() {
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 0.5;
    this.ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
  drawBackground() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  draw(x = 0, y = 0) {
    this.drawBackground();
    this.drawBorder();
    if (this.column.type === "image" && this.parent.name === "body") {
      super.drawImage();
    } else {
      super.drawText();
    }
    this.setEvent();
  }
}
