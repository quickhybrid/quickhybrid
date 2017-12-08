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

/**
 * 普通消息框模块、
 * 包括:alert,confirm,prompt
 * 基于mui.css
 */

var CLASS_POPUP = 'mui-popup';
var CLASS_POPUP_BACKDROP = 'mui-popup-backdrop';
var CLASS_POPUP_IN = 'mui-popup-in';
var CLASS_POPUP_OUT = 'mui-popup-out';
var CLASS_POPUP_INNER = 'mui-popup-inner';
var CLASS_POPUP_TITLE = 'mui-popup-title';
var CLASS_POPUP_TEXT = 'mui-popup-text';
var CLASS_POPUP_INPUT = 'mui-popup-input';
var CLASS_POPUP_BUTTONS = 'mui-popup-buttons';
var CLASS_POPUP_BUTTON = 'mui-popup-button';
var CLASS_POPUP_BUTTON_BOLD = 'mui-popup-button-bold';
var CLASS_ACTIVE = 'mui-active';

var popupStack = [];
var backdrop = function () {
    var element = document.createElement('div');

    element.classList.add(CLASS_POPUP_BACKDROP);
    element.addEventListener('webkitTransitionEnd', function () {
        if (!element.classList.contains(CLASS_ACTIVE)) {
            element.parentNode && element.parentNode.removeChild(element);
        }
    });

    return element;
}();
var createInput = function createInput(placeholder) {
    var inputHtml = '<input type="text" autofocus placeholder="' + (placeholder || '') + '"/>';

    return '<div class="' + CLASS_POPUP_INPUT + '">' + inputHtml + '</div>';
};
var createInner = function createInner(message, title, extra) {
    var divPopText = '<div class="' + CLASS_POPUP_TEXT + '">' + message + '</div>';
    var divPopTitle = '<div class="' + CLASS_POPUP_TITLE + '">' + title + '</div>';

    return '<div class="' + CLASS_POPUP_INNER + '">' + divPopTitle + divPopText + (extra || '') + '</div>';
};
var createButtons = function createButtons(btnArray) {
    var len = btnArray.length;
    var btns = [];

    for (var i = 0; i < len; i += 1) {
        var classBold = i === len - 1 ? CLASS_POPUP_BUTTON_BOLD : '';

        btns.push('<span class="' + CLASS_POPUP_BUTTON + ' ' + classBold + '">' + btnArray[i] + '</span>');
    }

    return '<div class="' + CLASS_POPUP_BUTTONS + '">' + btns.join('') + '</div>';
};
var createPopup = function createPopup(html, callback) {
    // 将所有的\n替换为  <br>
    var newHtml = html.replace(/[\n]/g, '<BR />');
    var popupElement = document.createElement('div');

    popupElement.className = CLASS_POPUP;
    popupElement.innerHTML = newHtml;

    var removePopupElement = function removePopupElement() {
        popupElement.parentNode && popupElement.parentNode.removeChild(popupElement);
        popupElement = null;
    };

    popupElement.addEventListener('webkitTransitionEnd', function (e) {
        if (popupElement && e.target === popupElement && popupElement.classList.contains(CLASS_POPUP_OUT)) {
            removePopupElement();
        }
    });
    popupElement.style.display = 'block';
    document.body.appendChild(popupElement);
    popupElement.classList.add(CLASS_POPUP_IN);

    if (!backdrop.classList.contains(CLASS_ACTIVE)) {
        backdrop.style.display = 'block';
        document.body.appendChild(backdrop);
        backdrop.classList.add(CLASS_ACTIVE);
    }
    var btns = popupElement.querySelectorAll('.' + CLASS_POPUP_BUTTON);
    var input = popupElement.querySelector('.' + CLASS_POPUP_INPUT + ' input');
    var popup = {
        element: popupElement,
        close: function close(index, animate) {
            if (popupElement) {
                // 如果是input 类型,就回调input内的文字
                // 否则回调 btns的index
                var value = input ? input.value : index || 0;

                callback && callback(value, {
                    index: index || 0,
                    value: value
                });
                if (animate !== false) {
                    popupElement.classList.remove(CLASS_POPUP_IN);
                    popupElement.classList.add(CLASS_POPUP_OUT);
                } else {
                    removePopupElement();
                }
                popupStack.pop();
                // 如果还有其他popup，则不remove backdrop
                if (popupStack.length) {
                    popupStack[popupStack.length - 1].show(animate);
                } else {
                    backdrop.classList.remove(CLASS_ACTIVE);
                }
            }
        }
    };
    var handleEvent = function handleEvent(e) {
        popup.close([].slice.call(btns).indexOf(e.target));
    };
    var allBtns = document.querySelectorAll('.' + CLASS_POPUP_BUTTON);

    if (allBtns && allBtns.length > 0) {
        for (var i = 0; i < allBtns.length; i += 1) {
            allBtns[i].addEventListener('click', handleEvent);
        }
    }
    if (popupStack.length) {
        popupStack[popupStack.length - 1].hide();
    }
    popupStack.push({
        close: popup.close,
        show: function show() {
            popupElement.style.display = 'block';
            popupElement.classList.add(CLASS_POPUP_IN);
        },
        hide: function hide() {
            popupElement.style.display = 'none';
            popupElement.classList.remove(CLASS_POPUP_IN);
        }
    });

    return popup;
};

