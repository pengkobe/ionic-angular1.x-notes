# cordova-app-loader
之所以要在这里做记录是因为看作者文档看得稀里糊涂，又找不到其它更好的Repo，只能硬啃了！

### 安装使用步骤
1. 下载autoupdate.js
   此文件主要用于在加载时自动检测更新文件
2. 下载bootstrap.js
   加载manifest.json，初始化加载js
3. 下载cordova-app-loader-complete.js
   位于lib,是cordova-app-loader、cordova-promise-fs、bluebird三者的合体,支持不同运行环境不同策略
4. 编写manifest.json文件

```javascript
// 生成环境时得去掉注释，否则会报错！
{
  // 这些文件是会被下载
  "files": {
    "app": {
      "version": "8c99369a825644e68e21433d78ed8b396351cc7d",
      "filename": "./app/js/app.js"
    },
    "dash": {
      "version": "8c99369a825644e68e21433d78ed8b396351cc7d",
      "filename": "./dash/js/dash.js"
    },
    "dashhtml": {
      "version": "3e70f2873de3d9c91e31271c1a59b32e8002ac23",
      "filename": "./dash/tpl/tab-dash.html"
    },
    "style": {
      "version": "6e76f36f27bf29402a70c8adfee0f84b8a595973",
      "filename": "./dash/css/dash.css"
    }
  },
  // 这些文件会在index.html中加载
  "load": [
    "autoupdate.js",
    "app/js/app.js",
    "dash/js/dash.js"
  ]
}
```

5. 在index.html文件中引用

```javascript
<script type="text/javascript"
      timeout="5100"
      server="http://yourdomain/yourappfolder/"
      manifest="manifest.json"
      src="bootstrap.js">
</script>
```

6. 测试
修改style下dash.css的版本号，虽然能够下载下来(downlaod)，但是没有进入到update方法，一步一步排查，
最后排查到了*cordova-app-loader-complete.js*中498行，发现少了如下一个判断,直接报错中止了运行。

```javascript
if(onSingleDownloadProgress){
	onSingleDownloadProgress(new ProgressEvent());
}
```

好的可以成功下载并更新，但是临时存储空间提示某些文件不存在！

```
filesystem:http://localhost:8100/temporary/www/lib/cordova-app-loader-complete.js?1474635373222
Failed to load resource: net::ERR_FILE_NOT_FOUND
```

后知后觉发现，只要放在files中的文件才会有所更新并放置到*temporary*，还是太年轻啊，不管怎样，最终运行通过了，
也算是告了一小段，接下来需要把其封装成服务了。

### 问题
和懒加载一起使用会发生问题哦！


