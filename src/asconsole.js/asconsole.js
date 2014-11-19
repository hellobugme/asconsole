/*
 * asconsole v1.0.0
 * http://hellobug.me
 * https://github.com/hellobugme/asconsole
 *
 * Copyright 2014, KainanHong
 * Released under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Date: Sat Nov 08, 2014
 */

var asconsole = window.asconsole || {};
asconsole.isAsReady = false;
asconsole.todoList = [];
asconsole.setMoviePath = function(path){
	AsConsole.moviePath = path;
};
asconsole.init = function(container, movieWidth, movieHeight){
    asconsole.client = new AsConsole(container, movieWidth, movieHeight);
    asconsole.client.init();
};
asconsole.log = function(){
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["log"].concat(argArr));
};
asconsole.logObject = function(){
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["logObject"].concat(argArr));
};
asconsole.info = function(){
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["info"].concat(argArr));
};
asconsole.error = function(){
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["error"].concat(argArr));
};
asconsole.warn = function(){
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["warn"].concat(argArr));
};
asconsole.group = function(groupName){
    asconsole.callAsConsole("group", groupName);
};
asconsole.groupEnd = function(){
    asconsole.callAsConsole("groupEnd");
};
asconsole.clear = function(){
    asconsole.callAsConsole("clear");
};
asconsole.table = function(){
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["table"].concat(argArr));
};
asconsole.logObjectAsString = function(){
    for(var i=0,len=arguments.length; i<len; i++){
        arguments[i] = asconsole.obj2string(arguments[i]);
    }
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["log"].concat(argArr));
};

asconsole.callAsConsole = function(){
    if(!asconsole.isAsReady){
        asconsole.todoList.push(arguments);
        return;
    }

    asconsole.fixFlash();

    arguments = Array.prototype.slice.call(arguments);
    var command = arguments.splice(0,1)[0];
    if(arguments.length===0){
        asconsole.client.movieHandle.callAsConsole(command);
        return;
    }
    
    var argumentsStr = "";
    for(var i=0,len=arguments.length; i<len; i++){
        argumentsStr += ", arguments[" + i + "]";
    }
    eval("asconsole.client.movieHandle.callAsConsole(command" + argumentsStr + ");");
};
asconsole.obj2string = function(o){
    if(!o) return o;

    var r=[];
    if(typeof o=="string"){
        return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t")+"\"";
    }
    if(typeof o=="object"){
        if(!o.sort){
            for(var i in o){
                r.push(i+":"+asconsole.obj2string(o[i]));
            }
            if(!!document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){
                r.push("toString:"+o.toString.toString());
            }
            r="{"+r.join()+"}";
        }else{
            for(var i=0;i<o.length;i++){
                r.push(asconsole.obj2string(o[i]))
            }
            r="["+r.join()+"]";
        }
        return r;
    }
    return o.toString();
};
asconsole.isArray = function(obj) {  
    return Object.prototype.toString.call(obj) === "[object Array]";   
};

asconsole.asReady = function(){
    asconsole.isAsReady = true;
    for(var i=0,len=asconsole.todoList.length; i<len; i++){
        asconsole.callAsConsole.apply(null, asconsole.todoList[i]);
    }
    asconsole.todoList.length = 0;
};


// AsConsole
var AsConsole = function(container, movieWidth, movieHeight){
    if (typeof AsConsole.instance === "object") {
        return AsConsole.instance;
    }

    this.moviePath = AsConsole.moviePath;
    this.movieId = "asconsole_" + AsConsole.instanceCounter;
    this.movieHandle = null;
    this.container = container || document.getElementsByTagName("body")[0];
    this.movieWidth = movieWidth || 0;
    this.movieHeight = movieHeight || 0;
    this.inited = false;

    AsConsole.instanceCounter ++;

    AsConsole.instance = this;
};

AsConsole.moviePath = "asconsole.js.swf";
AsConsole.instanceCounter = 0;

