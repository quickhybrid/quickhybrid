import { expect } from 'chai';
import {
    noop,
    extend,
} from '../src/util/lang';
import quick from '../src/index';
import Promise from './inner/promise';

describe('拓展一个测试模块并通过calljsbridge调用', () => {
    let curShotCallbackId;

    beforeEach(() => {
        quick.os.quick = true;
        quick.setPromise(Promise);
        window.top.prompt = function(uri) {
            curShotCallbackId = uri.match(/\w+[:][/]{2}\w+[:](\d+)/)[1];
            console.log(curShotCallbackId);
        };
    });

    it('注册短期回调并调用（回调正确）', (done) => {
        quick.extendModule('test', [{
            namespace: 'foo',
            os: ['quick'],
            runCode(options, resolve, reject) {
                const newOptions = extend({}, options);

                newOptions.dataFilter = (res) => {
                    return res;
                };

                quick.callInner.call(this, newOptions, resolve, reject);
            },
        }]);

        quick.test.foo({
            success: () => {
                done();
            }
        });

        quick.JSBridge._handleMessageFromNative({
            responseId: curShotCallbackId,
            responseData: {
                code: 1
            },
        });
    });

    it('注册短期回调并调用（回调错误）', (done) => {
        quick.extendModule('test', [{
            namespace: 'foo',
            os: ['quick'],
            runCode(options, resolve, reject) {
                quick.callInner.call(this, options, resolve, reject);
            },
        }]);

        quick.test.foo({
            success: () => {},
            error: () => {
                done();
            }
        });

        quick.JSBridge._handleMessageFromNative({
            responseId: curShotCallbackId,
            responseData: {
                code: 0
            },
        });
    });

    it('注册长期回调并调用', (done) => {
        quick.extendModule('test', [{
            namespace: 'fooLong',
            os: ['quick'],
            runCode(options, resolve, reject) {
                this.api.isLongCb = true;
                quick.callInner.call(this, options, resolve, reject);
            },
        }]);

        // long的promise几乎无效
        quick.test.fooLong().then(() => {
            // 确定有立马执行then
            done();
        });
    });

    it('注册事件并调用', (done) => {
        quick.extendModule('test', [{
            namespace: 'fooEvent',
            os: ['quick'],
            runCode(options, resolve, reject) {
                this.api.isLongCb = true;
                // 标识是event，event的时候需要额外增加一个port参数，对应相应的长期回调id
                this.api.isEvent = true;
                quick.callInner.call(this, options, resolve, reject);
                done();
            },
        }]);

        quick.test.fooEvent();
    });

});