export default function uiMixin(hybrid) {
    const hybridJs = hybrid;
    const innerUtil = hybridJs.innerUtil;
    
    hybridJs.extendModule('ui', [{
        namespace: 'toast',
        os: ['quick'],
        defaultParams: {
            message: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'message');
            
            hybridJs.callInner.apply(this, args);
        },
    }, {
        namespace: 'showDebugDialog',
        os: ['quick'],
        defaultParams: {
            debugInfo: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject(rest, 'debugInfo');
            
            hybridJs.callInner.apply(this, args);
        },
    }, {
        namespace: 'alert',
        os: ['quick'],
        defaultParams: {
            title: '',
            message: '',
            buttonName: '确定',
            // 默认可取消
            cancelable: 1,
        },
        // 用confirm来模拟alert
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'message',
                'title',
                'buttonName',
            );
            
            args[0].buttonLabels = [args[0].buttonName];
            hybridJs.ui.confirm.apply(this, args);
        },
    }, {
        namespace: 'confirm',
        os: ['quick'],
        defaultParams: {
            title: '',
            message: '',
            buttonLabels: ['取消', '确定'],
            // 默认可取消
            cancelable: 1,
        },
    }, {
        namespace: 'prompt',
        os: ['quick'],
        defaultParams: {
            title: '',
            hint: '',
            text: '',
            lines: 1,
            maxLength: 10000,
            buttonLabels: ['取消', '确定'],
            // 默认可取消
            cancelable: 1,
        },
    }, {
        namespace: 'actionSheet',
        os: ['quick'],
        defaultParams: {
            items: [],
            // 默认可取消
            cancelable: 1,
        },
        runCode(...rest) {
            const args = rest;
            const options = args[0];
            const originalItems = options.items;
            
            options.dataFilter = (res) => {
                const newRes = res;
                let index = -1;
                let content = '';
                
                if (newRes.result) {
                    index = newRes.result.which || 0;
                    content = originalItems[index];
                    // 需要将中文解码
                    newRes.result.content = decodeURIComponent(content);
                }
                
                return newRes;
            };
            
            args[0] = options;
            hybridJs.callInner.apply(this, args);
        },
    }, {
        namespace: 'popWindow',
        os: ['quick'],
        defaultParams: {
            titleItems: [],
            iconItems: [],
            iconFilterColor: '',
        },
        /**
         * 有横向菜单和垂直菜单2种
         * 可配合setNBRightImage、setNBRightText使用(iOS 不可配合使用)
         */
        runCode(...rest) {
            const args = rest;
            const options = args[0];
            const originalItems = options.iconItems;
            
            // 处理相对路径问题
            for (let i = 0, len = options.iconItems.length; i < len; i += 1) {
                options.iconItems[i] = innerUtil.getFullPath(options.iconItems[i]);
            }

            
            options.dataFilter = (res) => {
                const newRes = res;
                let index = -1;
                let content = '';
                
                if (newRes.result) {
                    index = newRes.result.which || 0;
                    content = originalItems[index];
                    // 需要将中文解码
                    newRes.result.content = decodeURIComponent(content);
                }
                
                return newRes;
            };
            
            args[0] = options;
            hybridJs.callInner.apply(this, args);
        },
    }, {
        namespace: 'pickDate',
        os: ['quick'],
        defaultParams: {
            // 部分设备上设置标题后遮挡控件可不设置标题
            title: '',
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd。
            datetime: '',
        },
    }, {
        namespace: 'pickTime',
        os: ['quick'],
        defaultParams: {
            // 部分设备上设置标题后遮挡控件可不设置标题
            title: '',
            // 默认为空为使用当前时间
            // 格式为 HH:mm
            datetime: '',
        },
    }, {
        namespace: 'pickDateTime',
        os: ['quick'],
        defaultParams: {
            title1: '',
            title2: '',
            // 默认为空为使用当前时间
            // 格式为 yyyy-MM-dd HH:mm
            datetime: '',
        },
    }, {
        namespace: 'showWaiting',
        os: ['quick'],
        defaultParams: {
            message: '加载中...',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'message');
            
            hybridJs.callInner.apply(this, args);
        },
    }, {
        namespace: 'closeWaiting',
        os: ['quick'],
    }]);
}
