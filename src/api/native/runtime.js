export default function runtimeMixin(hybrid) {
    const hybridJs = hybrid;
    const innerUtil = hybridJs.innerUtil;
    
    hybridJs.extendModule('runtime', [{
        namespace: 'launchApp',
        os: ['quick'],
        defaultParams: {
            // android应用的包名
            packageName: '',
            // android应用页面类名
            className: '',
            // android应用页面配置的ActionName
            actionName: '',
            // 页面配置的Scheme名字，适用于Android与iOS
            scheme: '',
            // 传递的参数。需要目标应用解析获取参数。字符串形式
            data: '',
        },
    }, {
        namespace: 'getAppVersion',
        os: ['quick'],
    }, {
        namespace: 'getQuickVersion',
        os: ['quick'],
    }, {
        namespace: 'clearCache',
        os: ['quick'],
    }, {
        namespace: 'getGeolocation',
        os: ['quick'],
        defaultParams: {
            isShowDetail: 0,
            // 1采用的火星坐标系，0采用地球坐标系
            coordinate: 1,
        },
    }, {
        namespace: 'clipboard',
        os: ['quick'],
        defaultParams: {
            text: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'text');
            
            hybridJs.callInner.apply(this, args);
        },
    }, {
        namespace: 'openUrl',
        os: ['quick'],
        defaultParams: {
            url: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject(rest, 'url');
            
            hybridJs.callInner.apply(this, args);
        },
    }]);
}