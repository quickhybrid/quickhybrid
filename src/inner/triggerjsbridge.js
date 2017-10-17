/**
 * 内部触发jsbridge的方式，作为一个工具类提供
 */
export default function generateJSBridgeTrigger(JSBridge) {
    /**
     * 有三大类型，短期回调，延时回调，长期回调，其中长期回调中又有一个event比较特殊
     * @param {JSON} options 配置参数，包括
     * handlerName 方法名
     * data 额外参数
     * isLongCb 是否是长期回调，如果是，则会生成一个长期回调id，以长期回调的形式存在
     * proto 对应方法的模块名
     * 其它 代表相应的头部
     * @param {Function} resolve promise中成功回调函数
     * @param {Function} reject promise中失败回调函数
     */
    return function callJsBridge(options, resolve, reject) {
        const success = options.success;
        const error = options.error;
        const dataFilter = options.dataFilter;
        const proto = options.proto;
        const handlerName = options.handlerName;
        const isLongCb = options.isLongCb;
        const isEvent = options.isEvent;
        const data = options.data;
        
        // 统一的回调处理
        const cbFunc = (res) => {
            if (res.code === 0) {
                error && error(res);
                // 长期回调不走promise
                !isLongCb && reject && reject(res);
            } else {
                let finalRes = res;
                
                if (dataFilter) {
                    finalRes = dataFilter(finalRes);
                }
                // 提取出result
                success && success(finalRes.result);
                !isLongCb && resolve && resolve(finalRes.result);
            }
        };
        
        if (isLongCb) {
            /**
             * 长期回调的做法，需要注册一个长期回调id,每一个方法都有一个固定的长期回调id
             * 短期回调的做法(短期回调执行一次后会自动销毁)
             * 但长期回调不会销毁，因此可以持续触发，例如下拉刷新
             * 长期回调id通过函数自动生成，每次会获取一个唯一的id
             */
            const longCbId = JSBridge.getLongCallbackId();
            
            if (isEvent) {
                // 如果是event，data里需要增加一个参数
                data.port = longCbId;
            }
            JSBridge.registerLongCallback(longCbId, cbFunc);
            // 传入的是id
            JSBridge.callHandler(proto, handlerName, data, longCbId);
            // 长期回调默认就成功了，这是兼容的情况，防止有人误用
            resolve && resolve();
        } else {
            // 短期回调直接使用方法
            JSBridge.callHandler(proto, handlerName, data, cbFunc);
        }
    };
}