export default class Base {
  image = null;
  listeners = new Map();
  visibleX = 0;
  visibleY = 0;
  actualWidth = 0;
  actualHeight = 0;
  constructor({
    name = "",
    type = "",
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
    events = {},
  }) {
    this.name = name;
    this.type = type;
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
    this.stage = stage;
    this.layer = layer || this;
    this.displayText = this.ellipsisText();
    this.setEvents(events);
  }
  setEvents(events = {}) {
    Object.keys(events).forEach((name) => {
      this.on(name, () => {
        events[name](this);
      });
    });
  }
  isVisible() {
    return (
      (this.x > 0 && this.x <= this.stage.width) ||
      (this.y > 0 && this.y <= this.stage.height)
    );
  }
  getHeadersHeight() {
    const headers = this.stage.getHeaders();
    return headers.reduce((height, header) => {
      height += header.height;
      return height;
    }, 0);
  }
  getFixedCeilsWidth() {
    const ceils = this.layer.getCeils();
    return ceils.reduce((width, ceil) => {
      if (ceil.fixed) {
        width += ceil.width;
      }
      return width;
    }, 0);
  }
  calculateActualSize() {
    this.visibleX = this.x;
    this.visibleY = this.y;
    this.actualWidth = this.width;
    this.actualHeight = this.height;
    if (!this.fixed) {
      //height
      const headersHeight = this.getHeadersHeight();
      const heightDiff = headersHeight - this.y;
      if (heightDiff > 0) {
        this.actualHeight = this.height - heightDiff;
        this.visibleY = this.y + heightDiff;
      }

      //width
      const fixedCeilsWidth = this.getFixedCeilsWidth();
      const widthDiff = fixedCeilsWidth - this.x;
      if (widthDiff > 0) {
        this.actualWidth = this.width - widthDiff;
        this.visibleX = this.x + widthDiff;
      }
    }
    if (this.stage.height - this.y < this.height) {
      this.actualHeight = this.stage.height - this.y;
    }
    if (this.stage.width - this.x < this.width) {
      this.actualWidth = this.stage.width - this.x;
    }
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
    const { options = {} } = this.stage;
    this.ctx.fillStyle = options.color;
    this.ctx.font = [options.fontSize, options.fontFamily].join(" ");
    this.ctx.textAlign = options.textAlign;
    this.ctx.textBaseline = options.textBaseline;
    this.ctx.fillText(
      this.displayText,
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width,
    );
  }

  drawImage() {
    //垂直可见
    if (this.isVisible()) {
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
    let x = this.x + (this.width - size) / 2;
    let y = this.y + (this.height - size) / 2;
    if (this.y + this.height / 2 < this.getHeadersHeight()) {
      return;
    }
    this.ctx.drawImage(image, x, y, size, size);
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
    this.calculateActualSize();
    this.trigger("onPositionUpdate");
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
    )(name, this, ...args);
  }
}
