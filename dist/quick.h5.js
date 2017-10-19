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
        namespace: 'alert',
        os: ['h5'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定'
        },
        runCode: function runCode() {
            var options = arguments.length <= 0 ? undefined : arguments[0];
            var resolve = arguments.length <= 1 ? undefined : arguments[1];
            var reject = arguments.length <= 2 ? undefined : arguments[2];

            // 支持简单的调用，alert(msg, title, btn)              
            if (!innerUtil.isObject(options)) {
                options = {
                    message: arguments.length <= 0 ? undefined : arguments[0],
                    title: '',
                    buttonName: '确定'
                };
                // 处理快速调用时的 resolve 与参数关系
                if (typeof (arguments.length <= 1 ? undefined : arguments[1]) === 'string') {
                    options.title = arguments.length <= 0 ? undefined : arguments[0];
                    options.message = arguments.length <= 1 ? undefined : arguments[1];
                    if (typeof (arguments.length <= 2 ? undefined : arguments[2]) === 'string') {
                        options.buttonName = arguments.length <= 2 ? undefined : arguments[2];
                        resolve = arguments.length <= 3 ? undefined : arguments[3];
                        reject = arguments.length <= 4 ? undefined : arguments[4];
                    } else {
                        resolve = arguments.length <= 2 ? undefined : arguments[2];
                        reject = arguments.length <= 3 ? undefined : arguments[3];
                    }
                }
            }

            if (window.alert) {
                // 可以使用自己的alert,并在回调中成功
                window.alert(options.message, options.title, options.buttonName);

                // 这里由于是window的alert，所以直接成功
                options.success && options.success({});
                resolve && resolve({});
            } else {
                options.error && options.error({});
                reject && reject({});
            }
        }
    }]);
}

var hybridJs = window.quick;

uiMixin(hybridJs);

})));
