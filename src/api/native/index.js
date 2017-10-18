import authMixin from './auth';
import runtimeMixin from './runtime';
import uiMixin from './ui';

export default function apinativeMixin(hybridJs) {
    authMixin(hybridJs);
    runtimeMixin(hybridJs);
    uiMixin(hybridJs);
}
