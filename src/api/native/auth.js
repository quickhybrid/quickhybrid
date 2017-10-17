export default function authMixin(hybridJs) {
    const quick = hybridJs;
    
    /**
     * 拓展ui模块
     */
    quick.extendModule('auth', [{
        namespace: 'getToken',
        os: ['quick'],
    },{
        namespace: 'refreshToken',
        os: ['quick'],
    }, {
        namespace: 'getUserInfo',
        os: ['quick'],
    }]);
};
