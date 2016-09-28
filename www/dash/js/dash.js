angular.module('dash', [])
.controller('DashCtrl', function($scope) {
    // 构建消息UI模板
    $scope.buildTplUrl = function (type) {
      var tplUrl;
      switch (type) {
        case 'industry':
          tplUrl = 'industry'; break;
        case 'medical':
          tplUrl = 'medical'; break;
        case 'aircondition':
          tplUrl = 'aircondition';break;
        default:// TODO：隐藏业务tab
      }
      return 'dash/business/' + tplUrl + '/' + tplUrl + '.html';
    };
})
