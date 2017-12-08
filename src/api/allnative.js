import uiMixin from './native/ui';
import authMixin from './native/auth';
import runtimeMixin from './native/runtime';
import deviceMixin from './native/device';
import pageMixin from './native/page';
import navigatorMixin from './native/navigator';
import utilMixin from './native/util';

const hybridJs = window.quick;

uiMixin(hybridJs);
authMixin(hybridJs);
runtimeMixin(hybridJs);
deviceMixin(hybridJs);
pageMixin(hybridJs);
navigatorMixin(hybridJs);
utilMixin(hybridJs);