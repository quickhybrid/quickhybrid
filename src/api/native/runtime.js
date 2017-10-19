export default function runtimeMixin(hybrid) {
    const hybridJs = hybrid;
    
    hybridJs.extendModule('runtime', [{
        namespace: 'getAppVersion',
        os: ['quick'],
    }, {
        namespace: 'getQuickVersion',
        os: ['quick'],
    }]);
}