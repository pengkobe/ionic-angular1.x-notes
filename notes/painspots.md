# 开发痛点

### cordova插件类
* 控件冲突导致的使用bug(例如:phonertc&barcodescanner)
* 有些插件需要单独修改代码才能正常运行
* ios发布时会出现类似不支持64位的错误，插件作者不改的话你也没啥好办法

### 架构组织类
* 随着业务日益复杂，不同行业在某一个tab页内，甚至某一个功能组件类高度耦合。(如：slide控件)
* 一个项目需要多个人写作开发，代码耦合较大沟通困难
* 无自动发布，需要手动添加引用并配置
* 子模块怎么动根据后台配置动态注入至主模块，之前是一次性全局加载，很显然这是不妥的
* 子模块与主模块的事件消息沟通机制,之前把子模块全局服务写到主模块中，造成拆分十分困难
* 考虑把项目中的一个或多个部分拿出去在几个项目之间共享，尤其是这些公共部分要做懒加载的时候，就比较难受了。

### 代码书写类
* 控制器过多膨胀，极难维护
* dom渲染过度依赖控制器
* css无规范，容易发生覆盖\冗余多
* css没有分模块写，非常难维护，此外分模块写就会造成首页引入css文件过多


### AngularJS1.x本身
[ng-conf分享](https://www.youtube.com/watch?v=_OGGsf1ZXMs&index=1&list=PLw5h0DiJ-9PB-vLe3vaNFLG-cTw0Wo7fw)  
> Isn’t the current DI in ng 1.2 good enough? It is, but I believe we can make it better.
It has issues:
• creating DI modules (hard to integrate with module loaders; RequireJS, TypeScript)
• complex API (provider, service, factory, value, filter, …)
• confusing config/run phase
• string ids make it hard to minify
• also conflicts of ids (because there is no namespacing)
• really hard to lazy load code
• all instances are singletons
I claim that the new DI system that I’m about to show you, solves these issues.

