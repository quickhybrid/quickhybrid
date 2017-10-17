export default function uiMixin(hybridJs) {
    const quick = hybridJs;
    
    /**
     * 拓展ui模块
     */
    quick.extendModule('ui', [{
        namespace: 'alert',
        os: ['h5'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定',
        },
        runCode(options, resolve, reject) {
            // TODO: 增加UI的API
            options.success && options.success({});
            resolve && resolve({});
        },
    }]);
}
