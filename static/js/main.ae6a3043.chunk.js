(this["webpackJsonpcanvas-demo"]=this["webpackJsonpcanvas-demo"]||[]).push([[0],{1522:function(t,e,i){"use strict";i.r(e);var n=i(3),o=i.n(n),a=i(23),h=i.n(a),r=(i(29),i(30),i(1)),s=i(2),c=i(7),l=i(6),d=i(24),u=i.n(d),v=i(9),g=i(5),f=function(){function t(e){var i=e.name,n=void 0===i?"":i,o=e.text,a=void 0===o?"":o,h=e.x,s=void 0===h?0:h,c=e.y,l=void 0===c?0:c,d=e.width,u=void 0===d?100:d,v=e.height,g=void 0===v?45:v,f=e.color,y=void 0===f?"yellow":f,p=e.fixed,x=void 0===p?"":p,m=e.columns,w=void 0===m?[]:m,k=e.column,b=void 0===k?{}:k,S=e.dataSource,j=void 0===S?{}:S,C=e.stage,T=void 0===C?{}:C,O=e.layer,E=void 0===O?null:O,L=e.onFocus,R=void 0===L?function(){}:L,M=e.onScroll,B=void 0===M?function(){}:M;Object(r.a)(this,t),this.name=n,this.text=a,this.x=s,this.y=l,this.originX=s,this.originY=l,this.width=u,this.height=g,this.ctx=T.ctx,this.color=y,this.fixed=x,this.columns=w,this.column=b,this.dataSource=j,this.onFocus=R,this.onScroll=B,this.stage=T,this.layer=E||this,this.listeners=new Map,this.displayText=this.ellipsisText(),this.image=null}return Object(s.a)(t,[{key:"ellipsisText",value:function(){var t=this.text,e=this.ctx.measureText(t).width,i=this.ctx.measureText("...").width,n=this.width-25;if(n<e){for(var o=t.length;e+i>n&&o>0;)t=t.substring(0,o),e=this.ctx.measureText(t).width,o-=1;return t+"..."}return t}},{key:"drawText",value:function(){this.ctx.fillStyle="#000",this.ctx.font="16px sans-serif",this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillText(this.displayText,this.x+this.width/2,this.y+this.height/2,this.width)}},{key:"drawImage",value:function(){var t=this;if(this.stage.height+this.stage.height/2>=this.y&&this.y>=0){if(this.image)return void this._drawImage(this.image);var e=new Image;e.src=this.text,e.onload=function(){t.image=e,t._drawImage(t.image)}}}},{key:"_drawImage",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:35;this.ctx.drawImage(t,this.x+(this.width-e)/2,this.y+(this.height-e)/2,e,e)}},{key:"commonTrigger",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},i=null;this.children.forEach((function(t){t.isCurrentElement(t,e)&&(i=t)})),i&&i.trigger(t,e)}},{key:"update",value:function(t){var e=t.x,i=void 0===e?this.x:e,n=t.y,o=void 0===n?this.y:n,a=t.width,h=void 0===a?this.width:a,r=t.height,s=void 0===r?this.height:r,c=t.color,l=void 0===c?this.color:c;this.x=i,this.y=o,this.width=h,this.height=s,this.color=l,this.parent&&this.parent.draw()}},{key:"updatePosition",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;switch(this.fixed){case"top":this.x=this.originX-t,this.y=this.originY;break;case"left":this.x=this.originX,this.y=this.originY-e;break;case"top,left":this.x=this.originX,this.y=this.originY;break;default:this.x=this.originX-t,this.y=this.originY-e}this.onScroll(this)}},{key:"setParent",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.parent=t}},{key:"isCurrentElement",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{x:0,y:0,height:0,width:0},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{x:0,y:0},i=e.x>t.x&&e.x<t.x+t.width,n=e.y>t.y&&e.y<t.y+t.height;return i&&n}},{key:"on",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};e.split(",").forEach((function(e){t.listeners.set(e.trim(),i)}))}},{key:"off",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.listeners.delete(t)}},{key:"trigger",value:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length,i=new Array(e>1?e-1:0),n=1;n<e;n++)i[n-1]=arguments[n];(this.listeners.get(t)||function(){return!1}).apply(void 0,[t].concat(i))}}]),t}(),y=function(t){Object(c.a)(i,t);var e=Object(l.a)(i);function i(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return Object(r.a)(this,i),e.call(this,t)}return Object(s.a)(i,[{key:"setEvent",value:function(){var t=this;this.on("click",(function(){console.log("click on ceil",t),t.onFocus(t)})),this.on("move",(function(){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{x:0,y:0};console.log("move...",e),t.update(e)})),this.on("hover",(function(){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{x:0,y:0};console.log("hover...",t)}))}},{key:"drawBorder",value:function(){this.ctx.strokeStyle="white",this.ctx.lineWidth=.5,this.ctx.strokeRect(this.x,this.y,this.width,this.height)}},{key:"drawBackground",value:function(){this.ctx.fillStyle=this.color,this.ctx.fillRect(this.x,this.y,this.width,this.height)}},{key:"draw",value:function(){this.drawBackground(),this.drawBorder(),"image"===this.column.type&&"body"===this.parent.name?Object(v.a)(Object(g.a)(i.prototype),"drawImage",this).call(this):Object(v.a)(Object(g.a)(i.prototype),"drawText",this).call(this),this.setEvent()}}]),i}(f),p=function(t){Object(c.a)(i,t);var e=Object(l.a)(i);function i(){var t,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return Object(r.a)(this,i),(t=e.call(this,n)).children=[],t}return Object(s.a)(i,[{key:"add",value:function(){for(var t=this,e=arguments.length,i=new Array(e),n=0;n<e;n++)i[n]=arguments[n];return this.children=this.children.concat(i).reverse(),this.children.forEach((function(e){e.setParent(t)})),this.draw(),this}},{key:"setEvent",value:function(){this.on("click,move",this.commonTrigger.bind(this)),this.on("hover",this.commonTrigger.bind(this))}},{key:"draw",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;this.ctx.fillStyle=this.color,this.ctx.fillRect(this.x,this.y,this.width,this.height),this.children.forEach((function(i){i.updatePosition(t,e),i.draw(t,e)})),this.setEvent()}}]),i}(f),x=function(){function t(e){var i=e.width,n=void 0===i?250:i,o=e.height,a=void 0===o?250:o;Object(r.a)(this,t);var h=window.devicePixelRatio||1;this.width=n*h,this.height=a*h,this.canvas=document.createElement("canvas"),this.canvas.width=this.width,this.canvas.height=this.height,this.canvas.style.width=n+"px",this.canvas.style.height=a+"px",this.ctx=this.canvas.getContext("2d"),this.children=[],this.ctx.scale(h,h)}return Object(s.a)(t,[{key:"addLayer",value:function(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return this.children=this.children.concat(e).reverse(),this.render(),this}},{key:"render",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;this.getViewportChildren().forEach((function(n){!n.parent&&n.setParent(t),n.updatePosition(e,i),n.draw(e,i)}))}},{key:"getViewportChildren",value:function(){var t=this,e=this.children.filter((function(t){return"body"===t.name})),i=this.children.filter((function(t){return"header"===t.name})),n=e.findIndex((function(e){return e.y>=0&&e.y<=t.height})),o=e.slice(n,Math.min(100,e.length-n)+n);return e.slice(Math.max(0,n-100),n).concat(o).concat(i)}},{key:"insertCanvas",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:HTMLElement;t.querySelector("canvas")||t.appendChild(this.canvas)}}]),t}(),m=i(0),w=function(t){Object(c.a)(i,t);var e=Object(l.a)(i);function i(t){var o;return Object(r.a)(this,i),(o=e.call(this,t)).handleScroll=u.a.throttle((function(t){var e=t.target,i=e.scrollTop,n=e.scrollLeft,a=o.props,h=a.onScrollToTop,r=void 0===h?function(){}:h,s=a.onScrollToBottom,c=void 0===s?function(){}:s;o.stage.render(n,i),0===i&&r(),o.scrollEndRef.getBoundingClientRect().bottom-t.target.getBoundingClientRect().bottom===0&&c()}),10),o.wrapperRef=Object(n.createRef)(),o.inputLayerRef=Object(n.createRef)(),o.scrollEndRef=Object(n.createRef)(),o.columns=t.columns,o.dataSource=t.dataSource,o.width=650,o.height=450,o.stage=new x({width:o.width,height:o.height}),o.state={inputLayerStyle:{},inputLayerVisibleState:!1,currentText:""},o}return Object(s.a)(i,[{key:"componentDidMount",value:function(){var t,e=new p({name:"header",x:0,y:0,stage:this.stage,width:this._getTotalWidth(),height:45,color:"white",fixed:"top",columns:this.columns,dataSource:{}}),i=[];this.stage.insertCanvas(this.wrapperRef),this._createCeil({layer:e,color:"orange"});for(var n=0;n<this.dataSource.length;n++){var o=new p({name:"body",x:0,y:45+46*n,stage:this.stage,width:this._getTotalWidth(),height:45,color:"white",columns:this.columns,dataSource:this.dataSource[n]});this._createCeil({y:o.y,layer:o,row:n}),i.push(o)}(t=this.stage).addLayer.apply(t,[e].concat(i))}},{key:"_getTotalWidth",value:function(){var t=0;return this.columns.forEach((function(e){t+=e.width})),t}},{key:"_getTotalHeight",value:function(){return 45*this.dataSource.length}},{key:"_createCeil",value:function(t){for(var e=this,i=t.y,n=void 0===i?0:i,o=t.layer,a=void 0===o?null:o,h=t.color,r=void 0===h?"green":h,s=t.row,c=void 0===s?0:s,l=this,d=[],u="",v=a.columns,g=a.dataSource,f=function(t){var i=d.reduce((function(t,e,i){return t+=e.width}),0);u="body"===a.name&&v[t].fixed?"left":"header"===a.name&&v[t].fixed?"top,left":a.fixed,d.push(new y({name:"\u5217".concat(t,"-\u884c").concat(c),text:g[v[t].key]||v[t].title,x:i,y:n,width:v[t].width,height:45,stage:e.stage,layer:a,color:r,fixed:u,column:v[t],columns:v,dataSource:g,onFocus:function(e){var i=e.dataSource,n=void 0===i?{}:i,o=e.image;"image"===v[t].type?(document.body.querySelectorAll("img").forEach((function(t){t.remove()})),document.body.appendChild(o),alert("click on ".concat(n.name,"'s avatar"))):l.updateInputLayer.call(l,this)},onScroll:function(){l.state.inputLayerVisibleState&&l.updateInputLayer.call(l,this,!1)}}))},p=0;p<v.length;p++)f(p);a.add.apply(a,d)}},{key:"updateInputLayer",value:function(t){var e=this,i=t.width,n=void 0===i?0:i,o=t.height,a=void 0===o?0:o,h=t.x,r=void 0===h?0:h,s=t.y,c=void 0===s?0:s,l=t.text,d=void 0===l?"":l,u=t.color,v=void 0===u?"orange":u,g=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.setState({inputLayerStyle:{display:g?"inline-block":"none",width:n,height:a,top:c,left:r,zIndex:1,background:v},currentText:d,inputLayerVisibleState:g}),g&&setTimeout((function(){e.inputLayerRef.focus()}))}},{key:"commonTrigger",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",e=arguments.length>1?arguments[1]:void 0,i=e.target.getBoundingClientRect(),n=i.left,o=i.top,a=e.clientX-n,h=e.clientY-o,r=null;this.stage.children.forEach((function(t){t.isCurrentElement(t,{x:a,y:h})&&(r=t)})),r&&r.trigger(t,{x:a,y:h})}},{key:"handleClick",value:function(t){this.commonTrigger("click",t)}},{key:"handleDoubleClick",value:function(){console.log("handleDoubleClick")}},{key:"handleContextMenu",value:function(t){console.log("handleContextMenu"),t.preventDefault(),t.stopPropagation()}},{key:"handleBlur",value:function(){this.updateInputLayer({},!1)}},{key:"handleMouseMove",value:function(t){}},{key:"calculateScrollEndPosition",value:function(){return{top:this._getTotalHeight()+40+this.dataSource.length,left:this._getTotalWidth()-this.width/2+5}}},{key:"render",value:function(){var t=this,e=this.state,i=e.inputLayerStyle,n=e.currentText;return Object(m.jsx)("div",{className:"wrapper",ref:function(e){return t.wrapperRef=e},onClick:this.handleClick.bind(this),onBlur:this.handleBlur.bind(this),onDoubleClick:this.handleDoubleClick.bind(this),onContextMenu:this.handleContextMenu.bind(this),onMouseMove:this.handleMouseMove.bind(this),children:Object(m.jsx)("div",{className:"wrapper-scroll",children:Object(m.jsxs)("div",{className:"wrapper-scroll-inner",style:{width:this.width+10,height:this.height+10},onScroll:this.handleScroll.bind(this),children:[Object(m.jsx)("div",{className:"wrapper-scroll-end",ref:function(e){return t.scrollEndRef=e},style:this.calculateScrollEndPosition()}),Object(m.jsx)("div",{className:"input-placeholder",ref:function(e){return t.inputLayerRef=e},style:i,onClick:function(t){t.preventDefault(),t.stopPropagation()},contentEditable:!0,suppressContentEditableWarning:!0,children:n})]})})})}}],[{key:"getDerivedStateFromProps",value:function(t,e){return console.log(t,e),null}}]),i}(n.Component),k=i(4),b=i.n(k),S=[{title:"No.",width:100,key:"id",fixed:!0},{title:"Avatar",width:100,type:"image",key:"avatar",fixed:!0},{title:"Name",width:120,key:"name",fixed:!0},{title:"Age",width:100,key:"age"},{title:"Province",width:100,key:"province"},{title:"City",width:120,key:"city"},{title:"Address",width:200,key:"address"},{title:"ZipCode",width:100,key:"zipcode"},{title:"Description",width:250,key:"description"},{title:"Action",width:100,key:"action"}],j=function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e3,i=0;i<e;i++)t.push({id:""+i,avatar:b.a.image.avatar(),province:b.a.address.state(),city:b.a.address.city(),name:b.a.name.findName(),zipcode:b.a.address.zipCode(),age:b.a.datatype.number(100),description:b.a.lorem.sentence(),address:b.a.address.streetAddress()});return t}([]);var C=function(){return Object(m.jsx)(w,{columns:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=t.filter((function(t){return t.fixed}));return e.concat(t.filter((function(t){return!t.fixed})))}(S),dataSource:j,onScrollToTop:function(){console.log("to the top")},onScrollToBottom:function(){console.log("to the bottom")}})},T=function(t){t&&t instanceof Function&&i.e(3).then(i.bind(null,1523)).then((function(e){var i=e.getCLS,n=e.getFID,o=e.getFCP,a=e.getLCP,h=e.getTTFB;i(t),n(t),o(t),a(t),h(t)}))};h.a.render(Object(m.jsx)(o.a.StrictMode,{children:Object(m.jsx)(C,{})}),document.getElementById("root")),T()},29:function(t,e,i){},30:function(t,e,i){}},[[1522,1,2]]]);
//# sourceMappingURL=main.ae6a3043.chunk.js.map