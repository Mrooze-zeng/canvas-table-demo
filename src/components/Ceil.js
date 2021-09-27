import Base from "./Base";
export default class Ceil extends Base {
  constructor(props = {}) {
    super(props);
  }
  drawBorderRight() {
    this.ctx.beginPath();
    this.ctx.lineWidth = this.lineWidth / 2;
    this.ctx.strokeStyle = this.borderColor;
    this.ctx.moveTo(this.x + this.width, this.y);
    this.ctx.lineTo(this.x + this.width, this.y + this.height);
    this.ctx.stroke();
  }
  drawBackground() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  draw(x = 0, y = 0) {
    this.updatePosition(x, y);
    this.drawBackground();
    this.drawBorderRight();
    if (this.column.type === "image" && this.layer.type === "body") {
      super.drawImage();
    } else {
      super.drawText();
    }
  }
}
