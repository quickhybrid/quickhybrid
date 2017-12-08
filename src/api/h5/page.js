export default function pageMixin(hybrid) {
    const hybridJs = hybrid;
    const innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('page', [{
        namespace: 'open',
        os: ['h5'],
        defaultParams: {
            pageUrl: '',
            // 额外数据
            data: {},
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'pageUrl',
                'data',
            );
            const options = args[0];
            
            // 将额外数据拼接到url中
            options.pageUrl = innerUtil.getFullUrlByParams(options.pageUrl, options.data);
            
            // 普通
            document.location.href = options.pageUrl;
        },
    }, {
        namespace: 'close',
        os: ['h5'],
        runCode() {
            // 浏览器退出
            if (window.history.length > 1) {
                window.history.back();
            }
        },
    }, {
        namespace: 'reload',
        os: ['h5'],
        runCode() {
            window.location.reload();
        },
    }]);
}