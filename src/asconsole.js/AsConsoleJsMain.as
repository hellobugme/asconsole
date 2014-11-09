package 
{
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	import flash.system.Security;
	import flash.utils.setTimeout;
	import me.hellobug.asconsole.console;

	public class AsConsoleJsMain extends Sprite
	{
		public function AsConsoleJsMain()
		{
			Security.allowDomain("*");
			initToJs();
		}

		public function callAsConsole(methodName:String, ...rest):void {
			console[methodName].apply(null, rest);
		}
		
		private function initToJs():void
		{
			if (ExternalInterface.available) {
				try {
					setTimeout(jsReadyTodo, 500);
				} catch (error:SecurityError) {
					console.error("A SecurityError occurred: " + error.message);
				} catch (error:Error) {
					console.error("An Error occurred: " + error.message);
				}
			} else {
				console.error("External interface is not available for this container.");
			}
		}

		private function jsReadyTodo():void {
			ExternalInterface.addCallback("callAsConsole", callAsConsole);
			// ExternalInterface.call("console.log", "As console ready");
			ExternalInterface.call("asconsole.asReady");
		}
	}
}