export default class Base {
  constructor({
    name = "",
    text = "",
    x = 0,
    y = 0,
    width = 100,
    height = 45,
    color = "yellow",
    fixed = "",
    columns = [],
    column = {},
    dataSource = {},
    stage = {},
    layer = null,
    onFocus = function () {},
    onScroll = function () {},
  }) {
    this.name = name;
    this.text = text;
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.width = width;
    this.height = height;
    this.ctx = stage.ctx;
    this.color = color;
    this.fixed = fixed;
    this.columns = columns;
    this.column = column;
    this.dataSource = dataSource;
    this.onFocus = onFocus;
    this.onScroll = onScroll;
    this.stage = stage;
    this.layer = layer || this;
    this.listeners = new Map();
    this.displayText = this.ellipsisText();
    this.image = null;
  }
  ellipsisText() {
    let displayText = this.text;
    let ellipsis = "...";
    let width = this.ctx.measureText(displayText).width;
    let ellipsisWidth = this.ctx.measureText(ellipsis).width;
    const maxWidth = this.width - 25;
    if (maxWidth < width) {
      let len = displayText.length;
      while (width + ellipsisWidth > maxWidth && len > 0) {
        displayText = displayText.substring(0, len);
        width = this.ctx.measureText(displayText).width;
        len -= 1;
      }
      return displayText + ellipsis;
    }
    return displayText;
  }
  drawText() {
    this.ctx.fillStyle = "#000";
    this.ctx.font = "16px sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(
      this.displayText,
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width,
    );
  }

  drawImage() {
    const size = 35;
    //垂直可见
    if (this.stage.height + this.stage.height / 2 >= this.y && this.y >= 0) {
      if (this.image) {
        this._drawImage(this.image);
        return;
      }
      const img = new Image();
      img.src = this.text;
      img.onload = () => {
        this.image = img;
        this._drawImage(this.image);
      };
    }
  }
  _drawImage(image, size = 35) {
    this.ctx.drawImage(
      image,
      this.x + (this.width - size) / 2,
      this.y + (this.height - size) / 2,
      size,
      size,
    );
  }
  commonTrigger(type = "", args = {}) {
    let currentElement = null;
    this.children.forEach((elment) => {
      elment.isCurrentElement(elment, args) && (currentElement = elment);
    });
    currentElement && currentElement.trigger(type, args);
  }
  update({
    x = this.x,
    y = this.y,
    width = this.width,
    height = this.height,
    color = this.color,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.parent && this.parent.draw();
  }
  updatePosition(x = 0, y = 0) {
    switch (this.fixed) {
      case "top":
        this.x = this.originX - x;
        this.y = this.originY;
        break;
      case "left":
        this.x = this.originX;
        this.y = this.originY - y;
        break;
      case "top,left":
        this.x = this.originX;
        this.y = this.originY;
        break;
      default:
        this.x = this.originX - x;
        this.y = this.originY - y;
    }
    this.onScroll(this);
  }
  setParent(parent = null) {
    this.parent = parent;
  }
  isCurrentElement(
    element = { x: 0, y: 0, height: 0, width: 0 },
    position = { x: 0, y: 0 },
  ) {
    let isInX =
      position.x > element.x && position.x < element.x + element.width;
    let isInY =
      position.y > element.y && position.y < element.y + element.height;
    return isInX && isInY;
  }
  on(names = "", callback = function () {}) {
    names.split(",").forEach((name) => {
      this.listeners.set(name.trim(), callback);
    });
  }
  off(name = "") {
    this.listeners.delete(name);
  }
  trigger(name = "", ...args) {
    (
      this.listeners.get(name) ||
      function () {
        return false;
      }
    )(name, ...args);
  }
}