function alert(params, success) {
    var options = params;

    options.title = options.title || '提示';
    options.buttonName = options.buttonName || '确定';
    options.message = options.message || '';

    var innerHtml = createInner(options.message, options.title);
    var buttonHtml = createButtons([options.buttonName]);

    return createPopup(innerHtml + buttonHtml, success);
}

function confirm(params, success) {
    var options = params;

    options.title = options.title || '提示';
    options.buttonLabels = options.buttonLabels || ['确认', '取消'];
    options.message = options.message || '';

    var innerHtml = createInner(options.message, options.title);
    var buttonHtml = createButtons(options.buttonLabels);

    return createPopup(innerHtml + buttonHtml, success);
}

function prompt(params, success) {
    var options = params;

    options.title = options.title || '您好';
    options.buttonLabels = options.buttonLabels || ['确认', '取消'];
    options.text = options.text || '';
    options.hint = options.hint || '请输入内容';

    var innerHtml = createInner(options.text, options.title, createInput(options.hint));
    var buttonHtml = createButtons(options.buttonLabels);

    return createPopup(innerHtml + buttonHtml, success);
}

function toast(params) {
    var options = params;
    var message = options.message;
    var duration = options.duration || 2000;
    var toastDiv = document.createElement('div');

    toastDiv.classList.add('mui-toast-container');
    toastDiv.innerHTML = '<div class="mui-toast-message">' + message + '</div>';
    toastDiv.addEventListener('webkitTransitionEnd', function () {
        if (!toastDiv.classList.contains(CLASS_ACTIVE)) {
            toastDiv.parentNode.removeChild(toastDiv);
            toastDiv = null;
        }
    });
    // 点击则自动消失
    toastDiv.addEventListener('click', function () {
        toastDiv.parentNode.removeChild(toastDiv);
        toastDiv = null;
    });
    document.body.appendChild(toastDiv);
    toastDiv.classList.add(CLASS_ACTIVE);
    setTimeout(function () {
        toastDiv && toastDiv.classList.remove(CLASS_ACTIVE);
    }, duration);
}

/**
 * waitingdialog
 * 基于mui.css
 */

var DEFAULT_ID = 'MFRAME_LOADING';
var dialogInstance = void 0;

/**
 * 通过div和遮罩,创建一个H5版本loading动画(如果已经存在则直接得到)
 * 基于mui的css
 * @return {HTMLElement} 返回创建后的div对象
 */
function createLoading() {
    var loadingDiv = document.getElementById(DEFAULT_ID);

    if (!loadingDiv) {
        // 如果不存在,则创建
        loadingDiv = document.createElement('div');
        loadingDiv.id = DEFAULT_ID;
        loadingDiv.className = 'mui-backdrop mui-loading';

        var iconStyle = 'width: 20%;height: 20%;\n        max-width: 46px;max-height: 46px;\n        position:absolute;top:46%;left:46%;';

        var contentStyle = 'position:absolute;\n        font-size: 14px;\n        top:54%;left: 46%;\n        text-align: center;';

        // 自己加了些样式,让loading能够有所自适应,并且居中
        loadingDiv.innerHTML = ' \n        <span class=" mui-spinner mui-spinner-white"\n            style="' + iconStyle + '">\n        </span>\n        <span class="tipsContent" style="' + contentStyle + '">\n                        \u52A0\u8F7D\u4E2D...\n        </span>';
    }

    return loadingDiv;
}

