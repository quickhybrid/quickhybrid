/*!
 * quickhybrid v0.0.1
 * (c) 2017-2017 dailc
 * Released under the BSD-3-Clause License.
 * https://github.com/quickhybrid/quickhybrid
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ejs = factory());
}(this, (function () { 'use strict';

function warn(msg) {
    // 模板字符串
    console.error("[quick error]: " + msg);
}

function log(msg) {
    console.log("[quick log]: " + msg);
}

function extend(target) {
    var finalTarget = target;

    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        rest[_key - 1] = arguments[_key];
    }

    rest.forEach(function (source) {
        Object.keys(source).forEach(function (key) {
            finalTarget[key] = source[key];
        });
    });

    return finalTarget;
}

/**
 * 如果version1大于version2，返回1，如果小于，返回-1，否则返回0。
 * @param {string} version1 版本1
 * @param {string} version2 版本2
 * @return {number} 返回版本1和版本2的关系
 */
function compareVersion(version1, version2) {
    if (typeof version1 !== 'string' || typeof version2 !== 'string') {
        throw new Error('version need to be string type');
    }

    var verArr1 = version1.split('.');
    var verArr2 = version2.split('.');
    var len = Math.max(verArr1.length, verArr2.length);

    // forin不推荐，foreach不能return与break
    for (var i = 0; i < len; i += 1) {
        var ver1 = verArr1[i] || 0;
        var ver2 = verArr2[i] || 0;

        // 隐式转化为数字
        ver1 -= 0;
        ver2 -= 0;

        if (ver1 > ver2) {
            return 1;
        } else if (ver1 < ver2) {
            return -1;
        }
    }

    return 0;
}

/**
 * 字符串超出截取
 * @param {string} str 目标字符串
 * @param {Number} count 字数，以英文为基数，如果是中文，会自动除2
 * @return {string} 返回截取后的字符串
 * 暂时不考虑只遍历一部分的性能问题，因为在应用场景内是微不足道的
 */


/**
 * 得到一个项目的根路径
 * h5模式下例如:http://id:端口/项目名/
 * @return {String} 项目的根路径
 */


/**
 * 将相对路径转为绝对路径 ./ ../ 开头的  为相对路径
 * 会基于对应调用js的html路径去计算
 * @param {String} path 需要转换的路径
 * @return {String} 返回转换后的路径
 */


/**
 * 得到一个全路径
 * @param {String} path 路径
 * @return {String} 返回最终的路径
 */


/**
 * 将json参数拼接到url中
 * @param {String} url url地址
 * @param {Object} data 需要添加的json数据
 * @return {String} 返回最终的url
 */

/**
 * 初始化给配置全局函数
 */
