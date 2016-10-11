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