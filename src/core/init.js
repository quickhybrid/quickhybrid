import {
    log,
} from '../util/debug';
import {
    extend,
    compareVersion,
} from '../util/lang';

/**
 * 初始化给配置全局函数
 */
export default function initMixin(hybrid) {
    const hybridJs = hybrid;
    const globalError = hybridJs.globalError;
    const showError = hybridJs.showError;
    const JSBridge = hybridJs.JSBridge;
    
    /**
     * 几个全局变量 用来控制全局的config与ready逻辑
     * 默认ready是false的
     */
    let readyFunc;
    let isAllowReady = false;
    let isConfig = false;
    
    /**
     * 检查环境是否合法，包括
     * 检测是否有检测版本号，如果不是，给出错误提示
     * 是否版本号小于容器版本号，如果小于，给予升级提示
     */
    function checkEnvAndPrompt() {
        if ((!hybridJs.runtime || !hybridJs.runtime.getQuickVersion)) {
            showError(
                globalError.ERROR_TYPE_VERSIONNOTSUPPORT.code,
                globalError.ERROR_TYPE_VERSIONNOTSUPPORT.msg);
        } else {
            hybridJs.runtime.getQuickVersion({
                success: (result) => {
                    const version = result.version;

                    if (compareVersion(hybridJs.version, version) < 0) {
                        showError(
                            globalError.ERROR_TYPE_VERSIONNEEDUPGRADE.code,
                            globalError.ERROR_TYPE_VERSIONNEEDUPGRADE.msg);
                    }
                },
                error: () => {
                    showError(
                        globalError.ERROR_TYPE_INITVERSIONERROR.code,
                        globalError.ERROR_TYPE_INITVERSIONERROR.msg);
                },
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
    hybridJs.config = function config(params) {
        if (isConfig) {
            showError(
                globalError.ERROR_TYPE_CONFIGMODIFY.code,
                globalError.ERROR_TYPE_CONFIGMODIFY.msg);
        } else {
            isConfig = true;
            
            const success = () => {
                // 如果这时候有ready回调
                if (readyFunc) {
                    log('ready!');
                    readyFunc();
                } else {
                    // 允许ready直接执行
                    isAllowReady = true;
                }
            };

            if (hybridJs.os.quick) {
                // 暂时检查环境默认就进行，因为框架默认注册了基本api的，并且这样2.也可以给予相应提示
                checkEnvAndPrompt();
                
                hybridJs.auth.config(extend({
                    success() {
                        success();
                    },
                    error(error) {
                        const tips = JSON.stringify(error);
                        
                        showError(
                            globalError.ERROR_TYPE_CONFIGERROR.code,
                            tips);
                    },
                }, params || {}));
            } else {
                success();
            }
        }
    };
    
    /**
     * 初始化完毕，并且config验证完毕后会触发这个回调
     * 注意，只有config了，才会触发ready，否则无法触发
     * ready只会触发一次，所以如果同时设置两个，第二个ready回调会无效
     * @param {Function} callback 回调函数
     */
    hybridJs.ready = function ready(callback) {
        if (!readyFunc) {
            readyFunc = callback;
            // 如果config先进行，然后才进行ready,这时候恰好又isAllowReady，代表ready可以直接自动执行
            if (isAllowReady) {
                log('ready!');
                isAllowReady = false;
                readyFunc();
            }
        } else {
            showError(
                globalError.ERROR_TYPE_READYMODIFY.code,
                globalError.ERROR_TYPE_READYMODIFY.msg);
        }
    };
    
    /**
     * 注册接收原生的错误信息
     */
    JSBridge.registerHandler('handleError', (data) => {
        showError(globalError.ERROR_TYPE_NATIVE.code, JSON.stringify(data));
    });
}
