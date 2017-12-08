import uiMixin from './h5/ui';
import pageMixin from './h5/page';
import storageMixin from './h5/storage';
import deviceMixin from './h5/device';

const hybridJs = window.quick;

uiMixin(hybridJs);
pageMixin(hybridJs);
storageMixin(hybridJs);
deviceMixin(hybridJs);
