import {
    noop,
} from '../util/lang';

/**
 * 定义API的添加
 * 必须按照特定方法添加API才能正常的代理
 * 依赖于一些基本库
 * os
 * Proxy
 * globalError
 * showError
 * callInner
 */
export default function defineapiMixin(hybrid) {
    const hybridJs = hybrid;
    const Proxy = hybridJs.Proxy;
    const globalError = hybridJs.globalError;
    const showError = hybridJs.showError;
    const os = hybridJs.os;
    const callInner = hybridJs.callInner;

    /**
     * 存放所有的代理 api对象
     * 每一个命名空间下的每一个os都可以执行
     * proxyapi[namespace][os]
     */
    const proxysApis = {};

    /**
     * 存放所有的代理 module对象
     */
    const proxysModules = {};

    const supportOsArray = ['quick', 'dd', 'h5'];

    function getCurrProxyApiOs(currOs) {
        for (let i = 0, len = supportOsArray.length; i < len; i += 1) {
            if (currOs[supportOsArray[i]]) {
                return supportOsArray[i];
            }
        }

        // 默认是h5
        return 'h5';
    }

    function getModuleApiParentByNameSpace(module, namespace) {
        let apiParent = module;
        // 只取命名空间的父级,如果仅仅是xxx，是没有父级的
        const parentNamespaceArray = /[.]/.test(namespace)
            ? namespace.replace(/[.][^.]+$/, '').split('.')
            : [];
            
        parentNamespaceArray.forEach((item) => {
            apiParent[item] = apiParent[item] || {};
            apiParent = apiParent[item];
        });

        return apiParent;
    }

    function proxyApiNamespace(apiParent, apiName, finalNameSpace, api) {
        // 代理API，将apiParent里的apiName代理到Proxy执行
        Object.defineProperty(apiParent, apiName, {
            configurable: true,
            enumerable: true,
            get: function proxyGetter() {
                // 确保get得到的函数一定是能执行的
                const nameSpaceApi = proxysApis[finalNameSpace];
                // 得到当前是哪一个环境，获得对应环境下的代理对象
                const proxyObj = nameSpaceApi[getCurrProxyApiOs(os)] || nameSpaceApi.h5;
                
                if (proxyObj) {
                    /**
                     * 返回代理对象，所以所有的api都会通过这个代理函数
                     * 注意引用问题，如果直接返回原型链式的函数对象，由于是在getter中，里面的this会被改写
                     * 所以需要通过walk后主动返回
                     */
                    return proxyObj.walk();
                }

                // 正常情况下走不到，除非预编译的时候在walk里手动抛出
                const osErrorTips = api.os ? (api.os.join('或')) : '"非法"';
                const msg = `${api.namespace}要求的os环境为:${osErrorTips}`;

                showError(globalError.ERROR_TYPE_APIOS.code, msg);

                return noop;
            },
            set: function proxySetter() {
                showError(globalError.ERROR_TYPE_APIMODIFY.code,
                    globalError.ERROR_TYPE_APIMODIFY.msg);
            },
        });
    }
    
    /**
     * 监听模块，防止被篡改
     * @param {String} moduleName 模块名
     */
    function observeModule(moduleName) {
        Object.defineProperty(hybridJs, moduleName, {
            configurable: true,
            enumerable: true,
            get: function proxyGetter() {
                if (!proxysModules[moduleName]) {
                    proxysModules[moduleName] = {};
                }

                return proxysModules[moduleName];
            },
            set: function proxySetter() {
                showError(globalError.ERROR_TYPE_MODULEMODIFY.code,
                    globalError.ERROR_TYPE_MODULEMODIFY.msg);
            },
        });
    }

    /**
     * 在某一个模块下拓展一个API
     * @param {String} moduleName 模块名
     * @param {String} apiParam api对象,包含
     * namespace 命名空间
     * os 支持的环境
     * defaultParams 默认参数
     */
    function extendApi(moduleName, apiParam) {
        if (!apiParam || !apiParam.namespace) {
            return;
        }
        if (!hybridJs[moduleName]) {
            // 如果没有定义模块，监听整个模块，用代理取值，防止重定义
            // 这样，模块只允许初次定义以及之后的赋值，其它操作都会被内部拒绝
            observeModule(moduleName);
        }
        
        const api = apiParam;
        const modlue = hybridJs[moduleName];
        const apiNamespace = api.namespace;

        // api加上module关键字，方便内部处理
        api.moduleName = moduleName;

        const apiParent = getModuleApiParentByNameSpace(modlue, apiNamespace);

        // 最终的命名空间是包含模块的
        const finalNameSpace = `${moduleName}.${api.namespace}`;
        // 如果仅仅是xxx，直接取xxx，如果aa.bb，取bb
        const apiName = /[.]/.test(apiNamespace) ?
            api.namespace.match(/[.][^.]+$/)[0].substr(1) :
            apiNamespace;

        // 这里防止触发代理，就不用apiParent[apiName]了，而是用proxysApis[finalNameSpace]
        if (!proxysApis[finalNameSpace]) {
            // 如果还没有代理这个API的命名空间，代理之，只需要设置一次代理即可
            proxyApiNamespace(apiParent, apiName, finalNameSpace, api);
        }

        // 一个新的API代理，会替换以前API命名空间中对应的内容
        let apiRuncode = api.runCode;

        if (!apiRuncode && callInner) {
            // 如果没有runcode，默认使用callInner
            apiRuncode = callInner;
        }

        const newApiProxy = new Proxy(api, apiRuncode);
        const oldProxyNamespace = proxysApis[finalNameSpace] || {};
        const oldProxyOsNotUse = {};

        proxysApis[finalNameSpace] = {};

        supportOsArray.forEach((osTmp) => {
            if (api.os && api.os.indexOf(osTmp) !== -1) {
                // 如果存在这个os，并且合法，重新定义
                proxysApis[finalNameSpace][osTmp] = newApiProxy;
                oldProxyOsNotUse[osTmp] = true;
            } else if (oldProxyNamespace[osTmp]) {
                // 否则仍然使用老版本的代理
                proxysApis[finalNameSpace][osTmp] = oldProxyNamespace[osTmp];
                // api本身的os要添加这个环境，便于提示
                api.os && api.os.push(osTmp);
            }
        });

        Object.keys(oldProxyOsNotUse).forEach((notUseOs) => {
            // 析构不用的代理
            oldProxyNamespace[notUseOs] && oldProxyNamespace[notUseOs].dispose();
        });
    }
    
    /**
     * 拓展整个对象的模块
     * @param {String} moduleName 模块名
     * @param {Array} apis 对应的api数组
     */
    function extendModule(moduleName, apis) {
        if (!apis || !Array.isArray(apis)) {
            return;
        }
        if (!hybridJs[moduleName]) {
            // 如果没有定义模块，监听整个模块，用代理取值，防止重定义
            // 这样，模块只允许初次定义以及之后的赋值，其它操作都会被内部拒绝
            observeModule(moduleName);
        }
        for (let i = 0, len = apis.length; i < len; i += 1) {
            extendApi(moduleName, apis[i]);
        }
    }
    
    hybridJs.extendModule = extendModule;
    hybridJs.extendApi = extendApi;
}