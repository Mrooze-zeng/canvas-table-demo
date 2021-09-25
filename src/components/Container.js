import { Component, createRef } from "react";
import Ceil from "./Ceil";
import Layer from "./Layer";
import Stage from "./Stage";

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.wrapper = createRef();
    this.width = 450;
    this.height = 350;
    this.stage = new Stage({
      width: this.width,
      height: this.height,
    });
    this.state = {
      inputLayerStyle: {},
    };
  }
  componentDidMount() {
    const self = this;
    const layer = new Layer({ ...this.stage, color: "green" });
    this.stage.insertCanvas(this.wrapper);
    this.stage.addLayer(layer);
    let ceil_1 = new Ceil({
      x: 100,
      y: 40,
      width: 50,
      height: 50,
      ctx: this.stage.ctx,
      onFocus: function ({ width = 0, height = 0, x = 0, y = 0 }) {
        self.setState({
          inputLayerStyle: {
            display: "inline-block",
            width,
            height,
            top: y,
            left: x,
            zIndex: 1,
          },
        });
      },
    });
    let ceil_2 = new Ceil({
      x: 10,
      y: 10,
      width: 25,
      height: 25,
      ctx: this.stage.ctx,
      onFocus: function () {
        self.setState({
          inputLayerStyle: {
            display: "inline-block",
            width: this.width,
            height: this.height,
            top: this.y,
            left: this.x,
            zIndex: 1,
          },
        });
      },
    });
    layer.add(ceil_1, ceil_2);
  }
  componentWillUnmount() {}
  handleScroll(e) {
    const { scrollTop, scrollLeft } = e.target;
    console.log(scrollTop, scrollLeft, this.stage);
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
  render() {
    const { inputLayerStyle } = this.state;
    return (
      <div
        className="wrapper"
        ref={(el) => (this.wrapper = el)}
        onClick={this.handleClick.bind(this)}
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
            <div className="wrapper-scroll-end"></div>
            <div
              className="input-placeholder"
              style={inputLayerStyle}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              contentEditable={true}
              suppressContentEditableWarning={true}
            >
              hello world
            </div>
          </div>
        </div>
      </div>
    );
  }
}
