import { expect } from 'chai';
import {
    noop,
} from '../src/util/lang';
import hybridJs from '../src/index';
import defineapiMixin from '../src/core/defineapi';

describe('拓展模块', () => {
    beforeEach(() => {
        hybridJs.os.h5 = true;
    });
    
    it('拓展一个测试模块，并执行API', (done) => {
        hybridJs.extendModule('test', [{
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
        
        hybridJs.test.foo({
            testKey2: 'test2',
        });
    });
    
    it('拓展一个模块，有a.b形式的命名空间API', (done) => {
        hybridJs.extendModule('test', [{
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
        
        hybridJs.test.parfoo.foo2({
            testKey2: 'test2',
        });
    });
    
    it('拓展一个测试模块，内部无h5环境', (done) => {
        hybridJs.os.h5 = false;
        hybridJs.extendModule('test', [{
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
        
        hybridJs.test.foo();
    });
    
    it('拓展一个测试模块，不传os并调用', () => {
        hybridJs.os.h5 = false;
        hybridJs.extendModule('test', [{
            namespace: 'foo2',
        }]);
        
        hybridJs.test.foo2();
    });
    
    it('拓展模块，不加参数', () => {
        hybridJs.extendModule('test');
    });
    
    it('尝试修改已经拓展的模块', (done) => {
        hybridJs.error((err) => {
            // 错误码要一致
            expect(err.code).to.be.equal(hybridJs.globalError.ERROR_TYPE_MODULEMODIFY.code);
            done();
        });
        hybridJs.extendModule('test', [{
            namespace: 'foo',
            os: ['h5'],
            defaultParams: {
                // 已选人员的用户guid列表
                testKey: 'test',
            },
            runCode() {},
        }]);
        
        hybridJs.test = 'xxx';
    });
});

describe('拓展API', () => {
    let index = 0;
    
    beforeEach(() => {
        index += 1;
        hybridJs.error(noop);
    });
    
    it('拓展一个API，非法参数', () => {
        hybridJs.extendApi('test2');
    });
    
    it('拓展一个API', (done) => {
        hybridJs.extendApi('test2', {
            namespace: `api${index}`,
            os: ['h5'],
            runCode() {
                done();
            },
        });
        
        hybridJs.test2[`api${index}`]();
    });
    
    it('拓展一个API，然后尝试修改', (done) => {
        hybridJs.error((err) => {
            // 错误码要一致
            expect(err.code).to.be.equal(hybridJs.globalError.ERROR_TYPE_APIMODIFY.code);
            done();
        });
        hybridJs.extendApi('test2', {
            namespace: `api${index}`,
            os: ['h5'],
            runCode() {
            },
        });
        
        hybridJs.test2[`api${index}`] = 'sss';
    });
    
    it('拓展一个API,无runcode,重新定义callInner', (done) => {
        const params = {
            testKey2: 'test2',
        };
        hybridJs.callInner = (options) => {
            expect(options).to.be.equal(params);
            done();
        };
        defineapiMixin(hybridJs);
        hybridJs.extendApi('test2', {
            namespace: `api${index}`,
            os: ['h5'],
        });
        
        hybridJs.test2[`api${index}`](params);
    });
    
    it('拓展native环境，调用h5环境', (done) => {
        hybridJs.error((err) => {
            // 错误码要一致
            expect(err.code).to.be.equal(hybridJs.globalError.ERROR_TYPE_APIOS.code);
            done();
        });
        hybridJs.extendApi('test2', {
            namespace: `api${index}`,
            os: ['quick'],
            runCode() {
                done();
            },
        });
        
        hybridJs.test2[`api${index}`]();
        
        done();
    });
});