import _ from "lodash";
import { Component, createRef } from "react";
import { COLUMN_TYPE } from "../columns";
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
      columns: props.columns,
      options: props.options || {},
    });
    this.state = {
      inputLayerStyle: {},
      inputLayerVisibleState: false,
      currentText: "",
      scrollEndPosition: {
        top: 0,
        left: 0,
      },
      currentCeil: null,
    };
  }
  static getDerivedStateFromProps(props, state) {
    // console.log(props, state);
    return null;
  }
  componentDidMount() {
    const { options } = this.stage;
    const headerRow = new Layer({
      type: Stage.LayerType.HEADER,
      x: 0,
      y: 0,
      stage: this.stage,
      width: this._getTotalWidth(),
      height: options.rowHeight,
      color: options.header.backgroundColor,
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
        type: Stage.LayerType.BODY,
        width: this._getTotalWidth(),
        y: this.stage.getHeadersHeight(),
        color: options.body.backgroundColor,
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
        top: this.stage.children.length * options.rowHeight,
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
    switch (column.type) {
      case COLUMN_TYPE.IMAGE:
        document.body.querySelectorAll("img").forEach((img) => {
          img.remove();
        });
        document.body.appendChild(image);
        alert(`click on ${dataSource.name}'s avatar`);
        break;
      case COLUMN_TYPE.EDITABLE:
        this.updateInputLayer(ceil);
        this.setState({ currentCeil: ceil });
        break;
      case COLUMN_TYPE.FUNCTION_BOX:
        alert("Functions up comming...");
        break;
      default:
        break;
    }
    console.log("click on ceil: ", ceil);
  }
  handleCeilScroll(ceil = {}) {
    const { inputLayerVisibleState } = this.state;
    inputLayerVisibleState && this.updateInputLayer(ceil, false);
  }
  updateInputLayer(
    {
      actualWidth = 0,
      actualHeight = 0,
      visibleX = 0,
      visibleY = 0,
      text = "",
      color = "orange",
    },
    show = true,
  ) {
    this.setState({
      inputLayerStyle: {
        display: show ? "inline-block" : "none",
        width: actualWidth,
        height: actualHeight,
        top: visibleY,
        left: visibleX,
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
      case Stage.LayerType.HEADER:
        this.wrapperRef.style.cursor = "auto";
        break;
      case Stage.LayerType.BODY:
        if (currentCeil.column.type === COLUMN_TYPE.IMAGE) {
          this.wrapperRef.style.cursor = "pointer";
        } else if (currentCeil.column.type === COLUMN_TYPE.EDITABLE) {
          this.wrapperRef.style.cursor = "text";
        } else {
          this.wrapperRef.style.cursor = "auto";
        }
        break;
      default:
        this.wrapperRef.style.cursor = "auto";
    }
  }, 50);
  handleMouseEnter = _.debounce((e) => {
    // this.wrapperRef.style.cursor = "text";
  }, 100);
  handleMouseOut = _.debounce((e) => {
    this.wrapperRef.style.cursor = "auto";
  }, 100);
  handleUpdateCeilData(e) {
    const { currentCeil } = this.state;
    currentCeil.updateValue(this.inputLayerRef.textContent);
  }
  render() {
    const { inputLayerStyle, currentText, scrollEndPosition } = this.state;
    return (
      <>
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
                onBlur={this.handleUpdateCeilData.bind(this)}
                contentEditable={true}
                suppressContentEditableWarning={true}
              >
                {currentText}
              </div>
            </div>
          </div>
        </div>
        <br />
      </>
    );
  }
}