function initMixin(hybridJs) {
    var quick = hybridJs;
    var globalError = quick.globalError;
    /**
     * 几个全局变量 用来控制全局的config与ready逻辑
     * 默认ready是false的
     */
    var errorFunc = void 0;
    var readyFunc = void 0;
    var isAllowReady = false;
    var isConfig = false;

    /**
     * 提示全局错误
     * @param {Nunber} code 错误代码
     * @param {String} msg 错误提示
     */
    function showError() {
        var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var msg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '错误!';

        warn('code:' + code + ', msg:' + msg);
        errorFunc && errorFunc({
            code: code,
            message: msg
        });
    }

    /**
     * 检查环境是否合法，包括
     * 检测是否有检测版本号，如果不是，给出错误提示
     * 是否版本号小于容器版本号，如果小于，给予升级提示
     */
    function checkEnvAndPrompt() {
        if (!quick.runtime || !quick.runtime.getQuickVersion) {
            showError(globalError.ERROR_TYPE_VERSIONNOTSUPPORT.code, globalError.ERROR_TYPE_VERSIONNOTSUPPORT.msg);
        } else {
            quick.runtime.getQuickVersion({
                success: function success(result) {
                    var version = result.version;

                    if (compareVersion(quick.version, version) < 0) {
                        showError(globalError.ERROR_TYPE_VERSIONNEEDUPGRADE.code, globalError.ERROR_TYPE_VERSIONNEEDUPGRADE.msg);
                    }
                },
                error: function error() {
                    showError(globalError.ERROR_TYPE_INITVERSIONERROR.code, globalError.ERROR_TYPE_INITVERSIONERROR.msg);
                }
            });
        }
    }

    /**
     * 页面初始化时必须要这个config函数
     * 必须先声明ready，然后再config
     * @param {Object} params
     * config的jsApiList主要是同来通知给原生进行注册的
     * 所以这个接口到时候需要向原生容器请求的
     */
    quick.config = function config(params) {
        if (isConfig) {
            showError(globalError.ERROR_TYPE_CONFIGMODIFY.code, globalError.ERROR_TYPE_CONFIGMODIFY.msg);
        } else {
            isConfig = true;

            var _success = function _success() {
                // 如果这时候有ready回调
                if (readyFunc) {
                    readyFunc();
                } else {
                    // 允许ready直接执行
                    isAllowReady = true;
                }
            };

            if (quick.os.quick) {
                // 暂时检查环境默认就进行，因为框架默认注册了基本api的，并且这样2.也可以给予相应提示
                checkEnvAndPrompt();

                quick.auth.config(extend({
                    success: function success() {
                        _success();
                    },
                    error: function error(_error) {
                        var tips = _error ? JSON.stringify(_error) : globalError.ERROR_TYPE_CONFIGERROR.msg;

                        showError(globalError.ERROR_TYPE_CONFIGERROR.code, tips);
                    }
                }, params));
            } else {
                _success();
            }
        }
    };

    /**
     *  初始化完毕，并且config验证完毕后会触发这个回调
     * 注意，只有config了，才会触发ready，否则无法触发
     * ready只会触发一次，所以如果同时设置两个，第二个ready回调会无效
     * @param {Function} callback 回调函数
     */
    quick.ready = function ready(callback) {
        if (!readyFunc) {
            readyFunc = callback;
            // 如果config先进行，然后才进行ready,这时候恰好又isAllowReady，代表ready可以直接自动执行
            if (isAllowReady) {
                log('ready!');
                isAllowReady = false;
                readyFunc();
            }
        } else {
            showError(globalError.ERROR_TYPE_READYMODIFY.code, globalError.ERROR_TYPE_READYMODIFY.msg);
        }
    };

    /**
     * 当出现错误时，会通过这个函数回调给开发者，可以拿到里面的提示信息
     * @param {Function} callback 开发者设置的回调(每次会监听一个全局error函数)
     * 回调的参数好似
     * msg 错误信息
     * code 错误码
     */
    quick.error = function error(callback) {
        errorFunc = callback;
    };

    quick.showError = showError;
}

/**
 * 加入系统判断功能
 */
function osMixin(hybridJs) {
    var detect = function detect(ua) {
        this.os = {};

        var android = ua.match(/(Android);?[\s/]+([\d.]+)?/);

        if (android) {
            this.os.android = true;
            this.os.version = android[2];
            this.os.isBadAndroid = !/Chrome\/\d/.test(window.navigator.appVersion);
        }

        var iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/);

        if (iphone) {
            this.os.ios = true;
            this.os.iphone = true;
            this.os.version = iphone[2].replace(/_/g, '.');
        }

        var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);

        if (ipad) {
            this.os.ios = true;
            this.os.ipad = true;
            this.os.version = ipad[2].replace(/_/g, '.');
        }

        // quickhybrid的容器
        var quick = ua.match(/QuickHybrid/i);

        if (quick) {
            this.os.quick = true;
        }

        // epoint的容器
        var ejs = ua.match(/EpointEJS/i);

        if (ejs) {
            this.os.ejs = true;
        }

        var dd = ua.match(/DingTalk/i);

        if (dd) {
            this.os.dd = true;
        }

        // 如果ejs和钉钉以及quick都不是，则默认为h5
        if (!ejs && !dd && !quick) {
            this.os.h5 = true;
        }
    };

    detect.call(hybridJs, navigator.userAgent);
}

