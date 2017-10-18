import osMixin from './core/os';
import promiseMixin from './core/promise';
import errorMixin from './core/error';
import proxyMixin from './core/proxy';
import jsbridgeMixin from './core/jsbridge';
import callinnerMixin from './core/callinner';
import defineapiMixin from './core/defineapi';
import callnativeapiMixin from './core/callnativeapi';
import initMixin from './core/init';
import apiMixin from './api/index';

export default function mixin(hybridJs) {
    const quick = hybridJs;
    
    osMixin(quick);
    promiseMixin(quick);
    errorMixin(quick);
    // 不依赖于promise，但是是否有Promise决定返回promise对象还是普通函数
    proxyMixin(quick);
    // 依赖于showError，globalError，os
    jsbridgeMixin(quick);
    // api没有runcode时的默认实现，依赖于jsbridge与os
    callinnerMixin(quick);
    // 依赖于os，Proxy，globalError，showError，以及callInner
    defineapiMixin(quick);
    // 依赖于JSBridge，Promise,sbridge
    callnativeapiMixin(quick);
    // init依赖与基础库以及部分原生的API
    initMixin(quick);
    // api添加，这才是实际调用的api
    apiMixin(quick);
}