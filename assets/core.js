(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{31:function(e,t,n){e.exports=n(68)},67:function(e,t,n){},68:function(e,t,n){"use strict";n.r(t);var a=n(24),r=n(10),o=function(){function e(){this.id=Math.random(),this.state={},this.listeners=[],Object(r.d)(this,{state:r.e,setState:r.a,getState:r.c})}var t=e.prototype;return t.setState=function(e,t){void 0===t&&(t=!0),this.state=t?Object.assign({},this.state,e):e},t.addListener=function(e){return this.listeners=this.listeners.concat(Object(r.b)(e)),this.listeners.length-1},t.removeListener=function(e){e<this.listeners.length&&this.listeners[e]&&(this.listeners[e](),this.listeners[e]=null)},t.resetListeners=function(){this.listeners=[]},Object(a.a)(e,[{key:"getState",get:function(){return this.state}}]),e}();window.DIState=new o;var i,c=n(1),s=n(9),l=n(19),u=n.n(l),d=n(25),b=n(0),p=n.n(b),f=n(2),m=n.n(f),g=n(3),h=n(15),v=h.a.div(i||(i=Object(g.a)(["\n  color: red;\n  font-size: 11px;\n  position: relative;\n  padding: 5px 5px 5px 0px;\n  display: block;\n"]))),w=function(e){var t=Object(b.useState)(""),n=t[0],a=t[1],r=function(t){t?"maxSelectedOptions"===t.type&&a(e.selectErrorMessage):a("")};return p.a.createElement("div",null,p.a.Children.map(e.children,(function(e){return p.a.isValidElement(e)?p.a.cloneElement(e,{onError:r}):e})),n?p.a.createElement(v,{className:"data-selector--wrapper"},n):null)};w.propTypes={selectErrorMessage:m.a.string,children:m.a.node};var O=w,j=n(26),y=n(27),x=n(30),S={control:function(e){return Object.assign({},e,{borderColor:"#ddd",borderRadius:"none",boxShadow:"none",":hover":{borderColor:"#8f1b13"},":active":{borderColor:"#8f1b13"}})},menu:function(e){return Object.assign({},e,{color:"#443e42",backgroundColor:"#FFFFFF"})},option:function(e,t){return Object.assign({},e,{fontSize:"14px",":hover":{backgroundColor:"#f0826d"},backgroundColor:t.isSelected?"#8f1b13":"transparent"})},singleValue:function(e){return Object.assign({},e,{fontSize:"14px"})},multiValue:function(e){return Object.assign({},e,{fontSize:"14px"})},multiValueLabel:function(e,t){return t.data.isCloseable?e:Object.assign({},e,{paddingRight:6})},multiValueRemove:function(e,t){return t.data.isCloseable?e:Object.assign({},e,{display:"none"})},input:function(e){return Object.assign({},e,{fontSize:"14px"})},indicatorsContainer:function(e){return Object.assign({},e,{pointerEvents:"none"})}},C=function(e){var t=e.label,n=e.onError,a=e.maxSelectedOptions,r=e.defaultValue,o=e.singleSelectOptions,i=Object(y.a)(e,["label","onError","maxSelectedOptions","defaultValue","singleSelectOptions"]),s=Object(b.useState)(r),l=s[0],u=s[1];Object(b.useEffect)((function(){i.onChange&&i.onChange(l),n&&n()}),[l]);return Object(c.b)("div",{className:"labelled-data-selector--wrapper"},Object(c.b)("label",null,Object(c.b)("b",null,t)),Object(c.b)(x.a,Object(j.a)({},i,{value:l,onChange:function(e){if(i.isMulti)if(e.length){var t=e.findIndex((function(e){return o.find((function(t){return t.value===e.value}))}));i.isMulti&&e.length>1&&-1!==t?u(0===t?e.slice(1):[e[t]]):a&&e.length>a?n&&n({type:"maxSelectedOptions",message:"Only up to "+a+" selections allowed"}):u(e)}else u(r);else u(e)},css:{marginRight:"25px"},styles:S,isClearable:"undefined"!==i.isClearable?i.isClearable:l.length>1})))};C.propTypes={label:m.a.string,options:m.a.array,maxSelectedOptions:m.a.number,onChange:m.a.func,onError:m.a.func,defaultValue:m.a.array,singleSelectOptions:m.a.array,isMulti:m.a.bool,isClearable:m.a.bool},C.defaultProps={maxSelectedOptions:2,singleSelectOptions:[]};var E=C,I=n(28);function L(e,t){var n;if("undefined"==typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(n=function(e,t){if(!e)return;if("string"==typeof e)return N(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return N(e,t)}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var a=0;return function(){return a>=e.length?{done:!0}:{done:!1,value:e[a++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(n=e[Symbol.iterator]()).next.bind(n)}function N(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}var k=function(e,t){void 0===t&&(t="");var n=Number(e);return Number.isNaN(n)?t:new Intl.NumberFormat("en-GB",{maximumFractionDigits:2}).format(n)},D=function(e){for(var t,n=e[1]-e[0]+1,a=[],r=L(Array(n).keys());!(t=r()).done;){var o=t.value;a.push(o)}return a.map((function(t){return e[0]+t}))},A=function(e){return e.endsWith("csv")?function(e){return new Promise((function(t){Object(I.parse)(e,{download:!0,header:!0,skipEmptyLines:!0,complete:function(e){var n=e.data;return t(n)}})}))}(e):window.fetch(e).then((function(e){return e.json()}))},R=function(e){var t=Object(b.useState)([]),n=t[0],a=t[1];Object(b.useEffect)((function(){e.configs&&Promise.all(e.configs.map(function(){var e=Object(d.a)(u.a.mark((function e(t){var n,a;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if((n={label:t.label,defaultValue:t.defaultValue,stateProperty:t.stateProperty}).options=t.defaultValue?[t.defaultValue]:[],a=t.data||[],!t.url){e.next=7;break}return e.next=6,A(t.url);case 6:a=e.sent;case 7:return n.options=n.options.concat(a.reduce((function(e,n){return e.find((function(e){return e[t.valueProperty]===n[t.valueProperty]}))||e.push({value:n[t.valueProperty],label:n[t.labelProperty]}),e}),[])),e.abrupt("return",n);case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())).then(a).catch((function(e){return window.console.log(e)}))}),[e.configs]);return Object(c.b)(O,{selectErrorMessage:""},n.map((function(e){var t=e.label,n=e.options,a=e.defaultValue,r=e.stateProperty;return Object(c.b)(E,{key:t,label:t,options:n,classNamePrefix:"subcounty-filter sticky-top",isClearable:!1,defaultValue:[Object.assign({},a,{isCloseable:!0})],onChange:function(e){var t;window.DIState.setState(((t={})[r]=e.value,t))},css:{minWidth:"200px"}})})))};R.propTypes={configs:m.a.arrayOf(m.a.shape({url:m.a.string,label:m.a.string.isRequired,defaultValue:m.a.shape({value:m.a.string,label:m.a.string}),stateProperty:m.a.string.isRequired,labelProperty:m.a.string.isRequired,valueProperty:m.a.string.isRequired}))};var T=R,_=function(e){window.DICharts.handler.addChart({className:e,d3:{onAdd:function(e){Array.prototype.forEach.call(e,(function(e){var t=new window.DICharts.Chart(e.parentElement);t.showLoading(),e.closest(".section").classList.add("sticky");var n=function(e){var t,n=document.createElement("div");return(t=n.classList).add.apply(t,["spotlight-banner","data-selector--wrapper"]),e.parentElement.insertBefore(n,e),n}(e),a=Object(s.createRoot)(n);window.DIState?window.DIState.addListener((function(){t.showLoading();var e=window.DIState.getState.selectors;e?(Array.isArray(e)||window.console.log("Invalid value for selectors - an Array is expected. Please review the documentation!"),a.render(Object(c.b)(T,{configs:e}))):window.console.log("Waiting on state update ...")})):window.console.log("State is not defined"),t.hideLoading(),e.parentElement.classList.add("auto-height")}))}}})},P=n(14),q=n.n(P);var z={rainbow:["#e84439","#eb642b","#f49b21","#109e68","#0089cc","#893f90","#c2135b","#f8c1b2","#f6bb9d","#fccc8e","#92cba9","#88bae5","#c189bb","#e4819b"],default:["#6c120a","#a21e25","#cd2b2a","#dc372d","#ec6250","#f6b0a0","#fbd7cb","#fce3dc"],sunflower:["#7d4712","#ba6b15","#df8000","#f7a838","#fac47e","#fedcab","#fee7c1","#feedd4"],marigold:["#7a2e05","#ac4622","#cb5730","#ee7644","#f4a57c","#facbad","#fcdbbf","#fde5d4"],rose:["#65093d","#8d0e56","#9f1459","#d12568","#e05c86","#f3a5b6","#f6b8c1","#f9cdd0"],lavendar:["#42184c","#632572","#732c85","#994d98","#af73ae","#cb98c4","#deb5d6","#ebcfe5"],bluebell:["#0c457b","#0071b1","#0089cc","#5da3d9","#77adde","#88bae5","#bcd4f0","#d3e0f4"],leaf:["#08492f","#005b3e","#00694a","#3b8c62","#74bf93","#a2d1b0","#b1d8bb","#c5e1cb"],orange:["#973915","#d85b31","#eb642b","#f18e5e","#f4a57c","#f6bb9d"]},F={legend:{top:10,textStyle:{fontFamily:"Geomanist Regular,sans-serif"}},tooltip:{trigger:"axis",textStyle:{fontFamily:"Geomanist Regular,sans-serif"},axisPointer:{type:"none"}},toolbox:{showTitle:!1,feature:{saveAsImage:{show:!0,title:"Save as image",pixelRatio:2}},right:20,tooltip:{show:!0,textStyle:{fontFamily:"Geomanist Regular,sans-serif",formatter:function(e){return"<div>"+e.title+"</div>"}}}},color:z.rainbow,xAxis:{axisLabel:{fontFamily:"Geomanist Regular,sans-serif",fontSize:13},splitLine:{show:!1}},yAxis:{axisLabel:{fontFamily:"Geomanist Regular,sans-serif",fontSize:13},splitLine:{show:!1}},axisPointer:{type:"none"},grid:{top:10}},V=(n(6),function(){return p.a.createElement("div",{className:"no-data"},"No Data")}),U=function(e,t,n){var a=e.slice();return t.forEach((function(t,r){void 0===a[r]?a[r]=n.cloneUnlessOtherwiseSpecified(t,n):n.isMergeableObject(t)?a[r]=q()(e[r],t,n):-1===e.indexOf(t)&&a.push(t)})),a},M=function(e,t,n,a,r){var o=e.series,i=e.mapping,c=o.map((function(s,l){return{name:s,type:(u=e.type,u?"area"===u?"line":u:"bar"),stack:!e.type||["area","bar","column"].includes(e.type)?"School Type":void 0,areaStyle:"area"===e.type?{}:void 0,smooth:!0,emphasis:{focus:"series"},label:{show:l===o.length-1,position:"top",formatter:function(e){var t=0;return c.forEach((function(n){t+=n.data[e.dataIndex]})),k(t)}},data:a.map((function(a){var o=[];if(t.filter((function(e){return!n&&!r||"all"===n&&"all"===r||(!n||r&&"all"!==r?!r||n&&"all"!==n?e[i.subCounty].toLowerCase()===n.toLowerCase()&&e[i.level].toLowerCase()===r.toLowerCase():e[i.level].toLowerCase()===r.toLowerCase():e[i.subCounty].toLowerCase()===n.toLowerCase())})).forEach((function(e){e[i.year]===a&&e[i.series].toLowerCase()===s.toLowerCase()&&o.push(Number(e[i.value]))})),!e.aggregator||"sum"===e.aggregator)return o.reduce((function(e,t){return e+t}),0);if("avg"===e.aggregator){var c=o.reduce((function(e,t){return e+t}),0);return k(c/o.length)}throw new Error("Invalid aggregator: ",e.aggregator)}))};var u}));return c},G=function(e){(function(e){return e.className?e.series&&Array.isArray(e.series)?e.mapping?e.mapping.series?e.mapping.year?e.mapping.value?e.mapping.subCounty?!!e.mapping.level||(window.console.error("Invalid chart config: mapping[mapping.level] is required!"),!1):(window.console.error("Invalid chart config: mapping.subCounty is required!"),!1):(window.console.error("Invalid chart config: mapping.value is required!"),!1):(window.console.error("Invalid chart config: mapping.year is required!"),!1):(window.console.error("Invalid chart config: mapping.series is required!"),!1):(window.console.error("Invalid chart config: mapping is required!"),!1):(window.console.error(e.series?"Invalid chart config: Invalid series config - expected an array!":"Invalid chart config: Series is required!"),!1):(window.console.error("Invalid chart config: className is required!"),!1)})(e)&&window.DICharts.handler.addChart({className:e.className,echarts:{onAdd:function(t){Array.prototype.forEach.call(t,(function(t){t.classList.add("dicharts--dimensions","dicharts--padding-top");var n=new window.DICharts.Chart(t.parentElement),a=window.echarts.init(t);A(e.url).then((function(t){if(window.DIState){var r="all",o="all",i=e.filters&&e.filters.subCounties?t.filter((function(t){return e.filters.subCounties.includes(t[e.mapping.subCounty])})):t;window.DIState.addListener((function(){n.showLoading();var t=window.DIState.getState,c=t.subCounty,s=t.level;if(r!==c||o!==s){r=c||"all",o=s||"all";var l=function(e,t){return t?D(t).map((function(e){return""+e})):Array.from(new Set(e.map((function(e){return Number(e.year)})))).sort((function(e,t){return e-t})).map((function(e){return e.toString()}))}(i,e.yearRange),u=q()(F,{responsive:!1,legend:{selectedMode:!1},grid:{top:60,bottom:20},xAxis:{data:l},yAxis:{type:"value",name:"Number of schools",nameLocation:"middle",nameGap:50},toolbox:{showTitle:!1,feature:{saveAsImage:{show:!1}}},series:M(e,i,r,l,o)});u.color=["#a21e25","#fbd7cb"].concat(z.default),a.setOption(q()(u,e.options||{},{arrayMerge:U})),n.hideLoading()}}))}else window.console.log("State is not defined")})),function(e,t){window.addEventListener("onresize",(function(){e.resize({width:t.clientWidth+"px",height:t.clientHeight+"px"})}),!0)}(a,t)}))}}})},B=function(){if(window.DIState){var e=[];window.DIState.addListener((function(){var t=window.DIState.getState.charts;t&&e.length!==t.length&&(e=t.filter((function(e){return"education"===e.target}))).forEach(G)}))}else window.console.log("State is not defined")},W=function(e){return p.a.createElement("div",{className:"table-styled"},p.a.createElement("table",null,e.children))};W.propTypes={children:m.a.any};var J=W,H=function(e){var t=function(e,t){return void 0===t&&(t=!1),e.map((function(e,n){return p.a.createElement("tr",{key:n},e.map((function(e,n){return t?p.a.createElement("th",{key:n},e):p.a.createElement("td",{key:n},e)})))}))};return p.a.createElement(J,null,p.a.createElement("thead",null,t(e.rows.filter((function(e,t){return 0===t})),!0)),p.a.createElement("tbody",null,t(e.rows.filter((function(e,t){return t>0})))))};H.propTypes={rows:m.a.arrayOf(m.a.array)};var X,$,K,Q,Y,Z,ee=H,te=function(e){(function(e){return e.className?e.mapping?e.mapping.rows?e.mapping.year?e.mapping.value?e.mapping.subCounty?!!e.mapping.level||(window.console.error("Invalid table config: mapping[mapping.level] is required!"),!1):(window.console.error("Invalid table config: mapping.subCounty is required!"),!1):(window.console.error("Invalid table config: mapping.value is required!"),!1):(window.console.error("Invalid table config: mapping.year is required!"),!1):(window.console.error("Invalid table config: mapping.series is required!"),!1):(window.console.error("Invalid table config: mapping is required!"),!1):(window.console.error("Invalid table config: className is required!"),!1)})(e)&&window.DICharts.handler.addChart({className:e.className,d3:{onAdd:function(t){A(e.url).then((function(n){Array.prototype.forEach.call(t,(function(t){var a=new window.DICharts.Chart(t.parentElement);a.showLoading();var r=Object(s.createRoot)(t),o="all",i="all";window.DIState.addListener((function(){a.showLoading();var c=window.DIState.getState,s=c.subCounty,l=c.level;if(s!==i||l!==o){i=s||"all",o=l||"all";var u=e.filters&&e.filters.subCounties?n.filter((function(t){return e.filters.subCounties.includes(t[e.mapping.subCounty])})):n,d=function(e,t,n,a){var r=e.rows,o=e.mapping,i=D(e.yearRange),c=["School Type"].concat(i),s=r.map((function(r){var c={};t.filter((function(e){return i.includes(Number(e[o.year]))&&e[o.rows]===r})).filter((function(e){return"all"===n||e[o.subCounty].toLowerCase()===n.toLowerCase()})).filter((function(e){return"all"===a||e[o.level].toLowerCase()===a.toLowerCase()})).forEach((function(e){var t=c[e[o.year]]||[];c[e[o.year]]=[].concat(t,[Number(e[o.value])])}));var s={};Object.keys(c).forEach((function(t){if(e.aggregator&&"sum"!==e.aggregator){if(e.aggregator&&"avg"===e.aggregator){var n=c[t].reduce((function(e,t){return e+t}),0);s[t]=n/c[t].length}}else s[t]=c[t].reduce((function(e,t){return e+t}),0)}));var l=i.map((function(e){return s[e]?s[e]:0}));return[r].concat(l)})),l=c.map((function(e,t){return 0===t?"Total":k(s.reduce((function(e,n){return"number"==typeof n[t]?e+n[t]:e}),0))})),u=s.map((function(e){return e.map((function(e){return"number"==typeof e?k(e):e}))}));return[c].concat(u,[l])}(e,u,i,o);r.render(Object(b.createElement)(ee,{rows:d})),a.hideLoading(),t.parentElement.classList.add("auto-height")}}))}))}))}}})},ne=function(){if(window.DIState){var e=[];window.DIState.addListener((function(){var t=window.DIState.getState.tables;t&&e.length!==t.length&&(e=t.filter((function(e){return"education"===e.target}))).forEach(te)}))}else window.console.log("State is not defined")},ae=(n(67),Object(b.createContext)()),re=n(29),oe=function(e){var t=e.close,n=e.description,a=e.source;return Object(c.b)("div",{className:"spotlight-modal",css:Object(c.a)($||($=Object(g.a)(["\n        font-size: 12px;\n      "])))},Object(c.b)("a",{className:"close",onClick:t,css:Object(c.a)(K||(K=Object(g.a)(["\n          cursor: pointer;\n          position: absolute;\n          display: block;\n          padding: 5px 10px;\n          line-height: 20px;\n          right: 0px;\n          top: 0px;\n          font-size: 20px;\n          background: transparent;\n          color: #333131;\n          font-weight: 900;\n        "])))},"×"),Object(c.b)("div",{className:"content",css:Object(c.a)(Q||(Q=Object(g.a)(["\n          width: 100%;\n          padding: 10px 5px 10px 5px;\n        "])))},Object(c.b)("p",{className:"description",css:Object(c.a)(Y||(Y=Object(g.a)(["\n            font-size: 14px;\n          "])))},n),a?Object(c.b)(p.a.Fragment,null,Object(c.b)("br",null),Object(c.b)("p",{className:"source",css:Object(c.a)(Z||(Z=Object(g.a)(["\n                text-align: left;\n              "])))},a?Object(c.b)(p.a.Fragment,null,Object(c.b)("b",{css:Object(c.a)(X||(X=Object(g.a)(["\n              font-family: Geomanist Bold, sans-serif;\n            "])))},"Source:"," "),a):null)," "):null))};oe.propTypes={description:m.a.oneOfType([m.a.string,m.a.element]),source:m.a.string,close:m.a.func.isRequired};var ie,ce,se=oe,le=function(e){return Object(c.b)(re.a,{trigger:Object(c.b)("span",{className:"spotlight__stat-icon",css:Object(c.a)(ie||(ie=Object(g.a)(["\n            display: inline-flex;\n            margin-left: 2px;\n            cursor: pointer;\n            padding: 8px;\n          "])))},Object(c.b)("i",{onClick:function(){document.querySelectorAll(".popup-content ").forEach((function(e){e.setAttribute("style","display:none;")}))},role:"presentation","aria-hidden":"true",className:"ico ico--12 ico-info-slate",css:Object(c.a)(ce||(ce=Object(g.a)(["\n              top: -1px;\n            "])))})),offsetX:20,arrowStyle:{height:"10px",width:"10px",position:"absolute",background:"rgb(255, 255, 255)",transform:"rotate(225deg)",margin:"-5px",zIndex:-1,boxShadow:"rgb(0 0 0 / 20%) 1px 1px 1px",bottom:"0%",left:"82px"},position:"bottom center",closeOnDocumentClick:!0,contentStyle:{zIndex:200,width:"350px",background:"#fff",fontWeight:400,fontStyle:"normal",fontSize:"12px",color:"#60575d",border:0,borderRadius:"0.28571429rem",boxShadow:"0 2px 4px 0 rgba(34, 36, 38, 0.12), 0 2px 10px 0 rgba(34, 36, 38, 0.15)",padding:"5px"}},(function(t){return Object(c.b)(se,{close:t,description:e.description,source:e.source})}))};le.propTypes={description:m.a.oneOfType([m.a.string,m.a.element]),source:m.a.string};var ue=le,de=function(e){var t=e.meta,n=void 0===t?{}:t,a=e.heading,r=e.children;return p.a.createElement("div",{className:"spotlight__stat"},p.a.createElement("h3",{className:"spotlight__stat-heading"},a,n.description||n.source?p.a.createElement(ue,{description:n.description,source:n.source}):null),r)};de.defaultProps={meta:{}},de.propTypes={heading:m.a.string,meta:m.a.shape({description:m.a.oneOfType([m.a.string,m.a.element]),source:m.a.string}),children:m.a.any};var be,pe=de,fe=function(e){var t=e.value,n=e.note;return Object(c.b)("p",{className:"spotlight__stat-data"},t,n&&n.content?Object(c.b)("span",{className:"spotlight__stat-data__note",css:Object(c.a)(be||(be=Object(g.a)(["\n          transform: none;\n          position: relative;\n          top: -10px;\n        "])))},n.content," ",n.meta?Object(c.b)(ue,{description:n.meta.description,source:n.meta.source}):null):null)};fe.propTypes={note:m.a.object,value:m.a.string};var me,ge=fe,he=function(e){var t=e.children;return Object(c.b)("article",{className:"tabs__content",css:Object(c.a)(me||(me=Object(g.a)(["\n      z-index: 200;\n    "])))},t)};he.propTypes={children:m.a.any};var ve=he,we=function(e){var t=e.id,n=e.active,a=e.label,r=e.children,o=e.onActivate;return p.a.createElement("section",{className:"tabs__container",id:t},p.a.createElement("input",{className:"tabs__input",type:"radio",name:"sections",id:t+"-option",defaultChecked:n}),p.a.createElement("label",{className:"tabs__label",htmlFor:t+"-option",onClick:o},a),b.Children.map(r,(function(e){return Object(b.isValidElement)(e)&&e.type===ve?e:null})))};we.propTypes={id:m.a.string.isRequired,label:m.a.string.isRequired,active:m.a.bool,onActivate:m.a.func,children:m.a.any};var Oe=we,je=function(e){var t=e.children,n=e.onClick;return p.a.createElement("div",{className:"tabs__content__header",onClick:n},t)};je.propTypes={children:m.a.any,onClick:m.a.func};var ye,xe,Se,Ce,Ee,Ie=je,Le=function(e,t){return t&&e?e.find((function(e){return e.id===t})):null},Ne=function(e){var t=Object(b.useContext)(ae),n=t.data,a=t.location,r=t.options,o="education",i=Le(r.tabs,o);if(void 0!==i.show&&!i.show)return null;var s=n&&n.education?n.education.find((function(e){return"Number of Schools"===e.caption})):null;return Object(c.b)(Oe,{id:o,label:i.label||"Education",active:!!e.active||i.active},Object(c.b)(ve,null,Object(c.b)(Ie,null,s?Object(c.b)("div",{css:Object(c.a)(ye||(ye=Object(g.a)(["\n                display: flex;\n              "])))},Object(c.b)("div",{css:Object(c.a)(xe||(xe=Object(g.a)(["\n                  margin-right: 1rem;\n                "])))},Object(c.b)("span",{css:Object(c.a)(Se||(Se=Object(g.a)(["\n                    font-size: 2.5rem;\n                  "])))},"Number of Schools in ",a.name," is"," "),Object(c.b)("b",{css:Object(c.a)(Ce||(Ce=Object(g.a)(["\n                    font-size: 3rem;\n                  "])))},k(s.value)),Object(c.b)(ue,{description:"Last updated: "+s.lastUpdated})),i.dashboardURL?Object(c.b)("a",{href:i.dashboardURL,className:"button button--secondary--fill"},i.dashboardButtonCaption||"View Full Dashboard"):null):null),Object(c.b)("div",{className:"l-2up"},n&&n.education?n.education.filter((function(e){return"Number of Schools"!==e.caption})).map((function(e){return Object(c.b)("div",{className:"l-2up__col",key:e.caption},Object(c.b)(pe,{heading:e.caption,meta:{description:Object(c.b)("span",{css:Object(c.a)(Ee||(Ee=Object(g.a)(["\n                              display: flex;\n                              justify-content: center;\n                            "])))},"Last updated: "+e.lastUpdated)}},Object(c.b)(ge,{value:e.value})))})):null)))};Ne.propTypes={active:m.a.bool};var ke,De,Ae,Re,Te,_e=Ne,Pe=function(e){var t=Object(b.useContext)(ae),n=t.data,a=t.location,r=t.options,o="overview",i=Le(r.tabs,o);return void 0===i.show||i.show?Object(c.b)(Oe,{id:o,label:i.label||"Overview",active:!!e.active||i.active},Object(c.b)(ve,null,Object(c.b)(Ie,null,n&&n.population?Object(c.b)("div",{css:Object(c.a)(ke||(ke=Object(g.a)(["\n                display: flex;\n              "])))},Object(c.b)("div",{css:Object(c.a)(De||(De=Object(g.a)(["\n                  margin-right: 1rem;\n                "])))},Object(c.b)("span",{css:Object(c.a)(Ae||(Ae=Object(g.a)(["\n                    font-size: 2.5rem;\n                  "])))},"Total Population in ",a.name," is"," "),Object(c.b)("b",{css:Object(c.a)(Re||(Re=Object(g.a)(["\n                    font-size: 3rem;\n                  "])))},k(n.population.value)),Object(c.b)(ue,{description:"Last updated: "+n.population.lastUpdated})),i.dashboardURL?Object(c.b)("a",{href:i.dashboardURL,className:"button button--secondary--fill"},i.dashboardButtonCaption||"View Full Dashboard"):null):null),Object(c.b)("div",{className:"l-2up"},n&&n.administration?n.administration.map((function(e){return Object(c.b)("div",{className:"l-2up__col",key:e.caption},Object(c.b)(pe,{heading:e.caption,meta:{description:Object(c.b)("span",{css:Object(c.a)(Te||(Te=Object(g.a)(["\n                            display: flex;\n                            justify-content: center;\n                          "])))},"Last updated: "+e.lastUpdated)}},Object(c.b)(ge,{value:e.value})))})):null))):null};Pe.propTypes={active:m.a.bool};var qe,ze,Fe,Ve,Ue,Me,Ge=Pe,Be=function(e){var t=Object(b.useContext)(ae),n=t.data,a=t.location,r=t.options,o="production",i=Le(r.tabs,o);if(void 0!==i.show&&!i.show)return null;var s=n&&n.production?n.production.find((function(e){return""===e.caption})):null,l=function(){return i.dashboardURL?Object(c.b)("a",{href:i.dashboardURL,className:"button button--secondary--fill"},i.dashboardButtonCaption||"View Full Dashboard"):null};return Object(c.b)(Oe,{id:o,label:i.label||"Production",active:!!e.active||i.active},Object(c.b)(ve,null,s?Object(c.b)(Ie,null,Object(c.b)("div",{css:Object(c.a)(qe||(qe=Object(g.a)(["\n                display: flex;\n              "])))},Object(c.b)("div",{css:Object(c.a)(ze||(ze=Object(g.a)(["\n                  margin-right: 1rem;\n                "])))},Object(c.b)("span",{css:Object(c.a)(Fe||(Fe=Object(g.a)(["\n                    font-size: 2.5rem;\n                  "])))},"Number of Schools in ",a.name," is"," "),Object(c.b)("b",{css:Object(c.a)(Ve||(Ve=Object(g.a)(["\n                    font-size: 3rem;\n                  "])))},k(s.value)),Object(c.b)(ue,{description:"Last updated: "+s.lastUpdated})),l())):l(),n&&n.production&&n.production.length?Object(c.b)("div",{className:"l-2up"},n.production.filter((function(e){return""!==e.caption})).map((function(e){return Object(c.b)("div",{className:"l-2up__col",key:e.caption},Object(c.b)(pe,{heading:e.caption,meta:{description:Object(c.b)("span",{css:Object(c.a)(Ue||(Ue=Object(g.a)(["\n                            display: flex;\n                            justify-content: center;\n                          "])))},"Last updated: "+e.lastUpdated)}},Object(c.b)(ge,{value:e.value})))}))):Object(c.b)("div",{css:Object(c.a)(Me||(Me=Object(g.a)(["\n              font-size: 16px;\n              display: flex;\n              justify-content: center;\n              width: 100%;\n            "])))},"No Production Data")))};Be.propTypes={active:m.a.bool};var We,Je=Be,He=function(e){var t=e.children;return Object(c.b)("div",{className:"tabs",css:Object(c.a)(We||(We=Object(g.a)(["\n      z-index: 0;\n    "])))},t)};He.propTypes={children:m.a.any};var Xe=He,$e=function(e){var t=Object(b.useState)({}),n=t[0],a=t[1];return Object(b.useEffect)((function(){e.data&&a(function(e){var t={},n=function(e){return{caption:e.Item,value:e.Value,lastUpdated:e["Last Updated"]}},a=e.find((function(e){return"Total Population"===e.Item}));return a&&(t.population=n(a)),t.administration=e.filter((function(e){return"Total Population"!==e.Item&&"Administration"===e.Department})).map(n),t.education=e.filter((function(e){return"Total Population"!==e.Item&&"Education"===e.Department})).map(n),t.production=e.filter((function(e){return"Total Population"!==e.Item&&"Production"===e.Department})).map(n),t}(e.data))}),[e.data]),Object(c.b)(ae.Provider,{value:Object.assign({},e,{data:n})},Object(c.b)(Xe,null,Object(c.b)(Ge,{active:!0}),Object(c.b)(_e,null),Object(c.b)(Je,null)))};$e.propTypes={data:m.a.array.isRequired,location:m.a.object.isRequired,options:m.a.object.isRequired};var Ke,Qe=$e,Ye=h.a.div(Ke||(Ke=Object(g.a)(["\n  background: #ffffff;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n"]))),Ze=function(){return p.a.createElement(Ye,null,p.a.createElement(V,null))},et=function(e){window.DICharts.handler.addChart({className:e,echarts:{onAdd:function(e){Array.prototype.forEach.call(e,(function(e){var t=new window.DICharts.Chart(e.parentElement);if(t.showLoading(),window.DIState){var n=Object(s.createRoot)(e);window.DIState.addListener((function(){t.showLoading();var e=window.DIState.getState,a=e.keyFacts,r=e.location;a&&a.url?A(a.url).then((function(e){Array.isArray(e)?n.render(p.a.createElement(Qe,{data:e,options:a,location:r})):e.results?n.render(p.a.createElement(Qe,{data:e.results,options:a,location:r})):(window.console.error("Invalid data shape. Expected an array or an object with a results property.",e),n.render(p.a.createElement(Ze,null)))})).catch((function(e){window.console.log(e),n.render(p.a.createElement(Ze,null))})):a&&a.data?n.render(p.a.createElement(Qe,{data:a.data,options:a,location:r})):n.render(p.a.createElement(Ze,null)),t.hideLoading()}))}else window.console.log("State is not defined")}))}}})};window.addEventListener("load",(function(){_("district-selectors"),ne(),et("dicharts--keyfacts"),B()}))}},[[31,1,2]]]);