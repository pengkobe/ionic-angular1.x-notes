angular.module('UpdateAPP')
    .provider('UpdateAPP_APK', function () {
        this.backendUrl = "";
        this.setBackendUrl = function (newUrl) {
            if (url) {
                this.backendUrl = newUrl;
            }
        }
        // injectables go here
        this.$get = function ($http, $cordovaFileTransfer, $ionicPopup, 
        $timeout, $ionicLoading,CacheFactory,HttpFactory) {
            if(backendUrl==""){alert("请在config中指定服务地址！");}
            var service = {
                checkUpdate: function () {
                    var serverAppVersion = null;
                    HttpFactory.send({
                        url: backendUrl,
                        method: 'post'
                    }).success(function (data) {
                        if (!!data.data && data.data.length != 0) {
                            serverAppVersion = data.data[0].Version;
                            var type = data.data[0].type;
                            $rootScope.version = '1.1.1';
                            //获取当前版本
                            if (window.cordova) {
                                cordova.getAppVersion.getVersionNumber().then(function (version) {
                                    $rootScope.version = version;
                                    // 是否有更新
                                    if (version != serverAppVersion && type == 0) {
                                        showUpdateConfirm(data.data[0].VersionContent);
                                    }
                                })
                            }
                        }
                    });
                }
            };
            return service;
        }

        function showUpdateConfirm(updateContent) {
            var confirmPopup = $ionicPopup.confirm({
                title: '发现新版本',
                template: updateContent,  // 更新内容
                cancelText: '以后再说',
                okText: '立即升级'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $ionicLoading.show({
                        template: "已经下载：0%"
                    });
                    // 可以从服务端获取更新APP的路径
                    var url = RequestUrl + "app_download/efos-black-beta.apk";
                    // APP下载存放的路径，可以使用cordova file插件进行相关配置
                    var targetPath = "file:///storage/sdcard0/Download/efos-black-beta.apk";
                    var trustHosts = true;
                    var options = {};
                    $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                        // 打开新APP
                        $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                        ).then(function () {
                            CacheFactory.removeAll();
                            $state.go('login');
                        }, function (err) {
                        });
                        $ionicLoading.hide();
                    }, function (err) {
                        alert('下载失败');
                    }, function (progress) {  
                        // 显示进度
                        $timeout(function () {
                            var downloadProgress = (progress.loaded / progress.total) * 100;
                            $ionicLoading.show({
                                template: "已经下载：" + Math.floor(downloadProgress) + "%"
                            });
                            if (downloadProgress > 99) {
                                $ionicLoading.hide();
                            }
                        })
                    });
                } else {
                    // 用户取消更新
                }
            });
        }
    });