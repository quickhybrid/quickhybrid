export default function uiMixin(hybridJs) {
    const quick = hybridJs;
    
    quick.extendModule('ui', [{
        namespace: 'alert',
        os: ['quick'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定',
        },
    }]);
}
