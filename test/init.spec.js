import {
    expect,
} from 'chai';
import {
    noop,
} from '../src/util/lang';
import mixin from '../src/mixin';
import errorMixin from '../src/core/error';
import jsbridgeMixin from '../src/core/jsbridge';
import initMixin from '../src/core/init';
import osMixin from '../src/core/os';
import authMixin from '../src/api/native/auth';
import runtimeMixin from '../src/api/native/runtime';

let quick;

describe('H5下的config', () => {
    before(() => {
        quick = {};
        mixin(quick);
        authMixin(quick);
        runtimeMixin(quick);
    });

    it('正常的ready', (done) => {
        quick.config();

        quick.ready(() => {
            expect(1).to.be.equal(1);
            done();
        });
    });

    it('H5多次config', (done) => {
        quick.error(() => {
            expect(1).to.be.equal(1);
            done();
        });

        quick.config();
    });

    it('H5多次ready', (done) => {
        quick.error(() => {
            expect(1).to.be.equal(1);
            done();
        });

        quick.ready();
    });
});

describe('先ready再config', () => {
    before(() => {
        quick = {};
        mixin(quick);
        authMixin(quick);
        runtimeMixin(quick);
    });

    it('正常ready成功', (done) => {
        quick.ready(() => {
            done();
        });
        quick.config();
    });
});

describe('触发注册的错误函数', () => {
    it('通过JSbridge触发', () => {
        quick.JSBridge._handleMessageFromNative({
            handlerName: 'handleError',
            data: {
                test: 'test',
            },
        });
    });
});

describe('quick环境的初始化', () => {
    let innerTrigger = noop;

    beforeEach(() => {
        quick = {};
        mixin(quick);
        authMixin(quick);
        runtimeMixin(quick);
        quick.version = '1.0.0';
        quick.os.quick = true;
        window.top.prompt = (uri) => {
            const curMatch = uri.match(/\w+[:][/]{2}(\w+)[:](\d+)/);
            const curCallbackId = curMatch[2];
            const curCallbackName = curMatch[1];

            expect(+curCallbackId).to.be.a('number');
            expect(curCallbackName).to.be.a('string');
            
            innerTrigger && innerTrigger(curCallbackId, curCallbackName);

            console.log(`监听回调uri:${uri}`);
        };
    });

    it('ready,并触发正确的version与config', (done) => {
        innerTrigger = (curCallbackId, curCallbackName) => {
            if (curCallbackName === 'auth') {
                // 立马回调
                quick.JSBridge._handleMessageFromNative({
                    responseId: curCallbackId,
                    responseData: {
                        code: 1,
                    },
                });
            } else if (curCallbackName === 'runtime') {
                quick.JSBridge._handleMessageFromNative({
                    responseId: curCallbackId,
                    responseData: {
                        code: 1,
                        result: {
                            version: '1.0.0',
                        },
                    },
                });
            }
        };
        quick.ready(() => {
            done();
        });
        quick.config({});
    });
    
    it('ready,错误的config与错误的版本号', (done) => {
        innerTrigger = (curCallbackId, curCallbackName) => {
            if (curCallbackName === 'auth') {
                // 立马回调
                quick.JSBridge._handleMessageFromNative({
                    responseId: curCallbackId,
                    responseData: {
                        code: 0,
                    },
                });
            } else if (curCallbackName === 'runtime') {
                quick.JSBridge._handleMessageFromNative({
                    responseId: curCallbackId,
                    responseData: {
                        code: 0,
                        result: {
                            version: '1.0.0',
                        },
                    },
                });
            }
        };
        quick.error(() => {
            done();
        });
        quick.config({});
    });
    
    it('ready,但给出错误的版本号', (done) => {
        innerTrigger = (curCallbackId, curCallbackName) => {
            if (curCallbackName === 'auth') {
                // 立马回调
                quick.JSBridge._handleMessageFromNative({
                    responseId: curCallbackId,
                    responseData: {
                        code: 1,
                    },
                });
            } else if (curCallbackName === 'runtime') {
                quick.JSBridge._handleMessageFromNative({
                    responseId: curCallbackId,
                    responseData: {
                        code: 1,
                        result: {
                            version: '2.0.0',
                        },
                    },
                });
            }
        };
        quick.ready(() => {
            done();
        });
        quick.config({});
    });
});

describe('quick环境，但是没有API', () => {
    beforeEach(() => {
        quick = {};
        errorMixin(quick);
        jsbridgeMixin(quick);
        initMixin(quick);
        osMixin(quick);
        quick.version = '1.0.0';
        quick.os.quick = true;
    });
    
    it('由于没有API，并且是quick环境，ready失败', (done) => {
        quick.error(() => {
            done();
        });
        quick.config();
    });
});