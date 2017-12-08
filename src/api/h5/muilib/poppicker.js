/**
 * 日期时间选择相关
 * 依赖于mui.min.css,mui.picker.min.css,mui.poppicker.css,mui.min.js,mui.picker.min.js,mui.poppicker.js
 */

let pPicker;
// 上一次的layer,如果layer换了,也需要重新换一个
let lastLayer;

/**
 * mui的PopPicker,单例显示
 * @param {options} params 配置包括
 * data 装载的数据
 * @param {Function} success 选择回调
 */
export default function showPopPicker(params, success) {
    const options = params || {};
    
    if (window.mui && window.mui.PopPicker) {
        const layer = options.layer || 1;

        if (lastLayer !== layer) {
            // 如果两次类别不一样,重新构造
            if (pPicker) {
                // 如果存在,先dispose
                pPicker.dispose();
                pPicker = undefined;
            }
            lastLayer = layer;
        }
        pPicker = pPicker || new mui.PopPicker({
            layer,
        });
        pPicker.setData(options.data || []);
        pPicker.show((items) => {
            const result = {};

            result.items = [];
            for (let i = 0; i < layer; i += 1) {
                result.items.push({
                    text: items[i].text,
                    value: items[i].value,
                });
            }
            success && success(result);
        });
    } else {
        console.error('未引入mui pop相关js(css)');
    }
}