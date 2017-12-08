/**
 * 普通消息框模块、
 * 包括:alert,confirm,prompt
 * 基于mui.css
 */

const CLASS_POPUP = 'mui-popup';
const CLASS_POPUP_BACKDROP = 'mui-popup-backdrop';
const CLASS_POPUP_IN = 'mui-popup-in';
const CLASS_POPUP_OUT = 'mui-popup-out';
const CLASS_POPUP_INNER = 'mui-popup-inner';
const CLASS_POPUP_TITLE = 'mui-popup-title';
const CLASS_POPUP_TEXT = 'mui-popup-text';
const CLASS_POPUP_INPUT = 'mui-popup-input';
const CLASS_POPUP_BUTTONS = 'mui-popup-buttons';
const CLASS_POPUP_BUTTON = 'mui-popup-button';
const CLASS_POPUP_BUTTON_BOLD = 'mui-popup-button-bold';
const CLASS_ACTIVE = 'mui-active';

const popupStack = [];
const backdrop = (() => {
    const element = document.createElement('div');

    element.classList.add(CLASS_POPUP_BACKDROP);
    element.addEventListener('webkitTransitionEnd', () => {
        if (!element.classList.contains(CLASS_ACTIVE)) {
            element.parentNode && element.parentNode.removeChild(element);
        }
    });

    return element;
})();
const createInput = (placeholder) => {
    const inputHtml = `<input type="text" autofocus placeholder="${placeholder || ''}"/>`;

    return `<div class="${CLASS_POPUP_INPUT}">${inputHtml}</div>`;
};
const createInner = (message, title, extra) => {
    const divPopText = `<div class="${CLASS_POPUP_TEXT}">${message}</div>`;
    const divPopTitle = `<div class="${CLASS_POPUP_TITLE}">${title}</div>`;

    return `<div class="${CLASS_POPUP_INNER}">${divPopTitle}${divPopText}${extra || ''}</div>`;
};
const createButtons = (btnArray) => {
    const len = btnArray.length;
    const btns = [];

    for (let i = 0; i < len; i += 1) {
        const classBold = (i === len - 1) ? CLASS_POPUP_BUTTON_BOLD : '';

        btns.push(`<span class="${CLASS_POPUP_BUTTON} ${classBold}">${btnArray[i]}</span>`);
    }

    return `<div class="${CLASS_POPUP_BUTTONS}">${btns.join('')}</div>`;
};
const createPopup = (html, callback) => {
    // 将所有的\n替换为  <br>
    const newHtml = html.replace(/[\n]/g, '<BR />');
    let popupElement = document.createElement('div');

    popupElement.className = CLASS_POPUP;
    popupElement.innerHTML = newHtml;

    const removePopupElement = () => {
        popupElement.parentNode && popupElement.parentNode.removeChild(popupElement);
        popupElement = null;
    };

    popupElement.addEventListener('webkitTransitionEnd', (e) => {
        if (popupElement &&
            e.target === popupElement &&
            popupElement.classList.contains(CLASS_POPUP_OUT)) {
            removePopupElement();
        }
    });
    popupElement.style.display = 'block';
    document.body.appendChild(popupElement);
    popupElement.classList.add(CLASS_POPUP_IN);

    if (!backdrop.classList.contains(CLASS_ACTIVE)) {
        backdrop.style.display = 'block';
        document.body.appendChild(backdrop);
        backdrop.classList.add(CLASS_ACTIVE);
    }
    const btns = popupElement.querySelectorAll(`.${CLASS_POPUP_BUTTON}`);
    const input = popupElement.querySelector(`.${CLASS_POPUP_INPUT} input`);
    const popup = {
        element: popupElement,
        close(index, animate) {
            if (popupElement) {
                // 如果是input 类型,就回调input内的文字
                // 否则回调 btns的index
                const value = input ? input.value : (index || 0);

                callback && callback(value, {
                    index: index || 0,
                    value,
                });
                if (animate !== false) {
                    popupElement.classList.remove(CLASS_POPUP_IN);
                    popupElement.classList.add(CLASS_POPUP_OUT);
                } else {
                    removePopupElement();
                }
                popupStack.pop();
                // 如果还有其他popup，则不remove backdrop
                if (popupStack.length) {
                    popupStack[popupStack.length - 1].show(animate);
                } else {
                    backdrop.classList.remove(CLASS_ACTIVE);
                }
            }
        },
    };
    const handleEvent = (e) => {
        popup.close([].slice.call(btns).indexOf(e.target));
    };
    const allBtns = document.querySelectorAll(`.${CLASS_POPUP_BUTTON}`);

    if (allBtns && allBtns.length > 0) {
        for (let i = 0; i < allBtns.length; i += 1) {
            allBtns[i].addEventListener('click', handleEvent);
        }
    }
    if (popupStack.length) {
        popupStack[popupStack.length - 1].hide();
    }
    popupStack.push({
        close: popup.close,
        show() {
            popupElement.style.display = 'block';
            popupElement.classList.add(CLASS_POPUP_IN);
        },
        hide() {
            popupElement.style.display = 'none';
            popupElement.classList.remove(CLASS_POPUP_IN);
        },
    });

    return popup;
};

export function alert(params, success) {
    const options = params;

    options.title = options.title || '提示';
    options.buttonName = options.buttonName || '确定';
    options.message = options.message || '';

    const innerHtml = createInner(options.message, options.title);
    const buttonHtml = createButtons([options.buttonName]);

    return createPopup(innerHtml + buttonHtml, success);
}

export function confirm(params, success) {
    const options = params;

    options.title = options.title || '提示';
    options.buttonLabels = options.buttonLabels || ['确认', '取消'];
    options.message = options.message || '';

    const innerHtml = createInner(options.message, options.title);
    const buttonHtml = createButtons(options.buttonLabels);

    return createPopup(innerHtml + buttonHtml, success);
}

export function prompt(params, success) {
    const options = params;

    options.title = options.title || '您好';
    options.buttonLabels = options.buttonLabels || ['确认', '取消'];
    options.text = options.text || '';
    options.hint = options.hint || '请输入内容';

    const innerHtml = createInner(options.text, options.title, createInput(options.hint));
    const buttonHtml = createButtons(options.buttonLabels);

    return createPopup(innerHtml + buttonHtml, success);
}

export function toast(params) {
    const options = params;
    const message = options.message;
    const duration = options.duration || 2000;
    let toastDiv = document.createElement('div');

    toastDiv.classList.add('mui-toast-container');
    toastDiv.innerHTML = `<div class="mui-toast-message">${message}</div>`;
    toastDiv.addEventListener('webkitTransitionEnd', () => {
        if (!toastDiv.classList.contains(CLASS_ACTIVE)) {
            toastDiv.parentNode.removeChild(toastDiv);
            toastDiv = null;
        }
    });
    // 点击则自动消失
    toastDiv.addEventListener('click', () => {
        toastDiv.parentNode.removeChild(toastDiv);
        toastDiv = null;
    });
    document.body.appendChild(toastDiv);
    toastDiv.classList.add(CLASS_ACTIVE);
    setTimeout(() => {
        toastDiv && toastDiv.classList.remove(CLASS_ACTIVE);
    }, duration);
}