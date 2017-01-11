# ES6与Angular1.x.md

# controller
```javascript
class LoginFormController {
    constructor (UserAPI, $state) {
        this.UserAPI = UserAPI;
        this.$state = $state;
    }
    login (credential) {
        if (this.loginForm.$invalid) {
            return;
        }
        this.UserAPI.login(credential.email, credential.password)
            .then(() => {...})
            .catch(() => {...});
    }
}
```
s
# service/factory
马斯特个人的建议是在ES6中统统使用service

```javascript
class PhoneService {
    constructor ($http, $q, AjaxError) {
        this.$http = $http;
        this.$q = $q;
        this.AjaxError = AjaxError;
    }
    getPhones () {
    }
    getPhoneDetail (id) {
    }
    addNewPhone (phone) {
    }
    updatePhone (id, phone) {
    }
    removePhone (id) {
    }
}
PhoneService.$inject = ['$http', '$q', 'AjaxErrorHandler'];
```

## provider
```javascript
class RouterHelperProvider {
    constructor ($locationProvider, $stateProvider, $urlRouterProvider) {
        this.$locationProvider = $locationProvider;
        this.$stateProvider = $stateProvider;
        this.$urlRouterProvider = $urlRouterProvider;
        this.config = {
            mainTitle: '',
            resolveAlways: {}
        };
        this.$locationProvider.html5Mode(true);
    }
    configure (cfg) {
        angular.extend(this.config, cfg);
    }
    $get ($rootScope, $state, Logger, Resolve) {
        return new RouterHelper(
            this.config, this.$stateProvider, this.$urlRouterProvider,
            $rootScope, $state, Logger, Resolve);
    }
}
// 注意:这里需要单独注入
RouterHelperProvider.prototype.$get.$inject = [
    '$rootScope', '$state', 'Logger', 'Resolve'
];
RouterHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
```


## directive
directive是返回一个键值对配置的函数，显然，它也不是一个class，同样没必要花心思把它封装成class。

## 一些建议
1. 以下写法等价

  ```javascript
  // method 1
  Object.assign(this, {UserAPI, $state});
  // method 2
  this.UserAPI = UserAPI;
  this.$state = $state;
  ```
2. 能用 const 就不用 let
3. this 不是万能的
4. 私有变量/函数的实现
   -  Symbol
5. 使用ESLint


## 插件
* [isparta](https://github.com/douglasduteil/isparta) : Isparta is a code coverage tool for ES6 using babel.




