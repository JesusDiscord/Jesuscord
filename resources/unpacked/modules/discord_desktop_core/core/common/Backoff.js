"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;class Backoff{constructor(t=500,e=null,i=!0){this.min=t,this.max=null!=e?e:10*t,this.jitter=i,this._current=t,this._timeoutId=null,this._fails=0}get fails(){return this._fails}get current(){return this._current}get pending(){return null!=this._timeoutId}succeed(){this.cancel(),this._fails=0,this._current=this.min}fail(t){this._fails+=1;let e=2*this._current;if(this.jitter&&(e*=Math.random()),this._current=Math.min(this._current+e,this.max),null!=t){if(null!=this._timeoutId)throw new Error("callback already pending");this._timeoutId=setTimeout(()=>{try{null!=t&&t()}finally{this._timeoutId=null}},this._current)}return this._current}cancel(){null!=this._timeoutId&&(clearTimeout(this._timeoutId),this._timeoutId=null)}}exports.default=Backoff,module.exports=exports.default;