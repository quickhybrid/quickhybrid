import globalError from '../inner/globalerror';
import {
    warn,
} from '../util/debug';

export default function errorMixin(hybrid) {
    const hybridJs = hybrid;
    let errorFunc;
    
    /**
     * 提示全局错误
     * @param {Nunber} code 错误代码
     * @param {String} msg 错误提示
     */
    function showError(code = 0, msg = '错误!') {
        warn(`code:${code}, msg:${msg}`);
        errorFunc && errorFunc({
            code,
            message: msg,
        });
    }
    
    hybridJs.showError = showError;
    
    hybridJs.globalError = globalError;
    
    /**
     * 当出现错误时，会通过这个函数回调给开发者，可以拿到里面的提示信息
     * @param {Function} callback 开发者设置的回调(每次会监听一个全局error函数)
     * 回调的参数好似
     * msg 错误信息
     * code 错误码
     */
    hybridJs.error = function error(callback) {
        errorFunc = callback;
    };
}