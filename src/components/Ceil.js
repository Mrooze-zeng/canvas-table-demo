import { COLUMN_TYPE } from "../columns";
import Base from "./Base";
import Stage from "./Stage";
export default class Ceil extends Base {
  prevCeil = null;
  nextCeil = null;
  children = [];
  constructor(props = {}) {
    super(props);
  }
  setNeighborCeil(prev = null, next = null) {
    this.prevCeil = prev;
    this.nextCeil = next;
  }
  getPrevCeil() {
    return this.prevCeil;
  }
  getNextCeil() {
    return this.nextCeil;
  }
  updateValue(value = "") {
    if (this.text === value) {
      return;
    }
    this.text = value;
    this.displayText = this.ellipsisText();
    this.updateDataSource(value);
    this.stage.render(this.stage.x, this.stage.y);
  }
  updateDataSource(value = "") {
    this.dataSource[this.column.key] = value;
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
    if (
      this.column.type === COLUMN_TYPE.IMAGE &&
      this.layer.type === Stage.LayerType.BODY
    ) {
      super.drawImage();
    } else {
      super.drawText();
    }
  }
}
