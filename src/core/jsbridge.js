import {
    warn,
} from '../util/debug';

/**
 * h5和原生交互，jsbridge核心代码
 * 依赖于showError，globalError，os
 */
export default function jsbridgeMixin(hybrid) {
    const hybridJs = hybrid;
    
    // 必须要有一个全局的JSBridge，否则原生和H5无法通信
    // 定义每次重新生成一个JSBridge
    window.JSBridge = {};
    
    const JSBridge = window.JSBridge;
    // 声明依赖
    const showError = hybridJs.showError;
    const globalError = hybridJs.globalError;
    const os = hybridJs.os;

    hybridJs.JSBridge = JSBridge;

    // jsbridge协议定义的名称
    const CUSTOM_PROTOCOL_SCHEME = 'QuickHybridJSBridge';
    // 本地注册的方法集合,原生只能调用本地注册的方法,否则会提示错误
    const messageHandlers = {};
    // 短期回调函数集合
    // 在原生调用完对应的方法后,会执行对应的回调函数id，并删除
    const responseCallbacks = {};
    // 长期存在的回调，调用后不会删除
    const responseCallbacksLongTerm = {};

    // 唯一id,用来确保长期回调的唯一性，初始化为最大值
    let uniqueLongCallbackId = 2147483647;

    /**
     * 获取短期回调id，内部要避免和长期回调的冲突
     * @return {Number} 返回一个随机的短期回调id
     */
    function getCallbackId() {
        // 确保每次都不会和长期id相同
        return Math.floor(Math.random() * uniqueLongCallbackId);
    }

    /**
     * 将JSON参数转为字符串
     * @param {Object} data 对应的json对象
     * @return {String} 转为字符串后的结果
     */
    function getParam(data) {
        if (typeof data !== 'string') {
            return JSON.stringify(data);
        }

        return data;
    }

    /**
     * 获取最终的url scheme
     * @param {String} proto 协议头，一般不同模块会有不同的协议头
     * @param {Object} message 兼容android中的做法
     * android中由于原生不能获取JS函数的返回值,所以得通过协议传输
     * @return {String} 返回拼接后的uri
     */
    function getUri(proto, message) {
        let uri = `${CUSTOM_PROTOCOL_SCHEME}://${proto}`;

        // 回调id作为端口存在
        let callbackId;
        let method;
        let params;

        if (message.callbackId) {
            // 必须有回调id才能生成一个scheme
            // 这种情况是H5主动调用native时
            callbackId = message.callbackId;
            method = message.handlerName;
            params = message.data;
        }

        // 参数转为字符串
        params = encodeURIComponent(getParam(params));
        // uri 补充,需要编码，防止非法字符
        uri += `:${callbackId}/${method}?${params}`;

        return uri;
    }

    /**
     * JS调用原生方法前,会先send到这里进行处理
     * @param {String} proto 这个属于协议头的一部分
     * @param {JSON} message 调用的方法详情,包括方法名,参数
     * @param {Object} responseCallback 调用完方法后的回调,或者长期回调的id
     */
    function doSend(proto, message, responseCallback) {
        const newMessage = message;

        if (typeof responseCallback === 'function') {
            // 如果传入的回调时函数，需要给它生成id
            // 取到一个唯一的callbackid
            const callbackId = getCallbackId();
            // 回调函数添加到短期集合中
            responseCallbacks[callbackId] = responseCallback;
            // 方法的详情添加回调函数的关键标识
            newMessage.callbackId = callbackId;
        } else {
            // 如果传入时已经是id，代表已经在回调池中了，直接使用即可
            newMessage.callbackId = responseCallback;
        }
        
        // 获取 触发方法的url scheme
        const uri = getUri(proto, newMessage);

        if (os.quick) {
            // 依赖于os判断
            if (os.ios) {
                // ios采用
                window.webkit.messageHandlers.WKWebViewJavascriptBridge.postMessage(uri);
            } else {
                window.top.prompt(uri, '');
            }
        } else {
            // 浏览器
            warn(`浏览器中jsbridge无效,对应scheme:${uri}`);
        }
    }

    /**
     * 注册本地JS方法通过JSBridge给原生调用
     * 我们规定,原生必须通过JSBridge来调用H5的方法
     * 注意,这里一般对本地函数有一些要求,要求第一个参数是data,第二个参数是callback
     * @param {String} handlerName 方法名
     * @param {Function} handler 对应的方法
     */
    JSBridge.registerHandler = function registerHandler(handlerName, handler) {
        messageHandlers[handlerName] = handler;
    };

    /**
     * 注册长期回调到本地
     * @param {String} callbackId 回调id
     * @param {Function} callback 对应回调函数
     */
    JSBridge.registerLongCallback = function registerLongCallback(callbackId, callback) {
        responseCallbacksLongTerm[callbackId] = callback;
    };

    /**
     * 获得本地的长期回调，每一次都是一个唯一的值
     * @retrurn 返回对应的回调id
     * @return {Number} 返回长期回调id
     */
    JSBridge.getLongCallbackId = function getLongCallbackId() {
        uniqueLongCallbackId -= 1;
        
        return uniqueLongCallbackId;
    };

    /**
     * 调用原生开放的方法
     * @param {String} proto 这个属于协议头的一部分
     * @param {String} handlerName 方法名
     * @param {JSON} data 参数
     * @param {Object} callback 回调函数或者是长期的回调id
     */
    JSBridge.callHandler = function callHandler(proto, handlerName, data, callback) {
        doSend(proto, {
            handlerName,
            data,
        }, callback);
    };

    /**
     * 原生调用H5页面注册的方法,或者调用回调方法
     * @param {String} messageJSON 对应的方法的详情,需要手动转为json
     */
    JSBridge._handleMessageFromNative = function _handleMessageFromNative(messageJSON) {
        /**
         * 处理原生过来的方法
         */
        function doDispatchMessageFromNative() {
            let message;

            try {
                if (typeof messageJSON === 'string') {
                    message = decodeURIComponent(messageJSON);
                    message = JSON.parse(message);
                } else {
                    message = messageJSON;
                }
            } catch (e) {
                showError(
                    globalError.ERROR_TYPE_NATIVECALL.code,
                    globalError.ERROR_TYPE_NATIVECALL.msg);

                return;
            }

            // 回调函数
            const responseId = message.responseId;
            const responseData = message.responseData;
            let responseCallback;

            if (responseId) {
                // 这里规定,原生执行方法完毕后准备通知h5执行回调时,回调函数id是responseId
                responseCallback = responseCallbacks[responseId];
                // 默认先短期再长期
                responseCallback = responseCallback || responseCallbacksLongTerm[responseId];
                // 执行本地的回调函数
                responseCallback && responseCallback(responseData);

                delete responseCallbacks[responseId];
            } else {
                /**
                 * 否则,代表原生主动执行h5本地的函数
                 * 从本地注册的函数中获取
                 */
                const handler = messageHandlers[message.handlerName];
                const data = message.data;
                
                // 执行本地函数,按照要求传入数据和回调
                handler && handler(data);
            }
        }
        
        // 使用异步
        setTimeout(doDispatchMessageFromNative);
    };
}