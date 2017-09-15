import { expect } from 'chai';
import initMixin from '../src/core/init';
import osMixin from '../src/core/os';

let ejs;

describe('H5下的config', () => {
    before(() => {
        ejs = {};
        initMixin(ejs);
        osMixin(ejs);
    });
    
    it('正常的ready', () => {
        ejs.config();

        ejs.ready(() => {
            expect(1).to.be.equal(1);
        });
    });
    
    it('H5多次config', () => {
        ejs.error(() => {
            expect(1).to.be.equal(1);
        });
        
        ejs.config();
    });
    
    it('H5多次ready', () => {
        ejs.error(() => {
            expect(1).to.be.equal(1);
        });
        
        ejs.ready();
    });
});

describe('先ready再config', () => {
    before(() => {
        ejs = {};
        initMixin(ejs);
        osMixin(ejs);
    });
    
    it('正常ready成功', () => {
        ejs.ready(() => {
            expect(1).to.be.equal(1);
        });
        ejs.config();
    });
});