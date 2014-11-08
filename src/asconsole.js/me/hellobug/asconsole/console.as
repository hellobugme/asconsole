package me.hellobug.asconsole
{
	import flash.net.LocalConnection;
	import flash.events.StatusEvent;

	public class console
	{
		// 打印DOM节点
		static public function logHTMLElement(...rest):void {
			callBrowser.apply(null, ["logHTMLElement"].concat(rest));
		}
		// 打印对象
		static public function logObject(...rest):void {
			callBrowser.apply(null, ["logObject"].concat(rest));
		}
		// 普通信息
		static public function log(...rest):void {
			callBrowser.apply(null, ["console.log"].concat(rest));
		}
		// 提示类信息
		static public function info(...rest):void {
			callBrowser.apply(null, ["console.info"].concat(rest));
		}
		// 错误信息
		static public function error(...rest):void {
			callBrowser.apply(null, ["console.error"].concat(rest));
		}
		// 警示信息
		static public function warn(...rest):void {
			callBrowser.apply(null, ["console.warn"].concat(rest));
		}
		// 开始分组
		static public function group(groupName:String):void {
			callBrowser.apply(null, ["console.group", groupName]);
		}
		// 结束分组
		static public function groupEnd():void {
			callBrowser("console.groupEnd");
		}
		// 清空控制台
		static public function clear():void {
			callBrowser("console.clear");
		}
		static public function table(...rest):void {
			callBrowser.apply(null, ["console.table"].concat(rest));
		}
		static public function callBrowser(command:String, ...rest):void
		{
			checkConn();
			rest = (["_asconsole","callBrowser",command]).concat(rest);
			conn.send.apply(null, rest);
		}

		static public function output(...rest):void {
			callFlash.apply(null, ["allOutput"].concat(rest));
		}
		static public function callFlash(methodName:String, ...rest):void
		{
			checkConn();
			rest = (["_asconsole", methodName]).concat(rest);
			conn.send.apply(null, rest);
		}

		static private var conn:LocalConnection;
		
		static private function checkConn():void
		{
			if (! conn)
			{
				conn = new LocalConnection();
				conn.addEventListener(StatusEvent.STATUS, onStatus);
				trace("domain : " + conn.domain);
			}
		}

		static private function onStatus(event:StatusEvent):void
		{
			switch (event.level)
			{
				case "status" :
					trace("send succeeded");
					break;
				case "error" :
					trace("send failed");
					break;
			}
		}

		public function console()
		{

		}

	}

}