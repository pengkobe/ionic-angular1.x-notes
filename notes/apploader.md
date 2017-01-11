# cordova-app-loader使用笔记
之所以要在这里做记录是因为看作者文档看得稀里糊涂，又找不到其它更好的Repo，只能硬啃了！

### 安装使用步骤
1. 下载autoupdate.js
   此文件主要用于在加载时自动检测更新文件
2. 下载bootstrap.js
   加载manifest.json,初始化加载js
3. 下载cordova-app-loader-complete.js
   位于lib,是cordova-app-loader、cordova-promise-fs、bluebird三者的合体,支持不同运行环境不同策略
4. 编写manifest.json文件

```javascript
// 生成环境时得去掉注释，否则会报错！
{
  // 这些文件是会被下载的,version对应版本
  "files": {
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
  // 这些文件会在 index.html 中加载,首次会从本地加载
  "load": [
    "dash/js/dash.js",
    "dash/tpl/tab-dash.html"
    "dash/css/dash.css"
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
修改 style 下 dash.css 的版本号，虽然能够下载下来( downlaod )，但是没有进入到 update 方法，一步一步排查，
最后排查到了*cordova-app-loader-complete.js*中498行，发现少了如下一个判断,直接报错中止了运行。
[issue](https://github.com/markmarijnissen/cordova-app-loader/issues/74)。但是新版本貌似修复了这个问题。

```javascript
if(onSingleDownloadProgress){
	onSingleDownloadProgress(new ProgressEvent());
}

```

好的，现在可以成功下载并更新，但是临时存储空间提示某些文件不存在！

```
filesystem:http://localhost:8100/temporary/www/lib/cordova-app-loader-complete.js?1474635373222
Failed to load resource: net::ERR_FILE_NOT_FOUND
```

后知后觉发现，只要配置在manifest.json中 files/load 中的文件才会有更新并放置到*temporary*，不管怎样，最终运行通过了，
也算是告了一小段，接下来需要把其封装成服务了。

7. 封装成服务
```javascript
    .factory('HotUpdateService', function ($log, $q, HOT_UPDATE_URL) {
        var fs = new CordovaPromiseFS({
            Promise: Promise
        });

        var loader = new CordovaAppLoader({
            fs: fs,
            serverRoot: HOT_UPDATE_URL,
            localRoot: 'www',
            cacheBuster: true, // make sure we're not downloading cached files.
            checkTimeout: 10000, // timeout for the "check" function - when you loose internet connection
            mode: 'mirror',
            manifest: 'manifest.json' + "?" + Date.now()
        });

        return {
            // Check for new updates on js and css files
            check: function () {
                var defer = $q.defer();
                loader.check().then(function (updateAvailable) {
                    if (updateAvailable) {
                        defer.resolve(updateAvailable);
                    }
                    else {
                        defer.reject(updateAvailable);
                    }
                });
                return defer.promise;
            },
            // Download new js/css files
            download: function (onprogress) {
                var defer = $q.defer();
                loader.download(onprogress).then(function (manifest) {
                    defer.resolve(manifest);
                }, function (error) {
                    defer.reject(error);
                });
                return defer.promise;
            },
            // Update the local files with a new version just downloaded
            update: function (reload) {
                // reload:指示是否立即重新加载
                return loader.update(reload);
            },
            // Check wether the HTML file is cached
            isFileCached: function (file) {
                if (angular.isDefined(loader.cache)) {
                    return loader.cache.isCached(file);
                }
                return false;
            },
            // returns the cached HTML file as a url for HTTP interceptor
            getCachedUrl: function (url) {
                if (angular.isDefined(loader.cache)) {
                    return loader.cache.get(url);
                }
                return url;
            }
        };
    })
```

### 结合 Angular1.x 使用
特别需要注意的是，首次加载文件为异步加载，如果需要下载加载入口文件
1. 去掉 body 上的 ng-app="starter" 属性
2. 手动指定入口 App ```angular.bootstrap(doucumnet.body,["starter"]);```


### 问题
1. 和懒加载一起使用会发生问题！
在谷歌浏览器中懒加载(oclazyload)本身会在 head 中添加js引用，该引用并不是使用临时目录，但是不排除在手机环境中可行，因为其
可能会替换文件本身(这个暂时没有深究)
2. *window.BOOTSTRAP_OK = true;* 必须放在***不会更新的文件***中，否则每次切换到页面都会自动加载
3. 谷歌第一次更新会刷新两次[有文件更新需要重新获取]，此外文件全都替换为内存中的临时文件(改动一个文件那么就下载一个文件)
4. 在手机设备上的体验待测试

