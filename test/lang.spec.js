import { expect } from 'chai';
import {
    extend,
    compareVersion,
    eclipseText,
    noop,
    getNow,
    getProjectBasePath,
    changeRelativePathToAbsolute,
    getFullPath,
    getFullUrlByParams,
    isObject,
} from '../src/util/lang';

describe('extend方法', () => {
    let obj1;
    let obj2;
    let obj3;
        
    before(() => {
        // 在本区块的所有测试用例之前执行
        obj1 = {
            company: 'epoint',
            product: {
                quick: 'quick混合开发方案',
            },
        };

        obj2 = {
            company: 'epoint2',
            city: 'suzhou',
            product: {
                m7: 'm7移动框架',
            },
        };

        obj3 = {
            name: 'zhangsan',
            product: {
                group: 'mobile',
                m7: 'm7移动框架2',
            },
        };
    });

    it('拓展单个（浅层拓展）', () => {
        const result = extend({}, obj1, obj2);

        expect(result).to.have.deep.property('company', obj2.company);
        expect(result).to.have.deep.property('product', obj2.product);
    });

    it('拓展多个（浅层拓展）', () => {
        const result = extend({}, obj1, obj2, obj3);

        expect(result).to.have.deep.property('company', obj2.company);
        expect(result).to.have.deep.property('product', obj3.product);
        expect(result).to.have.deep.property('name', obj3.name);
    });
});

describe('noop', () => {
    it('是一个空函数', () => {
        noop();
        expect(noop).to.be.an('function');
    });
});

describe('getNow', () => {
    it('当前时间', () => {
        expect(getNow()).to.be.an('number');
    });
    
    it('两个now不允许相等', () => {
        expect(getNow()).to.not.equal(getNow());
    });
    
    it('没有performance时', () => {
        const oldPerformance = window.performance;
        
        window.performance = undefined;
        getNow();
        expect(1).to.be.equal(1);
        
        window.performance = oldPerformance;
    });
});

describe('compareVersion', () => {
    it('错误情况', () => {
        try {
            compareVersion('1.0.0');
        } catch (e) {
            expect(1).to.be.equal(1);
        }
        
        try {
            compareVersion(123);
        } catch (e) {
            expect(1).to.be.equal(1);
        }
    });
    it('相等匹配', () => {
        expect(compareVersion('1.0.0', '1.0.0')).to.be.equal(0);
        expect(compareVersion('1.0', '1.0.0')).to.be.equal(0);
    });
    it('大于匹配', () => {
        expect(compareVersion('1.0.1', '1.0.0')).to.be.equal(1);
        expect(compareVersion('1.1', '1.0.2')).to.be.equal(1);
        expect(compareVersion('1.1.1', '1.1')).to.be.equal(1);
    });
    it('小于匹配', () => {
        expect(compareVersion('1.0.1', '1.0.2')).to.be.equal(-1);
        expect(compareVersion('1.1', '1.2.2')).to.be.equal(-1);
        expect(compareVersion('1.0', '1.0.1')).to.be.equal(-1);
    });
});

describe('eclipseText', () => {
    const targetStr = 'abc测试1234567890';
    
    it('截取2位字符', () => {
        expect(eclipseText(targetStr, 2)).to.be.equal('ab');
    });
    
    it('截取4位字符', () => {
        expect(eclipseText(targetStr, 4)).to.be.equal('abc');
    });
    
    it('截取5位字符', () => {
        expect(eclipseText(targetStr, 5)).to.be.equal('abc测');
    });
});

describe('getProjectBasePath', () => {
    it('基本路径匹配正则', () => {
        expect(getProjectBasePath()).to.satisfy(basePath => (/^(https?):[/]{2}[\w-]+(\.[\w-]+)*:[\d]{1,10}[/]([^/]+[/])*/.test(basePath)));
    });
});

describe('changeRelativePathToAbsolute', () => {
    it('相对路径匹配', () => {
        expect(changeRelativePathToAbsolute('./abc/d.html')).to.satisfy(currPath => (currPath === `${getProjectBasePath()}abc/d.html`));
        expect(changeRelativePathToAbsolute('../abc/d.html')).to.satisfy(currPath => (currPath === `${getProjectBasePath()}abc/d.html`));
    });
});

describe('getFullPath', () => {
    it('相对路径匹配', () => {
        expect(getFullPath('./abc/d.html')).to.satisfy(currPath => (currPath === `${getProjectBasePath()}abc/d.html`));
    });
    
    it('网络路径匹配', () => {
        expect(getFullPath('http://www.baidu.com')).to.satisfy(currPath => (currPath === 'http://www.baidu.com'));
    });
    
    it('基于根路径的相对路径', () => {
        expect(getFullPath('abc/d.html')).to.satisfy(currPath => (currPath === `${getProjectBasePath()}abc/d.html`));
    });
});

describe('getFullUrlByParams', () => {
    it('判断参数是否正确拼接', () => {
        expect(getFullUrlByParams('abc.html', {
            a: 1,
            b: 2,
        })).to.satisfy(finalUrl => (finalUrl === `${getProjectBasePath()}abc.html?a=1&b=2`));
    });
});

describe('isObject', () => {
    it('判断是否是isObject', () => {
        expect(isObject({})).to.be.equal(true);
    });
});