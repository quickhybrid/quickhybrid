export default function utilMixin(hybrid) {
    const hybridJs = hybrid;
    const innerUtil = hybridJs.innerUtil;
    
    hybridJs.extendModule('util', [{
        namespace: 'scan',
        os: ['quick'],
    }, {
        namespace: 'selectImage',
        os: ['quick'],
        defaultParams: {
            // 图片数量
            photoCount: 9,
            // 是否允许拍照，1：允许；0：不允许
            showCamera: 0,
            // 是否显示gif图片，1：显示；0：不显示
            showGif: 0,
            // 是否允许预览，1：允许，0：不允许
            previewEnabled: 1,
            // 已选图片，json数组格式，item为元素本地地址
            selectedPhotos: [],
        },
    }, {
        namespace: 'selectFile',
        os: ['quick'],
        defaultParams: {
            // 文件数量
            count: 9,
        },
    }, {
        namespace: 'cameraImage',
        os: ['quick'],
        defaultParams: {
            // 宽度
            width: 720,
            // 压缩质量
            quality: 70,
        },
    }, {
        namespace: 'openFile',
        os: ['quick'],
        defaultParams: {
            path: '',
        },
        runCode(...rest) {
            // 兼容字符串形式
            const args = innerUtil.compatibleStringParamsToObject.call(
                this,
                rest,
                'path');
            
            hybridJs.callInner.apply(this, args);
        },
    }]);
}