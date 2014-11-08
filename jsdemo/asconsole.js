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
asconsole.init = function(container, width, height){
    asconsole.client = new AsConsole(container, width, width);
    asconsole.client.init();
};
asconsole.log = function(){
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["log"].concat(argArr));
};
asconsole.info = function(){
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["info"].concat(argArr));
}
asconsole.error = function(){
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["error"].concat(argArr));
}
asconsole.warn = function(){
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["warn"].concat(argArr));
}
asconsole.group = function(groupName){
    asconsole.callAsConsole("group", groupName);
}
asconsole.groupEnd = function(){
    asconsole.callAsConsole("groupEnd");
}
asconsole.clear = function(){
    asconsole.callAsConsole("clear");
}
asconsole.table = function(){
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["table"].concat(argArr));
}
asconsole.logObjectAsString = function(){
    for(var i=0,len=arguments.length; i<len; i++){
        arguments[i] = asconsole.obj2string(arguments[i]);
    }
    var argArr = Array.prototype.slice.call(arguments);
    asconsole.callAsConsole.apply(null, ["log"].concat(argArr));
}

asconsole.callAsConsole = function(){
    if(!asconsole.isAsReady){
        asconsole.todoList.push(arguments);
        return;
    }

    arguments = Array.prototype.slice.call(arguments);
    var command = arguments.splice(0,1)[0];
    if(arguments.length===0){
        asconsole.client.movieHandle.callAsConsole(command);
        return;
    }
    
    var arg, isDocument, isHTMLElement;
    for(var i=0,len=arguments.length; i<len; i++){
        arg = arguments[i];
        isHTMLElement = false;
        if(typeof(arg)==="object"){
            isHTMLElement = arg.toString().indexOf("HTML") !== -1;
            if(isHTMLElement){
                command = "logHTMLElement";
                isDocument = arg.toString().indexOf("HTMLDocument") !== -1;
                if(isDocument){
                    arg = arg.documentElement.outerHTML;
                } else {
                    arg = arg.outerHTML;
                }
                arg = arg.replace("<html>", "<log_html>").replace("<html ", "<log_html ").replace("</html>", "</log_html>");
                arg = arg.replace("<head>", "<log_head>").replace("<head ", "<log_head ").replace("</head>", "</log_head>");
                arg = arg.replace("<body>", "<log_body>").replace("<body ", "<log_body ").replace("</body>", "</log_body>");
            } else {
                if(command !== "table") {
                    command = "logObject";
                }
            }
        }
        if(typeof(arg) === "function"){
            arg = asconsole.obj2string(arg);
        }
        arguments[i] = arg;
    }

    var argumentsStr = "";
    for(var i=0,len=arguments.length; i<len; i++){
        argumentsStr += ", arguments[" + i + "]";
    }
    eval("asconsole.client.movieHandle.callAsConsole(command" + argumentsStr + ");");
}
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
}
asconsole.isArray = function(obj) {  
    return Object.prototype.toString.call(obj) === "[object Array]";   
}

asconsole.asReady = function(){
    asconsole.isAsReady = true;
    for(var i=0,len=asconsole.todoList.length; i<len; i++){
        asconsole.callAsConsole.apply(null, asconsole.todoList[i]);
    }
    asconsole.todoList.length = 0;
}


// AsConsole
var AsConsole = function(container, movieWidth, movieHeight){
    if (typeof AsConsole.instance === "object") {
        return AsConsole.instance;
    }

    this.moviePath = "asconsole.js.swf";
    this.movieId = "asconsole_" + AsConsole.instanceCounter;
    this.movieHandle = null;
    this.container = container || document.getElementsByTagName("body")[0];
    this.movieWidth = movieWidth || 0;
    this.movieHeight = movieHeight || 0;
    this.inited = false;

    AsConsole.instanceCounter ++;

    AsConsole.instance = this;
};

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
        } else {
            if(window.ActiveXObject !== undefined){
                // still IE
                html = '<embed id="' + this.movieId + '" src="' + this.moviePath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + this.movieWidth + '" height="' + this.movieHeight + '" name="' + this.movieId + '" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
            } else {
                // all other browsers get an EMBED tag
                html = '<object id="' + this.movieId + '" name="' + this.movieId + '" type="application/x-shockwave-flash" data="' + this.moviePath + '" width="' + this.movieWidth + '" height="' + this.movieHeight + '"><param name="movie" value="' + this.moviePath + '"><param name="quality" value="low"><param name="allowScriptAccess" value="always" /><embed src="' + this.moviePath + '" name="' + this.movieId + '" id="' + this.movieId + '" quality="low" allowScriptAccess="always" swLiveConnect="true" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"  width="' + this.movieWidth + '" height="' + this.movieHeight + '" /></object>';
            }
        }
        return html;
    },
    getMovieHandle: function() {
        if (window.document[this.movieId]) {
            return window.document[this.movieId];
        } else if (navigator.appName.indexOf("Microsoft") == -1) {
            if (document.embeds && document.embeds[this.movieId]) {
                return document.embeds[this.movieId];
            } else {
                return document.getElementById(this.movieId);
            }
        }
    }
};