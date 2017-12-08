export default function deviceMixin(hybrid) {
    const hybridJs = hybrid;
    const innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('device', [{
        namespace: 'callPhone',
        os: ['h5'],
        defaultParams: {
            phoneNum: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'phoneNum');
            const phoneNum = args[0].phoneNum;
            
            window.location.href = `tel:${phoneNum}`;
        },
    }, {
        namespace: 'sendMsg',
        os: ['h5'],
        defaultParams: {
            phoneNum: '',
            message: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'phoneNum',
                'message');
            const phoneNum = args[0].phoneNum;
            const message = args[0].message;
            
            window.location.href = `sms:${phoneNum}?body=${message}`;
        },
    }, {
        namespace: 'sendMail',
        os: ['h5'],
        defaultParams: {
            mail: '',
            subject: '',
            cc: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'mail',
                'subject',
                'cc');
            const mail = args[0].mail;
            const subject = args[0].subject;
            const cc = args[0].cc;
            
            window.location.href = `mailto:${mail}?subject=${subject}&cc=${cc}`;
        },
    }]);
}