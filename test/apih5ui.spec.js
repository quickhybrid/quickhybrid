import hybridJs from '../src/index';
import Promise from './inner/promise';
import uiMixin from '../src/api/h5/ui';

uiMixin(hybridJs);

describe('ui-alert', () => {
    const oldAlert = window.alert;
    
    beforeEach(() => {
        hybridJs.setPromise(Promise);
        hybridJs.os.h5 = true;
        window.alert = oldAlert;
    });
    
    it('正常调用alert', () => {
        hybridJs.ui.alert('测试内容');
        hybridJs.ui.alert('测试标题', '测试内容');
        hybridJs.ui.alert('测试标题', '测试内容', '测试按钮');
    });
    
    it('带options并且有成功回调', (done) => {
        hybridJs.ui.alert({
            message: '测试内容',
            success: () => {
                done();
            },
        });
    });
    
    it('带options,promise成功', (done) => {
        hybridJs.ui.alert({
            message: '测试内容',
        }).then(() => {
            done();
        });
    });
    it('去除alert', (done) => {
        window.alert = undefined;
        hybridJs.ui.alert({
            message: '测试内容',
            error: () => {
                done();
            },
        });
    });
    it('去除alert,promise失败', (done) => {
        window.alert = undefined;
        hybridJs.ui.alert({
            message: '测试内容',
        }).catch(() => {
            done();
        });
    });
});

