export default {

    /**
     * 1001 api os错误
     */
    ERROR_TYPE_APIOS: {
        code: 1001,
        // 这个只是默认的提示，如果没有新的提示，就会采用默认的提示
        msg: '该API无法在当前OS下运行',
    },

    /**
     * 1002 api modify错误
     */
    ERROR_TYPE_APIMODIFY: {
        code: 1002,
        msg: '不允许更改JSSDK的API',
    },

    /**
     * 1003 module modify错误
     */
    ERROR_TYPE_MODULEMODIFY: {
        code: 1003,
        msg: '不允许更改JSSDK的模块',
    },

    /**
     * 1004 api 不存在
     */
    ERROR_TYPE_APINOTEXIST: {
        code: 1004,
        msg: '调用了不存在的api',
    },

    /**
     * 1005 组件api对应的proto不存在
     */
    ERROR_TYPE_PROTONOTEXIST: {
        code: 1005,
        msg: '调用错误，该组件api对应的proto不存在',
    },

    /**
     * 1006 非容器环境下无法调用自定义组件API
     */
    ERROR_TYPE_CUSTOMEAPINOTEXIST: {
        code: 1006,
        msg: '非容器下无法调用自定义组件API',
    },

    /**
     * 1007 对应的event事件在该环境下不存在
     */
    ERROR_TYPE_EVENTNOTEXIST: {
        code: 1007,
        msg: '对应的event事件在该环境下不存在',
    },

    /**
     * 1007 对应的event事件在该环境下不存在
     */
    ERROR_TYPE_INITVERSIONERROR: {
        code: 1008,
        msg: '初始化版本号错误，请检查容器api的实现情况',
    },

    /**
     * 2001 ready modify错误-ready回调正常只允许定义一个
     */
    ERROR_TYPE_READYMODIFY: {
        code: 2001,
        msg: 'ready回调不允许多次设置',
    },

    /**
     * 2002 config modify错误-正常一个页面只允许config一次
     */
    ERROR_TYPE_CONFIGMODIFY: {
        code: 2002,
        msg: 'config不允许多次调用',
    },

    /**
     * 2003 config 错误
     */
    ERROR_TYPE_CONFIGERROR: {
        code: 2003,
        msg: 'config校验错误',
    },

    /**
     * 2004 version not support
     */
    ERROR_TYPE_VERSIONNOTSUPPORT: {
        code: 2004,
        msg: '不支持当前容器版本，请确保容器与前端库版本匹配',
    },

    /**
     * 2004 version not support
     */
    ERROR_TYPE_VERSIONNEEDUPGRADE: {
        code: 2005,
        msg: '当前JSSDK库小于容器版本，请将前端库升级到最新版本',
    },

    /**
     * 3000 原生错误(非API错误)，原生捕获到的错误都会通知J5
     */
    ERROR_TYPE_NATIVE: {
        code: 3000,
        msg: '捕获到一处原生容器错误',
    },

    /**
     * 3001 原生调用h5错误  原生通过JSBridge调用h5错误，可能是参数不对
     */
    ERROR_TYPE_NATIVECALL: {
        code: 3001,
        msg: '原生调用H5时参数不对',
    },

    /**
     * 9999 其它未知错误
     */
    ERROR_TYPE_UNKNOWN: {
        code: 9999,
        msg: '未知错误',
    },
};