AsConsole.prototype = {
    version: "1.0.0",
    init: function(){
        if(this.inited) {
            return;
        }
        this.inited = true;
        this.div = document.createElement("div");
        var style = this.div.style;
        style.position = "absolute";
        this.container.appendChild(this.div);
        this.div.innerHTML = this.getHTML();
        this.movieHandle = this.getMovieHandle();
    },
    getHTML: function(){
        // return HTML for movie
        var html = '';
        var flashvars = 'id=' + this.movieId + '&width=' + this.movieWidth + '&height=' + this.movieHeight;

        if (navigator.userAgent.match(/MSIE/)) {
            // IE gets an OBJECT tag
            var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
            html = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + protocol + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + this.movieWidth + '" height="' + this.movieHeight + '" id="' + this.movieId + '" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + this.moviePath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + flashvars + '"/><param name="wmode" value="transparent"/></object>';
        } else if(window.ActiveXObject !== undefined) {
            // still IE...
            html = '<embed id="' + this.movieId + '" src="' + this.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + this.movieWidth + '" height="' + this.movieHeight + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
        } else {
            // all other browsers get an EMBED tag
            html = '<object id="' + this.movieId + '" name="' + this.movieId + '" type="application/x-shockwave-flash" data="' + this.moviePath + '" width="' + this.movieWidth + '" height="' + this.movieHeight + '"><param name="movie" value="' + this.moviePath + '"><param name="quality" value="low"><param name="allowScriptAccess" value="always" /><embed src="' + this.moviePath + '" name="' + this.movieId + '" id="' + this.movieId + '" quality="low" allowScriptAccess="always" swLiveConnect="true" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"  width="' + this.movieWidth + '" height="' + this.movieHeight + '" /></object>';
        }
        return html;
    },
    getMovieHandle: function() {
        var obj = null;
        if (window.document[this.movieId]) {
            obj = window.document[this.movieId];
        } else if (navigator.appName.indexOf("Microsoft") == -1) {
            if (document.embeds && document.embeds[this.movieId]) {
                obj = document.embeds[this.movieId];
            } else {
                obj = document.getElementById(this.movieId);
            }
        }
        if(obj.length && obj[0]){
            obj = obj[0];
        }
        return obj;
    }
};

