/*!
 * quickhybrid v0.0.1
 * (c) 2017-2017 dailc
 * Released under the BSD-3-Clause License.
 * https://github.com/quickhybrid/quickhybrid
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

function uiMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('ui', [{
        namespace: 'toast',
        os: ['quick'],
        defaultParams: {
            message: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message');

            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'showDebugDialog',
        os: ['quick'],
        defaultParams: {
            debugInfo: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject(rest, 'debugInfo');

            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'alert',
        os: ['quick'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定',
            // 默认可取消
            cancelable: 1
        },
        // 用confirm来模拟alert
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message', 'title', 'buttonName');

            args[0].buttonLabels = [args[0].buttonName];
            hybridJs.ui.confirm.apply(this, args);
        }
    }, {
        namespace: 'confirm',
        os: ['quick'],
        defaultParams: {
            title: '',
            message: '',
            buttonLabels: ['取消', '确定'],
            // 默认可取消
            cancelable: 1
        }
    }, {
        namespace: 'prompt',
        os: ['quick'],
        defaultParams: {
            title: '',
            hint: '',
            text: '',
            lines: 1,
            maxLength: 10000,
            buttonLabels: ['取消', '确定'],
            // 默认可取消
            cancelable: 1
        }
    }, {
        namespace: 'actionSheet',
        os: ['quick'],
        defaultParams: {
            items: [],
            // 默认可取消
            cancelable: 1
        },
        runCode: function runCode() {
            for (var _len4 = arguments.length, rest = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                rest[_key4] = arguments[_key4];
            }

            var args = rest;
            var options = args[0];
            var originalItems = options.items;

            options.dataFilter = function (res) {
                var newRes = res;
                var index = -1;
                var content = '';

                if (newRes.result) {
                    index = newRes.result.which || 0;
                    content = originalItems[index];
                    // 需要将中文解码
                    newRes.result.content = decodeURIComponent(content);
                }

                return newRes;
            };

            args[0] = options;
            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'popWindow',
        os: ['quick'],
        defaultParams: {
            titleItems: [],
            iconItems: [],
            iconFilterColor: ''
        },
        /**
         * 有横向菜单和垂直菜单2种
         * 可配合setNBRightImage、setNBRightText使用(iOS 不可配合使用)
         */
        runCode: function runCode() {
            for (var _len5 = arguments.length, rest = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                rest[_key5] = arguments[_key5];
            }

            var args = rest;
            var options = args[0];
            var originalItems = options.iconItems;

            // 处理相对路径问题
            for (var i = 0, len = options.iconItems.length; i < len; i += 1) {
                options.iconItems[i] = innerUtil.getFullPath(options.iconItems[i]);
            }

            options.dataFilter = function (res) {
                var newRes = res;
                var index = -1;
                var content = '';

                if (newRes.result) {
                    index = newRes.result.which || 0;
                    content = originalItems[index];
                    // 需要将中文解码
                    newRes.result.content = decodeURIComponent(content);
                }

                return newRes;
            };

            args[0] = options;
            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'pickDate',
        os: ['quick'],
        defaultParams: {
            // 部分设备上设置标题后遮挡控件可不设置标题
            title: '',
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd。
            datetime: ''
        }
    }, {
        namespace: 'pickTime',
        os: ['quick'],
        defaultParams: {
            // 部分设备上设置标题后遮挡控件可不设置标题
            title: '',
            // 默认为空为使用当前时间
            // 格式为 HH:mm
            datetime: ''
        }
    }, {
        namespace: 'pickDateTime',
        os: ['quick'],
        defaultParams: {
            title1: '',
            title2: '',
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd HH:mm
            datetime: ''
        }
    }, {
        namespace: 'showWaiting',
        os: ['quick'],
        defaultParams: {
            message: '加载中...'
        },
        runCode: function runCode() {
            for (var _len6 = arguments.length, rest = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                rest[_key6] = arguments[_key6];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message');

            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'closeWaiting',
        os: ['quick']
    }]);
}

function authMixin(hybrid) {
    var hybridJs = hybrid;

    hybridJs.extendModule('auth', [{
        namespace: 'getToken',
        os: ['quick']
    }, {
        namespace: 'config',
        os: ['quick'],
        defaultParams: {
            // 一个数组，不要传null，否则可能在iOS中会有问题
            jsApiList: []
        }
    }]);
}

function runtimeMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('runtime', [{
        namespace: 'launchApp',
        os: ['quick'],
        defaultParams: {
            // android应用的包名
            packageName: '',
            // android应用页面类名
            className: '',
            // android应用页面配置的ActionName
            actionName: '',
            // 页面配置的Scheme名字，适用于Android与iOS
            scheme: '',
            // 传递的参数。需要目标应用解析获取参数。字符串形式
            data: ''
        }
    }, {
        namespace: 'getAppVersion',
        os: ['quick']
    }, {
        namespace: 'getQuickVersion',
        os: ['quick']
    }, {
        namespace: 'clearCache',
        os: ['quick']
    }, {
        namespace: 'getGeolocation',
        os: ['quick'],
        defaultParams: {
            isShowDetail: 0,
            // 1采用的火星坐标系，0采用地球坐标系
            coordinate: 1
        }
    }, {
        namespace: 'clipboard',
        os: ['quick'],
        defaultParams: {
            text: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'text');

            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'openUrl',
        os: ['quick'],
        defaultParams: {
            url: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject(rest, 'url');

            hybridJs.callInner.apply(this, args);
        }
    }]);
}

function deviceMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('device', [{
        namespace: 'setOrientation',
        os: ['quick'],
        defaultParams: {
            // 1表示竖屏，0表示横屏，-1表示跟随系统
            orientation: 1
        }
    }, {
        namespace: 'getDeviceId',
        os: ['quick']
    }, {
        namespace: 'getVendorInfo',
        os: ['quick']
    }, {
        namespace: 'getNetWorkInfo',
        os: ['quick']
    }, {
        namespace: 'callPhone',
        os: ['quick'],
        defaultParams: {
            phoneNum: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'phoneNum');

            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'sendMsg',
        os: ['quick'],
        defaultParams: {
            phoneNum: '',
            message: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'phoneNum', 'message');

            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'closeInputKeyboard',
        os: ['quick']
    }, {
        namespace: 'vibrate',
        os: ['quick'],
        defaultParams: {
            duration: 500
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'duration');

            hybridJs.callInner.apply(this, args);
        }
    }]);
}

function pageMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('page', [{
        namespace: 'open',
        os: ['quick'],
        defaultParams: {
            pageUrl: '',
            pageStyle: 1,
            // 横竖屏,默认为1表示竖屏
            orientation: 1,
            // 额外数据
            data: {}
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'pageUrl', 'data');
            var options = args[0];

            // 将额外数据拼接到url中
            options.pageUrl = innerUtil.getFullUrlByParams(options.pageUrl, options.data);
            // 去除无用参数的干扰
            options.data = undefined;

            options.dataFilter = function (res) {
                var newRes = res;

                if (!innerUtil.isObject(newRes.result.resultData)) {
                    try {
                        newRes.result.resultData = JSON.parse(newRes.result.resultData);
                    } catch (e) {}
                }

                return newRes;
            };

            args[0] = options;
            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'openLocal',
        os: ['quick'],
        defaultParams: {
            className: '',
            // 为1则是打开已存在的页面，会杀掉所有该页面上的页面
            isOpenExist: 0,
            // 额外数据，注意额外数据只能一层键值对形式，不能再包裹子json
            data: {}
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            var args = rest;
            var options = args[0];

            options.dataFilter = function (res) {
                var newRes = res;

                if (!innerUtil.isObject(newRes.result.resultData)) {
                    try {
                        newRes.result.resultData = JSON.parse(newRes.result.resultData);
                    } catch (e) {}
                }

                return newRes;
            };

            args[0] = options;
            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'close',
        os: ['quick'],
        defaultParams: {
            // 需要传递的参数，是一个字符串
            resultData: ''
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'resultData');

            if (innerUtil.isObject(args[0].resultData)) {
                args[0].resultData = JSON.stringify(args[0].resultData);
            }

            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'reload',
        os: ['quick']
    }]);
}

function navigatorMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    /**
     * 按钮最多允许6个英文字符，或3个中文
     */
    var MAX_BTN_TEXT_COUNT = 6;

    hybridJs.extendModule('navigator', [{
        namespace: 'setTitle',
        os: ['quick'],
        defaultParams: {
            title: '',
            // 子标题
            subTitle: '',
            // 是否可点击，可点击时会有点击效果并且点击后会触发回调，不可点击时永远不会触发回调
            // 可点击时，title会有下拉箭头
            // promise调用时和其他长期回调一样立马then
            direction: 'bottom',
            // 是否可点击，如果为1，代表可点击，会在标题右侧出现一个下拉图标，并且能被点击监听
            clickable: 0
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'title');

            this.api.isLongCb = true;

            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'setMultiTitle',
        os: ['quick'],
        defaultParams: {
            titles: ''
        },
        runCode: function runCode() {
            this.api.isLongCb = true;

            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            hybridJs.callInner.apply(this, rest);
        }
    }, {
        namespace: 'show',
        os: ['quick']
    }, {
        namespace: 'hide',
        os: ['quick']
    }, {
        namespace: 'showStatusBar',
        os: ['quick']
    }, {
        namespace: 'hideStatusBar',
        os: ['quick']
    }, {
        namespace: 'hideBackButton',
        os: ['quick']
    }, {
        namespace: 'hookSysBack',
        os: ['quick'],
        runCode: function runCode() {
            this.api.isLongCb = true;

            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            hybridJs.callInner.apply(this, rest);
        }
    }, {
        namespace: 'hookBackBtn',
        os: ['quick'],
        runCode: function runCode() {
            this.api.isLongCb = true;

            for (var _len4 = arguments.length, rest = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                rest[_key4] = arguments[_key4];
            }

            hybridJs.callInner.apply(this, rest);
        }
    }, {
        namespace: 'setRightBtn',
        os: ['quick'],
        defaultParams: {
            text: '',
            imageUrl: '',
            isShow: 1,
            // 对应哪一个按钮，一般是0, 1可选择
            which: 0
        },
        runCode: function runCode() {
            for (var _len5 = arguments.length, rest = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                rest[_key5] = arguments[_key5];
            }

            var args = rest;
            var options = args[0];

            options.imageUrl = options.imageUrl && innerUtil.getFullPath(options.imageUrl);
            options.text = innerUtil.eclipseText(options.text, MAX_BTN_TEXT_COUNT);

            args[0] = options;
            this.api.isLongCb = true;

            hybridJs.callInner.apply(this, args);
        }
    }, {
        namespace: 'setRightMenu',
        os: ['quick'],
        defaultParams: {
            text: '',
            imageUrl: '',
            // 过滤色默认为空
            iconFilterColor: '',
            // 点击后出现的菜单列表，这个API会覆盖rightBtn
            titleItems: [],
            iconItems: []
        },
        /**
         * 这个API比较特殊，暂时由前端模拟
         */
        runCode: function runCode() {
            var _this = this;

            for (var _len6 = arguments.length, rest = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                rest[_key6] = arguments[_key6];
            }

            var newArgs = [].slice.call(rest);
            var newOptions = innerUtil.extend({}, newArgs[0]);

            newOptions.success = function () {
                // 点击的时候，弹出菜单
                hybridJs.ui.popWindow.apply(_this, rest);
            };

            newArgs[0] = newOptions;
            hybridJs.navigator.setRightBtn.apply(this, newArgs);
        }
    }, {
        namespace: 'setLeftBtn',
        os: ['quick'],
        defaultParams: {
            text: '',
            imageUrl: '',
            isShow: 1,
            // 是否显示下拉箭头,如果带箭头，它会占两个位置，同时覆盖左侧按钮和左侧返回按钮
            isShowArrow: 0
        },
        runCode: function runCode() {
            for (var _len7 = arguments.length, rest = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                rest[_key7] = arguments[_key7];
            }

            var args = rest;
            var options = args[0];

            options.imageUrl = options.imageUrl && innerUtil.getFullPath(options.imageUrl);
            options.text = innerUtil.eclipseText(options.text, MAX_BTN_TEXT_COUNT);

            args[0] = options;
            this.api.isLongCb = true;

            hybridJs.callInner.apply(this, args);
        }
    }]);
}

function utilMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('util', [{
        namespace: 'scan',
        os: ['quick']
    }, {
        namespace: 'selectImage',
        os: ['quick'],
        defaultParams: {
            // 图片数量
            photoCount: 9,
            // 是否允许拍照，1：允许；0：不允许
            showCamera: 0,
            // 是否显示gif图片，1：显示；0：不显示
            showGif: 0,
            // 是否允许预览，1：允许，0：不允许
            previewEnabled: 1,
            // 已选图片，json数组格式，item为元素本地地址
            selectedPhotos: []
        }
    }, {
        namespace: 'selectFile',
        os: ['quick'],
        defaultParams: {
            // 文件数量
            count: 9
        }
    }, {
        namespace: 'cameraImage',
        os: ['quick'],
        defaultParams: {
            // 宽度
            width: 720,
            // 压缩质量
            quality: 70
        }
    }, {
        namespace: 'openFile',
        os: ['quick'],
        defaultParams: {
            path: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'path');

            hybridJs.callInner.apply(this, args);
        }
    }]);
}

var hybridJs = window.quick;

uiMixin(hybridJs);
authMixin(hybridJs);
runtimeMixin(hybridJs);
deviceMixin(hybridJs);
pageMixin(hybridJs);
navigatorMixin(hybridJs);
utilMixin(hybridJs);

})));
