// client.express.js JavaScript Routing, version: 0.7.6
// (c) 2011 Mark Nijhof
//
//  Released under MIT license.
//
var ClientExpress={},__dirname="",process={env:{PORT:3E3}};ClientExpress.createServer=function(){return new ClientExpress.Server};ClientExpress.supported=function(){return typeof window.history.pushState==="function"};ClientExpress.logger=function(){return function(){var b=new ClientExpress.Logger;this.eventBroker.addListener("onLog",function(a){a.arguments.shift()=="warning"?b.warning(a.arguments):b.information(a.arguments)})}};
ClientExpress.setTitle=function(b){var a=b&&b.titleArgument;return function(){this.eventBroker.addListener("onRequestProcessed",function(f){var b;b=f.response.title;a&&f.args[a]&&(b=f.args[a]);if(b)document.title=b})}};ClientExpress.googleAnalytics=function(){return function(){this.eventBroker.addListener("onRequestProcessed",function(b){b.isRedirect||_gaq&&_gaq.push(["_trackPageview",b.request.originalUrl])})}};
ClientExpress.setContentElement=function(b){return function(){this.content_element=(document.getElementById?document.getElementById(b):document.all?document.all[b]:document.layers?document.layers[b]:null)||document.childNodes[1];this.content_element==document.childNodes[1]&&this.log("warning","Element '",b,"' could not be located!")}};
ClientExpress.Logger=function(){var b=function(){};b.prototype.error=function(){typeof console!="undefined"&&console.error(arguments[0].join(" "))};b.prototype.information=function(){typeof console!="undefined"&&console.log(arguments[0].join(" "))};b.prototype.warning=function(){typeof console!="undefined"&&console.warn(arguments[0].join(" "))};return b}();
ClientExpress.Server=function(){var b=0,a=function(){this.version="0.7.6";this.id=[(new Date).valueOf(),b++].join("-");this.settings={};this.templateEngines={};this.router=new ClientExpress.Router;this.eventListener=new ClientExpress.EventListener;this.eventBroker=new ClientExpress.EventBroker(this);this.session={};this.content_element=document.childNodes[1];this.setup_functions=[];this.eventBroker.addListener("onProcessRequest",c);this.eventBroker.addListener("onRequestProcessed",g);this.eventBroker.addListener("onBeforeRender",
e);this.eventBroker.addListener("onAfterRender",j);this.eventBroker.addListener("onRender",k);this.eventBroker.addListener("onSend",h);this.eventBroker.addListener("onRedirect",i)};a.prototype.log=function(){this.eventBroker.fire({type:"Log",arguments:ClientExpress.utils.toArray(arguments)})};a.prototype.configure=function(a,c){typeof a=="function"?this.setup_functions.push(a):this.setup_functions.push(function(){server.enabled(a)&&c.call()})};a.prototype.use=function(a,c){var g=this;if(typeof a==
"function")a.call(this);else if(typeof a=="string"){a[a.length-1]==="/"&&(a=a.substring(0,a.length-1));var b=c.router.routes,b=b.get.concat(b.post.concat(b.put.concat(b.del.concat(b.before.concat(b.after)))));ClientExpress.utils.forEach(b,function(c){var b=c.method,e;e=a;var d=c.path;d instanceof RegExp?(d=d.source,e=d.substr(0,1)=="^"?RegExp("^"+e+d.substr(1,d.length)):d.substr(0,2)=="\\/"?RegExp(e+d):RegExp(e+"/"+d)):e=d=="/"?e:d.substr(0,1)!="/"?e+"/"+d:e+d;f(g,b,e,c.action,a)})}};a.prototype.set=
function(a,c){if(c===void 0)if(this.settings.hasOwnProperty(a))return this.settings[a];else{if(this.parent)return this.parent.set(a)}else return this.settings[a]=c,this};a.prototype.enable=function(a){this.settings.hasOwnProperty(a);this.settings[a]=!0};a.prototype.disable=function(a){this.settings.hasOwnProperty(a);this.settings[a]=!1};a.prototype.enabled=function(a){return this.settings.hasOwnProperty(a)&&this.settings[a]};a.prototype.disabled=function(a){return this.settings.hasOwnProperty(a)&&
!this.settings[a]};a.prototype.register=function(a,c){if(c===void 0)if(this.templateEngines.hasOwnProperty(a))return this.templateEngines[a];else{if(this.parent)return this.parent.set(a)}else return this.templateEngines[a]=c,this};a.prototype.get=function(a,c){return f(this,"get",a,c,"")};a.prototype.post=function(a,c){return f(this,"post",a,c,"")};a.prototype.put=function(a,c){return f(this,"put",a,c,"")};a.prototype.del=function(a,c){return f(this,"del",a,c,"")};a.prototype.before=function(a,c){return f(this,
"before",a,c,"")};a.prototype.after=function(a,c){return f(this,"after",a,c,"")};var f=function(a,c,b,g,f){a.router.registerRoute(c,b,g,f);return a};a.prototype.listen=function(){if(ClientExpress.supported()){var a=this;ClientExpress.onDomReady(function(){a.eventBroker.fire({type:"BeforeApplyingConfiguration",server:a});ClientExpress.utils.forEach(a.setup_functions,function(c){c.call(a)});a.eventListener.registerEventHandlers(a);d(new ClientExpress.Request({method:"get",originalUrl:window.location.href,
title:document.title,session:a.session,delegateToServer:function(){window.location=window.location.href}}));a.log("information","Listening");var c=a.router.routes.get.concat(a.router.routes.post.concat(a.router.routes.put.concat(a.router.routes.del))).sortByName("path");ClientExpress.utils.forEach(c,function(c){a.log("information","Route registered:",c.method.toUpperCase().lpad("    "),c.path)})})}else this.log("information","Not supported on this browser")};var d=function(a){window.history.replaceState(JSON.stringify(a),
a.title,a.location())},c=function(a){var c=a.request,b=this.router.match(c.method,c.originalUrl);if(b.resolved()){if(!a.request.isHistoryRequest&&!a.request.isRedirect)a=a.request,window.history.pushState(JSON.stringify(a),a.title,a.location());this.log("information",200,c.method.toUpperCase().lpad("    "),c.originalUrl);c.attachRoute(b);a=new ClientExpress.Response(c,this);b.action(c,a)}else this.log("information",404,c.method.toUpperCase().lpad("    "),c.originalUrl),a.request.delegateToServer()},
g=function(){},e=function(a){var c=this,b=a.request,g=a.response,f=this.router.match("before",b.originalUrl),e=function(){c.eventBroker.fire({type:"Render",request:b,response:g,content_element:a.content_element,template:a.template,args:a.args})};f.resolved()?f.action(b,g,a.args,a.content_element,e):e()},k=function(a){var c=this.settings["view engine"]||"",b=(this.settings.views||"")+a.template;b.lastIndexOf(".")!=-1&&b.lastIndexOf(".")<=4&&(c=b.substr(b.lastIndexOf(".")-1,b.length),b=b.substr(0,b.lastIndexOf(".")-
1));c=c||this.settings["view engine"]||"";c!=""&&(c="."+c,b+=c);a.content_element.innerHTML=this.templateEngines[c].compile(b,a.args);this.eventBroker.fire({type:"AfterRender",request:a.request,response:a.response,content_element:a.content_element,template:a.template,args:a.args})},j=function(a){var c=this,b=a.request,g=a.response,f=this.router.match("after",b.originalUrl),e=function(){c.eventBroker.fire({type:"RequestProcessed",request:b,response:g,content_element:a.content_element,template:a.template,
args:a.args})};f.resolved()?f.action(b,g,a.args,a.content_element,e):e()},h=function(a){a.content_element.innerHTML=a.content;this.eventBroker.fire({type:"RequestProcessed",request:a.request,response:a.response,content_element:a.content_element,args:{}})},i=function(a){this.log("information",302,"GET ",a.originalUrl);this.eventBroker.fire({type:"ProcessRequest",request:new ClientExpress.Request({method:"get",originalUrl:a.originalUrl,title:"",isRedirect:!0,session:a.request.session,delegateToServer:function(){window.location.originalUrlname=
a.originalUrl}})});this.eventBroker.fire({type:"RequestProcessed",request:a.request,response:a.response,content_element:a.content_element,args:{}})};return a}();
ClientExpress.Route=function(){function b(a,b,c){if(a instanceof RegExp)return a;a=a.concat("/?").replace(/\/\(/g,"(?:/").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g,function(a,c,f,j,h,i){b.push({name:j,optional:!!i});c=c||"";return""+(i?"":c)+"(?:"+(i?c:"")+(f||"")+(h||"([^/]+?)")+")"+(i||"")}).replace(/([\/.])/g,"\\$1").replace(/\*/g,"(.+)");return RegExp("^"+a+"$",c?"":"i")}var a=function(a,d,c,g,e){this.resolved=function(){return!0};this.method=a;this.path=d;this.action=c;this.base_path=g;
this.params=[];this.regexp=b(d,this.keys=[],e.sensitive)};a.prototype.match=function(a){return this.regexp.exec(a)};return a}();
ClientExpress.Router=function(){var b=function(){this.routes={get:[],post:[],put:[],del:[],before:[],after:[]}};b.prototype.match=function(a,b){for(var d=this.routes[a].length,c=0;c<d;++c){var g=this.routes[a][c];if(captures=g.match(b)){keys=g.keys;g.params=[];d=1;for(c=captures.length;d<c;++d){var e=keys[d-1],k="string"==typeof captures[d]?decodeURIComponent(captures[d]):captures[d];e?g.params[e.name]=k:g.params.push(k)}return g}}return{resolved:function(){return!1}}};b.prototype.registerRoute=function(a,
b,d,c){this.routes[a].push(new ClientExpress.Route(a,b,d,c,{sensitive:!1}))};return b}();
ClientExpress.EventBroker=function(){var b=function(a){this.server=a;this.eventListeners={}};b.prototype.addListener=function(a,b){if(typeof b!="function")throw Error("Event handler for '"+a+"' needs to be a function");typeof this.eventListeners[a]=="undefined"&&(this.eventListeners[a]=[]);this.eventListeners[a].push(b)};b.prototype.removeListener=function(a,b){if(this.eventListeners[a]instanceof Array){var d=this.eventListeners[a];d.forEach(function(a,g){a===b&&d.splice(g,1)})}};b.prototype.fire=
function(a){var b=this;typeof a=="string"&&(a={type:a});if(!a.target)a.target=b.server;if(!a.type)throw Error("Event object missing 'type' property.");a.type="on"+a.type;b.eventListeners[a.type]instanceof Array&&b.eventListeners[a.type].forEach(function(d){d.call(b.server,a)})};return b}();
ClientExpress.EventListener=function(){var b=function(){};b.prototype.registerEventHandlers=function(c){a(c);f(c);d(c)};var a=function(a){document.onclick=function(b){var b=b||window.event,e=b.target||b.srcElement;if(e.tagName.toLowerCase()=="a")return b=new ClientExpress.Request({method:"get",originalUrl:e.href,title:e.title||"",session:a.session,delegateToServer:function(){~e.href.indexOf("://")?window.location=e.href:window.location.pathname=e.href}}),a.eventBroker.fire({type:"ProcessRequest",
request:b}),!1}},f=function(a){document.onsubmit=function(b){var b=b||window.event,e=b.target||b.srcElement;if(e.tagName.toLowerCase()=="form")return b=new ClientExpress.Request({method:e.method,originalUrl:e.action,body:ClientExpress.utils.serializeArray(e),title:e.title,session:a.session,delegateToServer:function(){e.submit()}}),a.eventBroker.fire({type:"ProcessRequest",request:b}),!1}},d=function(a){window.onpopstate=function(b){if(b.state)try{var e=JSON.parse(b.state);e.__proto__=ClientExpress.Request.prototype;
e.HistoryRequest();a.eventBroker.fire({type:"ProcessRequest",request:e})}catch(f){}}};return b}();
ClientExpress.Request=function(){var b=function(a){this.isHistoryRequest=!1;this.session=a.session;this.title=a.title;this.body={};this.params={};this.query={};this.base_path="";this.isRedirect=a.isRedirect||!1;var b=a.originalUrl.split("?")[1],d=a.body;this.processQueryString(b,this.query);this.processQueryString(d,this.body);this.method=(this.body._method||a.method).toLowerCase();this.originalUrl=a.originalUrl.replace(window.location.protocol+"//"+window.location.host,"");this.routePath=this.originalUrl.replace(/\?.+$/,
"");this.delegateToServer=a.delegateToServer||function(){}};b.prototype.processQueryString=function(a,b){a&&ClientExpress.utils.forEach(a.split("&"),function(a){var c=a.split("=")[0],a=a.split("=")[1],g;(g=/^(\w+)\[(\w+)\]/.exec(c))===!0?(paramParent=g[1],c=g[2],g=b[paramParent]||{},g[c]=a,b[paramParent]=g):b[c]=a})};b.prototype.attachRoute=function(a){this.params=a.params;this.base_path=a.base_path;this.routePath=a.path};b.prototype.location=function(){return this.method==="get"?this.originalUrl:
""};b.prototype.param=function(a){return this.params[a]||this.body[a]||this.query[a]||void 0};b.prototype.HistoryRequest=function(){this.isHistoryRequest=!0};return b}();
ClientExpress.Response=function(){var b=function(a,b){this.request=a;this.server=b;this.output=this.redirect_path="";this.title=a.title};b.prototype.send=function(a){this.server.eventBroker.fire({type:"Send",request:this.request,response:this,content_element:this.server.content_element,content:a})};b.prototype.render=function(a,b){this.server.eventBroker.fire({type:"BeforeRender",request:this.request,response:this,content_element:this.server.content_element,template:a,args:b||{}})};b.prototype.redirect=
function(a){this.server.eventBroker.fire({type:"Redirect",request:this.request,response:this,originalUrl:(a.substr(0,1)=="/"?this.request.base_path:"")+a})};return b}();String.prototype.rpad=function(b){return b.substr(0,b.length-this.length)+this};String.prototype.lpad=function(b){return this+b.substr(0,b.length-this.length)};
ClientExpress.utils=function(){var b=Array.prototype.every?function(a,b,e){return a.every(b,e)}:function(a,b,e){if(a===void 0||a===null)throw new TypeError;var a=Object(a),f=a.length>>>0;if(typeof b!=="function")throw new TypeError;for(var d=0;d<f;d++)if(d in a&&!b.call(e,a[d],d,a))return!1;return!0},a=Array.prototype.forEach?function(a,b,e){return a.forEach(b,e)}:function(a,b,e){if(a===void 0||a===null)throw new TypeError;var a=Object(a),f=a.length>>>0;if(typeof b!=="function")throw new TypeError;
for(var d=0;d<f;d++)d in a&&b.call(e,a[d],d,a)},f=Array.prototype.filter?function(a,b,e){return a.filter(b,e)}:function(a,b,e){if(a===void 0||a===null)throw new TypeError;var a=Object(a),d=a.length>>>0;if(typeof b!=="function")throw new TypeError;for(var f=[],h=0;h<d;h++)if(h in a){var i=a[h];b.call(e,i,h,a)&&f.push(i)}return f},d=Array.prototype.map?function(a,b,e){return a.map(b,e)}:function(a,b,e){if(a===void 0||a===null)throw new TypeError;var a=Object(a),d=a.length>>>0;if(typeof b!=="function")throw new TypeError;
for(var f=Array(d),h=0;h<d;h++)h in a&&(f[h]=b.call(e,a[h],h,a));return f};if(!Array.prototype.sortByName)Array.prototype.sortByName=function(a){if(this===void 0||this===null)throw new TypeError;if(typeof a!=="string")throw new TypeError;return this.sort(function(b,e){var d=(b[a]instanceof RegExp?b[a].source:b[a]).toLowerCase(),f=(e[a]instanceof RegExp?e[a].source:e[a]).toLowerCase();return d<f?-1:d>f?1:0})};return{every:b,forEach:a,filter:f,map:d,toArray:function(a,b){return Array.prototype.slice.call(a,
b||0)},serializeArray:function(a){for(var b="",a=a.getElementsByTagName("*"),e=0;e<a.length;e++){var d=a[e];if(!d.disabled&&d.name&&d.name.length>0)switch(d.tagName.toLowerCase()){case "input":switch(d.type){case "checkbox":case "radio":d.checked&&(b.length>0&&(b+="&"),b+=d.name+"="+encodeURIComponent(d.value));break;case "hidden":case "password":case "text":b.length>0&&(b+="&"),b+=d.name+"="+encodeURIComponent(d.value)}break;case "select":case "textarea":b.length>0&&(b+="&"),b+=d.name+"="+encodeURIComponent(d.value)}}return b},
objectIterator:function(a,b){for(var d in a)callBackValue={isFunction:a[d]instanceof Function,name:d,value:a[d]},b(callBackValue)}}}();
ClientExpress.onDomReady=function(b,a){var f=function(a){if((a=a||window.event)&&a.type&&/DOMContentLoaded|load/.test(a.type))d();else if(document.readyState)if(/loaded|complete/.test(g.readyState))d();else if(document.documentElement.doScroll){try{e||document.documentElement.doScroll("left")}catch(b){return}d()}},d=function(){if(!e){e=!0;for(var a=0,b=j.length;a<b;a++)j[a][0].call(j[a][1]);document.removeEventListener&&document.removeEventListener("DOMContentLoaded",f,!1);clearInterval(c);document.onreadystatechange=
window.onload=c=null}},c,g=window.document,e=!1,k=!1,j=[],a=a||window;if(e)b.call(a);else{if(!k)k=!0,document.addEventListener&&document.addEventListener("DOMContentLoaded",f,!1),c=setInterval(f,5),document.onreadystatechange=window.onload=f;j.push([b,a])}};
function require_override(b){function a(){if(typeof XMLHttpRequest!="undefined")return new XMLHttpRequest;else if(window.ActiveXObject)for(var a=["Microsoft.XmlHttp","MSXML2.XmlHttp","MSXML2.XmlHttp.3.0","MSXML2.XmlHttp.4.0","MSXML2.XmlHttp.5.0"],b=a.length-1;b>=0;b--)try{return httpObj=new ActiveXObject(a[b])}catch(c){}throw Error("XMLHttp (AJAX) not supported");}var f=a(),d=require.resolve(b),f=require.modules[d];if(!f){var c,f=a();f.open("GET",d+".js",!1);f.onreadystatechange=function(){this.readyState==
4&&this.status==200&&(c={},(new Function("exports",this.responseText))(c),require.modules[d+".js"]={exports:c})};f.send();if(c!=null)return c;throw Error('failed to require "'+b+'"');}if(!f.exports)f.exports={},f.call(f.exports,f,f.exports,require.relative(d));return f.exports}require_override.modules={};require_override.resolve=function(b){var a=b+".js",f=b+"/index.js";return require.modules[a]&&a||require.modules[f]&&f||b};require_override.register=function(b,a){require.modules[b]=a};
require_override.relative=function(b){return function(a){if("."!=a[0])return require(a);var f=b.split("/"),a=a.split("/");f.pop();for(var d=0;d<a.length;d++){var c=a[d];".."==c?f.pop():"."!=c&&f.push(c)}return require(f.join("/"))}};if(typeof require!="undefined"){var modules=require.modules;require=require_override;require.modules=modules}else require=require_override;
require.register("express.js",function(b,a){a.version="0.7.6";a.createServer=function(){return ClientExpress.createServer()};a.logger=function(){return ClientExpress.logger()};a.setTitle=function(a){return ClientExpress.setTitle(a)};a.googleAnalytics=function(){return ClientExpress.googleAnalytics()};a.setContentElement=function(a){return ClientExpress.setContentElement(a)};a.methodOverride=function(){return function(){}};a.bodyParser=function(){return function(){}};a.cookieParser=function(){return function(){}};
a.session=function(){return function(){}};a["static"]=function(){return function(){}};a.errorHandler=function(){return function(){}}});require.register("clientexpress.js",function(b,a){a.attach=function(){}});
