export default function runtimeMixin(hybridJs) {
    const quick = hybridJs;

    quick.extendModule('runtime', [{
        namespace: 'getAppVersion',
        os: ['quick'],
    }, {
        namespace: 'getQuickVersion',
        os: ['quick'],
    }]);
}
