export default function uiMixin(hybrid) {
    const hybridJs = hybrid;
    
    hybridJs.extendModule('ui', [{
        namespace: 'alert',
        os: ['quick'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定',
        },
    }]);
}
