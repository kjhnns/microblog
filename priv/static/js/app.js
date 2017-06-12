!function(){"use strict";var e="undefined"==typeof window?global:window;if("function"!=typeof e.require){var t={},n={},i={},o={}.hasOwnProperty,r=/^\.\.?(\/|$)/,s=function(e,t){for(var n,i=[],o=(r.test(t)?e+"/"+t:t).split("/"),s=0,u=o.length;s<u;s++)n=o[s],".."===n?i.pop():"."!==n&&""!==n&&i.push(n);return i.join("/")},u=function(e){return e.split("/").slice(0,-1).join("/")},a=function(t){return function(n){var i=s(u(t),n);return e.require(i,t)}},c=function(e,t){var i=null;i=m&&m.createHot(e);var o={id:e,exports:{},hot:i};return n[e]=o,t(o.exports,a(e),o),o.exports},h=function(e){return i[e]?h(i[e]):e},l=function(e,t){return h(s(u(e),t))},f=function(e,i){null==i&&(i="/");var r=h(e);if(o.call(n,r))return n[r].exports;if(o.call(t,r))return c(r,t[r]);throw new Error("Cannot find module '"+e+"' from '"+i+"'")};f.alias=function(e,t){i[t]=e};var p=/\.[^.\/]+$/,v=/\/index(\.[^\/]+)?$/,d=function(e){if(p.test(e)){var t=e.replace(p,"");o.call(i,t)&&i[t].replace(p,"")!==t+"/index"||(i[t]=e)}if(v.test(e)){var n=e.replace(v,"");o.call(i,n)||(i[n]=e)}};f.register=f.define=function(e,i){if("object"==typeof e)for(var r in e)o.call(e,r)&&f.register(r,e[r]);else t[e]=i,delete n[e],d(e)},f.list=function(){var e=[];for(var n in t)o.call(t,n)&&e.push(n);return e};var m=e._hmr&&new e._hmr(l,f,t,n);f._cache=n,f.hmr=m&&m.wrap,f.brunch=!0,e.require=f}}(),function(){var e=(window,function(e,t,n){var i={},o=function(t,n){var r;try{return r=e(n+"/node_modules/"+t)}catch(s){if(s.toString().indexOf("Cannot find module")===-1)throw s;if(n.indexOf("node_modules")!==-1){var u=n.split("/"),a=u.lastIndexOf("node_modules"),c=u.slice(0,a).join("/");return o(t,c)}}return i};return function(r){if(r in t&&(r=t[r]),r){if("."!==r[0]&&n){var s=o(r,n);if(s!==i)return s}return e(r)}}});require.register("phoenix/priv/static/phoenix.js",function(t,n,i){n=e(n,{},"phoenix"),function(){!function(e){"use strict";function t(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();Object.defineProperty(e,"__esModule",{value:!0});var r="1.0.0",s={connecting:0,open:1,closing:2,closed:3},u=1e4,a={closed:"closed",errored:"errored",joined:"joined",joining:"joining",leaving:"leaving"},c={close:"phx_close",error:"phx_error",join:"phx_join",reply:"phx_reply",leave:"phx_leave"},h={longpoll:"longpoll",websocket:"websocket"},l=function(){function e(t,i,o,r){n(this,e),this.channel=t,this.event=i,this.payload=o||{},this.receivedResp=null,this.timeout=r,this.timeoutTimer=null,this.recHooks=[],this.sent=!1}return o(e,[{key:"resend",value:function(e){this.timeout=e,this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1,this.send()}},{key:"send",value:function(){this.hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload,ref:this.ref}))}},{key:"receive",value:function(e,t){return this.hasReceived(e)&&t(this.receivedResp.response),this.recHooks.push({status:e,callback:t}),this}},{key:"matchReceive",value:function(e){var t=e.status,n=e.response;e.ref;this.recHooks.filter(function(e){return e.status===t}).forEach(function(e){return e.callback(n)})}},{key:"cancelRefEvent",value:function(){this.refEvent&&this.channel.off(this.refEvent)}},{key:"cancelTimeout",value:function(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}},{key:"startTimeout",value:function(){var e=this;this.timeoutTimer||(this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,function(t){e.cancelRefEvent(),e.cancelTimeout(),e.receivedResp=t,e.matchReceive(t)}),this.timeoutTimer=setTimeout(function(){e.trigger("timeout",{})},this.timeout))}},{key:"hasReceived",value:function(e){return this.receivedResp&&this.receivedResp.status===e}},{key:"trigger",value:function(e,t){this.channel.trigger(this.refEvent,{status:e,response:t})}}]),e}(),f=e.Channel=function(){function e(t,i,o){var r=this;n(this,e),this.state=a.closed,this.topic=t,this.params=i||{},this.socket=o,this.bindings=[],this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new l(this,c.join,this.params,this.timeout),this.pushBuffer=[],this.rejoinTimer=new d(function(){return r.rejoinUntilConnected()},this.socket.reconnectAfterMs),this.joinPush.receive("ok",function(){r.state=a.joined,r.rejoinTimer.reset(),r.pushBuffer.forEach(function(e){return e.send()}),r.pushBuffer=[]}),this.onClose(function(){r.rejoinTimer.reset(),r.socket.log("channel","close "+r.topic+" "+r.joinRef()),r.state=a.closed,r.socket.remove(r)}),this.onError(function(e){r.isLeaving()||r.isClosed()||(r.socket.log("channel","error "+r.topic,e),r.state=a.errored,r.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("timeout",function(){r.isJoining()&&(r.socket.log("channel","timeout "+r.topic,r.joinPush.timeout),r.state=a.errored,r.rejoinTimer.scheduleTimeout())}),this.on(c.reply,function(e,t){r.trigger(r.replyEventName(t),e)})}return o(e,[{key:"rejoinUntilConnected",value:function(){this.rejoinTimer.scheduleTimeout(),this.socket.isConnected()&&this.rejoin()}},{key:"join",value:function(){var e=arguments.length<=0||void 0===arguments[0]?this.timeout:arguments[0];if(this.joinedOnce)throw"tried to join multiple times. 'join' can only be called a single time per channel instance";return this.joinedOnce=!0,this.rejoin(e),this.joinPush}},{key:"onClose",value:function(e){this.on(c.close,e)}},{key:"onError",value:function(e){this.on(c.error,function(t){return e(t)})}},{key:"on",value:function(e,t){this.bindings.push({event:e,callback:t})}},{key:"off",value:function(e){this.bindings=this.bindings.filter(function(t){return t.event!==e})}},{key:"canPush",value:function(){return this.socket.isConnected()&&this.isJoined()}},{key:"push",value:function(e,t){var n=arguments.length<=2||void 0===arguments[2]?this.timeout:arguments[2];if(!this.joinedOnce)throw"tried to push '"+e+"' to '"+this.topic+"' before joining. Use channel.join() before pushing events";var i=new l(this,e,t,n);return this.canPush()?i.send():(i.startTimeout(),this.pushBuffer.push(i)),i}},{key:"leave",value:function(){var e=this,t=arguments.length<=0||void 0===arguments[0]?this.timeout:arguments[0];this.state=a.leaving;var n=function(){e.socket.log("channel","leave "+e.topic),e.trigger(c.close,"leave",e.joinRef())},i=new l(this,c.leave,{},t);return i.receive("ok",function(){return n()}).receive("timeout",function(){return n()}),i.send(),this.canPush()||i.trigger("ok",{}),i}},{key:"onMessage",value:function(e,t,n){return t}},{key:"isMember",value:function(e){return this.topic===e}},{key:"joinRef",value:function(){return this.joinPush.ref}},{key:"sendJoin",value:function(e){this.state=a.joining,this.joinPush.resend(e)}},{key:"rejoin",value:function(){var e=arguments.length<=0||void 0===arguments[0]?this.timeout:arguments[0];this.isLeaving()||this.sendJoin(e)}},{key:"trigger",value:function(e,t,n){var i=c.close,o=c.error,r=c.leave,s=c.join;if(!(n&&[i,o,r,s].indexOf(e)>=0&&n!==this.joinRef())){var u=this.onMessage(e,t,n);if(t&&!u)throw"channel onMessage callbacks must return the payload, modified or unmodified";this.bindings.filter(function(t){return t.event===e}).map(function(e){return e.callback(u,n)})}}},{key:"replyEventName",value:function(e){return"chan_reply_"+e}},{key:"isClosed",value:function(){return this.state===a.closed}},{key:"isErrored",value:function(){return this.state===a.errored}},{key:"isJoined",value:function(){return this.state===a.joined}},{key:"isJoining",value:function(){return this.state===a.joining}},{key:"isLeaving",value:function(){return this.state===a.leaving}}]),e}(),p=(e.Socket=function(){function e(t){var i=this,o=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];n(this,e),this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.timeout=o.timeout||u,this.transport=o.transport||window.WebSocket||p,this.heartbeatIntervalMs=o.heartbeatIntervalMs||3e4,this.reconnectAfterMs=o.reconnectAfterMs||function(e){return[1e3,2e3,5e3,1e4][e-1]||1e4},this.logger=o.logger||function(){},this.longpollerTimeout=o.longpollerTimeout||2e4,this.params=o.params||{},this.endPoint=t+"/"+h.websocket,this.reconnectTimer=new d(function(){i.disconnect(function(){return i.connect()})},this.reconnectAfterMs)}return o(e,[{key:"protocol",value:function(){return location.protocol.match(/^https/)?"wss":"ws"}},{key:"endPointURL",value:function(){var e=v.appendParams(v.appendParams(this.endPoint,this.params),{vsn:r});return"/"!==e.charAt(0)?e:"/"===e.charAt(1)?this.protocol()+":"+e:this.protocol()+"://"+location.host+e}},{key:"disconnect",value:function(e,t,n){this.conn&&(this.conn.onclose=function(){},t?this.conn.close(t,n||""):this.conn.close(),this.conn=null),e&&e()}},{key:"connect",value:function(e){var t=this;e&&(console&&console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"),this.params=e),this.conn||(this.conn=new this.transport(this.endPointURL()),this.conn.timeout=this.longpollerTimeout,this.conn.onopen=function(){return t.onConnOpen()},this.conn.onerror=function(e){return t.onConnError(e)},this.conn.onmessage=function(e){return t.onConnMessage(e)},this.conn.onclose=function(e){return t.onConnClose(e)})}},{key:"log",value:function(e,t,n){this.logger(e,t,n)}},{key:"onOpen",value:function(e){this.stateChangeCallbacks.open.push(e)}},{key:"onClose",value:function(e){this.stateChangeCallbacks.close.push(e)}},{key:"onError",value:function(e){this.stateChangeCallbacks.error.push(e)}},{key:"onMessage",value:function(e){this.stateChangeCallbacks.message.push(e)}},{key:"onConnOpen",value:function(){var e=this;this.log("transport","connected to "+this.endPointURL(),this.transport.prototype),this.flushSendBuffer(),this.reconnectTimer.reset(),this.conn.skipHeartbeat||(clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(function(){return e.sendHeartbeat()},this.heartbeatIntervalMs)),this.stateChangeCallbacks.open.forEach(function(e){return e()})}},{key:"onConnClose",value:function(e){this.log("transport","close",e),this.triggerChanError(),clearInterval(this.heartbeatTimer),this.reconnectTimer.scheduleTimeout(),this.stateChangeCallbacks.close.forEach(function(t){return t(e)})}},{key:"onConnError",value:function(e){this.log("transport",e),this.triggerChanError(),this.stateChangeCallbacks.error.forEach(function(t){return t(e)})}},{key:"triggerChanError",value:function(){this.channels.forEach(function(e){return e.trigger(c.error)})}},{key:"connectionState",value:function(){switch(this.conn&&this.conn.readyState){case s.connecting:return"connecting";case s.open:return"open";case s.closing:return"closing";default:return"closed"}}},{key:"isConnected",value:function(){return"open"===this.connectionState()}},{key:"remove",value:function(e){this.channels=this.channels.filter(function(t){return t.joinRef()!==e.joinRef()})}},{key:"channel",value:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],n=new f(e,t,this);return this.channels.push(n),n}},{key:"push",value:function(e){var t=this,n=e.topic,i=e.event,o=e.payload,r=e.ref,s=function(){return t.conn.send(JSON.stringify(e))};this.log("push",n+" "+i+" ("+r+")",o),this.isConnected()?s():this.sendBuffer.push(s)}},{key:"makeRef",value:function(){var e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}},{key:"sendHeartbeat",value:function(){this.isConnected()&&this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.makeRef()})}},{key:"flushSendBuffer",value:function(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(function(e){return e()}),this.sendBuffer=[])}},{key:"onConnMessage",value:function(e){var t=JSON.parse(e.data),n=t.topic,i=t.event,o=t.payload,r=t.ref;this.log("receive",(o.status||"")+" "+n+" "+i+" "+(r&&"("+r+")"||""),o),this.channels.filter(function(e){return e.isMember(n)}).forEach(function(e){return e.trigger(i,o,r)}),this.stateChangeCallbacks.message.forEach(function(e){return e(t)})}}]),e}(),e.LongPoll=function(){function e(t){n(this,e),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(t),this.readyState=s.connecting,this.poll()}return o(e,[{key:"normalizeEndpoint",value:function(e){return e.replace("ws://","http://").replace("wss://","https://").replace(new RegExp("(.*)/"+h.websocket),"$1/"+h.longpoll)}},{key:"endpointURL",value:function(){return v.appendParams(this.pollEndpoint,{token:this.token})}},{key:"closeAndRetry",value:function(){this.close(),this.readyState=s.connecting}},{key:"ontimeout",value:function(){this.onerror("timeout"),this.closeAndRetry()}},{key:"poll",value:function(){var e=this;this.readyState!==s.open&&this.readyState!==s.connecting||v.request("GET",this.endpointURL(),"application/json",null,this.timeout,this.ontimeout.bind(this),function(t){if(t){var n=t.status,i=t.token,o=t.messages;e.token=i}else var n=0;switch(n){case 200:o.forEach(function(t){return e.onmessage({data:JSON.stringify(t)})}),e.poll();break;case 204:e.poll();break;case 410:e.readyState=s.open,e.onopen(),e.poll();break;case 0:case 500:e.onerror(),e.closeAndRetry();break;default:throw"unhandled poll status "+n}})}},{key:"send",value:function(e){var t=this;v.request("POST",this.endpointURL(),"application/json",e,this.timeout,this.onerror.bind(this,"timeout"),function(e){e&&200===e.status||(t.onerror(status),t.closeAndRetry())})}},{key:"close",value:function(e,t){this.readyState=s.closed,this.onclose()}}]),e}()),v=e.Ajax=function(){function e(){n(this,e)}return o(e,null,[{key:"request",value:function(e,t,n,i,o,r,s){if(window.XDomainRequest){var u=new XDomainRequest;this.xdomainRequest(u,e,t,i,o,r,s)}else{var u=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");this.xhrRequest(u,e,t,n,i,o,r,s)}}},{key:"xdomainRequest",value:function(e,t,n,i,o,r,s){var u=this;e.timeout=o,e.open(t,n),e.onload=function(){var t=u.parseJSON(e.responseText);s&&s(t)},r&&(e.ontimeout=r),e.onprogress=function(){},e.send(i)}},{key:"xhrRequest",value:function(e,t,n,i,o,r,s,u){var a=this;e.timeout=r,e.open(t,n,!0),e.setRequestHeader("Content-Type",i),e.onerror=function(){u&&u(null)},e.onreadystatechange=function(){if(e.readyState===a.states.complete&&u){var t=a.parseJSON(e.responseText);u(t)}},s&&(e.ontimeout=s),e.send(o)}},{key:"parseJSON",value:function(e){return e&&""!==e?JSON.parse(e):null}},{key:"serialize",value:function(e,t){var n=[];for(var o in e)if(e.hasOwnProperty(o)){var r=t?t+"["+o+"]":o,s=e[o];"object"===("undefined"==typeof s?"undefined":i(s))?n.push(this.serialize(s,r)):n.push(encodeURIComponent(r)+"="+encodeURIComponent(s))}return n.join("&")}},{key:"appendParams",value:function(e,t){if(0===Object.keys(t).length)return e;var n=e.match(/\?/)?"&":"?";return""+e+n+this.serialize(t)}}]),e}();v.states={complete:4};var d=(e.Presence={syncState:function(e,t,n,i){var o=this,r=this.clone(e),s={},u={};return this.map(r,function(e,n){t[e]||(u[e]=n)}),this.map(t,function(e,t){var n=r[e];n?!function(){var i=t.metas.map(function(e){return e.phx_ref}),r=n.metas.map(function(e){return e.phx_ref}),a=t.metas.filter(function(e){return r.indexOf(e.phx_ref)<0}),c=n.metas.filter(function(e){return i.indexOf(e.phx_ref)<0});a.length>0&&(s[e]=t,s[e].metas=a),c.length>0&&(u[e]=o.clone(n),u[e].metas=c)}():s[e]=t}),this.syncDiff(r,{joins:s,leaves:u},n,i)},syncDiff:function(e,n,i,o){var r=n.joins,s=n.leaves,u=this.clone(e);return i||(i=function(){}),o||(o=function(){}),this.map(r,function(e,n){var o=u[e];if(u[e]=n,o){var r;(r=u[e].metas).unshift.apply(r,t(o.metas))}i(e,o,n)}),this.map(s,function(e,t){var n=u[e];if(n){var i=t.metas.map(function(e){return e.phx_ref});n.metas=n.metas.filter(function(e){return i.indexOf(e.phx_ref)<0}),o(e,n,t),0===n.metas.length&&delete u[e]}}),u},list:function(e,t){return t||(t=function(e,t){return t}),this.map(e,function(e,n){return t(e,n)})},map:function(e,t){return Object.getOwnPropertyNames(e).map(function(n){return t(n,e[n])})},clone:function(e){return JSON.parse(JSON.stringify(e))}},function(){function e(t,i){n(this,e),this.callback=t,this.timerCalc=i,this.timer=null,this.tries=0}return o(e,[{key:"reset",value:function(){this.tries=0,clearTimeout(this.timer)}},{key:"scheduleTimeout",value:function(){var e=this;clearTimeout(this.timer),this.timer=setTimeout(function(){e.tries=e.tries+1,e.callback()},this.timerCalc(this.tries+1))}}]),e}())}("undefined"==typeof t?window.Phoenix=window.Phoenix||{}:t)}()}),require.register("phoenix_html/priv/static/phoenix_html.js",function(t,n,i){n=e(n,{},"phoenix_html"),function(){"use strict";function e(e){var t="A"===e.tagName,n="parent"===e.getAttribute("data-submit");return t&&n}function t(e){for(;e&&e!==document&&e.nodeType===Node.ELEMENT_NODE;){if("FORM"===e.tagName)return e;e=e.parentNode}return null}function n(n){for(;n&&n.getAttribute;){if(e(n)){var i=n.getAttribute("data-confirm");return(null===i||confirm(i))&&t(n).submit(),!0}n=n.parentNode}return!1}window.addEventListener("click",function(e){if(e.target&&n(e.target))return e.preventDefault(),!1},!1)}()}),require.register("elm/src/Main.elm",function(e,t,n){}),require.register("web/static/js/app.js",function(e,t,n){"use strict";t("phoenix_html")}),require.register("web/static/js/socket.js",function(e,t,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=t("phoenix"),o=new i.Socket("/socket",{params:{token:window.userToken}});o.connect();var r=o.channel("topic:subtopic",{});r.join().receive("ok",function(e){console.log("Joined successfully",e)}).receive("error",function(e){console.log("Unable to join",e)}),e["default"]=o}),require.alias("phoenix_html/priv/static/phoenix_html.js","phoenix_html"),require.alias("phoenix/priv/static/phoenix.js","phoenix"),require.register("___globals___",function(e,t,n){})}(),require("___globals___"),require("web/static/js/app");