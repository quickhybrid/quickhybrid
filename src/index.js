import osMixin from './core/os';
import promiseMixin from './core/promise';
import errorMixin from './core/error';
import proxyMixin from './core/proxy';
import jsbridgeMixin from './core/jsbridge';
import calljsbridgeMixin from './core/calljsbridge';
import defaultcallMixin from './core/defaultcall';
import defineapiMixin from './core/defineapi';
import callnativeapiMixin from './core/callnativeapi';
import initMixin from './core/init';

const quick = {};

osMixin(quick);
promiseMixin(quick);
errorMixin(quick);
// 不依赖于promise，但是是否有Promise决定返回promise对象还是普通函数
proxyMixin(quick);
// 依赖于showError，globalError，os
jsbridgeMixin(quick);
// 依赖于jsbridge
calljsbridgeMixin(quick);
// api没有runcode时的默认实现，依赖于calljsbridgeMixin与os
defaultcallMixin(quick);
// 依赖于os，Proxy，globalError，showError，以及defaultCall
defineapiMixin(quick);
// 依赖于JSBridge，Promise,calljsbridgeMixin
callnativeapiMixin(quick);
// init依赖与基础库以及部分原生的API
initMixin(quick);

quick.Version = '3.0.0';

export default quick;