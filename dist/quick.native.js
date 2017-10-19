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

function uiMixin(hybridJs) {
    var quick = hybridJs;

    quick.extendModule('ui', [{
        namespace: 'alert',
        os: ['quick'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定'
        }
    }]);
}

function authMixin(hybridJs) {
    var quick = hybridJs;

    quick.extendModule('auth', [{
        namespace: 'getToken',
        os: ['quick']
    }, {
        namespace: 'refreshToken',
        os: ['quick']
    }, {
        namespace: 'getUserInfo',
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

function runtimeMixin(hybridJs) {
    var quick = hybridJs;

    quick.extendModule('runtime', [{
        namespace: 'getAppVersion',
        os: ['quick']
    }, {
        namespace: 'getQuickVersion',
        os: ['quick']
    }]);
}

var quick = window.quick;

uiMixin(quick);
authMixin(quick);
runtimeMixin(quick);

})));