/**
 * h5版本waiting dialog的构造方法
 * @param {String} title 标题
 * @param {Object} options 配置
 * @constructor
 */
function H5WaitingDialog(title, options) {
    var _this = this;

    // 构造的时候生成一个dialog
    this.loadingDiv = createLoading();
    document.body.appendChild(this.loadingDiv);
    this.setTitle(title);
    if (options && options.padlock === true) {
        // 如果设置了点击自动关闭
        this.loadingDiv.addEventListener('click', function () {
            _this.close();
        });
    }
}

/**
 * 设置提示标题方法,重新显示
 * @param {String} title 标题
 */
H5WaitingDialog.prototype.setTitle = function setTitle(title) {
    if (this.loadingDiv) {
        // 只有存在对象时才能设置
        this.loadingDiv.style.display = 'block';
        this.loadingDiv.querySelector('.tipsContent').innerText = title || '';
    }
};

/**
 * 关闭后执行的方法,这里只是为了扩充原型
 */
H5WaitingDialog.prototype.onclose = function () {};

/**
 * 设置关闭dialog
 */
H5WaitingDialog.prototype.close = function close() {
    if (this.loadingDiv) {
        this.loadingDiv.style.display = 'none';
        this.onclose();
    }
};

/**
 * 销毁方法
 */
H5WaitingDialog.prototype.dispose = function dispose() {
    // 将loadingDiv销毁
    this.loadingDiv && this.loadingDiv.parentNode && this.loadingDiv.parentNode.removeChild(this.loadingDiv);
};

/**
 * 显示waiting对话框
 * @param {String} title 标题
 * @param {Object} options 配置参数
 * @return {Object} 返回一个dialog对象
 */
function showWaiting(title, options) {
    if (dialogInstance === undefined) {
        dialogInstance = new H5WaitingDialog(title, options);
    } else {
        dialogInstance.setTitle(title);
    }

    return dialogInstance;
}

/**
 * 关闭waiting对话框
 */
function closeWaiting() {
    if (dialogInstance) {
        dialogInstance.dispose();
        dialogInstance = undefined;
    }
}

/**
 * actionsheet
 * 基于mui.css
 */

var ACTION_UNIQUE_ID = 'defaultActionSheetId';
var ACTION_WRAP_UNIQUE_ID = 'defaultActionSheetWrapContent';
var ACTION_CONTENT_ID = 'actionSheetContent';

function createActionSheetH5(params) {
    var options = params || {};
    var idStr = options.id ? 'id="' + options.id + '"' : '';
    var finalHtml = '';

    finalHtml += '<div ' + idStr + ' class="mui-popover mui-popover-action mui-popover-bottom">';
    // 加上title
    if (options.title) {
        finalHtml += '<ul class="mui-table-view">';
        finalHtml += '<li class="mui-table-view-cell">';
        finalHtml += '<a class="titleActionSheet"><b>' + options.title + '</b></a>';
        finalHtml += '</li>';
        finalHtml += '</ul>';
    }
    finalHtml += '<ul class="mui-table-view">';
    // 添加内容
    if (options.items && Array.isArray(options.items)) {
        for (var i = 0; i < options.items.length; i += 1) {
            var title = options.items[i] || '';

            finalHtml += '<li class="mui-table-view-cell">';
            finalHtml += '<a >' + title + '</a>';
            finalHtml += '</li>';
        }
    }
    finalHtml += '</ul>';
    // 加上最后的取消
    finalHtml += '<ul class="mui-table-view">';
    finalHtml += '<li class="mui-table-view-cell">';
    finalHtml += '<a class="cancelActionSheet"><b>取消</b></a>';
    finalHtml += '</li>';
    finalHtml += '</ul>';

    // 补齐mui-popover
    finalHtml += '</div>';

    return finalHtml;
}

