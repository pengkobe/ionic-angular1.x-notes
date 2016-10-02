# AngularJS Scope
scope用来包含一段代码中的上下文、变量等。注意区分理解JavaScript中的scope。


### 确定元素scope
一个scope跟一个元素以及所有它的子元素关联，但元素不一定会关联scope:

```javascript
// 1: 直接关联
<nav ng-controller='menuCtrl'>

// 2: 继承自祖先
<nav ng-controller='menuCtrl'>
   <a ng-click='navigate()'>Click Me!</a> <!-- also <nav>'s scope -->
</nav>

// 3: 没有包含在ng-app中，不属于任何scope
```

### 内部属性
这里分享一些妙用

```javascript
// 获取scope
angular.element($0).scope()
// 遍历scope所有属性
for(o in $($0).scope())o[0]=='$'&&console.log(o)
```


### 事件模型
1. $$listeners
  在scope上注册事件监听器。

2. $on(evt, fn)
  注册一个名为evt，监听器为fn的事件。

3. $emit(evt, args) 发送事件 evt
  在scope链上冒泡，在当前scope以及所有的$parents上触发,包括$rootScope。
  *应用场景*:指令中scope发布事件,在controller中接收处理

4. $broadcast(evt, args) 发送事件 evt
  在当前scope 以及它 所有的 children 上触发。
  *应用场景*:可以把事件注册发布写成服务,直接注册在$rootscope上,大大减少时间



### $digest/$watcher/$phase/$apply


###  参考
1. http://www.w3ctech.com/topic/1611
  每次看这种别人翻译的文章就会想起阮老师，一般的翻译者和阮老师真不是一个档次的！

