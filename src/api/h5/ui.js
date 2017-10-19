export default function uiMixin(hybrid) {
    const hybridJs = hybrid;
    const innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('ui', [{
        namespace: 'alert',
        os: ['h5'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定',
        },
        runCode(...args) {
            let options = args[0];
            let resolve = args[1];
            let reject = args[2];
            
            // 支持简单的调用，alert(msg, title, btn)              
            if (!innerUtil.isObject(options)) {
                options = {
                    message: args[0],
                    title: '',
                    buttonName: '确定',
                };
                // 处理快速调用时的 resolve 与参数关系
                if (typeof args[1] === 'string') {
                    options.title = args[0];
                    options.message = args[1];
                    if (typeof args[2] === 'string') {
                        options.buttonName = args[2];
                        resolve = args[3];
                        reject = args[4];
                    } else {
                        resolve = args[2];
                        reject = args[3];
                    }
                }
            }

            if (window.alert) {
                // 可以使用自己的alert,并在回调中成功
                window.alert(options.message,
                    options.title,
                    options.buttonName);

                // 这里由于是window的alert，所以直接成功
                options.success && options.success({});
                resolve && resolve({});
            } else {
                options.error && options.error({});
                reject && reject({});
            }
        },
    }]);
}