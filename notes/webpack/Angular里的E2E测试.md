# Angular里的E2E测试
原文:http://pinkyjie.com/2016/02/21/e2e-testing-in-angular/


## 使用mock API和非真实后台
* mock的API不仅可以用于测试，使得在后端API未完工的情况下可以方便的进行前端的开发。  
  现在的Web开发早已趋向彻底的前后分离，后端只提供API，其他的都归前端。前端在开发阶段就需要根据前后端商量好的contract来mock API  
* 迅速解决“前后端撕逼”问题。众所周知，所有的bug都是前端bug，因为QA测的是你的前端页面啊，不管bug是什么引起的，肯定都是报给前端啊。  
* 节约测试成本。使用mock API使得E2E测试可以跑在自己的开发server上，不仅可以减轻测试 server的压力，更是避免了真实测试环境的一些资源消耗。  
* 跑起来速度快！没了真实环境的束缚，API想几秒返回就几秒返回，测试跑起来自然非常快了。  

## PageObject应该包含啥

## PageObject里的元素该咋定义

## 使用ComponentObject

## 善用helper函数和自定义matcher

## protractor的大部分函数都返回promise

## 其它小tip