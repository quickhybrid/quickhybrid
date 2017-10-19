export default function authMixin(hybridJs) {
    const quick = hybridJs;
    
    quick.extendModule('auth', [{
        namespace: 'getToken',
        os: ['quick'],
    }, {
        namespace: 'refreshToken',
        os: ['quick'],
    }, {
        namespace: 'getUserInfo',
        os: ['quick'],
    }, {
        namespace: 'config',
        os: ['quick'],
        defaultParams: {
            // 一个数组，不要传null，否则可能在iOS中会有问题
            jsApiList: [],
        },
    }]);
}