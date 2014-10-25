package 
{
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFieldAutoSize;
	import flash.utils.getQualifiedClassName;
	import me.hellobug.asconsole.console;
	import flash.text.TextFormat;

	public class AsConsoleDemoMain extends Sprite
	{
		private var messageLabel:TextField;
		private var message:TextField;
		private var sendBtn:Sprite;

		public function AsConsoleDemoMain()
		{
			stage.align = "TL";
			stage.scaleMode = "noScale";
			
			var txtfmt:TextFormat = new TextFormat("Arial", 12);
			
			const hPadding:uint = 5;
			// messageLabel
			messageLabel = new TextField();
			messageLabel.defaultTextFormat = txtfmt;
			messageLabel.x = 10;
			messageLabel.y = 10;
			messageLabel.text = "Text to send:";
			messageLabel.autoSize = TextFieldAutoSize.LEFT;
			addChild(messageLabel);

			// message
			message = new TextField();
			message.defaultTextFormat = txtfmt;
			message.x = messageLabel.x + messageLabel.width + hPadding;
			message.y = 10;
			message.width = 120;
			message.height = 20;
			message.background = true;
			message.border = true;
			message.type = TextFieldType.INPUT;
			addChild(message);

			// sendBtn
			sendBtn = new Sprite();
			sendBtn.x = message.x + message.width + hPadding;
			sendBtn.y = 10;
			var sendLbl:TextField = new TextField();
			sendLbl.defaultTextFormat = txtfmt;
			sendLbl.x = 1 + hPadding;
			sendLbl.y = 1;
			sendLbl.selectable = false;
			sendLbl.autoSize = TextFieldAutoSize.LEFT;
			sendLbl.text = "Send";
			sendBtn.addChild(sendLbl);
			sendBtn.graphics.lineStyle(1);
			sendBtn.graphics.beginFill(0xcccccc);
			sendBtn.graphics.drawRoundRect(0, 0, (sendLbl.width + 2 + hPadding + hPadding), (sendLbl.height + 2), 5, 5);
			sendBtn.graphics.endFill();
			addChild(sendBtn);
			sendBtn.addEventListener(MouseEvent.CLICK, sendMessage);
			
			// demoTxt
			var nextY:int = 40;
			for(var i:int=0, len=demoDescs.length; i<len; ++i) {
				var txt:TextField = new TextField();
				txt.defaultTextFormat = txtfmt;
				txt.text = demoDescs[i];
				txt.name = "txt" + String(i);
				txt.selectable = false;
				txt.wordWrap = true;
				txt.background = true;
				txt.backgroundColor = 0xCCCCCC;
				txt.addEventListener(MouseEvent.CLICK, showDemo);
				txt.width = 530;
				txt.height = txt.textHeight + 10;
				txt.x = 10;
				txt.y = nextY;
				nextY += txt.height + 4;
				addChild(txt);
			}
		}
		
		private function sendMessage(event:MouseEvent):void
		{
			console.log(message.text);
		}
		
		private var demoDescs:Array = [
			"几个类型的信息:\nconsole.log('一颗红心向太阳','吼吼~');\nconsole.info('楼上药不能停！');\nconsole.warn('楼上嘴太贱！');\nconsole.error('楼上关你毛事？');",
			"输出对象:\nvar obj:Sprite = new Sprite();\nconsole.logObject(obj.toString(), obj);", 
			"表格形式输出数据:\nvar data:Array = [{'品名': '杜雷斯', '数量': 4}, {'品名': '冈本', '数量': 3}];\nconsole.table(data);",
			"分组输出:\nconsole.group('groupDemo');\nfor(var i:int=0;i<10;++i){\n    console.log(Math.random());\n}\nconsole.groupEnd();",
			"输出对象类型:\nconsole.log(this.toString());\nconsole.log(getQualifiedClassName(this));",
			"包含格式化指令的信息:\nconsole.log('%chello world','font-size:25px;color:red;');",
			"包含格式化指令的信息:\nconsole.log('%chello world', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');",
			"log图片:\nconsole.log('%c', \"padding:50px 300px;line-height:120px;background:url('http://wayou.github.io/2014/09/10/chrome-console-tips-and-tricks/rabbit.gif') no-repeat;\");", 
			"清空控制台:\nconsole.clear();"
		];
		private var demoFns:Array = [
			function(){
				console.log('一颗红心向太阳','吼吼~');
				console.info('楼上药不能停！');
				console.warn('楼上嘴太贱！');
				console.error('楼上关你毛事？');
			},
			function(){
				var obj:Sprite = new Sprite();
				//var obj:CusCalss = new CusCalss();
				console.logObject(obj.toString(), obj);
			}, 
			function(){
				var data:Array = [{'品名': '杜雷斯', '数量': 4}, {'品名': '冈本', '数量': 3}];
				console.table(data);
			}, 
			groupDemo,
			classNameDemo,
			function(){
				console.log('%chello world','font-size:25px;color:red;');
			},
			function(){
				console.log('%chello world', 'background-image:-webkit-gradient( linear, left top, right top, color-stop(0, #f22), color-stop(0.15, #f2f), color-stop(0.3, #22f), color-stop(0.45, #2ff), color-stop(0.6, #2f2),color-stop(0.75, #2f2), color-stop(0.9, #ff2), color-stop(1, #f22) );color:transparent;-webkit-background-clip: text;font-size:5em;');
			},
			function(){
				console.log("%c", "padding:50px 300px;line-height:120px;background:url('http://wayou.github.io/2014/09/10/chrome-console-tips-and-tricks/rabbit.gif') no-repeat;");
			},
			function(){
				console.clear();
			}
		];
		private function showDemo(e:MouseEvent):void {
			var id = int(e.currentTarget.name.substr(3));
			// trace(id);
			console.group("结果");
			demoFns[id]();
			console.groupEnd();
			console.group("代码");
			console.log(demoDescs[id]);
			console.groupEnd();
		}
		private function groupDemo():void {
			console.group("groupDemo");
			for(var i:int=0;i<10;++i){
				console.log(Math.random());
			}
			console.groupEnd();
		}
		private function classNameDemo():void {
			console.log(this.toString());
			console.log(getQualifiedClassName(this));
		}
	}
}

class CusCalss {
	public var num:int = 5;
	public var str:String = "cus class";
}