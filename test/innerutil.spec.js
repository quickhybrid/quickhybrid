import quick from '../src/index';
import Promise from './inner/promise';

describe('非promise情况', () => {
    beforeEach(() => {
        quick.extendModule('test', [{
            namespace: 'fun1',
            os: ['quick'],
            defaultParams: {
                text: '',
                test2: '222',
            },
            runCode(...rest) {
                // 兼容字符串形式
                const args = quick.innerUtil.compatibleStringParamsToObject.call(
                    this,
                    rest,
                    'text');
                
                quick.callInner.apply(this, args);
            },
        }]);
    });
    it('compatibleStringParamsToObject', () => {
        quick.os.quick = true;
        quick.test.fun1('hello');
    });
});

describe('promise情况', () => {
    beforeEach(() => {
        quick.setPromise(Promise);
        quick.extendModule('test', [{
            namespace: 'fun1',
            os: ['quick'],
            defaultParams: {
                text: '',
                test2: '222',
            },
            runCode(...rest) {
                // 兼容字符串形式
                const args = quick.innerUtil.compatibleStringParamsToObject.call(
                    this,
                    rest,
                    'text');
                
                quick.callInner.apply(this, args);
            },
        }]);
    });
    it('compatibleStringParamsToObject', () => {
        quick.os.quick = true;
        quick.test.fun1('hello');
    });
});
