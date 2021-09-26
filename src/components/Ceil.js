import Base from "./Base";
export default class Ceil extends Base {
  constructor(props = {}) {
    super(props);
    const { ctx, onFocus } = props;
    this.ctx = ctx;
    this.onFocus = onFocus;
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
  }
  ellipsisText() {
    let displayText = this.text;
    let ellipsis = "...";
    let width = this.ctx.measureText(displayText).width;
    let ellipsisWidth = this.ctx.measureText(ellipsis).width;
    const maxWidth = this.column.width - 50;
    if (maxWidth < width) {
      let len = displayText.length;
      while (width > maxWidth && len > 0) {
        displayText = displayText.substring(0, len);
        width = this.ctx.measureText(displayText).width;
        len -= 1;
      }
    }
    return displayText;
  }
  draw(x = 0, y = 0) {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.fillStyle = "#000";
    this.ctx.font =
      "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;";
    this.ctx.fillText(
      this.text,
      this.x + 25,
      this.y + 25,
      this.column.width - 50,
    );
    this.setEvent();
  }
}
