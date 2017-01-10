# Angular里的E2E测试
原文:http://pinkyjie.com/2016/02/21/e2e-testing-in-angular/


## 使用mock API和非真实后台
* mock的API不仅可以用于测试，使得在后端API未完工的情况下可以方便的进行前端的开发。  
  现在的Web开发早已趋向彻底的前后分离，后端只提供API，其他的都归前端。前端在开发阶段就需要根据前后端商量好的contract来mock API  
* 迅速解决“前后端撕逼”问题。众所周知，所有的bug都是前端bug，因为QA测的是你的前端页面啊，不管bug是什么引起的，肯定都是报给前端啊。  
* 节约测试成本。使用mock API使得E2E测试可以跑在自己的开发server上，不仅可以减轻测试 server的压力，更是避免了真实测试环境的一些资源消耗。  
* 跑起来速度快！没了真实环境的束缚，API想几秒返回就几秒返回，测试跑起来自然非常快了。  

## PageObject应该包含啥
PageObject 是 protractor 官方推荐的最佳实践，它最大的好处就是将页面元素的选择器与测试本身隔离开，
这样一旦页面结构发生变化，只需要更新 PageObject 即可，测试部分的代码不用变动。
好的PageObject应该包含以下这些东西：
* load()或get()函数，用来加载页面。
* 页面上所有测试需要用到的元素。
* 页面测试需要用到的数据，比如测试表单页面时需要填入的测试数据。
* 共享的测试用例，比如多个测试用例可能都需要用到公用的代码来assert特定的逻辑，那么这个公用逻辑可以作为函数提出来放入PageObject。
* 不要包含对元素的操作函数，像官方例子中的函数，只是简单的在元素上调用.sendKey(xxx)或getText()，我认为没必要将其封装成函数，
直接写会更加直观，看测试代码的人也比较容易明白。每个PageObject单独放一个文件，然后每个文件export这个class，这样一来，
如果其他的PageObject依赖这个页面，可以方便的引入。

```javascript
// 初步封装
class BasePageObject {
    constructor (url) {
        Object.assign(this, {url});
        this.ele = this._getAllElements();
        this.mainTitle = 'Aio Angular App';
    }
    load () {
        browser.get(`${browser.baseUrl}/${this.url}`);
    }
    getHeader () {...}
    getFooter () {...}
    getSidebar () {...}
    getBreadcrumb () {...}
    getModal () {...}
    // shared test case
    assertCorrectLayout (config) {...}
}

// 子类调用方式
import LoginPage from './login.page';
// phone page object
class PhonePage extends browser._BasePageObject {
    constructor () {
        super('phone');
    }
    _getAllElements () {
        const $page = $('.phone-main-view');
        return {
            addNewBtn: $page.$('.btn-add-new'),
        };
    }
    // overrite load function to support login
    load () {
        super.load();
        const loginPage = new LoginPage();
        browser._.expectUrlToMatch(loginPage.url);
        loginPage.loginWithCredential('f@f', 'f');
        browser._.expectUrlToMatch(this.url);
    }
}
```

## PageObject里的元素该咋定义
```javascript
// 获取方式
_getAllElements () {
    const $table = $('.table');
    return {
        row: {
            view: $page.$$('.row'),
            col1: '.col1',
            col2: '.col2',
            col3: '.col3'
        }
    };
}
// 使用方式
const rowList = page.ele.row;
expect(rowList.view.count()).toBe(4);
// first row
const first = rowList.view.get(0);
expect(first.$(rowList.col1).getText()).toBe(xxx);

```

## 使用ComponentObject
页面其实是由各个组件搭成的。那么很自然的，PageObject也应该由ComponentObject来组成

```javascript
// phone form component object
class PhoneFormComp {
    constructor (parentElement) {
        const $form = parentElement.$('.phone-form-view');
        this.ele = {
            saveBtn: $form.$('.btn-save'),
            cancelBtn: $form.$('.btn-cancel')
        };
    }
    assertFormFieldError (field, isError, message) {}
    assertPhoneDetail (phone) {}
    assertEditPhoneDetail (phone) {}
    assertEditingForm (phone, isNew) {}
}
export default PhoneFormComp;

// phone add page object
import PhoneFormComp from './phone-form.comp';
class PhoneAddPage extends browser._BasePageObject {
    _getAllElements () {
        const $page = $('.phone-add-view');
        return {
            form: new PhoneFormComp($page)
        };
    }
}
```

## 善用helper函数和自定义matcher
### helper
因为browser是所有的spec里默认都可以访问到的，所以很多全局变量都可以考虑挂在它上面。
这样在spec文件的测试里就可以方便的使用browser._.xxx来调用这些函数了。
### Matcher
```javascript
// 构建 Matcher
const customMatchers = {
    toHaveClass: () => {
        return {
            compare: (actual, expected) => {
                return {
                    pass: actual.getAttribute('class').then((classes) => {
                        return classes.split(' ').indexOf(expected) !== -1;
                    })
                };
            }
        };
    }
};

// 使用 Matcher
onPrepare: () => {
    const helper = require('./source/test/e2e/helper');
    browser._BasePageObject = helper.BasePageObject;
    browser._ = new helper.E2EHelper();
    beforeEach(() => {
        // add custom matchers
        jasmine.addMatchers(helper.customMatchers);
    });
}
```

## protractor的大部分函数都返回promise
jasmine的expect()函数真正expect的是promise resolve后的值。  
所以可以这么用:

```javascript
ele.isDisplayed().then((val) => {
    if (val) {
        // do something
    } else {
        // do others
    }
})
```

## 其它小tip

### 让测试report更好看
[jasmine-spec-reporter](https://www.npmjs.com/package/jasmine-spec-reporter)

```javascript
// 禁用默认的输出
jasmineNodeOpts: {
    print: () => {}
}
// 添加新的reporter
onPrepare: () => {
    const SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter({
        displayStacktrace: 'all',
        displayFailuresSummary: false
    }));
}
```

### 失败时自动截图
[protractor-jasmine2-screenshot-reporter](https://www.npmjs.com/package/protractor-jasmine2-screenshot-reporter)

```javascript
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
    dest: `${e2eBaseFolder}/screenshots`,
    filename: 'e2e-report.html',
    captureOnlyFailedSpecs: true,
    reportOnlyFailedSpecs: false,
    pathBuilder: (currentSpec) => {
        return currentSpec.description.replace(/[ :]/g, '-');
    }
}));
```

## ES6的报错行号
protractor 2.x需要手动引入babel来支持使用ES6来书写spec文件，至于配置文件本身，只要你的node版本够高（4.x）或使用--harmony
也是可以用ES6来写的。但如果你在protractor的配置文件一开头就引入babelrequire('babel-core/register');就会发现，一旦spec报错，
log里给出的报错行号是不对的，在protractor的issues里有人给出了解决方案，其实只要在onPrepare里再引入babel即可。