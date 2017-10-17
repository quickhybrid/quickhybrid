import generateJSBridgeTrigger from '../inner/triggerjsbridge';

/**
 * 定义如何调用一个API
 * 一般指调用原生环境下的API
 * 依赖于Promise,calljsbridgeMixin
 */
export default function callnativeapiMixin(hybridJs) {
    const quick = hybridJs;
    const JSBridge = quick.JSBridge;
    const callJsBridge = generateJSBridgeTrigger(JSBridge);
    
    /**
     * 调用自定义API
     * @param {Object} options 配置参数
     * @return {Object} 返回一个Promise对象，如果没有Promise环境，直接返回运行结果
     */
    function callApi(options) {
        // 实时获取promise
        const Promise = quick.getPromise();
        const finalOptions = options || {};

        const callback = (resolve, reject) => {
            callJsBridge({
                handlerName: finalOptions.name,
                proto: finalOptions.mudule,
                data: finalOptions.data || {},
                success: finalOptions.success,
                error: finalOptions.error,
                isLongCb: finalOptions.isLongCb,
                isEvent: finalOptions.isEvent,
            }, resolve, reject);
        };
        
        
        return (Promise && new Promise(callback)) || callback();
    }
    
    quick.callApi = callApi;
    quick.callNativeApi = callApi;
}