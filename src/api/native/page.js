export default function pageMixin(hybrid) {
    const hybridJs = hybrid;
    const innerUtil = hybridJs.innerUtil;
    
    hybridJs.extendModule('page', [{
        namespace: 'open',
        os: ['quick'],
        defaultParams: {
            pageUrl: '',
            pageStyle: 1,
            // 横竖屏,默认为1表示竖屏
            orientation: 1,
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
            // 去除无用参数的干扰
            options.data = undefined;
            
            options.dataFilter = (res) => {
                const newRes = res;
                
                if (!innerUtil.isObject(newRes.result.resultData)) {
                    try {
                        newRes.result.resultData = JSON.parse(newRes.result.resultData);
                    } catch (e) {}
                }
                
                return newRes;
            };
            
            args[0] = options;
            hybridJs.callInner.apply(this, args);
        },
    }, {
        namespace: 'openLocal',
        os: ['quick'],
        defaultParams: {
            className: '',
            // 为1则是打开已存在的页面，会杀掉所有该页面上的页面
            isOpenExist: 0,
            // 额外数据，注意额外数据只能一层键值对形式，不能再包裹子json
            data: {},
        },
        runCode(...rest) {
            const args = rest;
            const options = args[0];
            
            options.dataFilter = (res) => {
                const newRes = res;
                
                if (!innerUtil.isObject(newRes.result.resultData)) {
                    try {
                        newRes.result.resultData = JSON.parse(newRes.result.resultData);
                    } catch (e) {}
                }
                
                return newRes;
            };
            
            args[0] = options;
            hybridJs.callInner.apply(this, args);
        },
    }, {
        namespace: 'close',
        os: ['quick'],
        defaultParams: {
            // 需要传递的参数，是一个字符串
            resultData: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'resultData');
            
            if (innerUtil.isObject(args[0].resultData)) {
                args[0].resultData = JSON.stringify(args[0].resultData);
            }
            
            hybridJs.callInner.apply(this, args);
        },
    }, {
        namespace: 'reload',
        os: ['quick'],
    }]);
}