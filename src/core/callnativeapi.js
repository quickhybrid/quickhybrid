import generateJSBridgeTrigger from '../inner/triggerjsbridge';

/**
 * 定义如何调用一个API
 * 一般指调用原生环境下的API
 * 依赖于Promise,calljsbridgeMixin
 */
export default function callnativeapiMixin(hybrid) {
    const hybridJs = hybrid;
    const JSBridge = hybridJs.JSBridge;
    const callJsBridge = generateJSBridgeTrigger(JSBridge);
    
    /**
     * 调用自定义API
     * @param {Object} options 配置参数
     * @return {Object} 返回一个Promise对象，如果没有Promise环境，直接返回运行结果
     */
    function callApi(options) {
        // 实时获取promise
        const Promise = hybridJs.getPromise();
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
    
    hybridJs.callApi = callApi;
    hybridJs.callNativeApi = callApi;
}