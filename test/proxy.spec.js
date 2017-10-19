import { expect } from 'chai';
import {
    noop,
} from '../src/util/lang';
import hybridJs from '../src/index';
import proxyMixin from '../src/core/proxy';
import Promise from './inner/promise';

proxyMixin(hybridJs);

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
        
        const proxyObj = new hybridJs.Proxy(api, callback);
        
        proxyObj.dispose();
    });
    
    
    it('proxy普通方法无参数', (done) => {
        callback = function innerCallback(options) {
            expect(this.api).to.be.equal(api);
            expect(options.test).to.be.equal(api.defaultParams.test);
        
            done();
        };
        
        const proxyFun = (new hybridJs.Proxy(api, callback)).walk();
        
        proxyFun();
    });
    
    it('proxy普通方法有参数', (done) => {
        callback = function innerCallback(options) {
            expect(this.api).to.be.equal(api);
            expect(options.test).to.be.equal(api.defaultParams.test);
            expect(options.test2).to.be.equal(params.test2);
        
            done();
        };
        
        const proxyFun = (new hybridJs.Proxy(api, callback)).walk();
        
        proxyFun(params);
    });
    
    it('proxy时不传回调', () => {
        // 执行后市undefined
        const proxyFun = (new hybridJs.Proxy(api)).walk();

        expect(proxyFun()).to.be.equal(undefined);
    });
    
    it('proxy使用promise resolve', (done) => {
        hybridJs.setPromise(Promise);
        proxyMixin(hybridJs);
        
        callback = function innerCallback(options, resolve) {
            expect(this.api).to.be.equal(api);
            expect(options.test).to.be.equal(api.defaultParams.test);
            expect(options.test2).to.be.equal(params.test2);
        
            resolve(params);
        };
        
        const proxyFun = (new hybridJs.Proxy(api, callback)).walk();
        
        proxyFun(params).then((val) => {
            expect(val).to.be.equal(params);
            
            done();
        });
    });
    
    it('proxy使用promise reject', (done) => {
        hybridJs.setPromise(Promise);
        proxyMixin(hybridJs);
        
        callback = function innerCallback(options, resolve, reject) {
            expect(this.api).to.be.equal(api);
            expect(options.test).to.be.equal(api.defaultParams.test);
            expect(options.test2).to.be.equal(params.test2);
        
            reject(params);
        };
        
        const proxyFun = (new hybridJs.Proxy(api, callback)).walk();
        
        proxyFun(params).catch((val) => {
            expect(val).to.be.equal(params);
            
            done();
        });
    });
});

