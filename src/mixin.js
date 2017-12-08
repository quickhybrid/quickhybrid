import osMixin from './core/os';
import promiseMixin from './core/promise';
import errorMixin from './core/error';
import proxyMixin from './core/proxy';
import jsbridgeMixin from './core/jsbridge';
import callinnerMixin from './core/callinner';
import defineapiMixin from './core/defineapi';
import callnativeapiMixin from './core/callnativeapi';
import initMixin from './core/init';
import innerUtilMixin from './core/innerutil';

export default function mixin(hybrid) {
    const hybridJs = hybrid;
    
    osMixin(hybridJs);
    promiseMixin(hybridJs);
    errorMixin(hybridJs);
    // 赖于promise，是否有Promise决定返回promise对象还是普通函数
    proxyMixin(hybridJs);
    // 依赖于showError，globalError，os
    jsbridgeMixin(hybridJs);
    // api没有runcode时的默认实现，依赖于jsbridge与os
    callinnerMixin(hybridJs);
    // 依赖于os，Proxy，globalError，showError，以及callInner
    defineapiMixin(hybridJs);
    // 依赖于JSBridge，Promise,sbridge
    callnativeapiMixin(hybridJs);
    // init依赖与基础库以及部分原生的API
    initMixin(hybridJs);
    // 给API快速使用的内部工具集
    innerUtilMixin(hybridJs);
}