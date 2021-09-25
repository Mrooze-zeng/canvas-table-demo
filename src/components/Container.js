import { Component, createRef } from "react";
import Ceil from "./Ceil";
import Layer from "./Layer";
import Stage from "./Stage";

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.wrapper = createRef();
    this.inputLayer = createRef();
    this.width = 450;
    this.height = 350;
    this.stage = new Stage({
      width: this.width,
      height: this.height,
    });
    this.state = {
      inputLayerStyle: {},
      currentText: "",
    };
  }
  componentDidMount() {
    const bodyLayer = new Layer({
      name: "body",
      x: 0,
      y: 45,
      ctx: this.stage.ctx,
      width: this.width * 10,
      height: this.height * 10,
      color: "white",
    });
    const headerLayer = new Layer({
      name: "header",
      x: 0,
      y: 0,
      ctx: this.stage.ctx,
      width: this.width * 10,
      height: 45,
      color: "white",
      fixed: "top",
    });
    this.stage.insertCanvas(this.wrapper);
    this.stage.addLayer(headerLayer, bodyLayer);
    this._createCeil({
      size: 50,
      initX: 0,
      initY: 0,
      layer: headerLayer,
      color: "orange",
    });
    for (let i = 0; i < 75; i++) {
      this._createCeil({
        size: 50,
        initX: 0,
        initY: 45 + i * 46,
        layer: bodyLayer,
        row: i + 1,
      });
    }
  }
  _createCeil({
    size = 10,
    initX = 0,
    initY = 0,
    width = 100,
    layer = null,
    color = "green",
    row = 0,
  }) {
    const self = this;
    let ceils = [];
    for (let i = 0; i < size; i++) {
      let x = initX + i * (width + 1);
      let y = initY;
      ceils.push(
        new Ceil({
          name: `列${i}-行${row}`,
          x: x,
          y: y,
          width: 100,
          height: 45,
          ctx: this.stage.ctx,
          color: color,
          fixed: layer.fixed,
          onFocus: function () {
            self.updateInputLayer.call(self, this);
          },
          onScroll: function () {
            self.updateInputLayer.call(self, this, false);
          },
        }),
      );
    }
    layer.add(...ceils);
  }
  updateInputLayer(
    { width = 0, height = 0, x = 0, y = 0, name = "", color = "orange" },
    show = true,
  ) {
    this.setState({
      inputLayerStyle: {
        display: show ? "inline-block" : "none",
        width: width,
        height: height,
        top: y,
        left: x,
        zIndex: 1,
        background: color,
      },
      currentText: name,
    });
    if (show) {
      setTimeout(() => {
        this.inputLayer.focus();
      });
    }
  }
  handleScroll(e) {
    const { scrollTop, scrollLeft } = e.target;
    this.stage.render(scrollLeft, scrollTop);
  }
  handleClick(e) {
    const { left, top } = e.target.getBoundingClientRect();
    const x = e.clientX - left,
      y = e.clientY - top;
    this.stage.children.forEach((layer) => {
      layer.isCurrentElement(layer, { x, y }) &&
        layer.trigger("click", { x, y });
    });
  }
  handleDoubleClick() {
    console.log("handleDoubleClick");
  }
  handleContextMenu(e) {
    console.log("handleContextMenu");
    e.preventDefault();
    e.stopPropagation();
  }
  handleBlur() {
    this.updateInputLayer({}, false);
  }
  render() {
    const { inputLayerStyle, currentText } = this.state;
    return (
      <div
        className="wrapper"
        ref={(el) => (this.wrapper = el)}
        onClick={this.handleClick.bind(this)}
        onBlur={this.handleBlur.bind(this)}
        onDoubleClick={this.handleDoubleClick.bind(this)}
        onContextMenu={this.handleContextMenu.bind(this)}
      >
        <div className="wrapper-scroll">
          <div
            className="wrapper-scroll-inner"
            style={{
              width: this.width + 10,
              height: this.height + 10,
            }}
            onScroll={this.handleScroll.bind(this)}
          >
            <div
              className="wrapper-scroll-end"
              style={{
                top: this.height * 10,
                left: this.width * 10,
              }}
            ></div>
            <div
              className="input-placeholder"
              ref={(el) => (this.inputLayer = el)}
              style={inputLayerStyle}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              contentEditable={true}
              suppressContentEditableWarning={true}
            >
              {currentText}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
