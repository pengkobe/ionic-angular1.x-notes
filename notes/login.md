# 

## 修改
```javascript
// 参考自：'jackblog
.factory('AuthInterceptor', function ($rootScope, $q, $cookies, $location, $injector) {
    var Auth;
    return {
      // 全局替换头
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token').replace(/(^\")|(\"$)/g, "");
        }
        return config;
      },
      response: function (response) {
        return response;
      },
      // 统一处理错误
      responseError: function (rejection) {
        if (rejection.status === 401) {
          Auth = $injector.get('Auth');
          Auth.logout();
          $location.path('/signin');
          return $q.reject(rejection);
        } else {
          return $q.reject(rejection);
        }
      }
    };
  });
})();
```