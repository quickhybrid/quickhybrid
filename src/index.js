import initMixin from './core/init';
import osMixin from './core/os';

const quick = {};

initMixin(quick);
osMixin(quick);

quick.Version = '3.0.0';

export default quick;