//=========================================================
asconsole.isFixedFlash = false;
asconsole.debug = false;
asconsole.fixFlash = function() {
    if(asconsole.isFixedFlash) {
        return;
    }
    if(asconsole.debug) {
        console.log("flash fixed");
    }
    asconsole.isFixedFlash = true;

    window.__flash__functionToXML = function(obj, prop) {
        if(!prop){
            return __flash__toXML(asconsole.obj2string(obj));
        }
        var s = "<object>";
        s += "<property id=\"__type__\">" + __flash__toXML("function") + "</property>";
        s += "<property id=\"code\">" + __flash__toXML(asconsole.obj2string(obj)) + "</property>";
        return s + "</object>";
    };

    window.__flash__arrayToXML = function(obj) {
        if(asconsole.debug) {
            console.group("__flash__arrayToXML");
            console.log("[arguments obj]", obj);
            console.groupEnd();
        }
        var s = "<array>";
        for (var i=0; i<obj.length; i++) {
            s += "<property id=\"" + i + "\">" + __flash__toXML(obj[i]) + "</property>";
        }
        if(asconsole.debug) {
            console.group("__flash__arrayToXML");
            console.log("[return]", s+"</array>");
            console.groupEnd();
        }
        return s+"</array>";
    };

    window.__flash__argumentsToXML = function(obj,index) {
        if(asconsole.debug) {
            console.group("__flash__argumentsToXML");
            console.log("[arguments obj]", obj);
            console.log("[arguments index]", index);
            console.groupEnd();
        }
        var s = "<arguments>";
        for (var i=index; i<obj.length; i++) {
            s += __flash__toXML(obj[i]);
        }
        if(asconsole.debug) {
            console.group("__flash__argumentsToXML");
            console.log("[return]", s+"</arguments>");
            console.groupEnd();
        }
        return s+"</arguments>";
    };

    window.__flash__objectToXML = function(obj) {
        if(asconsole.debug) {
            console.group("__flash__objectToXML");
            console.log("[arguments obj]", obj);
            console.groupEnd();
        }

        var s = "<object>";
        for (var prop in obj) {
            s += "<property id=\"" + prop + "\">" + __flash__toXML(obj[prop], prop) + "</property>";
        }
        if(asconsole.debug) {
            console.group("__flash__objectToXML");
            console.log("[return]", s+"</object>");
            console.groupEnd();
        }
        return s+"</object>";
    };

    window.__flash__escapeXML = function(s) {
        if(asconsole.debug) console.log("%c__flash__escapeXML", "font-weight: bold;");
        return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    };

    window.__flash__toXML = function(value, prop) {
        if(asconsole.debug) {
            console.group("__flash__toXML");
            console.log("[arguments value]", value);
            console.groupEnd();
        }
        var type = typeof(value);
        if (type == "string") {
            return "<string>" + __flash__escapeXML(value) + "</string>";
        } else if (type == "undefined") {
            return "<undefined/>";
        } else if (type == "number") {
            return "<number>" + value + "</number>";
        } else if (value == null) {
            return "<null/>";
        } else if (type == "boolean") {
            return value ? "<true/>" : "<false/>";
        } else if (type == "function") {
            return __flash__functionToXML(value, prop);
        } else if (value instanceof Date) {
            return "<date>" + value.getTime() + "</date>";
        } else if (value instanceof Array) {
            return __flash__arrayToXML(value);
        } else if (type == "object") {
            // 处理jQuery对象
            if(value instanceof jQuery) {
                return __flash__arrayToXML(value);
            }
            // 处理HTML对象
            var type = Object.prototype.toString.call(value);
            if(type === "[object HTMLDocument]") {
                value = "[AsconsoleObject HTMLElement]" + value.documentElement.outerHTML;
                value = value.replace("<html>", "<log_html>").replace("<html ", "<log_html ").replace("</html>", "</log_html>");
                value = value.replace("<head>", "<log_head>").replace("<head ", "<log_head ").replace("</head>", "</log_head>");
                value = value.replace("<body>", "<log_body>").replace("<body ", "<log_body ").replace("</body>", "</log_body>");
                return __flash__toXML(value);
            } else if(type.indexOf("HTML") && value["outerHTML"]) {
                value = "[AsconsoleObject HTMLElement]" + value.outerHTML;
                return __flash__toXML(value);
            }

            return __flash__objectToXML(value);
        } else {
            return "<null/>"; //???
        }
    };
    window.__flash__request = function(name) {
        if(asconsole.debug) {
            console.group("__flash__request");
            console.log("[arguments name]", name);
            console.groupEnd();
        }
        var ret = "<invoke name=\""+name+"\" returntype=\"javascript\">" + __flash__argumentsToXML(arguments,1) + "</invoke>";
        if(asconsole.debug) {
            console.group("__flash__request");
            console.log("[return]", ret);
            console.groupEnd();
        }
        return ret;
    };
    window.__flash__addCallback = function(instance, name) {
        if(asconsole.debug) {
            console.group("__flash__addCallback");
            console.log("[arguments instance]", instance);
            console.log("[arguments name]", name);
            console.groupEnd();
        }
        instance[name] = function () { 
            return eval(instance.CallFunction("<invoke name=\""+name+"\" returntype=\"javascript\">" + __flash__argumentsToXML(arguments,0) + "</invoke>"));
        };
    };
    window.__flash__removeCallback = function(instance, name) {
        if(asconsole.debug) {
            console.group("__flash__removeCallback");
            console.log("[arguments instance]", instance);
            console.log("[arguments name]", name);
            console.groupEnd();
        }
        instance[name] = null;
    };
};