var VTMEventDOM=function(){"use strict";var t=function(){return t=Object.assign||function(t){for(var e,n=1,o=arguments.length;n<o;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t},t.apply(this,arguments)};function e(t){var e="function"==typeof Symbol&&Symbol.iterator,n=e&&t[e],o=0;if(n)return n.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&o>=t.length&&(t=void 0),{value:t&&t[o++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}function n(t,e){var n="function"==typeof Symbol&&t[Symbol.iterator];if(!n)return t;var o,r,i=n.call(t),s=[];try{for(;(void 0===e||e-- >0)&&!(o=i.next()).done;)s.push(o.value)}catch(t){r={error:t}}finally{try{o&&!o.done&&(n=i.return)&&n.call(i)}finally{if(r)throw r.error}}return s}function o(t,e,n){if(n||2===arguments.length)for(var o,r=0,i=e.length;r<i;r++)!o&&r in e||(o||(o=Array.prototype.slice.call(e,0,r)),o[r]=e[r]);return t.concat(o||Array.prototype.slice.call(e))}!function(){if("object"==typeof window)if("IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype)"isIntersecting"in window.IntersectionObserverEntry.prototype||Object.defineProperty(window.IntersectionObserverEntry.prototype,"isIntersecting",{get:function(){return this.intersectionRatio>0}});else{var t=function(t){for(var e=window.document,n=r(e);n;)n=r(e=n.ownerDocument);return e}(),e=[],n=null,o=null;s.prototype.THROTTLE_TIMEOUT=100,s.prototype.POLL_INTERVAL=null,s.prototype.USE_MUTATION_OBSERVER=!0,s._setupCrossOriginUpdater=function(){return n||(n=function(t,n){o=t&&n?l(t,n):{top:0,bottom:0,left:0,right:0,width:0,height:0},e.forEach((function(t){t._checkForIntersections()}))}),n},s._resetCrossOriginUpdater=function(){n=null,o=null},s.prototype.observe=function(t){if(!this._observationTargets.some((function(e){return e.element==t}))){if(!t||1!=t.nodeType)throw new Error("target must be an Element");this._registerInstance(),this._observationTargets.push({element:t,entry:null}),this._monitorIntersections(t.ownerDocument),this._checkForIntersections()}},s.prototype.unobserve=function(t){this._observationTargets=this._observationTargets.filter((function(e){return e.element!=t})),this._unmonitorIntersections(t.ownerDocument),0==this._observationTargets.length&&this._unregisterInstance()},s.prototype.disconnect=function(){this._observationTargets=[],this._unmonitorAllIntersections(),this._unregisterInstance()},s.prototype.takeRecords=function(){var t=this._queuedEntries.slice();return this._queuedEntries=[],t},s.prototype._initThresholds=function(t){var e=t||[0];return Array.isArray(e)||(e=[e]),e.sort().filter((function(t,e,n){if("number"!=typeof t||isNaN(t)||t<0||t>1)throw new Error("threshold must be a number between 0 and 1 inclusively");return t!==n[e-1]}))},s.prototype._parseRootMargin=function(t){var e=(t||"0px").split(/\s+/).map((function(t){var e=/^(-?\d*\.?\d+)(px|%)$/.exec(t);if(!e)throw new Error("rootMargin must be specified in pixels or percent");return{value:parseFloat(e[1]),unit:e[2]}}));return e[1]=e[1]||e[0],e[2]=e[2]||e[0],e[3]=e[3]||e[1],e},s.prototype._monitorIntersections=function(e){var n=e.defaultView;if(n&&-1==this._monitoringDocuments.indexOf(e)){var o=this._checkForIntersections,i=null,s=null;this.POLL_INTERVAL?i=n.setInterval(o,this.POLL_INTERVAL):(c(n,"resize",o,!0),c(e,"scroll",o,!0),this.USE_MUTATION_OBSERVER&&"MutationObserver"in n&&(s=new n.MutationObserver(o)).observe(e,{attributes:!0,childList:!0,characterData:!0,subtree:!0})),this._monitoringDocuments.push(e),this._monitoringUnsubscribes.push((function(){var t=e.defaultView;t&&(i&&t.clearInterval(i),a(t,"resize",o,!0)),a(e,"scroll",o,!0),s&&s.disconnect()}));var h=this.root&&(this.root.ownerDocument||this.root)||t;if(e!=h){var u=r(e);u&&this._monitorIntersections(u.ownerDocument)}}},s.prototype._unmonitorIntersections=function(e){var n=this._monitoringDocuments.indexOf(e);if(-1!=n){var o=this.root&&(this.root.ownerDocument||this.root)||t,i=this._observationTargets.some((function(t){var n=t.element.ownerDocument;if(n==e)return!0;for(;n&&n!=o;){var i=r(n);if((n=i&&i.ownerDocument)==e)return!0}return!1}));if(!i){var s=this._monitoringUnsubscribes[n];if(this._monitoringDocuments.splice(n,1),this._monitoringUnsubscribes.splice(n,1),s(),e!=o){var c=r(e);c&&this._unmonitorIntersections(c.ownerDocument)}}}},s.prototype._unmonitorAllIntersections=function(){var t=this._monitoringUnsubscribes.slice(0);this._monitoringDocuments.length=0,this._monitoringUnsubscribes.length=0;for(var e=0;e<t.length;e++)t[e]()},s.prototype._checkForIntersections=function(){if(this.root||!n||o){var t=this._rootIsInDom(),e=t?this._getRootRect():{top:0,bottom:0,left:0,right:0,width:0,height:0};this._observationTargets.forEach((function(o){var r=o.element,s=h(r),c=this._rootContainsTarget(r),a=o.entry,u=t&&c&&this._computeTargetAndRootIntersection(r,s,e),l=null;this._rootContainsTarget(r)?n&&!this.root||(l=e):l={top:0,bottom:0,left:0,right:0,width:0,height:0};var f=o.entry=new i({time:window.performance&&performance.now&&performance.now(),target:r,boundingClientRect:s,rootBounds:l,intersectionRect:u});a?t&&c?this._hasCrossedThreshold(a,f)&&this._queuedEntries.push(f):a&&a.isIntersecting&&this._queuedEntries.push(f):this._queuedEntries.push(f)}),this),this._queuedEntries.length&&this._callback(this.takeRecords(),this)}},s.prototype._computeTargetAndRootIntersection=function(e,r,i){if("none"!=window.getComputedStyle(e).display){for(var s,c,a,u,f,d,v,y,m=r,g=p(e),b=!1;!b&&g;){var w=null,_=1==g.nodeType?window.getComputedStyle(g):{};if("none"==_.display)return null;if(g==this.root||9==g.nodeType)if(b=!0,g==this.root||g==t)n&&!this.root?!o||0==o.width&&0==o.height?(g=null,w=null,m=null):w=o:w=i;else{var A=p(g),E=A&&h(A),I=A&&this._computeTargetAndRootIntersection(A,E,i);E&&I?(g=A,w=l(E,I)):(g=null,m=null)}else{var k=g.ownerDocument;g!=k.body&&g!=k.documentElement&&"visible"!=_.overflow&&(w=h(g))}if(w&&(s=w,c=m,a=void 0,u=void 0,f=void 0,d=void 0,v=void 0,y=void 0,a=Math.max(s.top,c.top),u=Math.min(s.bottom,c.bottom),f=Math.max(s.left,c.left),d=Math.min(s.right,c.right),y=u-a,m=(v=d-f)>=0&&y>=0&&{top:a,bottom:u,left:f,right:d,width:v,height:y}||null),!m)break;g=g&&p(g)}return m}},s.prototype._getRootRect=function(){var e;if(this.root&&!d(this.root))e=h(this.root);else{var n=d(this.root)?this.root:t,o=n.documentElement,r=n.body;e={top:0,left:0,right:o.clientWidth||r.clientWidth,width:o.clientWidth||r.clientWidth,bottom:o.clientHeight||r.clientHeight,height:o.clientHeight||r.clientHeight}}return this._expandRectByRootMargin(e)},s.prototype._expandRectByRootMargin=function(t){var e=this._rootMarginValues.map((function(e,n){return"px"==e.unit?e.value:e.value*(n%2?t.width:t.height)/100})),n={top:t.top-e[0],right:t.right+e[1],bottom:t.bottom+e[2],left:t.left-e[3]};return n.width=n.right-n.left,n.height=n.bottom-n.top,n},s.prototype._hasCrossedThreshold=function(t,e){var n=t&&t.isIntersecting?t.intersectionRatio||0:-1,o=e.isIntersecting?e.intersectionRatio||0:-1;if(n!==o)for(var r=0;r<this.thresholds.length;r++){var i=this.thresholds[r];if(i==n||i==o||i<n!=i<o)return!0}},s.prototype._rootIsInDom=function(){return!this.root||f(t,this.root)},s.prototype._rootContainsTarget=function(e){var n=this.root&&(this.root.ownerDocument||this.root)||t;return f(n,e)&&(!this.root||n==e.ownerDocument)},s.prototype._registerInstance=function(){e.indexOf(this)<0&&e.push(this)},s.prototype._unregisterInstance=function(){var t=e.indexOf(this);-1!=t&&e.splice(t,1)},window.IntersectionObserver=s,window.IntersectionObserverEntry=i}function r(t){try{return t.defaultView&&t.defaultView.frameElement||null}catch(t){return null}}function i(t){this.time=t.time,this.target=t.target,this.rootBounds=u(t.rootBounds),this.boundingClientRect=u(t.boundingClientRect),this.intersectionRect=u(t.intersectionRect||{top:0,bottom:0,left:0,right:0,width:0,height:0}),this.isIntersecting=!!t.intersectionRect;var e=this.boundingClientRect,n=e.width*e.height,o=this.intersectionRect,r=o.width*o.height;this.intersectionRatio=n?Number((r/n).toFixed(4)):this.isIntersecting?1:0}function s(t,e){var n,o,r,i=e||{};if("function"!=typeof t)throw new Error("callback must be a function");if(i.root&&1!=i.root.nodeType&&9!=i.root.nodeType)throw new Error("root must be a Document or Element");this._checkForIntersections=(n=this._checkForIntersections.bind(this),o=this.THROTTLE_TIMEOUT,r=null,function(){r||(r=setTimeout((function(){n(),r=null}),o))}),this._callback=t,this._observationTargets=[],this._queuedEntries=[],this._rootMarginValues=this._parseRootMargin(i.rootMargin),this.thresholds=this._initThresholds(i.threshold),this.root=i.root||null,this.rootMargin=this._rootMarginValues.map((function(t){return t.value+t.unit})).join(" "),this._monitoringDocuments=[],this._monitoringUnsubscribes=[]}function c(t,e,n,o){"function"==typeof t.addEventListener?t.addEventListener(e,n,o||!1):"function"==typeof t.attachEvent&&t.attachEvent("on"+e,n)}function a(t,e,n,o){"function"==typeof t.removeEventListener?t.removeEventListener(e,n,o||!1):"function"==typeof t.detachEvent&&t.detachEvent("on"+e,n)}function h(t){var e;try{e=t.getBoundingClientRect()}catch(t){}return e?(e.width&&e.height||(e={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.right-e.left,height:e.bottom-e.top}),e):{top:0,bottom:0,left:0,right:0,width:0,height:0}}function u(t){return!t||"x"in t?t:{top:t.top,y:t.top,bottom:t.bottom,left:t.left,x:t.left,right:t.right,width:t.width,height:t.height}}function l(t,e){var n=e.top-t.top,o=e.left-t.left;return{top:n,left:o,height:e.height,width:e.width,bottom:n+e.height,right:o+e.width}}function f(t,e){for(var n=e;n;){if(n==t)return!0;n=p(n)}return!1}function p(e){var n=e.parentNode;return 9==e.nodeType&&e!=t?r(e):(n&&n.assignedSlot&&(n=n.assignedSlot.parentNode),n&&11==n.nodeType&&n.host?n.host:n)}function d(t){return t&&9===t.nodeType}}(),Element.prototype.getAttributeNames||(Element.prototype.getAttributeNames=function(){for(var t=this.attributes,e=t.length,n=new Array(e),o=0;o<e;o++)n[o]=t[o].name;return n});var r=function(){function e(){this.events={}}return e.prototype.once=function(t,e){return this.on(t,e,{once:!0}),this},e.prototype.on=function(e,n,o){return this.events[e]||(this.events[e]=[]),this.events[e].push(t({callback:n},o)),this},e.prototype.off=function(t,e){return e?(this.events[t]=this.events[t].filter((function(t){return t.callback!==e})),this):(delete this.events[t],this)},e.prototype.emit=function(t){for(var e=this,r=[],i=1;i<arguments.length;i++)r[i-1]=arguments[i];return this.events[t]?(this.events[t].forEach((function(i,s){i.callback.apply(i,o([],n(r),!1)),i.once&&e.events[t].splice(s,1)})),this):this},e}();function i(t,e){void 0===e&&(e=1e3),setTimeout((function(){t(),i(t)}),e)}function s(t,e){return Array.from(t).reduce((function(t,r){if(!(r instanceof Element))return t;if("show"===e){var i=Array.from(r.querySelectorAll(a.selectorShow));t.push.apply(t,o([],n(i),!1))}if("click"===e){var s=Array.from(r.querySelectorAll(a.selectorClick));t.push.apply(t,o([],n(s),!1))}return"show"===e&&r.classList.contains(a.selectorShow.substring(1))&&t.push(r),"click"===e&&r.classList.contains(a.selectorClick.substring(1))&&t.push(r),t}),[])}function c(){var t=Date.now(),e=Math.random().toString(36).slice(2,10);return"".concat(t,"_").concat(e)}var a=function(){function t(t){this.mapBindClickElement=new WeakMap,this.event=new r,this.options=t||{},this.init()}return t.prototype.init=function(){this.observerIntersection=this.createIntersectionObserver(),this.initIntervalCallbackAsyncList()},t.prototype.on=function(t,e){switch(t){case"view":e();break;case"click":this.event.on(t,e),this.onClick();break;case"show":this.event.on(t,e),this.onShow()}return this},t.prototype.emit=function(t,e){this.$emit({type:t,data:e})},t.prototype.onClick=function(){this.onClickSync(),this.onGlobalObserve("click")},t.prototype.onClickSync=function(e){var n=this;e||(e=Array.from(document.querySelectorAll(t.selectorClick)));var o=this;e.forEach((function(t){n.mapBindClickElement.has(t)||(n.mapBindClickElement.set(t,!0),t.addEventListener("click",(function(){o.emit("click",{ele:t})})))}))},t.prototype.patchAsyncClick=function(t){if(t&&t instanceof Element){var e=this;new MutationObserver((function(t,n){t.forEach((function(t){var n=s(t.addedNodes,"click");e.onClickSync(n)}))})).observe(t,{childList:!0,subtree:!0})}},t.prototype.onShow=function(){this.onShowSync(),this.onGlobalObserve("show")},t.prototype.onShowSync=function(e){e||(e=Array.from(document.querySelectorAll(t.selectorShow)));var n=this.observerIntersection;e.forEach((function(t){n.observe(t)}))},t.prototype.patchAsyncShow=function(t){if(t&&t instanceof Element){var e=this;new MutationObserver((function(t,n){t.forEach((function(t){var n=s(t.addedNodes,"show");e.onShowSync(n)}))})).observe(t,{childList:!0,subtree:!0})}},t.prototype.onGlobalObserve=function(e){var r=this;new MutationObserver((function(i,s){i.forEach((function(i){var s=i.addedNodes;0!==s.length&&Array.from(s).filter((function(t){return t instanceof Element})).forEach((function(i){"click"===e&&(r.onClickSync(o(o([],n(i.classList.contains(t.selectorClick.substring(1))?[i]:[]),!1),n(Array.from(i.querySelectorAll(t.selectorClick))),!1)),r.patchAsyncClick(i)),"show"===e&&(r.onShowSync(o(o([],n(i.classList.contains(t.selectorShow.substring(1))?[i]:[]),!1),n(Array.from(i.querySelectorAll(t.selectorShow))),!1)),r.patchAsyncShow(i))}))}))})).observe(document.body,{childList:!0,subtree:!0})},t.prototype.$emit=function(r){var i,s,a=r.type,h=r.data;if("show"===a){var u=h,l=[],f=[],p=function(e){var n=e.target,o=!0,r=n.getAttributeNames().reduce((function(e,r){if(!r.startsWith(t.attrAsyncDataPrefix))return e;var i=n.getAttribute(r);return r=r.replace(t.attrAsyncDataPrefix,""),i?(e[r]=i,e):(o=!1,e[r]="",e)}),{});if(e.asyncData=r,o)return l.push(e),"continue";e.isLoadingAsyncData=!0,e.eleId=c(),f.push(e)};try{for(var d=e(u),v=d.next();!v.done;v=d.next()){p(v.value)}}catch(t){i={error:t}}finally{try{v&&!v.done&&(s=d.return)&&s.call(d)}finally{if(i)throw i.error}}this.event.emit(a,o(o([],n(l),!1),n(f),!1)),f.length>0&&this.callbackAsyncList.push({type:a,data:f})}else if("click"===a){var y=h,m=y.ele,g=!0,b=m.getAttributeNames().reduce((function(e,n){if(!n.startsWith(t.attrAsyncDataPrefix))return e;var o=m.getAttribute(n);return n=n.replace(t.attrAsyncDataPrefix,""),o?(e[n]=o,e):(g=!1,e[n]="",e)}),{});if(y.asyncData=b,g)return void this.event.emit(a,y);y.isLoadingAsyncData=!0,y.eleId=c(),this.event.emit(a,y),this.callbackAsyncList.push({type:a,data:y})}},t.prototype.initIntervalCallbackAsyncList=function(){this.callbackAsyncList=[],i(function(){var n=this;if(0===this.callbackAsyncList.length)return;this.callbackAsyncList.forEach((function(o,r){var i,s;if(o)if("show"===o.type){var c=o.data,a=[],h=[],u=function(e){var n=e.target,o=!0,r=n.getAttributeNames().reduce((function(e,r){if(!r.startsWith(t.attrAsyncDataPrefix))return e;var i=n.getAttribute(r);return r=r.replace(t.attrAsyncDataPrefix,""),i?(e[r]=i,e):(o=!1,e[r]="",e)}),{});if(e.asyncData=r,o)return e.isLoadingAsyncData=!1,a.push(e),"continue";h.push(e)};try{for(var l=e(c),f=l.next();!f.done;f=l.next()){u(f.value)}}catch(t){i={error:t}}finally{try{f&&!f.done&&(s=l.return)&&s.call(l)}finally{if(i)throw i.error}}n.callbackAsyncList[r]=null,a.length>0&&n.event.emit(o.type,a),h.length>0&&n.callbackAsyncList.push({type:o.type,data:h})}else if("click"===o.type){var p=o.data,d=p.ele,v=!0,y=d.getAttributeNames().reduce((function(e,n){if(!n.startsWith(t.attrAsyncDataPrefix))return e;var o=d.getAttribute(n);return n=n.replace(t.attrAsyncDataPrefix,""),o?(e[n]=o,e):(v=!1,e[n]="",e)}),{});if(v)return p.asyncData=y,n.callbackAsyncList[r]=null,p.isLoadingAsyncData=!1,void n.event.emit(o.type,p)}}))}.bind(this),1e3)},t.prototype.createIntersectionObserver=function(){var t,e=this;return new IntersectionObserver((function(t,n){e.emit("show",t.map((function(t){return Object.assign(t,{isShow:t.isIntersecting})})))}),{threshold:(null===(t=e.options.show)||void 0===t?void 0:t.threshold)||.1})},t.selectorClick=".vcr-click",t.selectorShow=".vcr-show",t.attrAsyncDataPrefix="data-vcr-d-",t}();return a}();