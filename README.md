# asconsole

Debug Flash ActionScript by browser's console

* Author : Kainan Hong <<1037714455@qq.com>>
* Demo   : Receiver : http://hellobug.me/play/asconsole/
           <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
           Sender : http://hellobug.me/play/asconsole/demo/
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

## Example

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