var globalError = {

    /**
     * 1001 api os错误
     */
    ERROR_TYPE_APIOS: {
        code: 1001,
        // 这个只是默认的提示，如果没有新的提示，就会采用默认的提示
        msg: '该API无法在当前OS下运行'
    },

    /**
     * 1002 api modify错误
     */
    ERROR_TYPE_APIMODIFY: {
        code: 1002,
        msg: '不允许更改JSSDK的API'
    },

    /**
     * 1003 module modify错误
     */
    ERROR_TYPE_MODULEMODIFY: {
        code: 1003,
        msg: '不允许更改JSSDK的模块'
    },

    /**
     * 1004 api 不存在
     */
    ERROR_TYPE_APINOTEXIST: {
        code: 1004,
        msg: '调用了不存在的api'
    },

    /**
     * 1005 组件api对应的proto不存在
     */
    ERROR_TYPE_PROTONOTEXIST: {
        code: 1005,
        msg: '调用错误，该组件api对应的proto不存在'
    },

    /**
     * 1006 非容器环境下无法调用自定义组件API
     */
    ERROR_TYPE_CUSTOMEAPINOTEXIST: {
        code: 1006,
        msg: '非容器下无法调用自定义组件API'
    },

    /**
     * 1007 对应的event事件在该环境下不存在
     */
    ERROR_TYPE_EVENTNOTEXIST: {
        code: 1007,
        msg: '对应的event事件在该环境下不存在'
    },

    /**
     * 1007 对应的event事件在该环境下不存在
     */
    ERROR_TYPE_INITVERSIONERROR: {
        code: 1008,
        msg: '初始化版本号错误，请检查容器api的实现情况'
    },

    /**
     * 2001 ready modify错误-ready回调正常只允许定义一个
     */
    ERROR_TYPE_READYMODIFY: {
        code: 2001,
        msg: 'ready回调不允许多次设置'
    },

    /**
     * 2002 config modify错误-正常一个页面只允许config一次
     */
    ERROR_TYPE_CONFIGMODIFY: {
        code: 2002,
        msg: 'config不允许多次调用'
    },

    /**
     * 2003 config 错误
     */
    ERROR_TYPE_CONFIGERROR: {
        code: 2003,
        msg: 'config校验错误'
    },

    /**
     * 2004 version not support
     */
    ERROR_TYPE_VERSIONNOTSUPPORT: {
        code: 2004,
        msg: '不支持当前容器版本，请确保容器与前端库版本匹配'
    },

    /**
     * 2004 version not support
     */
    ERROR_TYPE_VERSIONNEEDUPGRADE: {
        code: 2005,
        msg: '当前JSSDK库小于容器版本，请将前端库升级到最新版本'
    },

    /**
     * 3000 原生错误(非API错误)，原生捕获到的错误都会通知J5
     */
    ERROR_TYPE_NATIVE: {
        code: 3000,
        msg: '捕获到一处原生容器错误'
    },

    /**
     * 3001 原生调用h5错误  原生通过JSBridge调用h5错误，可能是参数不对
     */
    ERROR_TYPE_NATIVECALL: {
        code: 3001,
        msg: '原生调用H5时参数不对'
    },

    /**
     * 9999 其它未知错误
     */
    ERROR_TYPE_UNKNOWN: {
        code: 9999,
        msg: '未知错误'
    }
};

function globalerrorMixin(hybridJs) {
    var quick = hybridJs;

    quick.globalError = globalError;
}

var quick = {};

osMixin(quick);
globalerrorMixin(quick);
initMixin(quick);

quick.Version = '3.0.0';

return quick;

})));
