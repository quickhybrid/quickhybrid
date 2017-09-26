import { expect } from 'chai';
import oldQuick from '../src/index';
import initMixin from '../src/core/init';
import osMixin from '../src/core/os';

let quick;

describe('H5下的config', () => {
    before(() => {
        quick = oldQuick;
        initMixin(quick);
        osMixin(quick);
    });
    
    it('正常的ready', () => {
        quick.config();

        quick.ready(() => {
            expect(1).to.be.equal(1);
        });
    });
    
    it('H5多次config', () => {
        quick.error(() => {
            expect(1).to.be.equal(1);
        });
        
        quick.config();
    });
    
    it('H5多次ready', () => {
        quick.error(() => {
            expect(1).to.be.equal(1);
        });
        
        quick.ready();
    });
});

describe('先ready再config', () => {
    before(() => {
        quick = oldQuick;
        initMixin(quick);
        osMixin(quick);
    });
    
    it('正常ready成功', () => {
        quick.ready(() => {
            expect(1).to.be.equal(1);
        });
        quick.config();
    });
});