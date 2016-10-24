# Angular服务
angular按照用途与生命周期划分成几种服务类型，如下一一道来。

### factory
factory()让我们通过返回一个包含方法和数据的对象来定义。
从面向对象编程的工厂模式来说，一个factory可以是一个用于创建其他对象的对象。
在刚入门时候最好只使用service()，Factory()更加适用于当你在设计一个需要私有方法的类的时候使用：
当然，我们也可以注入其它服务，比如 $http 和 $q等，示例:

```javascript
angular.module('myApp.services')
.factory('User', function($http) { // 在这里注入服务
  var backendUrl = "http://localhost:3000";  
  var service = {    
    user: {},
    setName: function(newName) { 
      service.user['name'] = newName; 
    },
    setEmail: function(newEmail) {
      service.user['email'] = newEmail;
    },
    save: function() {
      return $http.post(backendUrl + '/users', {
        user: service.user
      });
    }
  };  
  return service;
});
```  
当我们仅仅需要的是***一个方法和数据的集合且不需要处理复杂的逻辑**的时候，factory()是一个非常不错的选择，、
如解析姓名首字母、返回一组测试数据...

### service
通过构造函数的方式让我们创建服务，我们可以使用原型模式替代javaScript原始的对象来定义。
和factory()方法一样我们也可以在函数的定义里面看到服务的注入

```javascript
angular.module('myApp.services')
.service('User', function($http) { // 在这里注入服务
  var self = this;
  this.user = {};
  this.backendUrl = "http://localhost:3000";
  this.setName = function(newName) {
    self.user['name'] = newName;
  }
  this.setEmail = function(newEmail) {
    self.user['email'] = newEmail;
  }
  this.save = function() {
    return  $http.post(self.backendUrl + '/users', {user: self.user});
  }
});
```  

使用方式与javascript一样，但是service()会持有构造函数创建的对象

```javascript
angular.module('myApp')
.controller('MainCtrl', function($scope, User) {//User是实例化的对象
  $scope.saveUser = User.save;
});
```  
适合在功能控制较多的服务里面。


### provider
之前有说到provider()是最底层的方式，这也是唯一一个可以使用.config()方法配置的方法。
注意:**所有的 providers 都是单例的。**

```javascript
angular.module('myApp.services')
.provider('User', function() {
  this.backendUrl = "http://localhost:3000";
  this.setBackendUrl = function(newUrl) {
    if (url) { 
        this.backendUrl = newUrl;
    }
  }
  this.$get = function($http) { // 在这里注入服务
    var self = this;
    var service = {
        user: {},
        setName: function(newName) {
            service.user['name'] = newName;
        },
        setEmail: function(newEmail) {
            service.user['email'] = newEmail;
        },
        save: function() {
            return $http.post(self.backendUrl + '/users', {
                user: service.user
            })
        }
    };
    return  service;
  }
});
```  

为了给服务进行配置，我们可以将其注入到config中进行。

```javascript
angular.module('myApp')
.config(function(UserProvider) {
  UserProvider.setBackendUrl("http://myApiBackend.com/api");
})
```

从而可以和其它方式一样使用了

```javascript
angular.module('myApp')
.controller('MainCtrl', function($scope, User) {
  $scope.saveUser = User.save;
});
```
使用场景:
1. 需要对服务进行配置的使用。比如，上述列子中需要配置后台URL
2. 发布公用组件时可以给用户配置的权利

### 参考  
[AngularJS 开发者最常犯的 10 个错误](http://www.oschina.net/translate/top-10-mistakes-angularjs-developers-make)  
http://www.ng-newsletter.com/advent2013/#!/day/1  
