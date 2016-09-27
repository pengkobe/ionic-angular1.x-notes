# 架构组织

### 工程组织
1. 分文件夹管理子模块
2. 深层次使用gulp，进一步自动化解决人工维护痛点
3. 使用sass模块化开发css
4. 使用[ocLazyLoad](https://github.com/ocombe/ocLazyLoad)动态加载文件，[文档](https://oclazyload.readme.io/docs)
5. 统一管理包名[测试版、发布版]，在引用第三方服务的时候特别需要注意。
6. 更好的开发和调试，使用[Batarang](https://chrome.google.com/webstore/detail/angularjs-batarang/ighdmehidhipcmcojjgiloacoafjmpfk?hl=en)
7. 适当引进测试,Karma、[Protractor](http://www.oschina.net/p/protractor)

### 入口
1. 用户信息/权限/功能管理
2. 封装动态加载(ocLazyLoad)
3. 封装app动态更新([cordova-app-loader](https://github.com/markmarijnissen/cordova-app-loader))/大版本更新
4. 全局服务注册(电话/设施告警)
5. 公用类库(图表)
6. 分文件夹管理大业务模块
7. 全局注入器(ajax切面/请求头修改)

### 业务类
* 分模块开发,懒加载
* 对于服务类需要异步请求数据的，可以使用promise进行改造

### 代码组织
* controller应该尽量不涉及dom操作(交由directive实现)，应该作为视图与模型的协调者  


### 问题
1. gulp-uglify可能导致程序不能运行
   原因分析:uglify会进行变量压缩，压缩后angularJS就不知道依赖注入哪个服务了。   
   解决方案:把依赖作为一个字符串数组传递，而数组的最后一个元素是一个把所有依赖作为参数的函数。