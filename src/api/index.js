import apinativeMixin from './native/index';
import apih5Mixin from './h5/index';

export default function apiMixin(hybridJs) {
    apinativeMixin(hybridJs);
    apih5Mixin(hybridJs);
}
