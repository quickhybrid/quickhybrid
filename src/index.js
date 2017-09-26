import initMixin from './core/init';
import osMixin from './core/os';
import globalerrorMixin from './core/globalerror';

const quick = {};

osMixin(quick);
globalerrorMixin(quick);
initMixin(quick);

quick.Version = '3.0.0';

export default quick;