* Angular指令
这里之前在[博文](http://yipeng.info/p/5728166902b77eca70929c83)里就写过，直接粘过来了。
** 指令的存在一个是实现语义化，另一个是解决解决模块的解耦与复用，作为angularJS的核心，必须深入理解。**
<!-- more -->

### 指令属性参数详解
*  name - 当前scope的名称，可不填。
*  priority（优先级）- 当多个directive定义在同一个DOM元素时，这属性用于在compile之前进行排序。
*  terminal（最后一组）- 如果设置为”true”，则表示当前的priority将会成为最后一组执行的directive。
  指令优先级相同的话，执行顺序不确定（注:基本上与priority的顺序一致。当前优先级执行完毕后，更低优先级的将不会再执行）。
*  scope
 - 值为：true - 将为这个directive创建一个新的scope。如果在同一个元素中有多个directive需要新的scope的话，
   它还是只会创建一个scope。新的作用域规则不适用于根模版，根模版往往会创建一个新的scope。
 - 值为：{}(object hash) - 将创建一个新的、独立(isolate)的scope。”isolate”。可有效防止读取或修改父级scope，
   这个独立的scope会创建一个拥有一组来源于父scope的本地scope属性，如果没有指定属性的名称，那么局部名称将与属性名称一致：
    + @或@attr - 建立一个local scope property到DOM属性的绑定（单向）。属性值总是String类型。
    + =或=expression， 在本地scope属性与parent scope属性之间设置双向的绑定。
    + &或&attr - 提供一个在父scope上下文中执行一个表达式的途径。
*  controller，会在pre-linking步骤之前进行初始化，并允许其他directive通过指定名称的require共享(见require属性),
   这将允许directive之间相互沟通,controller默认注入了以下本地对象：
  - $scope - 与当前元素结合的scope
  - $element - 当前的元素
  - $attrs - 当前元素的属性对象
  - $transclude - 一个预先绑定到当前转置scope的转置linking function :function(cloneLinkingFn)。
    (A  transclude linking function pre-bound to the correct transclusion scope)
  - require - 请求另外的controller，传入当前指令的linking函数中。require需要传入指令controller的名称,可加以下前缀：
    + ?,不要抛出异常。这使这个依赖变为一个可选项。
    + ^,允许查找父元素的controller
    + ?^,将前面两个选项的行为组合起来，我们可选择地加载需要的指令并在父指令链中进行查找。
*  restrict - EACM的子集的字符串，它限制directive为指定的声明方式，如果省略的话
 - E, 元素名称
 - A, 属性名(默认)
 - C, class名
 - M, 注释
*  template - 如果replace 为true，则将模版内容替换当前的HTML元素;如果为false，则将当作子元素处理。
*  templateUrl - 通过指定的url进行加载。因为模版加载是异步的，所以compilation、linking都会暂停，等待加载完毕后再执行。
*  replace - 为true时，那么模版将会替换当前元素，而不是作为子元素.(为true时，模版必须**有且只有**一个根节点)
*  transclude - 编译元素的内容，使它能够被directive所用。需要(在模版中)配合ngTransclude使用(引用)。
   transclusion的优点是linking function能够得到一个预先与当前scope绑定的transclusion function。
   一般地，建立一个widget，创建isolate scope，transclusion不是子级的，
   而是isolate scope的兄弟。这将使得widget拥有私有的状态，
   transclusion会被绑定到父级(pre-isolate)scope中。
   - true - 转换这个directive的内容。(这个感觉上，是直接将内容编译后搬入指定地方)
   - element - 转换整个元素，包括其他优先级较低的directive。(像将整体内容编译后，当作一个整体(外面再包裹p)，插入到指定地方)
*  compile - 下面实例详解
*  link -下面实例详解。这个属性仅在compile属性没有定义的情况下使用。

### compile与link
#### compile
负责对模板DOM进行转换。存在多个指令实例时也只会执行一遍。
#### link
负责将作用域和DOM进行链接。scope在此阶段才会绑定到元素上，指令的每个实例都会执行一遍。

### 指令案例
参考自AngularJS权威教程，实现自动填充指令

```javascript
//HTML
<input type="text" ng-model="user.location" auto-fill="fetchCities"
autocomplete="off" placeholder="Location" />

// 指令实现
.directive('autoFill', function($timeout) {
    return {
        restrict: 'EA',
        scope: {
            autoFill: '&',//函数
            ngModel: '='
        },
        compile: function(tEle, tAttrs) {
            //编译函数
            var tplEl = angular.element('<div class="typeahead">' +
                '<input type="text" autocomplete="off" />' +
                '<ul id="autolist" ng-show="reslist">' +
                    '<li ng-repeat="res in reslist" ' +
                    '>{{res.name}}</li>' +
                '</ul>' +
            '</div>');
            var input = tplEl.find('input');
            input.attr('type', tAttrs.type);
            input.attr('ng-model', tAttrs.ngModel);
            tEle.replaceWith(tplEl);
            return function(scope, ele, attrs, ctrl) {
                //链接函数
                var minKeyCount = attrs.minKeyCount || 3,
                timer,
                input = ele.find('input');
                input.bind('keyup', function(e) {
                    val = ele.val();
                    if(val.length < minKeyCount) {
                        if(timer) $timeout.cancel(timer);
                        scope.reslist = null;
                        return;
                } else {
                    if(timer) $timeout.cancel(timer);
                    timer = $timeout(function() {
                        scope.autoFill()(val).then(function(data) {
                            if(data && data.length > 0) {
                                scope.reslist = data;
                                scope.ngModel = data[0].zmw;
                            }
                        });
                    }, 300);
                }
                });
                // 失去焦点时隐藏reslist
                input.bind('blur', function(e) {
                    scope.reslist = null;
                    scope.$digest();
                });
            }
        }
    }
});
```

### 部分参考
* [AngularJS权威教程](https://book.douban.com/subject/25945442/)
* 翻译者有点烂,建议看原文:[[译] AngularJS内幕详解之 Directive](http://www.w3ctech.com/topic/1612)
* [《AngularJS》5个实例详解Directive（指令）机制](http://damoqiongqiu.iteye.com/blog/1917971)
