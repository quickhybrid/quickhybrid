import {
    alert,
    confirm,
    prompt,
    toast,
} from './muilib/messagedialog';
import {
    showWaiting,
    closeWaiting,
} from './muilib/waitingdialog';
import actionSheet from './muilib/actionsheet';
import showDatePicter from './muilib/datepicker';
import showPopPicker from './muilib/poppicker';
import paddingWith0 from './muilib/paddingwith0';

function pickerDateWithArgs(args) {
    const options = args[0];
    const resolve = args[1];
    
    showDatePicter(options, (result) => {
        options.success && options.success(result);
        resolve && resolve(result);
    });
}

export default function uiMixin(hybrid) {
    const hybridJs = hybrid;
    const innerUtil = hybridJs.innerUtil;

    hybridJs.extendModule('ui', [{
        namespace: 'toast',
        os: ['h5'],
        defaultParams: {
            message: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'message',
            );
            const options = args[0];
            const resolve = args[1];

            toast(options);
            options.success && options.success();
            resolve && resolve();
        },
    }, {
        namespace: 'showDebugDialog',
        os: ['h5'],
        defaultParams: {
            debugInfo: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'debugInfo',
            );

            args[0] = {
                title: '',
                message: args[0].debugInfo,
                buttonName: '确定',
                success: args[0].success,
            };
            hybridJs.ui.alert.apply(this, args);
        },
    }, {
        namespace: 'alert',
        os: ['h5'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'message',
                'title',
                'buttonName',
            );
            const options = args[0];
            const resolve = args[1];

            alert(options, () => {
                options.success && options.success({});
                resolve && resolve({});
            });
        },
    }, {
        namespace: 'confirm',
        os: ['h5'],
        defaultParams: {
            // 这是默认参数，API的每一个参数都应该有一个默认值
            title: '',
            message: '',
            buttonLabels: ['取消', '确定'],
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = rest;
            const options = args[0];
            const resolve = args[1];

            confirm(options, (index) => {
                const result = {
                    which: index,
                };

                options.success && options.success(result);
                resolve && resolve(result);
            });
        },
    }, {
        namespace: 'prompt',
        os: ['h5'],
        defaultParams: {
            title: '',
            hint: '',
            text: '',
            buttonLabels: ['取消', '确定'],
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = rest;
            const options = args[0];
            const resolve = args[1];

            prompt(options, (content) => {
                const index = content ? 1 : 0;
                const result = {
                    which: index,
                    content,
                };

                options.success && options.success(result);
                resolve && resolve(result);
            });
        },
    }, {
        namespace: 'actionSheet',
        os: ['h5'],
        defaultParams: {
            items: [],
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = rest;
            const options = args[0];
            const resolve = args[1];

            actionSheet(options, (title) => {
                const index = options.items.indexOf(title);
                const result = {
                    which: index,
                    content: title,
                };

                options.success && options.success(result);
                resolve && resolve(result);
            });
        },
    }, {
        namespace: 'pickDate',
        os: ['h5'],
        defaultParams: {
            // h5中的开始年份
            beginYear: 1900,
            // h5中的结束年份
            endYear: 2100,
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd。
            datetime: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = rest;
            const options = args[0];
            let datetime = options.datetime;

            if (!datetime) {
                // 如果不存在，默认为当前时间
                const dateNow = new Date();

                datetime = `${dateNow.getFullYear()}
                -${paddingWith0(dateNow.getMonth() + 1)}
                -${paddingWith0(dateNow.getDate())}`;
            }
            options.value = datetime;
            options.type = 'date';
            
            pickerDateWithArgs(args);
        },
    }, {
        namespace: 'pickTime',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 hh:mm。
            datetime: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = rest;
            const options = args[0];
            const dateNow = new Date();
            const datePrefix = `${dateNow.getFullYear()}
                -${paddingWith0(dateNow.getMonth() + 1)}
                -${paddingWith0(dateNow.getDate())} `;
            let datetime = options.datetime;
            
            if (!datetime) {
                // 如果不存在，默认为当前时间
                const dateSuffix = `${paddingWith0(dateNow.getHours())}
                :${paddingWith0(dateNow.getMinutes())}`;

                datetime = datePrefix + dateSuffix;
            } else {
                datetime = datePrefix + datetime;
            }
            options.value = datetime;
            options.type = 'time';
            
            pickerDateWithArgs(args);
        },
    }, {
        namespace: 'pickDateTime',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd hh:mm。
            datetime: '',
            // h5中的开始年份
            beginYear: 1900,
            // h5中的结束年份
            endYear: 2100,
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = rest;
            const options = args[0];
            let datetime = options.datetime;

            if (!datetime) {
                // 如果不存在，默认为当前时间
                const dateNow = new Date();
                const datePrefix = `${dateNow.getFullYear()}
                -${paddingWith0(dateNow.getMonth() + 1)}
                -${paddingWith0(dateNow.getDate())} `;
                const dateSuffix = `${paddingWith0(dateNow.getHours())}
                :${paddingWith0(dateNow.getMinutes())}`;

                datetime = datePrefix + dateSuffix;
            }
            options.value = datetime;
            options.type = null;
            
            pickerDateWithArgs(args);
        },
    }, {
        namespace: 'pickMonth',
        os: ['h5'],
        defaultParams: {
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM
            datetime: '',
            // h5中的开始年份
            beginYear: 1900,
            // h5中的结束年份
            endYear: 2100,
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = rest;
            const options = args[0];
            const dateNow = new Date();
            let datetime = options.datetime;

            if (!datetime) {
                // 如果不存在，默认为当前时间
                datetime = `${dateNow.getFullYear()}
                -${paddingWith0(dateNow.getMonth() + 1)}
                -${paddingWith0(dateNow.getDate())} `;
            } else {
                // 否则，只需要加上日期尾缀
                datetime += `-${paddingWith0(dateNow.getDate())}`;
            }
            options.value = datetime;
            options.type = 'month';
            
            pickerDateWithArgs(args);
        },
    }, {
        namespace: 'popPicker',
        os: ['h5'],
        defaultParams: {
            // 层级，默认为1
            layer: 1,
            data: [],
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = rest;
            const options = args[0];
            const resolve = args[1];

            showPopPicker(options, (result) => {
                options.success && options.success(result);
                resolve && resolve(result);
            });
        },
    }, {
        namespace: 'showWaiting',
        os: ['h5'],
        defaultParams: {
            message: '',
            padlock: true,
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = rest;
            const options = args[0];
            const resolve = args[1];

            showWaiting(options.message, {
                padlock: options.padlock,
            });

            options.success && options.success({});
            resolve && resolve({});
        },
    }, {
        namespace: 'closeWaiting',
        os: ['h5'],
        runCode(...rest) {
            // 兼容字符串形式
            const args = rest;
            const options = args[0];
            const resolve = args[1];

            closeWaiting();

            options.success && options.success();
            resolve && resolve();
        },
    }]);
}