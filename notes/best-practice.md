### AngularJS最佳实践

### 官方
1. Namespace distributed code
2. Only use .$broadcast(), .$emit() and .$on() for atomic events
3. Always let users use expressions whenever possible
4. Extend directives by using Directive Controllers
5. Add teardown code to controllers and directives
6. Leverage modules properly [范例](https://github.com/angular-app/angular-app/tree/master/client/src/app/dashboard)
7. Add NPM and Bower Support

### 最佳实践

1. 对images使用ng-src 替代src。

2. 使用promise 来处理回调。AngularJS已经为它暴露了“$q”服务。许多AngularJS services返回promises:$http, $interval, $timeout。

3. 不要压缩angular.min.js 因为AngularJS团队已经通过预定义设置压缩了angular文件,如果我们再压缩可能会产生破坏。所以直接使用。

4. 如果template (模板)缓存是必需的，使用$templateCache缓存html template。

5. 总是把第三方API的回调包裹到$apply，用来通知AngularJS关于环境的变化。

6. 为了阻止任何冲突，不要在我们自己的directives里使用“ng”前缀。创建你的自定义的。最好使用<my–component> ,因为 <my:component>在IE有时出错。

7. 在应用程序中为全局相关的事件使用$broadcast() , $emit() 和 $on()(比如用户身份验证或应用程序关闭)。如果我们需要特定于模块,服务或小部件的事件，我们应该选择Services,Directive Controllers等。

8. 不要使用自动关闭标签,因为有些浏览器不喜欢他们。使用“<product-title></product-title >”而不是“<product-title/>”。

9. 在页面初始化的时候，用户可能会看到 {{ }} 闪烁一下才出现真正的内容。解决办法:
  1. 使用 ng-cloak directive 来隐藏它
  2. 使用 ng-bind 替代 {{ }}
10. $rootscope
只用其来存储一些数据，像函数类型的直接包装在service中就好(可在使用时再初始化)

### 参考
https://github.com/angular/angular.js/wiki/Best-Practices
AngularJS最佳编码实践指南 : http://blog.jobbole.com/80634/
AngulaeJS最佳实践 : http://www.cnblogs.com/jifeng/p/3474757.html

