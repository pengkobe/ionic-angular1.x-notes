# cordova-app-loader
之所以要在这里做记录是引文作者文档写得稀里糊涂的，又找不到更好的REPO，所以只能硬啃了！

### 安装使用步骤
1. 添加autoupdate.js
2. 添加bootstrap.js
3. 添加cordova-app-loader-complete.js(位于lib,是cordova-app-loader、cordova-promise-fs、bluebird三者的合体)  
4. 添加manifest.json文件

```javascript
// 生成环境时得去掉注释，否则报错哈！
{
  "files": {  // these files are downloaded 
    "template": {
      "version": "3e70f2873de3d9c91e31271c1a59b32e8002ac23",
      "filename": "./dash/tpl/tab-dash.html"
    },
    "app": {
      "version": "8c99369a825644e68e21433d78ed8b396351cc7d",
      "filename": "./dash/js/dash.js"
    },
    "style": {
      "version": "6e76f36f27bf29402a70c8adfee0f84b8a595973",
      "filename": "./dash/css/dash.css"
    }
  },
  "load": [ // these files are loaded in your index.html
    ".lib/cordova-app-loader-complete.js",
    "autoupdate.js",
    "app/js/app.js",
    "dash/js/dash.js"
  ]
}
```

在index.html文件中引用  
```javascript
<script type="text/javascript" 
            timeout="5100" 
            server="http://yourdomain/yourappfolder/"
            manifest="manifest.json" 
            src="bootstrap.js"></script>
```  

接下来测试修改style下dash.css的版本，虽然能够下载，但是没有进入到update方法，于是只能一步一步排查，
最后排查到了*cordova-app-loader-complete.js*中500行，发现少了如下一个判断,直接报错中止了运行。  

```javascript
if(onSingleDownloadProgress){
	onSingleDownloadProgress(new ProgressEvent());
}
```  

好的可以成功下载并更新，但是临时存储空间并木有文件！！！(只是提示而已，路径是可以导航的！)  

```
filesystem:http://localhost:8100/temporary/www/lib/cordova-app-loader-complete.js?1474635373222 
Failed to load resource: net::ERR_FILE_NOT_FOUND
```

