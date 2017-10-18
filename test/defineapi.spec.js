import { expect } from 'chai';
import {
    noop,
} from '../src/util/lang';
import quick from '../src/index';
import defineapiMixin from '../src/core/defineapi';

describe('拓展模块', () => {
    beforeEach(() => {
        quick.os.h5 = true;
    });
    
    it('拓展一个测试模块，并执行API', (done) => {
        quick.extendModule('test', [{
            namespace: 'foo',
            os: ['h5'],
            defaultParams: {
                // 已选人员的用户guid列表
                testKey: 'test',
            },
            runCode() {
                done();
            },
        }]);
        
        quick.test.foo({
            testKey2: 'test2',
        });
    });
    
    it('拓展一个模块，有a.b形式的命名空间API', (done) => {
        quick.extendModule('test', [{
            namespace: 'parfoo.foo2',
            os: ['h5'],
            defaultParams: {
                // 已选人员的用户guid列表
                testKey: 'test',
            },
            runCode() {
                done();
            },
        }]);
        
        quick.test.parfoo.foo2({
            testKey2: 'test2',
        });
    });
    
    it('拓展一个测试模块，内部无h5环境', (done) => {
        quick.os.h5 = false;
        quick.extendModule('test', [{
            namespace: 'foo',
            os: ['h5'],
            defaultParams: {
                // 已选人员的用户guid列表
                testKey: 'test',
            },
            runCode() {
                done();
            },
        }]);
        
        quick.test.foo();
    });
    
    it('拓展一个测试模块，不传os并调用', () => {
        quick.os.h5 = false;
        quick.extendModule('test', [{
            namespace: 'foo2',
        }]);
        
        quick.test.foo2();
    });
    
    it('拓展模块，不加参数', () => {
        quick.extendModule('test');
    });
    
    it('尝试修改已经拓展的模块', (done) => {
        quick.error((err) => {
            // 错误码要一致
            expect(err.code).to.be.equal(quick.globalError.ERROR_TYPE_MODULEMODIFY.code);
            done();
        });
        quick.extendModule('test', [{
            namespace: 'foo',
            os: ['h5'],
            defaultParams: {
                // 已选人员的用户guid列表
                testKey: 'test',
            },
            runCode() {},
        }]);
        
        quick.test = 'xxx';
    });
});

describe('拓展API', () => {
    let index = 0;
    
    beforeEach(() => {
        index += 1;
        quick.error(noop);
    });
    
    it('拓展一个API，非法参数', () => {
        quick.extendApi('test2');
    });
    
    it('拓展一个API', (done) => {
        quick.extendApi('test2', {
            namespace: `api${index}`,
            os: ['h5'],
            runCode() {
                done();
            },
        });
        
        quick.test2[`api${index}`]();
    });
    
    it('拓展一个API，然后尝试修改', (done) => {
        quick.error((err) => {
            // 错误码要一致
            expect(err.code).to.be.equal(quick.globalError.ERROR_TYPE_APIMODIFY.code);
            done();
        });
        quick.extendApi('test2', {
            namespace: `api${index}`,
            os: ['h5'],
            runCode() {
            },
        });
        
        quick.test2[`api${index}`] = 'sss';
    });
    
    it('拓展一个API,无runcode,重新定义callInner', (done) => {
        const params = {
            testKey2: 'test2',
        };
        quick.callInner = (options) => {
            expect(options).to.be.equal(params);
            done();
        };
        defineapiMixin(quick);
        quick.extendApi('test2', {
            namespace: `api${index}`,
            os: ['h5'],
        });
        
        quick.test2[`api${index}`](params);
    });
    
    it('拓展quick环境，调用h5环境', (done) => {
        quick.error((err) => {
            // 错误码要一致
            expect(err.code).to.be.equal(quick.globalError.ERROR_TYPE_APIOS.code);
            done();
        });
        quick.extendApi('test2', {
            namespace: `api${index}`,
            os: ['quick'],
            runCode() {
                done();
            },
        });
        
        quick.test2[`api${index}`]();
        
        done();
    });
});