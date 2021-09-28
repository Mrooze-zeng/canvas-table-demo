import Ceil from "./Ceil";
import Layer from "./Layer";

export default class Stage {
  static LayerType = {
    HEADER: Symbol("header"),
    BODY: Symbol("body"),
    CEIL: Symbol("ceil"),
  };
  children = [];
  visibleRange = { x: 0, y: 0 };
  constructor({ width = 250, height = 250, columns = [], options = {} }) {
    let ratio = window.devicePixelRatio || 1;
    this.width = width * ratio;
    this.height = height * ratio;
    this.columns = columns;
    this.options = options;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
    this.ctx = this.canvas.getContext("2d");
    this.ctx.scale(ratio, ratio);
  }
  addLayer(...layers) {
    this.children = this.children.concat(layers);
    return this;
  }
  render(x = 0, y = 0) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.getViewportLayers(100).forEach((layer) => {
      layer.draw(x, y);
    });
  }
  getHeaders() {
    return this.children.filter(
      (layer) => layer.type === Stage.LayerType.HEADER,
    );
  }
  getHeadersHeight() {
    const headers = this.getHeaders();
    return headers.reduce((height, header) => {
      height += header.height;
      return height;
    }, 0);
  }
  getBodys() {
    return this.children.filter((layer) => layer.type === Stage.LayerType.BODY);
  }
  getViewportLayers(size = 0) {
    //viewport 上下200条
    const allBodyLayer = this.getBodys();
    const headerLayer = this.getHeaders();
    const firstLayerIndex = allBodyLayer.findIndex((layer) => {
      return layer.y >= 0 && layer.y <= this.height;
    });
    let lastLayerIndex = allBodyLayer.findIndex((layer) => {
      return layer.y >= this.height;
    });
    if (lastLayerIndex < 0) {
      lastLayerIndex = this.children.length - 1;
    }
    const output = allBodyLayer.slice(
      Math.max(0, firstLayerIndex - size),
      Math.min(this.children.length, lastLayerIndex + size),
    );
    return output.concat(headerLayer);
  }
  getCurrentLayer({ x = 0, y = 0 }) {
    let currentLayer = null;
    const viewportLayers = this.getViewportLayers();
    viewportLayers.forEach((layer, index) => {
      if (layer.isCurrentElement(layer, { x, y })) {
        layer.type === Stage.LayerType.BODY &&
          layer.setNeighborLayer(
            viewportLayers[index - 1],
            viewportLayers[index + 1],
          );
        currentLayer = layer;
      }
    });
    return currentLayer;
  }
  getCurrentCeil({ x = 0, y = 0 }) {
    let currentLayer = this.getCurrentLayer({ x, y });
    if (currentLayer) {
      return currentLayer.getCurrentCeil({ x, y });
    }
    return null;
  }
  triggerEventToCeil(event = "", position = { x: 0, y: 0 }, data = {}) {
    const ceil = this.getCurrentCeil(position);
    if (ceil) {
      ceil.trigger(event, data);
      ceil.layer.trigger(event, data);
    }
  }
  setName(name = "", args) {
    switch (typeof name) {
      case "function":
        return name(args);
      default:
        return String(name);
    }
  }
  setFixedState({ type = "", fixed = "" }, isFixed = false) {
    switch (type) {
      case Stage.LayerType.HEADER:
        if (isFixed) {
          return "top,left";
        }
        return fixed;
      case Stage.LayerType.BODY:
        if (isFixed) {
          return "left";
        }
        return fixed;
      default:
        return fixed;
    }
  }
  createCeils({
    layer = null,
    events = {},
    type = Stage.LayerType.CEIL,
    name = "",
  }) {
    let ceils = [];
    const columns = layer.columns;
    const dataSource = layer.dataSource;
    for (let i = 0; i < columns.length; i++) {
      let x = ceils.reduce((prev, curv, i) => {
        prev += curv.width;
        return prev;
      }, 0);

      ceils.push(
        new Ceil({
          name: this.setName(name, i),
          type: type,
          text: dataSource[columns[i].key] || columns[i].title,
          x: x,
          y: layer.y,
          width: columns[i].width,
          height: layer.height,
          stage: this,
          layer: layer,
          color: layer.color,
          fixed: this.setFixedState(layer, columns[i].fixed),
          column: columns[i],
          columns: columns,
          dataSource: layer.dataSource,
          events: events,
        }),
      );
    }
    layer.add(...ceils).draw();
  }
  createRows({
    dataSource = [],
    columns = [],
    layerOptions = {},
    ceilOptions = {},
  }) {
    let rows = [];
    const {
      name = "",
      type = Stage.LayerType.BODY,
      width = 100,
      height = 45,
      color = "white",
      x = 0,
      y = 0,
      events = {},
    } = layerOptions;
    for (let i = 0; i < dataSource.length; i++) {
      let row = new Layer({
        name: this.setName(name, i),
        type: type,
        x: x,
        y: y + i * height,
        stage: this,
        width: width,
        height: height,
        color: color,
        columns: columns,
        dataSource: dataSource[i],
        events: events,
      });
      this.createCeils({
        layer: row,
        ...ceilOptions,
      });
      rows.push(row);
    }
    return rows;
  }
  getDataSource() {
    let dataSource = [];
    this.children.forEach((layer) => {
      if (layer.dataSource && Object.keys(layer.dataSource).length) {
        dataSource.push(layer.dataSource);
      }
    });
    return dataSource;
  }
  insertCanvas(wrapper = HTMLElement) {
    if (!wrapper.querySelector("canvas")) {
      wrapper.appendChild(this.canvas);
    }
  }
}
