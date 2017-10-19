import {
    expect,
} from 'chai';
import {
    noop,
} from '../src/util/lang';
import hybridJs from '../src/index';
import Promise from './inner/promise';

describe('直接调用原生api', () => {
    let curShotCallbackId;

    beforeEach(() => {
        hybridJs.os.quick = true;
        window.top.prompt = (uri) => {
            curShotCallbackId = uri.match(/\w+[:][/]{2}\w+[:](\d+)/)[1];
            expect(+curShotCallbackId).to.be.a('number');
        };
    });

    it('调用短期回调并（回调正确）', (done) => {
        hybridJs.callNativeApi({
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

        hybridJs.JSBridge._handleMessageFromNative({
            responseId: curShotCallbackId,
            responseData: {
                code: 1,
            },
        });
    });
    
    it('调用空', () => {
        hybridJs.callNativeApi();
    });
});

describe('Promise调用原生api', () => {
    let curShotCallbackId;

    beforeEach(() => {
        hybridJs.os.quick = true;
        hybridJs.setPromise(Promise);
        window.top.prompt = (uri) => {
            curShotCallbackId = uri.match(/\w+[:][/]{2}\w+[:](\d+)/)[1];
            expect(+curShotCallbackId).to.be.a('number');
        };
    });

    it('promise调用短期回调并（回调正确）', (done) => {
        hybridJs.callNativeApi({
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

        hybridJs.JSBridge._handleMessageFromNative({
            responseId: curShotCallbackId,
            responseData: {
                code: 1,
            },
        });
    });
});