package 
{
	import flash.display.Sprite;
	import flash.external.ExternalInterface;
	import me.hellobug.asconsole.console;

	public class AsConsoleJsMain extends Sprite
	{
		public function AsConsoleJsMain()
		{
			initToJs();
		}

		public function callAsConsole(methodName:String, ...rest):void {
			console[methodName].apply(null, rest);
		}
		
		private function initToJs():void
		{
			if (ExternalInterface.available) {
				try {
					ExternalInterface.addCallback("callAsConsole", callAsConsole);
					// ExternalInterface.call("console.log", "As console ready");
					ExternalInterface.call("asconsole.asReady");
				} catch (error:SecurityError) {
					console.error("A SecurityError occurred: " + error.message);
				} catch (error:Error) {
					console.error("An Error occurred: " + error.message);
				}
			} else {
				console.error("External interface is not available for this container.");
			}
		}
	}
}