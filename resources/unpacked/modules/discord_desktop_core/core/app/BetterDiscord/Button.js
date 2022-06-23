"use strict";const ModuleLoader=require("./loaders/modules");Object.defineProperty(exports,"__esModule",{value:!0});const WebpackLoader_1={default:{findByUniqueProperties:o=>ModuleLoader.get(e=>{if(e.__esModule&&"default"in e){let r=!0;for(let t of o)Object.prototype.hasOwnProperty.call(e.default,t)||(r=!1);if(r)return!0}for(let r of o)if(!Object.prototype.hasOwnProperty.call(e,r))return!1;return!0})[0]}};let ButtonModules,Button=(()=>{class o extends React.Component{constructor(o){super(o),this.state={hover:!1}}get modules(){return ButtonModules||(ButtonModules=[WebpackLoader_1.default.findByUniqueProperties(["_horizontal"]),WebpackLoader_1.default.findByUniqueProperties(["colorTransparent"]),WebpackLoader_1.default.findByUniqueProperties(["buttonWrapper"]),WebpackLoader_1.default.findByUniqueProperties(["ButtonColors"])])}render(){let[e,r,t,s]=this.modules,l={};this.props&&("color"in this.props&&(l.color=this.props.color),"children"in this.props&&(l.children=this.props.children),"onClick"in this.props&&(l.onClick=this.props.onClick),"wrapper"in this.props&&(l.wrapper=!!this.props.wrapper),"look"in this.props&&(l.look=this.props.look),"size"in this.props&&(l.size=this.props.size),"hoverColor"in this.props&&(l.hoverColor=this.props.hoverColor)),l.color?(l.color=l.color.toLowerCase(),o.Colors.includes(l.color)||(l.color=o.Colors[0])):l.color=o.Colors[0],l.look?(l.look=l.look.toLowerCase(),o.Looks.includes(l.look)||(l.look=o.Looks[0])):l.look=o.Looks[0],l.size?(l.size=l.size.toLowerCase(),o.Sizes.includes(l.size)||(l.size=o.Sizes[0])):l.size=o.Sizes[0],l.hoverColor?(l.hoverColor=l.hoverColor.toLowerCase(),o.HoverColors.includes(l.hoverColor)||(l.hoverColor=o.HoverColors[0])):l.hoverColor=o.HoverColors[0];let i=l.size&&s.ButtonSizes[l.size.toUpperCase()]||"";i&&(i=" "+i);let n=l.hoverColor&&s.ButtonHovers[l.hoverColor.toUpperCase()]||"";n&&(n=" "+n),l.onClick="function"==typeof l.onClick?l.onClick:()=>{},"boolean"!=typeof l.wrapper&&(l.wrapper=!0);let p=this.state.hover?r.hasHover:"";p&&(p=" "+p);let a=React.createElement("button",{type:"button",className:`${e.flexChild} ${r.button} ${s.ButtonLooks[l.look.toUpperCase()]} ${s.ButtonColors[l.color.toUpperCase()]}${i}${n}${p} ${r.grow}`,style:{flex:"0 1 auto"},onClick:this.props.onClick,onMouseEnter:o=>{n&&this.setState({hover:!0})},onMouseLeave:o=>{n&&this.setState({hover:!1})}},React.createElement("div",{className:r.contents},l.children));return l.wrapper?React.createElement("div",{className:t.buttonWrapper},a):a}}return o.Colors=["brand","grey","red","green","yellow","primary","link","white","black","transparent"],o.Looks=["filled","inverted","outlined","ghost","link","blank"],o.Sizes=["small","medium","large","xlarge","min","max","icon","none"],o.HoverColors=["default",...o.Colors],o})();exports.default=Button;