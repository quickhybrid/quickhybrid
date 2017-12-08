/**
 * waitingdialog
 * 基于mui.css
 */

const DEFAULT_ID = 'MFRAME_LOADING';
let dialogInstance;

/**
 * 通过div和遮罩,创建一个H5版本loading动画(如果已经存在则直接得到)
 * 基于mui的css
 * @return {HTMLElement} 返回创建后的div对象
 */
function createLoading() {
    let loadingDiv = document.getElementById(DEFAULT_ID);

    if (!loadingDiv) {
        // 如果不存在,则创建
        loadingDiv = document.createElement('div');
        loadingDiv.id = DEFAULT_ID;
        loadingDiv.className = 'mui-backdrop mui-loading';
        
        const iconStyle = `width: 20%;height: 20%;
        max-width: 46px;max-height: 46px;
        position:absolute;top:46%;left:46%;`;
        
        const contentStyle = `position:absolute;
        font-size: 14px;
        top:54%;left: 46%;
        text-align: center;`;
        
        // 自己加了些样式,让loading能够有所自适应,并且居中
        loadingDiv.innerHTML = ` 
        <span class=" mui-spinner mui-spinner-white"
            style="${iconStyle}">
        </span>
        <span class="tipsContent" style="${contentStyle}">
                        加载中...
        </span>`;
    }

    return loadingDiv;
}

/**
 * h5版本waiting dialog的构造方法
 * @param {String} title 标题
 * @param {Object} options 配置
 * @constructor
 */
function H5WaitingDialog(title, options) {
    // 构造的时候生成一个dialog
    this.loadingDiv = createLoading();
    document.body.appendChild(this.loadingDiv);
    this.setTitle(title);
    if (options && options.padlock === true) {
        // 如果设置了点击自动关闭
        this.loadingDiv.addEventListener('click', () => {
            this.close();
        });
    }
}

/**
 * 设置提示标题方法,重新显示
 * @param {String} title 标题
 */
H5WaitingDialog.prototype.setTitle = function setTitle(title) {
    if (this.loadingDiv) {
        // 只有存在对象时才能设置
        this.loadingDiv.style.display = 'block';
        this.loadingDiv.querySelector('.tipsContent').innerText = title || '';
    }
};

/**
 * 关闭后执行的方法,这里只是为了扩充原型
 */
H5WaitingDialog.prototype.onclose = () => {};

/**
 * 设置关闭dialog
 */
H5WaitingDialog.prototype.close = function close() {
    if (this.loadingDiv) {
        this.loadingDiv.style.display = 'none';
        this.onclose();
    }
};

/**
 * 销毁方法
 */
H5WaitingDialog.prototype.dispose = function dispose() {
    // 将loadingDiv销毁
    this.loadingDiv
    && this.loadingDiv.parentNode
    && this.loadingDiv.parentNode.removeChild(this.loadingDiv);
};

/**
 * 显示waiting对话框
 * @param {String} title 标题
 * @param {Object} options 配置参数
 * @return {Object} 返回一个dialog对象
 */
export function showWaiting(title, options) {
    if (dialogInstance === undefined) {
        dialogInstance = new H5WaitingDialog(title, options);
    } else {
        dialogInstance.setTitle(title);
    }

    return dialogInstance;
}

/**
 * 关闭waiting对话框
 */
export function closeWaiting() {
    if (dialogInstance) {
        dialogInstance.dispose();
        dialogInstance = undefined;
    }
}