/**
 * actionsheet
 * 基于mui.css
 */

const ACTION_UNIQUE_ID = 'defaultActionSheetId';
const ACTION_WRAP_UNIQUE_ID = 'defaultActionSheetWrapContent';
const ACTION_CONTENT_ID = 'actionSheetContent';

function createActionSheetH5(params) {
    const options = params || {};
    const idStr = options.id ? `id="${options.id}"` : '';
    let finalHtml = '';
    
    finalHtml += `<div ${idStr} class="mui-popover mui-popover-action mui-popover-bottom">`;
    // 加上title
    if (options.title) {
        finalHtml += '<ul class="mui-table-view">';
        finalHtml += '<li class="mui-table-view-cell">';
        finalHtml += `<a class="titleActionSheet"><b>${options.title}</b></a>`;
        finalHtml += '</li>';
        finalHtml += '</ul>';
    }
    finalHtml += '<ul class="mui-table-view">';
    // 添加内容
    if (options.items && Array.isArray(options.items)) {
        for (let i = 0; i < options.items.length; i += 1) {
            const title = options.items[i] || '';

            finalHtml += '<li class="mui-table-view-cell">';
            finalHtml += `<a >${title}</a>`;
            finalHtml += '</li>';
        }
    }
    finalHtml += '</ul>';
    // 加上最后的取消
    finalHtml += '<ul class="mui-table-view">';
    finalHtml += '<li class="mui-table-view-cell">';
    finalHtml += '<a class="cancelActionSheet"><b>取消</b></a>';
    finalHtml += '</li>';
    finalHtml += '</ul>';

    // 补齐mui-popover
    finalHtml += '</div>';

    return finalHtml;
}

export default function actionsheet(params, success) {
    const options = params;
    
    options.id = options.id || ACTION_UNIQUE_ID;
    
    const html = createActionSheetH5(options);
    
    if (!document.getElementById(ACTION_CONTENT_ID)) {
        // 不重复添加
        const wrapper = document.createElement('div');
        
        wrapper.id = ACTION_WRAP_UNIQUE_ID;
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);
        mui('body').on('shown', '.mui-popover', () => {
            // console.log('shown:'+e.detail.id, e.detail.id); //detail为当前popover元素
        });
        mui('body').on('hidden', '.mui-popover', () => {
            // console.log('hidden:'+e.detail.id, e.detail.id); //detail为当前popover元素
        });
    } else {
        // 直接更改html
        document.getElementById(ACTION_WRAP_UNIQUE_ID).innerHTML = html;
    }
    
    const actionSheetDom = document.getElementById(ACTION_WRAP_UNIQUE_ID);
    
    // 每次都需要监听，否则引用对象会出错，注意每次都生成新生成出来的dom，免得重复
    mui(actionSheetDom).off();
    mui(actionSheetDom).on('tap', 'li > a', function tapFunc() {
        const title = this.innerText;

        // console.log('class:' + mClass);
        // console.log('点击,title:' + title + ',value:' + value);
        if (this.className.indexOf('titleActionSheet') === -1) {
            // 排除title的点击
            mui(`#${options.id}`).popover('toggle');
            if (this.className.indexOf('cancelActionSheet') === -1) {
                // 排除取消按钮,回调函数
                success && success(title);
            }
        }
    });
    // 显示actionsheet
    mui(`#${options.id}`).popover('toggle');
}