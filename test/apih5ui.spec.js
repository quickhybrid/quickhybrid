import {
    expect,
} from 'chai';
import {
    noop,
} from '../src/util/lang';
import quick from '../src/index';
import Promise from './inner/promise';


describe('ui-alert', () => {
    const oldAlert = window.alert;
    
    beforeEach(() => {
        quick.setPromise(Promise);
        quick.os.h5 = true;
        window.alert = oldAlert;
    });
    
    it('正常调用alert', () => {
        quick.ui.alert('测试内容');
        quick.ui.alert('测试标题', '测试内容');
        quick.ui.alert('测试标题', '测试内容', '测试按钮');
    });
    
    it('带options并且有成功回调', (done) => {
        quick.ui.alert({
            message: '测试内容',
            success: () => {
                done();
            }
        });
    });
    
    it('带options,promise成功', (done) => {
        quick.ui.alert({
            message: '测试内容',
        }).then(() => {
            done();
        });
    });
    it('去除alert', (done) => {
        window.alert = undefined;
        quick.ui.alert({
            message: '测试内容',
            error: () => {
                done();
            }
        });
    });
    it('去除alert,promise失败', (done) => {
        window.alert = undefined;
        quick.ui.alert({
            message: '测试内容',
        }).catch(() => {
            done();
        });
    });
});

