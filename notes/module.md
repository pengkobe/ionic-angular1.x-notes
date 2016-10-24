# AngularJS笔记
实践  
+网络资料(如:[AngularJS系列-翻译官网](http://www.cnblogs.com/leosx/p/4048105.html))  
+书(如:angularJS权威教程)

### module
各个模块组织方式建议:
1. 不同的业务，为一个模块。
2. 一个模块中，包含很多可以重用的组件(特别是指令和过滤器，以后也可以使用的)
3. 一个应用程序级别的模块，它依赖于上级的模块，并且它还包含有所有的初始化代码  

一些使用注意事项:
* angular.module('moduleName', [])会创建新module,获取引用使用angular.module('moduleName')
* 看文档:https://code.angularjs.org/1.3.0/docs/api/ng/type/angular.Module(需翻墙)


### constant
constan是唯一在所有配置块之前被执行的方法,用于配置全局常量。

### config
整个工作流中，唯一能够在应用启动前进行修改的部分。
使用多个配置块时，按照书写顺序执行
在模块上创建服务与指令(factory&directive)实际是config的语法糖
> 注意: 只能注入用provider()语法构建的服务，其它服务(factory\service)会在在配置之前意外实例化

```javascript
// 默认按照书写顺序进行注册
angular.module('myApp', [])
.config(function($provide ,$compileProvider) {
    // 工厂语法糖
    $provide.factory('myFactory', function() {
        var service = {};
        return service;
    });
    // directive语法糖
    $compileProvider.directive('myDirective', function() {
        return {
            template: '<button>Click me</button>'
        };
    });
});
```

### run
和配置块不同，运行块在注入器创建之后被执行，它是所有AngularJS应用中第一个被执行的方法。
运行块与应用本身高度耦合(不好测试)，用于注册全局事件，应用场景可以有如:
1. 设置路由事件的监听器
2. 过滤未经授权的请求
3. 其它...

```javascript
// 检测用户权限
angular.module('myApp', ['ngRoute'])
.run(function($rootScope, AuthService) {
    $rootScope.$on('$routeChangeStart', function(evt, next, current) {
        // 如果用户未登录
        if (!AuthService.userLoggedIn()) {
            if (next.templateUrl === "login.html") {
                // 已经转向登录路由因此无需重定向
            } else {
                $location.path('/login');
            }
        }
    });
});
```

### 大型项目文件组织
石器时代:
> js/css/html

电气时代:
> controller/service/model

互联网时代:
>  common + business-->controller/service/model


### 模块动态加载
这里摘自oclazyload中的2种方式

```javascript

// 结合module使用,不过这种方式只适用于可以懒加载的模块
angular.module('MyModule', ['pascalprecht.translate', {
    files: [
        '/components/TestModule/TestModule.js',
        '/components/bootstrap/css/bootstrap.css',
        '/components/bootstrap/js/bootstrap.js'
    ],
    cache: false
}]);

// 结合路由使用
$stateProvider.state('parent', {
  url: "/",
  resolve: {
    loadMyService: ['$ocLazyLoad', function($ocLazyLoad) {
             return $ocLazyLoad.load('js/ServiceTest.js');
    }]
  }
})
.state('parent.child', {
    resolve: {
        test: ['loadMyService', '$ServiceTest', function(loadMyService, $ServiceTest) {
            // you can use your service
            $ServiceTest.doSomething();
        }]
    }
});
```

### 番外篇
ASP.NET 的母版页Master Pages相比？
[链接](http://www.oschina.net/translate/developing-a-large-scale-application-with-a-single)
