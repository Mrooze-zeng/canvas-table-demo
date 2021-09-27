import _ from "lodash";
import { Component, createRef } from "react";
import Layer from "./Layer";
import Stage from "./Stage";

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.wrapperRef = createRef();
    this.inputLayerRef = createRef();
    this.scrollEndRef = createRef();
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
      inputLayerVisibleState: false,
      currentText: "",
      scrollEndPosition: {
        top: 0,
        left: 0,
      },
    };
  }
  static getDerivedStateFromProps(props, state) {
    // console.log(props, state);
    return null;
  }
  componentDidMount() {
    const headerRow = new Layer({
      type: "header",
      x: 0,
      y: 0,
      stage: this.stage,
      width: this._getTotalWidth(),
      height: 45,
      color: "orange",
      fixed: "top",
      columns: this.columns,
    });
    this.stage.insertCanvas(this.wrapperRef);

    this.stage.createCeils({
      layer: headerRow,
    });

    const bodyRows = this.stage.createRows({
      dataSource: this.dataSource,
      columns: this.columns,
      layerOptions: {
        width: this._getTotalWidth(),
        y: 45,
        color: "green",
      },
      ceilOptions: {
        events: {
          onClick: this.handleCeilClick.bind(this),
          onPositionUpdate: this.handleCeilScroll.bind(this),
        },
      },
    });
    this.stage.addLayer(headerRow, ...bodyRows);

    this.setState({
      scrollEndPosition: {
        top: this.stage.children.length * 45,
        left: this._getTotalWidth() - this.width / 2 + 5,
      },
    });
  }
  _getTotalWidth() {
    let width = 0;
    this.columns.forEach((col) => {
      width += col.width;
    });
    return width;
  }
  handleCeilClick(ceil = {}) {
    const { dataSource = {}, image, column = {} } = ceil;
    if (column.type === "image") {
      document.body.querySelectorAll("img").forEach((img) => {
        img.remove();
      });
      document.body.appendChild(image);
      alert(`click on ${dataSource.name}'s avatar`);
    } else {
      this.updateInputLayer(ceil);
    }
    console.log("click on ceil: ", ceil);
  }
  handleCeilScroll(ceil = {}) {
    const { inputLayerVisibleState } = this.state;
    inputLayerVisibleState && this.updateInputLayer(ceil, false);
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
      inputLayerVisibleState: show,
    });
    if (show) {
      setTimeout(() => {
        this.inputLayerRef.focus();
      });
    }
  }
  handleScroll = _.throttle((e) => {
    const { scrollTop, scrollLeft } = e.target;
    const {
      onScrollToTop = function () {},
      onScrollToBottom = function () {},
    } = this.props;

    this.stage.render(scrollLeft, scrollTop);

    if (scrollTop === 0) {
      //todo x轴
      onScrollToTop();
    }
    const { bottom: endBottom } = this.scrollEndRef.getBoundingClientRect();
    const { bottom: wrapperBottom } = e.target.getBoundingClientRect();
    if (endBottom - wrapperBottom === 0) {
      //todo windows
      onScrollToBottom();
    }
  }, 0);
  handleClick(e) {
    const { left, top } = e.target.getBoundingClientRect();
    const x = e.clientX - left,
      y = e.clientY - top;
    this.stage.triggerEventToCeil("onClick", { x, y }, { x, y });
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
  handleMouseMove = _.debounce((e) => {
    const { left, top } = e.target.getBoundingClientRect();
    const x = e.clientX - left,
      y = e.clientY - top;
    const currentCeil = this.stage.getCurrentCeil({ x, y });
    if (!currentCeil) {
      return;
    }
    switch (currentCeil.layer.type) {
      case "header":
        this.wrapperRef.style.cursor = "auto";
        break;
      case "body":
        if (currentCeil.column.type === "image") {
          this.wrapperRef.style.cursor = "pointer";
        } else {
          this.wrapperRef.style.cursor = "text";
        }
        break;
      default:
        this.wrapperRef.style.cursor = "auto";
    }
  }, 10);
  handleMouseEnter = _.debounce((e) => {
    // this.wrapperRef.style.cursor = "text";
  }, 100);
  handleMouseOut = _.debounce((e) => {
    this.wrapperRef.style.cursor = "auto";
  }, 100);
  render() {
    const { inputLayerStyle, currentText, scrollEndPosition } = this.state;
    return (
      <div
        className="wrapper"
        ref={(el) => (this.wrapperRef = el)}
        onClick={this.handleClick.bind(this)}
        onBlur={this.handleBlur.bind(this)}
        onDoubleClick={this.handleDoubleClick.bind(this)}
        onContextMenu={this.handleContextMenu.bind(this)}
        onMouseMove={this.handleMouseMove.bind(this)}
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseOut={this.handleMouseOut.bind(this)}
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
              ref={(el) => (this.scrollEndRef = el)}
              style={scrollEndPosition}
            ></div>
            <div
              className="input-placeholder"
              ref={(el) => (this.inputLayerRef = el)}
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
