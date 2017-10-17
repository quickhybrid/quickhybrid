/**
 * 依赖于quick的基础库
 * Promise
 */
export default function proxyMixin(hybridJs) {
    const quick = hybridJs;

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
        const Promise = quick.getPromise();
        
        // 返回一个闭包函数
        return (...args) => {
            let rest = args;

            rest[0] = rest[0] || {};

            // 默认参数的处理
            if (this.api.defaultParams && (rest[0] instanceof Object)) {
                Object.keys(this.api.defaultParams).forEach((item) => {
                    if (rest[0][item] === undefined) {
                        rest[0][item] = this.api.defaultParams[item];
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
                    // 拓展 rest
                    rest = rest.concat([resolve, reject]);
                    finallyCallback.apply(this, rest);
                });
            }
            
            return finallyCallback && finallyCallback.apply(this, rest);
        };
    };

    /**
     * 析构函数
     */
    Proxy.prototype.dispose = function dispose() {
        this.api = null;
        this.callback = null;
    };

    quick.Proxy = Proxy;
}