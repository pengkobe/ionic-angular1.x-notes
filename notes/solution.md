# 架构组织

### 工程组织
1. 分文件夹管理子模块
2. 深层次使用gulp，进一步自动化解决人工维护痛点
3. 使用sass模块化开发css
4. 使用[ocLazyLoad](https://github.com/ocombe/ocLazyLoad)动态加载js，[文档](https://oclazyload.readme.io/docs)

### 入口
1. 用户信息/权限/功能管理
2. 封装动态加载(ocLazyLoad)
3. 封装app动态更新([cordova-app-loader](https://github.com/markmarijnissen/cordova-app-loader))/大版本更新
4. 全局服务注册(电话/设施告警)
5. 公用类库(图表)
6. 分文件夹管理大业务模块
7. 全局注入器(ajax切面/请求头修改)

### 业务类
分模块开发,懒加载
对于服务类需要异步请求数据的，可以使用promise进行改造
