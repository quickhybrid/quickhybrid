/**
 * 依赖于以下的基础库
 * Promise
 */
export default function proxyMixin(hybrid) {
    const hybridJs = hybrid;

    /**
     * 对所有的API进行统一参数预处理，promise逻辑支持等操作
     * @param {Object} api 对应的API
     * @param {Function} callback 回调
     * @constructor
     */
    function Proxy(api, callback) {
        this.api = api;
        this.callback = callback;
    }

    /**
     * 实际的代理操作
     */
    Proxy.prototype.walk = function walk() {
        // 实时获取promise
        const Promise = hybridJs.getPromise();
        
        // 返回一个闭包函数
        return (...rest) => {
            let args = rest;

            args[0] = args[0] || {};

            // 默认参数的处理
            if (this.api.defaultParams && (args[0] instanceof Object)) {
                Object.keys(this.api.defaultParams).forEach((item) => {
                    if (args[0][item] === undefined) {
                        args[0][item] = this.api.defaultParams[item];
                    }
                });
            }

            // 决定是否使用Promise
            let finallyCallback;

            if (this.callback) {
                // 将this指针修正为proxy内部，方便直接使用一些api关键参数
                finallyCallback = this.callback;
            }

            if (Promise) {
                return finallyCallback && new Promise((resolve, reject) => {
                    // 拓展 args
                    args = args.concat([resolve, reject]);
                    finallyCallback.apply(this, args);
                });
            }
            
            return finallyCallback && finallyCallback.apply(this, args);
        };
    };

    /**
     * 析构函数
     */
    Proxy.prototype.dispose = function dispose() {
        this.api = null;
        this.callback = null;
    };

    hybridJs.Proxy = Proxy;
}