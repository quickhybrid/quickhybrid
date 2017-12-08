import quick from '../src/index';
import runtimeMixin from '../src/api/native/runtime';

runtimeMixin(quick);

describe('一些API', () => {
    beforeEach(() => {
        quick.os.quick = true;
    });
    it('clipboard', () => {
        quick.runtime.clipboard('hello');
    });
    
    it('openUrl', () => {
        quick.runtime.openUrl('http://www.baidu.com');
    });
});
