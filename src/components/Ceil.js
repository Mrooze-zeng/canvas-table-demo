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
  draw(x = 0, y = 0) {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.fillStyle = "#000";
    this.ctx.font =
      "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;";
    this.ctx.fillText(this.name, this.x + 25, this.y + 25);
    this.setEvent();
  }
}
