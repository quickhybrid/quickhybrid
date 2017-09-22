import { expect } from 'chai';
import ejs from '../src/index';
import jsbridgeMixin from '../src/jsbridge/jsbridge';

jsbridgeMixin(ejs);

describe('注册H5本地函数', () => {
    const handlerName = 'testH5';
    let callback;
    let data;
    
    before(() => {
        data = {
            test: 11,
        };
    });
    
    it('触发已注册的本地函数', (done) => {
        callback = function innerCallback(innerData) {
            console.log(innerData);
            console.log('~');
            expect(1).to.be.equal(1);
            done();
        };
        
        ejs.JSBridge.registerHandler(handlerName, callback);
        
        ejs.JSBridge._handleMessageFromNative({
            handlerName,
            data,
        });
    });
});