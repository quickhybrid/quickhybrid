import { expect } from 'chai';
import {
    noop,
    extend,
} from '../src/util/lang';
import quick from '../src/index';
import Promise from './inner/promise';

describe('直接调用原生api', () => {
    let curShotCallbackId;

    beforeEach(() => {
        quick.os.quick = true;
        window.top.prompt = function(uri) {
            curShotCallbackId = uri.match(/\w+[:][/]{2}\w+[:](\d+)/)[1];
        };
    });

    it('调用短期回调并（回调正确）', (done) => {
        quick.callNativeApi({
            handlerName: 'foo',
            proto: 'test',
            data: undefined,
            success: () => {
                done();
            },
            error: noop,
            isLongCb: undefined,
            isEvent: undefined,
        });

        quick.JSBridge._handleMessageFromNative({
            responseId: curShotCallbackId,
            responseData: {
                code: 1
            },
        });
    });
    
    it('调用空', () => {
        quick.callNativeApi();
    });

});

describe('Promise调用原生api', () => {
    let curShotCallbackId;

    beforeEach(() => {
        quick.os.quick = true;
        quick.setPromise(Promise);
        window.top.prompt = function(uri) {
            curShotCallbackId = uri.match(/\w+[:][/]{2}\w+[:](\d+)/)[1];
        };
    });

    it('promise调用短期回调并（回调正确）', (done) => {
        quick.callNativeApi({
            handlerName: 'foo',
            proto: 'test',
            data: undefined,
            success: noop,
            error: noop,
            isLongCb: undefined,
            isEvent: undefined,
        }).then(() => {
            done();
        });

        quick.JSBridge._handleMessageFromNative({
            responseId: curShotCallbackId,
            responseData: {
                code: 1
            },
        });
    });

});