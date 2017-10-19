import uiMixin from './native/ui';
import authMixin from './native/auth';
import runtimeMixin from './native/runtime';

const quick = window.quick;

uiMixin(quick);
authMixin(quick);
runtimeMixin(quick);