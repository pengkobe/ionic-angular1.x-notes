# 案例
打算拿[ionic-chat](https://github.com/pengkobe/ionic-chat)进行改造，暂时放在refactoring分支中进行开发

### 步骤记录
1. 建好文件夹，确定功能页面,在README.md中记录
2. 初始化服务端(EXPRESS+MONGODB)
3. 构建singling服务，singling服务属于chat但是需要在全局注册(登录成功时)
   方案:采用一个全局的service管理权限，根据权限加载模块，并初始化业务,初始化业务放在对应模块的run方法中
4. 遇见添米app，进行一番重构
   + 增加子文件夹module
   + 路由配置下放到moudle
5. 迁移代码、移除多余代码(服务端+ionic前端)
6. 配置路由，安装gulp插件，其中gulp-sass报错，但是降低版本后安装成功
7. 添加ozlazyloader,hotupdater插件
8. 报了一个错，发现是乱套用tianmi中的config出问题了！挖掘原因是$httpProvider重复配置，导致报错
   ```
.config(['$httpProvider', '$resourceProvider', function ($httpProvider, $resourceProvider) {
      var interceptor = function ($q, $rootScope, Passport, $location, Config) {
      return {
          'request': function (request) {
                $httpProvider.defaults.useXDomain = true;
                delete $httpProvider.defaults.headers.common['X-Requested-With'];
                $resourceProvider.defaults.stripTrailingSlashes = false;
                $httpProvider.defaults.headers.common['platform'] = 'android';  // 添加platform

                delete request.headers.Authorization;
                var _token = Passport.getToken();
                var _request_url = request.url.substr(0, 22);
                if (_token) {
                    request.headers.Authorization = "Token " + _token;
                }

                request.params = request.params || {};
                return request;
                },
                'requestError': function (requestError) {
                return requestError;
                },
                'response': function (response) {
                return response;
                },
                'responseError': function (rejection) {
                switch (rejection.status) {
                    case 401:
                    // $location.path('login');
                    $rootScope.$broadcast('response', '401');
                    break;
                    case 403:
                    break;
                    case 404:
                    //清除Passport中的token
                    // Passport.logout();

                    break;
                    case 500:
                    // /!*$location.path('/500');*!/
                    break;
                }
                return $q.reject(rejection);
                }
            };
      };
      //声明interceptor 的注入依赖顺序
      interceptor.$inject = ['$q', '$rootScope', 'Passport', '$location', 'Config'];
      $httpProvider.interceptors.push(interceptor);
   }])
   ```

   9. 发现错误，造成$digest死循环
   ```
   // 构建消息UI模板
    $scope.buildTplUrl = function (type) {
      /** 业务类模板 */
      var tplUrl;
      switch (type) {
        case 'industry':
          tplUrl = 'industry';
          break;
        case 'medical':
          tplUrl = 'medical';
          break;
        case 'aircondition':
          tplUrl = 'aircondition';
          buildAircondition();
          break;
        default:
        // TODO：隐藏业务tab
      }
      return 'module/dash/business/' + tplUrl + '/' + tplUrl + '.html';
    };

    /**
     * 构建Aircondition业务
     */
    function buildAircondition() {
      $scope.expanders = [
        {
          title: 'Click me to expand',
          text: 'Hi there folks, I am the content that was hidden but is now shown.'
        },
        {
          title: 'Click this',
          text: 'I am even better text than you have seen previously'
        },
        {
          title: 'Test',
          text: 'test'
        }];
    }
   ```
   10. ion-nav-buttons>ion-nav-title>ion-nav-bar>(上级不见了会报错)
   11. 路由需要遵循命名规则：tab.名称，
   12. 重构聊天界面(指令化、服务化)，对界面做稍许优化
   13. 发现指令配置scope时，键与值的名称不能相同，否则无法找到实例。
   14. 删掉call中多余的代码
   15. 重构cordova-app-loader，指令化，部署服务端进行测试

    
