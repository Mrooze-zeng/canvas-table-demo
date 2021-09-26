import _ from "lodash";
import { Component, createRef } from "react";
import Ceil from "./Ceil";
import Layer from "./Layer";
import Stage from "./Stage";

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.wrapper = createRef();
    this.inputLayer = createRef();
    this.columns = props.columns;
    this.dataSource = props.dataSource;
    this.width = 650;
    this.height = 450;
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
    const headerRow = new Layer({
      name: "header",
      x: 0,
      y: 0,
      ctx: this.stage.ctx,
      width: this._getTotalWidth(),
      height: 45,
      color: "white",
      fixed: "top",
      columns: this.columns,
      dataSource: {},
    });
    let bodyRows = [];
    this.stage.insertCanvas(this.wrapper);

    this._createCeil({
      initX: 0,
      initY: 0,
      layer: headerRow,
      color: "orange",
    });
    for (let i = 0; i < this.dataSource.length; i++) {
      let bodyRow = new Layer({
        name: "body",
        x: 0,
        y: 45 + i * 46,
        ctx: this.stage.ctx,
        width: this._getTotalWidth(),
        height: 45,
        color: "white",
        columns: this.columns,
        dataSource: this.dataSource[i],
      });
      this._createCeil({
        initX: 0,
        initY: bodyRow.y,
        layer: bodyRow,
        row: i,
      });
      bodyRows.push(bodyRow);
    }
    this.stage.addLayer(headerRow, ...bodyRows);
    console.log(this.stage);
  }
  _getTotalWidth() {
    let width = 0;
    this.columns.forEach((col) => {
      width += col.width;
    });
    return width;
  }
  _getTotalHeight() {
    return this.dataSource.length * 45;
  }
  _createCeil({
    initX = 0,
    initY = 0,
    width = 100,
    layer = null,
    color = "green",
    row = 0,
  }) {
    const self = this;
    let ceils = [];
    let fixed = "";
    const columns = layer.columns;
    const dataSource = layer.dataSource;
    for (let i = 0; i < columns.length; i++) {
      let x = initX + i * (width + 1);
      let y = initY;

      if (layer.name === "body" && columns[i].fixed) {
        fixed = "left";
      } else if (layer.name === "header" && columns[i].fixed) {
        fixed = "top,left";
      } else {
        fixed = layer.fixed;
      }
      ceils.push(
        new Ceil({
          name: `列${i}-行${row}`,
          text: dataSource[columns[i].key] || columns[i].title,
          x: x,
          y: y,
          width: columns[i].width,
          height: 45,
          ctx: this.stage.ctx,
          color: color,
          fixed: fixed,
          column: columns[i],
          columns: columns,
          dataSource: dataSource,
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
    { width = 0, height = 0, x = 0, y = 0, text = "", color = "orange" },
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
      currentText: text,
    });
    if (show) {
      setTimeout(() => {
        this.inputLayer.focus();
      });
    }
  }
  handleScroll = _.throttle((e) => {
    const { scrollTop, scrollLeft } = e.target;
    this.stage.render(scrollLeft, scrollTop);
  }, 10);
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
  calculateScrollEndPosition() {
    return {
      top: this._getTotalHeight() + 35 + this.dataSource.length,
      left: this._getTotalWidth() - (this._getTotalWidth() % this.width) - 13,
    };
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
              style={this.calculateScrollEndPosition()}
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
