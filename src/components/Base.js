export default class Base {
  constructor({
    name = "",
    x = 0,
    y = 0,
    width = 100,
    height = 45,
    color = "yellow",
    onFocus = function () {},
  }) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.originX = x;
    this.originY = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.onFocus = onFocus;
    this.listeners = new Map();
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
    this.x = this.originX - x;
    this.y = this.originY - y;
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