function actionsheet(params, success) {
    var options = params;

    options.id = options.id || ACTION_UNIQUE_ID;

    var html = createActionSheetH5(options);

    if (!document.getElementById(ACTION_CONTENT_ID)) {
        // 不重复添加
        var wrapper = document.createElement('div');

        wrapper.id = ACTION_WRAP_UNIQUE_ID;
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);
        mui('body').on('shown', '.mui-popover', function () {
            // console.log('shown:'+e.detail.id, e.detail.id); //detail为当前popover元素
        });
        mui('body').on('hidden', '.mui-popover', function () {
            // console.log('hidden:'+e.detail.id, e.detail.id); //detail为当前popover元素
        });
    } else {
        // 直接更改html
        document.getElementById(ACTION_WRAP_UNIQUE_ID).innerHTML = html;
    }

    var actionSheetDom = document.getElementById(ACTION_WRAP_UNIQUE_ID);

    // 每次都需要监听，否则引用对象会出错，注意每次都生成新生成出来的dom，免得重复
    mui(actionSheetDom).off();
    mui(actionSheetDom).on('tap', 'li > a', function tapFunc() {
        var title = this.innerText;

        // console.log('class:' + mClass);
        // console.log('点击,title:' + title + ',value:' + value);
        if (this.className.indexOf('titleActionSheet') === -1) {
            // 排除title的点击
            mui('#' + options.id).popover('toggle');
            if (this.className.indexOf('cancelActionSheet') === -1) {
                // 排除取消按钮,回调函数
                success && success(title);
            }
        }
    });
    // 显示actionsheet
    mui('#' + options.id).popover('toggle');
}

/**
 * 日期时间选择相关
 * 依赖于 mui.min.css,mui.picker.min.css,mui.min.js,mui.picker.min.js
 */

var dtPicker = void 0;
var oldDtType = void 0;

/**
 * mui的时间选择单例选择
 * 如果当前类别和以前类别是同一个,则使用同一个对象,
 * 否则销毁当前,重新构造
 * @param {JSON} params 传入的构造参数
 * @param {Function} success(res) 选择后的回调
 * 日期时 result.date
 * 时间时 result.time
 * 月份时 result.month
 * 日期时间时 result.datetime
 */
function showDatePicter(params, success) {
    var options = params || {};

    if (window.mui && window.mui.DtPicker) {
        if (oldDtType !== options.type) {
            // 如果两次类别不一样,重新构造
            if (dtPicker) {
                // 如果存在,先dispose
                dtPicker.dispose();
                dtPicker = undefined;
            }
            oldDtType = options.type;
        }
        dtPicker = dtPicker || new mui.DtPicker(options);
        dtPicker.show(function (rs) {
            var result = {};

            if (options.type === 'date') {
                result.date = rs.y.value + '-' + rs.m.value + '-' + rs.d.value;
            } else if (options.type === 'time') {
                result.time = rs.h.value + ':' + rs.i.value;
            } else if (options.type === 'month') {
                result.month = rs.y.value + '-' + rs.m.value;
            } else {
                // 日期时间
                result.datetime = rs.y.value + '-' + rs.m.value + '-' + rs.d.value + ' ' + rs.h.value + ':' + rs.i.value;
            }

            success && success(result);
        });
    } else {
        console.error('错误,缺少引用的css或js,无法使用mui的dtpicker');
    }
}

/**
 * 日期时间选择相关
 * 依赖于mui.min.css,mui.picker.min.css,mui.poppicker.css,mui.min.js,mui.picker.min.js,mui.poppicker.js
 */

var pPicker = void 0;
// 上一次的layer,如果layer换了,也需要重新换一个
var lastLayer = void 0;

/**
 * mui的PopPicker,单例显示
 * @param {options} params 配置包括
 * data 装载的数据
 * @param {Function} success 选择回调
 */
function showPopPicker(params, success) {
    var options = params || {};

    if (window.mui && window.mui.PopPicker) {
        var layer = options.layer || 1;

        if (lastLayer !== layer) {
            // 如果两次类别不一样,重新构造
            if (pPicker) {
                // 如果存在,先dispose
                pPicker.dispose();
                pPicker = undefined;
            }
            lastLayer = layer;
        }
        pPicker = pPicker || new mui.PopPicker({
            layer: layer
        });
        pPicker.setData(options.data || []);
        pPicker.show(function (items) {
            var result = {};

            result.items = [];
            for (var i = 0; i < layer; i += 1) {
                result.items.push({
                    text: items[i].text,
                    value: items[i].value
                });
            }
            success && success(result);
        });
    } else {
        console.error('未引入mui pop相关js(css)');
    }
}

