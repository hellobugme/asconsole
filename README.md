# asconsole

Debug Flash/ActionScript by browser's console.<br/>
Debug webpage/JavaScript in different tabpages or browsers.

* Author : Kainan Hong <<1037714455@qq.com>>
* Demo   : Receiver : http://hellobug.me/play/asconsole/
           <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           AsSender : http://hellobug.me/play/asconsole/asdemo/
           <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           JsSender : http://hellobug.me/play/asconsole/jsdemo/
* Source : https://github.com/hellobugme/asconsole/

## Features

If use Google Chrome, you need to disable the PepperFlash plugin in `chrome://plugins/`

## Methods

* `log(...rest)`
* `info(...rest)`
* `error(...rest)`
* `warn(...rest)`
* `group(groupName:String)`
* `groupEnd()`
* `table(...rest)`
* `clear()`
* `output(...rest)`
* `callBrowser(command:String, ...rest)`

## console.as Example

```actionscript
package {
  import me.hellobug.asconsole.console;
  
  public class Example {
    public function Example() {
      console.log('一颗红心向太阳','吼吼~');
      console.info('楼上药不能停！');
      console.warn('楼上嘴太贱！');
      console.error('楼上关你毛事？');
      console.logObject(stage.toString(), stage);
      console.table([{'品名': '杜雷斯', '数量': 4}, {'品名': '冈本', '数量': 3}]);
      console.log('%chello world','font-size:25px;color:red;');
      // console.clear();
    }
  }
}
```

## asconsole.js Example

```html
<html>
<head>
<title>ASCONSOLE.JS DEMO</title>
</head>
<body>
<script src="asconsole.js"></script>
<script>
  asconsole.init();
  asconsole.log('一颗红心向太阳','吼吼~');
  asconsole.info('楼上药不能停！');
  asconsole.warn('楼上嘴太贱！');
  asconsole.error('楼上关你毛事？');
  asconsole.logObjectAsString({a:1, b:"b", c:[5, 6]});
  asconsole.table([{'品名': '杜雷斯', '数量': 4}, {'品名': '冈本', '数量': 3}]);
  asconsole.log('%chello world','font-size:25px;color:red;');
  // asconsole.clear();
</script>
</body>
</html>
```
