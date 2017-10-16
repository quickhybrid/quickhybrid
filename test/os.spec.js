import { expect } from 'chai';
import osMixin from '../src/core/os';
import {
    setUserAgent,
    setAppVersion,
} from './inner/hackwindow';

const ORIGINAL_NAVIGATOR = navigator.userAgent;
let ejs;

describe('H5环境', () => {
    before(() => {
        ejs = {};
        osMixin(ejs);
    });
    
    it('默认为h5', () => {
        expect(ejs.os.h5).to.be.equal(true);
    });

    it('默认其它os都为假', () => {
        expect(ejs.os.dd).to.be.equal(undefined);
        expect(ejs.os.ejs).to.be.equal(undefined);
    });
    
    it('默认非Android与iOS', () => {
        expect(ejs.os.android).to.be.equal(undefined);
        expect(ejs.os.ios).to.be.equal(undefined);
        
        expect(ejs.os.isBadAndroid).to.be.equal(undefined);
        expect(ejs.os.ipad).to.be.equal(undefined);
        expect(ejs.os.iphone).to.be.equal(undefined);
    });
});

describe('模拟Android', () => {
    const AGENT_ANDROID = 'Android; 1.0.2;';
    const APPVERSION_BAD_ANDROID = 'firefox 50';
    
    before(() => {
        // 在本区块的所有测试用例之前执行
        ejs = {};
        
        setUserAgent(AGENT_ANDROID);
        setAppVersion(APPVERSION_BAD_ANDROID);
        
        osMixin(ejs);
    });
    
    it('为Android环境', () => {
        expect(ejs.os.android).to.be.equal(true);
    });
    
    it('版本匹配', () => {
        expect(ejs.os.version).to.be.equal('1.0.2');
    });
    
    it('为badAndroid', () => {
        expect(ejs.os.isBadAndroid).to.be.equal(true);
    });
    
    after(() => {
        setUserAgent(ORIGINAL_NAVIGATOR);
    });
});

describe('模拟iphone', () => {
    const AGENT_IPHONE = 'iPhone OS 1_0_1;';
    
    before(() => {
        // 在本区块的所有测试用例之前执行
        ejs = {};
        
        setUserAgent(AGENT_IPHONE);
        
        osMixin(ejs);
    });
    
    it('为iOS环境', () => {
        expect(ejs.os.ios).to.be.equal(true);
    });
    
    it('为iphone环境', () => {
        expect(ejs.os.iphone).to.be.equal(true);
    });
    
    it('版本号匹配', () => {
        expect(ejs.os.version).to.be.equal('1.0.1');
    });
    
    after(() => {
        setUserAgent(ORIGINAL_NAVIGATOR);
    });
});

describe('模拟ipad', () => {
    const AGENT_IPAD = 'iPad OS 1_0_2;';
    
    before(() => {
        // 在本区块的所有测试用例之前执行
        ejs = {};
        
        setUserAgent(AGENT_IPAD);
        
        osMixin(ejs);
    });
    
    it('为iOS环境', () => {
        expect(ejs.os.ios).to.be.equal(true);
    });
    
    it('为ipad环境', () => {
        expect(ejs.os.ipad).to.be.equal(true);
    });
    
    it('版本号匹配', () => {
        expect(ejs.os.version).to.be.equal('1.0.2');
    });
    
    after(() => {
        setUserAgent(ORIGINAL_NAVIGATOR);
    });
});

describe('模拟quick、dd与ejs', () => {
    const AGENT_QUICK = 'QuickHybrid1.0.1';
    const AGENT_EJS = 'EpointEJS1.0.1';
    const AGENT_DD = 'DingTalk1.0.1';
    
    before(() => {
        // 在本区块的所有测试用例之前执行
        ejs = {};
        
        setUserAgent(AGENT_EJS + AGENT_DD + AGENT_QUICK);
        
        osMixin(ejs);
    });
    
    it('为quick环境', () => {
        expect(ejs.os.quick).to.be.equal(true);
    });
    
    it('为ejs环境', () => {
        expect(ejs.os.ejs).to.be.equal(true);
    });
    
    it('为DD环境', () => {
        expect(ejs.os.dd).to.be.equal(true);
    });
    
    after(() => {
        setUserAgent(ORIGINAL_NAVIGATOR);
    });
});