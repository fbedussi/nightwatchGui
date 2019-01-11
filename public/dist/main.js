!function(e){var t={};function n(a){if(t[a])return t[a].exports;var r=t[a]={i:a,l:!1,exports:{}};return e[a].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(a,r,function(t){return e[t]}.bind(null,r));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var a=function(e,t){window.fetch(e,{method:"get"}).then(function(e){return e.json()}).then(function(e){return t(e)}).catch(function(e){return console.log("Error: "+e)})};var r=function(e){var t=document.createElement(e.elTag);if(e.text){var n="string"==typeof e.text?document.createTextNode(e.text):e.text;t.appendChild(n)}return e.class&&(t.className=e.class),e.id&&(t.id=e.id),t};var l,c=function(e){var t=document.createElement("input"),n=r({elTag:"label",text:e.labelText});t.setAttribute("id",e.id),t.setAttribute("type",e.type),e.name&&t.setAttribute("name",e.name),e.className.length&&t.setAttribute("class",e.className),e.checked&&t.setAttribute("checked","checked"),e.dataPath&&t.setAttribute("data-path",e.dataPath),e.dataType&&t.setAttribute("data-type",e.dataType),n.setAttribute("for",e.id),e.labelClass&&(n.className=e.labelClass),e.parent.appendChild(t),e.parent.appendChild(n)},d={get:function(){return l},set:function(e){return l=e}},o=[],i={get:function(){return o},set:function(e){return o=e}},u=document.getElementById("testRunningMsg"),s=document.getElementById("submitBtn"),f=document.getElementById("includedFeatures"),p=document.getElementById("excludeddFeatures");var m=function e(t,n,a){void 0===a&&(a="root"),function(e,t){return Object.keys(e).map(function(n,a){return Object.assign({},e[n],{label:n,id:t+"-"+a})})}(t,a).sort(function(e,t){return e.label>t.label}).forEach(function(t){if("file"===t.type){var a=t.tags,l="";a&&a.length&&(i.set(i.get().concat(a)),l=" (TAG: "+a.join(", ")+")");var d=document.createElement("li");n.appendChild(d),c({type:"radio",name:"selectFile",value:t.label,labelText:t.label+l,className:"line",dataPath:t.path,dataType:"file",id:t.id,parent:d})}else{var o=r({elTag:"fieldset",class:"folderWrapper "+t.label+"_wrapper"}),u=r({elTag:"span",text:"",class:"closeTxt"}),s=r({elTag:"span",text:"",class:"openTxt"}),f=r({elTag:"ul",class:"featureFiles"}),p=document.createElement("span");p.appendChild(s),p.appendChild(u),p.appendChild(document.createTextNode(t.label)),n.appendChild(o),c({type:"checkbox",value:t.label,labelText:p,className:"closeBtn",labelClass:"openClose",dataPath:t.path,dataType:"close",id:t.id+"_close",checked:!0,parent:o}),c({type:"radio",name:"selectFolder",value:t.label,labelText:"select folder",className:"folderBtn",labelClass:"btn btn-outline-dark mr-2 selectFolder",dataPath:t.path,dataType:"dir",id:t.id+"_entire",parent:o}),c({type:"checkbox",value:t.value,labelText:"exclude folder",className:"folderBtn",labelClass:"btn btn-outline-dark excludeFolder",dataPath:t.path,dataType:"exclude",id:t.id+"_entireExclude",parent:o}),o.appendChild(f),e(t.subDir,f,t.id)}})};var h=function(){return{included:[].map.call(document.querySelectorAll("#tagsIncluded li"),function(e){return e.id}),excluded:[].map.call(document.querySelectorAll("#tagsExcluded li"),function(e){return e.id})}};var g=function(e,t){var n=[e,t];return n.sort().shift().filter(function(e){return n.every(function(t){return-1!==t.indexOf(e)})})};var y=function(e,t){t.innerHTML="",e.forEach(function(e){var n=document.createElement("li"),a=document.createTextNode(e);n.appendChild(a),t.appendChild(n)})};var b=function(e){return e.replace(/^.*features/,"").substr(1)};var v=function(e){var t=document.querySelector('[data-type="dir"]:checked'),n="all"===t.dataset.path,a=[],r=h().included,l=h().excluded,c=[].map.call(document.querySelectorAll('[data-type="exclude"]:checked'),function(e){return e.dataset.path}),o=document.querySelector('[data-type="file"]:checked'),i=document.getElementById("featuresToRun");i.innerHTML="",function e(d){var i;for(i in d)"file"===d[i].type?g(l,d[i].tags).length||!n||r.length&&!g(r,d[i].tags).length||c.length&&!c.every(function(e){return Boolean(-1===d[i].path.indexOf(e))})||o&&d[i].path!==o.dataset.path||a.push(b(d[i].path)):d[i].subDir&&(0===d[i].path.indexOf(t.dataset.path)?n=!0:"all"!==t.dataset.path&&(n=!1),e(d[i].subDir))}(d.get()),a.length?(i.classList.remove("error"),s.disabled=!1):(a=["No features selected!"],i.classList.add("error"),s.disabled=!0),y(a,i)};var E=function(e){!function(e,t){e.forEach(function(e){var n=document.createElement("li"),a=document.createTextNode(e);n.appendChild(a),n.setAttribute("draggable",!0),n.id=e,n.className="tag",t.appendChild(n),n.addEventListener("dragstart",function(e){console.log("dragstart"),e.dataTransfer.setData("text/plain",e.target.id),e.dataTransfer.dropEffect="move",e.dataTransfer.effectAllowed="move"})})}(e,document.getElementById("tagsList")),document.addEventListener("dragover",function(e){e.preventDefault()}),document.addEventListener("dragenter",function(e){e.preventDefault()}),document.addEventListener("drop",function(e){if(e.preventDefault(),e.target.classList.contains("tagsDropArea")||e.target.parentNode.classList.contains("tagsDropArea")){var t=e.dataTransfer.getData("text");(e.target.classList.contains("tagsDropArea")?e.target:e.target.parentNode).querySelector("ul").appendChild(document.getElementById(t)),n=h().included,a=h().excluded,r=[],l=[],function e(t){Object.keys(t).forEach(function(c){return"file"===t[c].type&&t[c].tags?(g(t[c].tags,n).length&&r.push(b(t[c].path)),void(g(t[c].tags,a).length&&l.push(b(t[c].path)))):t[c].subDir?e(t[c].subDir):void 0})}(d.get()),y(r,f),y(l,p),v()}var n,a,r,l}),document.getElementById("tagsFormWrapper").setAttribute("style","")};var x=function(e){var t={environments:[],dir:""},n=h().included,a=h().excluded;return[].filter.call(e.querySelectorAll(".line, .folderBtn"),function(e){return e.checked}).forEach(function(e){switch(e.getAttribute("data-type")){case"environment":t.environments.push(e.id);break;case"dir":t.dir=e.getAttribute("data-path");break;case"exclude":t.exclude||(t.exclude=[]),t.exclude.push(e.getAttribute("data-path"));break;case"file":t.file=e.getAttribute("data-path")}}),n.length&&(t.tagsIncluded=n),a.length&&(t.tagsExcluded=a),t};var T=function(e,t,n){window.fetch(t,{method:"post",headers:new Headers({"Content-Type":"application/json; charset=UTF-8"}),body:JSON.stringify(e)}).then(function(e){console.log("Form submit status: ",e.statusText),n()}).catch(function(e){console.log("post error: ",e),alert("Server not responding, check if it's running")})},k=document.getElementById("filesForm");var A=function(e){var t=io.connect(e);s.addEventListener("click",function(n){n.preventDefault();var a=x(k);T(a,e+"/launchspy",function(){u.setAttribute("style","")}),t.removeAllListeners("nightwatchConsoleMsg"),t.on("nightwatchConsoleMsg",function(e){var t=document.createElement("p");t.innerHTML=e,u.appendChild(t),u.scrollTop=u.scrollHeight})})};var C=function(e,t){return function e(t,n){return t.dataset.type&&t.dataset.type===n?t:t.nextElementSibling?e(t.nextElementSibling,n):null}(e.parentElement.firstElementChild,t)};var S=function(){document.addEventListener("featureListReady",function(){[].forEach.call(document.querySelectorAll(".folderBtn"),function(e){e.addEventListener("click",function(e){if(e.currentTarget.checked){var t=C(e.currentTarget,"dir"===e.currentTarget.dataset.type?"exclude":"dir");t&&t.checked&&(t.checked=!1);var n=e.currentTarget.dataset.type;if(n&&("dir"===n||"exclude"===n)){var a=document.querySelector('[data-type="file"]:checked');a&&(a.checked=!1)}if(document.querySelector('[data-type="dir"]:checked')||(document.getElementById("selectAll").checked=!0),"dir"===e.currentTarget.dataset.type){var r=e.currentTarget.parentElement.querySelector(".featureFiles");[].map.call(document.querySelectorAll('[data-type="exclude"]'),function(e){return e.disabled=!1,e}).filter(function(e){return!function e(t,n){return t===n||!!t.parentElement&&e(t.parentElement,n)}(e,r)}).forEach(function(e){e.disabled=!0,e.checked=!1})}}v()})})})};var L=function(){document.addEventListener("featureListReady",function(){[].forEach.call(document.querySelectorAll('[name="selectFile"]'),function(e){e.addEventListener("click",function(e){var t=e.currentTarget.closest("fieldset"),n=t?C(t.firstElementChild,"dir"):null,a=t?C(t.firstElementChild,"exclude"):null;n&&!n.checked&&(n.checked=!0),a&&a.checked&&(a.checked=!1),v()})})})};var B=function(){document.getElementById("resetButton").addEventListener("click",function(){var e=document.getElementById("tagsList");[].forEach.call(document.querySelectorAll(".tagsDropAreaWrapper li"),function(t){e.appendChild(t)}),y([],f),y([],p),u.setAttribute("style","display: none;"),setTimeout(v,0)})};function N(e){return(N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var I="http://"+document.location.host,j=new Event("featureListReady",{bubbles:!0,cancelable:!1});a(I+"/environments",function(e){var t=document.getElementById("environmentsFormInner");"object"===N(e)&&Object.keys(e).forEach(function(e){var n=document.createElement("span");n.className="btn btn-outline-dark mr-1 mb-1",t.appendChild(n),c({type:"checkbox",value:e,labelText:e,className:"mr-2",dataType:"environment",id:e,checked:"chrome"===e&&"checked",parent:n})})}),a(I+"/features",function(e){if("object"===N(e)){if(d.set(e),m(e,document.getElementById("filesFormInner")),i.get().length){var t=i.get().sort().filter(function(e,t,n){return n.indexOf(e)===t});E(t)}v(),document.dispatchEvent(j)}}),A(I),S(),L(),B()}]);
//# sourceMappingURL=main.js.map