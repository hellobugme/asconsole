package 
{
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	import flash.system.Security;
	import flash.utils.Timer;
	import flash.text.TextField;
	import flash.events.*;
	import flash.net.LocalConnection;
	import flash.text.TextFormat;

	public class AsConsoleMain extends Sprite
	{
		private var output_txt:TextField;

		public function AsConsoleMain()
		{
			stage.align = "TL";
			stage.scaleMode = "noScale";

			Security.allowDomain("*");

			output_txt = new TextField();
			output_txt.defaultTextFormat = new TextFormat("Arial",null,0xFFFFFF);
			output_txt.width = stage.stageWidth;
			output_txt.height = stage.stageHeight;
			output_txt.multiline = true;
			output_txt.wordWrap = true;
			addChild(output_txt);

			allOutput("v1");

			initToJs();
		}

		//================================================================================================================
		private var conn:LocalConnection;
		private var connectStatus:String = "disconnected";
		private function initLocalConnection():void
		{
			conn = new LocalConnection();
			conn.allowDomain("*");
			conn.allowDomain("localhost");
			conn.client = this;
		}
		public function connect():String
		{
			if (connectStatus !== "disconnected") return "Already connected.";
			if (! conn) initLocalConnection();
			connectStatus = "connecting";
			var msg:String;
			try {
				conn.connect("_asconsole");
				connectStatus = "connected";
				callBrowser("connectSuccess");
				msg = "LocalConnection connect, domain : " + conn.domain + ".";
			} catch (error:ArgumentError) {
				connectStatus = "disconnected";
				msg = "Can't connect...the connection name is already being used by another SWF."
			}
			allOutput(msg);
			return msg;
		}
		public function disconnect():String
		{
			if (connectStatus !== "connected") return "Already disconnected.";
			if (! conn) return "Already disconnected.";
			var msg:String;
			try {
				connectStatus = "disconnected";
				conn.close();
				msg = "LocalConnection disconnect.";
			} catch (error:ArgumentError) {
				connectStatus = "disconnected";
				msg = "LocalConnection close failed.";
			}
			allOutput(msg);
			return msg;
		}
		public function destroy():void 
		{
			if(!conn) return;
			disconnect();
			conn.client = null;
			conn = null;
		}

		public function callBrowser(command:String, ...rest):void {
			if (ExternalInterface.available) {
				rest.unshift(command);
				ExternalInterface.call.apply(null, rest);
			}
		}

		//================================================================================================================;
		private function initToJs():void
		{
			if (ExternalInterface.available) {
				try {
					ExternalInterface.addCallback("output", output);
					ExternalInterface.addCallback("connect", connect);
					ExternalInterface.addCallback("disconnect", disconnect);
					ExternalInterface.addCallback("destroy", destroy);

					if (checkJavaScriptReady()) {
						jsReadyTodo();
					} else {
						allOutput("JavaScript is not ready, creating timer.");
						var readyTimer:Timer = new Timer(100,0);
						readyTimer.addEventListener(TimerEvent.TIMER, timerHandler);
						readyTimer.start();
					}
				} catch (error:SecurityError) {
					allOutput("A SecurityError occurred: " + error.message);
				} catch (error:Error) {
					allOutput("An Error occurred: " + error.message);
				}
			} else {
				allOutput("External interface is not available for this container.");
			}
		}

		private function checkJavaScriptReady():Boolean
		{
			var isReady:Boolean = ExternalInterface.call("isJsReady");
			return isReady;
		}

		private function timerHandler(event:TimerEvent):void
		{
			allOutput("Checking JavaScript status...");
			var isReady:Boolean = checkJavaScriptReady();
			if (isReady) {
				jsReadyTodo();
				Timer(event.target).stop();
			}
		}
		private function jsReadyTodo():void {
			isJsReady = true;
			allOutput("JavaScript is ready.");
			ExternalInterface.call("flashIsReady");
		}

		public function output(...rest):void
		{
			var lineNum:int = output_txt.numLines;
			var msg:String = "";
			for(var i:int=0, len:int=rest.length; i<len; i++) {
				msg += lineNum + "  " + rest[i].toString() + "\n";
				lineNum ++;
			}
			output_txt.appendText(msg);
			output_txt.scrollV = output_txt.numLines;
		}

		private var isJsReady:Boolean = false;
		private var outputMsgs:Array = [];
		private function jsOutput(...rest):void {
			if(isJsReady) {
				if(outputMsgs.length>0) {
					rest = outputMsgs.concat(rest);
					outputMsgs = [];
				}
				if(rest.length === 0) return;
				ExternalInterface.call.apply(null, ["output"].concat(rest));
			} else {
				outputMsgs = outputMsgs.concat(rest);
			}
		}

		public function allOutput(...rest):void {
			output.apply(null, rest);
			jsOutput.apply(null, rest);
		}
	}
}