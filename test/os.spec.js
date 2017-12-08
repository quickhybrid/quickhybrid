import { expect } from 'chai';
import osMixin from '../src/core/os';
import {
    setUserAgent,
    setAppVersion,
} from './inner/hackwindow';

const ORIGINAL_NAVIGATOR = navigator.userAgent;
let quick;

describe('H5环境', () => {
    before(() => {
        quick = {};
        osMixin(quick);
    });
    
    it('默认为h5', () => {
        expect(quick.os.h5).to.be.equal(true);
    });

    it('默认其它os都为假', () => {
        expect(quick.os.dd).to.be.equal(undefined);
        expect(quick.os.quick).to.be.equal(undefined);
    });
    
    it('默认非Android与iOS', () => {
        expect(quick.os.android).to.be.equal(undefined);
        expect(quick.os.ios).to.be.equal(undefined);
        
        expect(quick.os.isBadAndroid).to.be.equal(undefined);
        expect(quick.os.ipad).to.be.equal(undefined);
        expect(quick.os.iphone).to.be.equal(undefined);
    });
});

describe('模拟Android', () => {
    const AGENT_ANDROID = 'Android; 1.0.2;';
    const APPVERSION_BAD_ANDROID = 'firefox 50';
    
    before(() => {
        // 在本区块的所有测试用例之前执行
        quick = {};
        
        setUserAgent(AGENT_ANDROID);
        setAppVersion(APPVERSION_BAD_ANDROID);
        
        osMixin(quick);
    });
    
    it('为Android环境', () => {
        expect(quick.os.android).to.be.equal(true);
    });
    
    it('版本匹配', () => {
        expect(quick.os.version).to.be.equal('1.0.2');
    });
    
    it('为badAndroid', () => {
        expect(quick.os.isBadAndroid).to.be.equal(true);
    });
    
    after(() => {
        setUserAgent(ORIGINAL_NAVIGATOR);
    });
});

describe('模拟iphone', () => {
    const AGENT_IPHONE = 'iPhone OS 1_0_1;';
    
    before(() => {
        // 在本区块的所有测试用例之前执行
        quick = {};
        
        setUserAgent(AGENT_IPHONE);
        
        osMixin(quick);
    });
    
    it('为iOS环境', () => {
        expect(quick.os.ios).to.be.equal(true);
    });
    
    it('为iphone环境', () => {
        expect(quick.os.iphone).to.be.equal(true);
    });
    
    it('版本号匹配', () => {
        expect(quick.os.version).to.be.equal('1.0.1');
    });
    
    after(() => {
        setUserAgent(ORIGINAL_NAVIGATOR);
    });
});

describe('模拟ipad', () => {
    const AGENT_IPAD = 'iPad OS 1_0_2;';
    
    before(() => {
        // 在本区块的所有测试用例之前执行
        quick = {};
        
        setUserAgent(AGENT_IPAD);
        
        osMixin(quick);
    });
    
    it('为iOS环境', () => {
        expect(quick.os.ios).to.be.equal(true);
    });
    
    it('为ipad环境', () => {
        expect(quick.os.ipad).to.be.equal(true);
    });
    
    it('版本号匹配', () => {
        expect(quick.os.version).to.be.equal('1.0.2');
    });
    
    after(() => {
        setUserAgent(ORIGINAL_NAVIGATOR);
    });
});

describe('模拟quick、dd与quick', () => {
    const AGENT_QUICK = 'QuickHybrid1.0.1';
    const AGENT_DD = 'DingTalk1.0.1';
    
    before(() => {
        // 在本区块的所有测试用例之前执行
        quick = {};
        
        setUserAgent(AGENT_DD + AGENT_QUICK);
        
        osMixin(quick);
    });
    
    it('为quick环境', () => {
        expect(quick.os.quick).to.be.equal(true);
    });
    
    it('为DD环境', () => {
        expect(quick.os.dd).to.be.equal(true);
    });
    
    after(() => {
        setUserAgent(ORIGINAL_NAVIGATOR);
    });
});