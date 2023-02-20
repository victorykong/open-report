/**
 * 不使用babel/core-js 做polyfill 原因是让SDK体积可控 且代码清晰
 * 基础的转es5能力 tsc已支持
 */

import "intersection-observer";

polyfill();

function polyfill() {
  // getAttributeNames
  if (!Element.prototype.getAttributeNames) {
    Element.prototype.getAttributeNames = function () {
      var attributes = this.attributes;
      var length = attributes.length;
      var result = new Array(length);
      for (var i = 0; i < length; i++) {
        result[i] = attributes[i].name;
      }
      return result;
    };
  }
}
