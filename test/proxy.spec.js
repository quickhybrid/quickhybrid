import { expect } from 'chai';
import {
    noop,
} from '../src/util/lang';
import quick from '../src/index';
import proxyMixin from '../src/core/proxy';
import Promise from './inner/promise';

proxyMixin(quick);

describe('创建proxy函数', () => {
    let callback;
    let api;
    let params;
    
    before(() => {
        api = {
            defaultParams: {
                test: 111,
            },
            os: ['h5'],
        };
        params = {
            test2: 222,
        };
    });
    
    it('proxy的销毁', () => {
        callback = noop;
        
        const proxyObj = new quick.Proxy(api, callback);
        
        proxyObj.dispose();
    });
    
    
    it('proxy普通方法无参数', (done) => {
        callback = function innerCallback(options) {
            expect(this.api).to.be.equal(api);
            expect(options.test).to.be.equal(api.defaultParams.test);
        
            done();
        };
        
        let proxyFun = (new quick.Proxy(api, callback)).walk();
        
        proxyFun();
    });
    
    it('proxy普通方法有参数', (done) => {
        callback = function innerCallback(options) {
            expect(this.api).to.be.equal(api);
            expect(options.test).to.be.equal(api.defaultParams.test);
            expect(options.test2).to.be.equal(params.test2);
        
            done();
        };
        
        let proxyFun = (new quick.Proxy(api, callback)).walk();
        
        proxyFun(params);
    });
    
    it('proxy时不传回调', () => {
        // 执行后市undefined
        let proxyFun = (new quick.Proxy(api)).walk();

        expect(proxyFun()).to.be.equal(undefined);
    });
    
    it('proxy使用promise resolve', (done) => {
        quick.setPromise(Promise);
        proxyMixin(quick);
        
        callback = function innerCallback(options, resolve) {
            expect(this.api).to.be.equal(api);
            expect(options.test).to.be.equal(api.defaultParams.test);
            expect(options.test2).to.be.equal(params.test2);
        
            resolve(params);
        };
        
        let proxyFun = (new quick.Proxy(api, callback)).walk();
        
        proxyFun(params).then((val) => {
            expect(val).to.be.equal(params);
            
            done();
        });
    });
    
    it('proxy使用promise reject', (done) => {
        quick.setPromise(Promise);
        proxyMixin(quick);
        
        callback = function innerCallback(options, resolve, reject) {
            expect(this.api).to.be.equal(api);
            expect(options.test).to.be.equal(api.defaultParams.test);
            expect(options.test2).to.be.equal(params.test2);
        
            reject(params);
        };
        
        let proxyFun = (new quick.Proxy(api, callback)).walk();
        
        proxyFun(params).catch((val) => {
            expect(val).to.be.equal(params);
            
            done();
        });
    });
});

