import { expect } from 'chai';
import {
    noop,
} from '../src/util/lang';
import hybridJs from '../src/index';
import jsbridgeMixin from '../src/core/jsbridge';

jsbridgeMixin(hybridJs);

describe('注册H5本地函数', () => {
    const handlerName = 'testH5';
    let callback;
    let data;
    
    before(() => {
        data = {
            test: 11,
        };
    });
    
    it('注册本地函数，并触发', (done) => {
        callback = function innerCallback(innerData) {
            expect(innerData).to.be.equal(data);
            done();
        };
        
        hybridJs.JSBridge.registerHandler(handlerName, callback);
        
        hybridJs.JSBridge._handleMessageFromNative({
            handlerName,
            data,
        });
    });
    
    it('触发本地函时格式失败', (done) => {
        hybridJs.JSBridge._handleMessageFromNative('sss');
        
        done();
    });
});

describe('短期回调API', () => {
    it('调用短期API，不回调', (done) => {
        hybridJs.JSBridge.callHandler('testModule', 'testFunc', {
            test: 'sss',
        }, noop);
        
        done();
    });
    
    it('调用短期API，字符串参数', (done) => {
        hybridJs.JSBridge.callHandler('testModule', 'testFunc', JSON.stringify({
            test: 'sss',
        }), noop);
        
        done();
    });
    
    it('调用短期API，无参数', (done) => {
        hybridJs.JSBridge.callHandler('testModule', 'testFunc', null, noop);
        
        done();
    });
    
    it('调用短期API，Android环境', (done) => {
        hybridJs.os.quick = true;
        hybridJs.os.android = true;
        
        jsbridgeMixin(hybridJs);
        
        hybridJs.JSBridge.callHandler('testModule', 'testFunc', JSON.stringify({
            test: 'sss',
        }), noop);
        
        done();
    });
    
    it('调用短期API，iOS环境', (done) => {
        hybridJs.os.quick = true;
        hybridJs.os.ios = true;
        
        jsbridgeMixin(hybridJs);
        
        const innerCallback = () => {
            hybridJs.JSBridge.callHandler('testModule', 'testFunc', JSON.stringify({
                test: 'sss',
            }), noop);
        };
        
        expect(innerCallback).to.throw(Error);
        
        done();
    });
    
    afterEach(() => {
        hybridJs.os.quick = false;
    });
});

describe('长期回调API', () => {
    let callback;
    let responseData;
    let longCbId;

    it('调用长期API，并回调', (done) => {
        responseData = {
            test: 11,
        };
        callback = function innerCallback(innerData) {
            expect(innerData).to.be.equal(responseData);
            done();
        };
        
        longCbId = hybridJs.JSBridge.getLongCallbackId();
        hybridJs.JSBridge.registerLongCallback(longCbId, callback);
        hybridJs.JSBridge.callHandler('testModlue', 'testFunc', {}, longCbId);
        
        hybridJs.JSBridge._handleMessageFromNative({
            responseId: longCbId,
            responseData,
        });
    });
    
    it('调用长期API，字符串形式参数 ', (done) => {
        responseData = JSON.stringify({
            test: 11,
        });
        callback = function innerCallback(innerData) {
            expect(innerData).to.be.equal(responseData);
            done();
        };
        
        longCbId = hybridJs.JSBridge.getLongCallbackId();
        hybridJs.JSBridge.registerLongCallback(longCbId, callback);
        
        hybridJs.JSBridge._handleMessageFromNative(JSON.stringify({
            responseId: longCbId,
            responseData,
        }));
    });
});