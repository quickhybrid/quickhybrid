export default function uiMixin(hybridJs) {
    const quick = hybridJs;

    quick.extendModule('ui', [{
        namespace: 'alert',
        os: ['h5'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定',
        },
        runCode(...rest) {
            let options = rest[0];
            let resolve = rest[1];
            let reject = rest[2];
            
            // 支持简单的调用，alert(msg, title, btn)              
            if (typeof options !== 'object') {
                options = {
                    message: rest[0],
                    title: '',
                    buttonName: '确定',
                };
                // 处理快速调用时的 resolve 与参数关系
                if (typeof rest[1] === 'string') {
                    options.title = rest[1];
                    if (typeof rest[2] === 'string') {
                        options.buttonName = rest[2];
                        resolve = rest[3];
                        reject = rest[4];
                    } else {
                        resolve = rest[2];
                        reject = rest[3];
                    }
                }
            }

            if (window.alert) {
                // 可以使用自己的alert,并在回调中成功
                window.alert(options.message,
                    options.title,
                    options.buttonName,
                    () => {
                        options.success && options.success({});
                        resolve && resolve({});
                    });

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