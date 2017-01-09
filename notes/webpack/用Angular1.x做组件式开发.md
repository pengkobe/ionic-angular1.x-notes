# 用Angular 1.x做组件式开发

## 马斯特选用的文件结构
```
app/
-- components/
---- _core/
---- _layout/
---- home-hero/
---- login-form/
-- pages/
---- home/
---- login/
index.html
index.js
```

设计参考: https://github.com/fouber/blog/issues/10

## 函数式思维实现组件
* 将组件组合成页面时，这些数据一般由页面的controller准备好然后传递给组件。
* “实现逻辑”自然是放在directive的controller里实现了（用于UI组件时建议不要使用link函数，使用controller在语义上更好）
* 纯函数不会产生很多副作用，比如说它不能更改传入的参数本身，它不能依赖一些全局变量，不能有异步的HTTP请求或DB请求
  作者这里提供了一个实现:[链接](https://github.com/PinkyJie/angular1-webpack-starter/tree/master/source/app/components/phone-form)


## 组件通信
* 依靠 service
* 依靠 emit 事件
* 通过属性传参，通过调用“父级Ctrl”中方法获取参数
* 通过 directive 的 require 配置( 一旦使用 require ，directiveA 的定义只能使用link函数，directiveB 只能使用 controller函数，相当于 directiveB 通过 controller 函数将自己的API暴露出去了。)，[资料参考](Angular 1.x Direct
ive Definition Object: `require` property)


## 参考
* [用Angular 1.x做组件式开发](http://pinkyjie.com/2016/01/31/component-based-development-with-angular-1x/)
