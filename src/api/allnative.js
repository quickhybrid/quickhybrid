import uiMixin from './native/ui';
import authMixin from './native/auth';
import runtimeMixin from './native/runtime';

const hybridJs = window.quick;

uiMixin(hybridJs);
authMixin(hybridJs);
runtimeMixin(hybridJs);