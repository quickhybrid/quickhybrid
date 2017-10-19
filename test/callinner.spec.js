import {
    expect,
} from 'chai';
import {
    extend,
} from '../src/util/lang';
import hybridJs from '../src/index';
import Promise from './inner/promise';

describe('拓展一个测试模块并通过calljsbridge调用', () => {
    let curShotCallbackId;

    beforeEach(() => {
        hybridJs.os.quick = true;
        hybridJs.setPromise(Promise);
        window.top.prompt = (uri) => {
            curShotCallbackId = uri.match(/\w+[:][/]{2}\w+[:](\d+)/)[1];
            expect(+curShotCallbackId).to.be.a('number');
        };
    });

    it('注册短期回调并调用（回调正确）', (done) => {
        hybridJs.extendModule('test', [{
            namespace: 'foo',
            os: ['quick'],
            runCode(options, resolve, reject) {
                const newOptions = extend({}, options);

                newOptions.dataFilter = res => res;

                hybridJs.callInner.call(this, newOptions, resolve, reject);
            },
        }]);

        hybridJs.test.foo({
            success: () => {
                done();
            },
        });

        hybridJs.JSBridge._handleMessageFromNative({
            responseId: curShotCallbackId,
            responseData: {
                code: 1,
            },
        });
    });

    it('注册短期回调并调用（回调错误）', (done) => {
        hybridJs.extendModule('test', [{
            namespace: 'foo',
            os: ['quick'],
            runCode(options, resolve, reject) {
                hybridJs.callInner.call(this, options, resolve, reject);
            },
        }]);

        hybridJs.test.foo({
            success: () => {},
            error: () => {
                done();
            },
        });

        hybridJs.JSBridge._handleMessageFromNative({
            responseId: curShotCallbackId,
            responseData: {
                code: 0,
            },
        });
    });

    it('注册长期回调并调用', (done) => {
        hybridJs.extendModule('test', [{
            namespace: 'fooLong',
            os: ['quick'],
            runCode(options, resolve, reject) {
                this.api.isLongCb = true;
                hybridJs.callInner.call(this, options, resolve, reject);
            },
        }]);

        // long的promise几乎无效
        hybridJs.test.fooLong().then(() => {
            // 确定有立马执行then
            done();
        });
    });

    it('注册事件并调用', (done) => {
        hybridJs.extendModule('test', [{
            namespace: 'fooEvent',
            os: ['quick'],
            runCode(options, resolve, reject) {
                this.api.isLongCb = true;
                // 标识是event，event的时候需要额外增加一个port参数，对应相应的长期回调id
                this.api.isEvent = true;
                hybridJs.callInner.call(this, options, resolve, reject);
                done();
            },
        }]);
        hybridJs.test.fooEvent();
    });
});