/**
 * 将小于10的数字前面补齐0,然后变为字符串返回
 * @param {Number} number 需要不起的数字
 * @return {String} 补齐0后的字符串
 */
function paddingWith0(numberStr) {
    var DECIMAL_TEN = 10;
    var number = numberStr;

    if (typeof number === 'number' || typeof number === 'string') {
        number = parseInt(number, DECIMAL_TEN);
        if (number < DECIMAL_TEN) {
            number = '0' + number;
        }

        return number;
    }

    return '';
}

function pickerDateWithArgs(args) {
    var options = args[0];
    var resolve = args[1];

    showDatePicter(options, function (result) {
        options.success && options.success(result);
        resolve && resolve(result);
    });
}

function uiMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('ui', [{
        namespace: 'toast',
        os: ['h5'],
        defaultParams: {
            message: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message');
            var options = args[0];
            var resolve = args[1];

            toast(options);
            options.success && options.success();
            resolve && resolve();
        }
    }, {
        namespace: 'showDebugDialog',
        os: ['h5'],
        defaultParams: {
            debugInfo: ''
        },
        runCode: function runCode() {
            for (var _len2 = arguments.length, rest = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                rest[_key2] = arguments[_key2];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'debugInfo');

            args[0] = {
                title: '',
                message: args[0].debugInfo,
                buttonName: '确定',
                success: args[0].success
            };
            hybridJs.ui.alert.apply(this, args);
        }
    }, {
        namespace: 'alert',
        os: ['h5'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定'
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'message', 'title', 'buttonName');
            var options = args[0];
            var resolve = args[1];

            alert(options, function () {
                options.success && options.success({});
                resolve && resolve({});
            });
        }
    }, {
        namespace: 'confirm',
        os: ['h5'],
        defaultParams: {
            // 这是默认参数，API的每一个参数都应该有一个默认值
            title: '',
            message: '',
            buttonLabels: ['取消', '确定']
        },
        runCode: function runCode() {
            for (var _len4 = arguments.length, rest = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                rest[_key4] = arguments[_key4];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var resolve = args[1];

            confirm(options, function (index) {
                var result = {
                    which: index
                };

                options.success && options.success(result);
                resolve && resolve(result);
            });
        }
    }, {
        namespace: 'prompt',
        os: ['h5'],
        defaultParams: {
            title: '',
            hint: '',
            text: '',
            buttonLabels: ['取消', '确定']
        },
        runCode: function runCode() {
            for (var _len5 = arguments.length, rest = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                rest[_key5] = arguments[_key5];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var resolve = args[1];

            prompt(options, function (content) {
                var index = content ? 1 : 0;
                var result = {
                    which: index,
                    content: content
                };

                options.success && options.success(result);
                resolve && resolve(result);
            });
        }
    }, {
        namespace: 'actionSheet',
        os: ['h5'],
        defaultParams: {
            items: []
        },
        runCode: function runCode() {
            for (var _len6 = arguments.length, rest = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
                rest[_key6] = arguments[_key6];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var resolve = args[1];

            actionsheet(options, function (title) {
                var index = options.items.indexOf(title);
                var result = {
                    which: index,
                    content: title
                };

                options.success && options.success(result);
                resolve && resolve(result);
            });
        }
    }, {
        namespace: 'pickDate',
        os: ['h5'],
        defaultParams: {
            // h5中的开始年份
            beginYear: 1900,
            // h5中的结束年份
            endYear: 2100,
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd。
            datetime: ''
        },
        runCode: function runCode() {
            for (var _len7 = arguments.length, rest = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
                rest[_key7] = arguments[_key7];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var datetime = options.datetime;

            if (!datetime) {
                // 如果不存在，默认为当前时间
                var dateNow = new Date();

                datetime = dateNow.getFullYear() + '\n                -' + paddingWith0(dateNow.getMonth() + 1) + '\n                -' + paddingWith0(dateNow.getDate());
            }
            options.value = datetime;
            options.type = 'date';

            pickerDateWithArgs(args);
        }
    }, {
        namespace: 'pickTime',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 hh:mm。
            datetime: ''
        },
        runCode: function runCode() {
            for (var _len8 = arguments.length, rest = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
                rest[_key8] = arguments[_key8];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var dateNow = new Date();
            var datePrefix = dateNow.getFullYear() + '\n                -' + paddingWith0(dateNow.getMonth() + 1) + '\n                -' + paddingWith0(dateNow.getDate()) + ' ';
            var datetime = options.datetime;

            if (!datetime) {
                // 如果不存在，默认为当前时间
                var dateSuffix = paddingWith0(dateNow.getHours()) + '\n                :' + paddingWith0(dateNow.getMinutes());

                datetime = datePrefix + dateSuffix;
            } else {
                datetime = datePrefix + datetime;
            }
            options.value = datetime;
            options.type = 'time';

            pickerDateWithArgs(args);
        }
    }, {
        namespace: 'pickDateTime',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd hh:mm。
            datetime: '',
            // h5中的开始年份
            beginYear: 1900,
            // h5中的结束年份
            endYear: 2100
        },
        runCode: function runCode() {
            for (var _len9 = arguments.length, rest = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
                rest[_key9] = arguments[_key9];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var datetime = options.datetime;

            if (!datetime) {
                // 如果不存在，默认为当前时间
                var dateNow = new Date();
                var datePrefix = dateNow.getFullYear() + '\n                -' + paddingWith0(dateNow.getMonth() + 1) + '\n                -' + paddingWith0(dateNow.getDate()) + ' ';
                var dateSuffix = paddingWith0(dateNow.getHours()) + '\n                :' + paddingWith0(dateNow.getMinutes());

                datetime = datePrefix + dateSuffix;
            }
            options.value = datetime;
            options.type = null;

            pickerDateWithArgs(args);
        }
    }, {
        namespace: 'pickMonth',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM
            datetime: '',
            // h5中的开始年份
            beginYear: 1900,
            // h5中的结束年份
            endYear: 2100
        },
        runCode: function runCode() {
            for (var _len10 = arguments.length, rest = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
                rest[_key10] = arguments[_key10];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var dateNow = new Date();
            var datetime = options.datetime;

            if (!datetime) {
                // 如果不存在，默认为当前时间
                datetime = dateNow.getFullYear() + '\n                -' + paddingWith0(dateNow.getMonth() + 1) + '\n                -' + paddingWith0(dateNow.getDate()) + ' ';
            } else {
                // 否则，只需要加上日期尾缀
                datetime += '-' + paddingWith0(dateNow.getDate());
            }
            options.value = datetime;
            options.type = 'month';

            pickerDateWithArgs(args);
        }
    }, {
        namespace: 'popPicker',
        os: ['h5'],
        defaultParams: {
            // 层级，默认为1
            layer: 1,
            data: []
        },
        runCode: function runCode() {
            for (var _len11 = arguments.length, rest = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
                rest[_key11] = arguments[_key11];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var resolve = args[1];

            showPopPicker(options, function (result) {
                options.success && options.success(result);
                resolve && resolve(result);
            });
        }
    }, {
        namespace: 'showWaiting',
        os: ['h5'],
        defaultParams: {
            message: '',
            padlock: true
        },
        runCode: function runCode() {
            for (var _len12 = arguments.length, rest = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
                rest[_key12] = arguments[_key12];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var resolve = args[1];

            showWaiting(options.message, {
                padlock: options.padlock
            });

            options.success && options.success({});
            resolve && resolve({});
        }
    }, {
        namespace: 'closeWaiting',
        os: ['h5'],
        runCode: function runCode() {
            for (var _len13 = arguments.length, rest = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
                rest[_key13] = arguments[_key13];
            }

            // 兼容字符串形式
            var args = rest;
            var options = args[0];
            var resolve = args[1];

            closeWaiting();

            options.success && options.success();
            resolve && resolve();
        }
    }]);
}

function pageMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('page', [{
        namespace: 'open',
        os: ['h5'],
        defaultParams: {
            pageUrl: '',
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

            // 普通
            document.location.href = options.pageUrl;
        }
    }, {
        namespace: 'close',
        os: ['h5'],
        runCode: function runCode() {
            // 浏览器退出
            if (window.history.length > 1) {
                window.history.back();
            }
        }
    }, {
        namespace: 'reload',
        os: ['h5'],
        runCode: function runCode() {
            window.location.reload();
        }
    }]);
}

function storageMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('storage', [{
        namespace: 'getItem',
        os: ['h5'],
        defaultParams: {
            // 对应的key
            key: ''
        },
        runCode: function runCode(params, resolve, reject) {
            var options = params;
            var success = options.success;
            var error = options.error;

            if (!innerUtil.isObject(options.key)) {
                options.key = [options.key];
            }

            var keys = options.key;
            var values = {};

            try {
                for (var i = 0, len = keys.length; i < len; i += 1) {
                    var value = localStorage.getItem(keys[i]);

                    values[keys[i]] = value;
                }
            } catch (msg) {
                var err = {
                    code: 0,
                    msg: 'localStorage\u83B7\u53D6\u503C\u51FA\u9519:' + JSON.stringify(keys),
                    result: msg
                };

                error && error(err);
                reject && reject(err);

                return;
            }

            success && success(values);
            resolve && resolve(values);
        }
    }, {
        namespace: 'setItem',
        os: ['h5'],
        runCode: function runCode(params, resolve, reject) {
            var options = params;
            var success = options.success;
            var error = options.error;

            try {
                Object.keys(options).forEach(function (key) {
                    if (key !== 'success' && key !== 'error') {
                        var value = options[key];

                        localStorage.setItem(key, value);
                    }
                });
            } catch (msg) {
                var errorMsg = '';

                if (msg.name === 'QuotaExceededError') {
                    errorMsg = '超出本地存储限额，建议先清除一些无用空间!';
                } else {
                    errorMsg = 'localStorage存储值出错';
                }

                var err = {
                    code: 0,
                    msg: errorMsg,
                    result: msg
                };

                error && error(err);
                reject && reject(err);

                return;
            }

            success && success({});
            resolve && resolve({});
        }
    }, {
        namespace: 'removeItem',
        os: ['h5'],
        defaultParams: {
            // 对应的key
            key: ''
        },
        runCode: function runCode(params, resolve, reject) {
            var options = params;
            var success = options.success;
            var error = options.error;

            if (!innerUtil.isObject(options.key)) {
                options.key = [options.key];
            }

            var keys = options.key;

            try {
                for (var i = 0, len = keys.length; i < len; i += 1) {
                    localStorage.removeItem(keys[i]);
                }
            } catch (msg) {
                var err = {
                    code: 0,
                    msg: 'localStorage\u79FB\u9664\u503C\u51FA\u9519:' + JSON.stringify(keys),
                    result: msg
                };

                error && error(err);
                reject && reject(err);

                return;
            }

            success && success({});
            resolve && resolve({});
        }
    }]);
}

function deviceMixin(hybrid) {
    var hybridJs = hybrid;
    var innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('device', [{
        namespace: 'callPhone',
        os: ['h5'],
        defaultParams: {
            phoneNum: ''
        },
        runCode: function runCode() {
            for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
                rest[_key] = arguments[_key];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'phoneNum');
            var phoneNum = args[0].phoneNum;

            window.location.href = 'tel:' + phoneNum;
        }
    }, {
        namespace: 'sendMsg',
        os: ['h5'],
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
            var phoneNum = args[0].phoneNum;
            var message = args[0].message;

            window.location.href = 'sms:' + phoneNum + '?body=' + message;
        }
    }, {
        namespace: 'sendMail',
        os: ['h5'],
        defaultParams: {
            mail: '',
            subject: '',
            cc: ''
        },
        runCode: function runCode() {
            for (var _len3 = arguments.length, rest = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                rest[_key3] = arguments[_key3];
            }

            // 兼容字符串形式
            var args = innerUtil.compatibleStringParamsToObject.call(this, rest, 'mail', 'subject', 'cc');
            var mail = args[0].mail;
            var subject = args[0].subject;
            var cc = args[0].cc;

            window.location.href = 'mailto:' + mail + '?subject=' + subject + '&cc=' + cc;
        }
    }]);
}

var hybridJs = window.quick;

uiMixin(hybridJs);
pageMixin(hybridJs);
storageMixin(hybridJs);
deviceMixin(hybridJs);

})));
