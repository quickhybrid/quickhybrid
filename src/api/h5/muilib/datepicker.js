/**
 * 日期时间选择相关
 * 依赖于 mui.min.css,mui.picker.min.css,mui.min.js,mui.picker.min.js
 */

let dtPicker;
let oldDtType;

/**
 * mui的时间选择单例选择
 * 如果当前类别和以前类别是同一个,则使用同一个对象,
 * 否则销毁当前,重新构造
 * @param {JSON} params 传入的构造参数
 * @param {Function} success(res) 选择后的回调
 * 日期时 result.date
 * 时间时 result.time
 * 月份时 result.month
 * 日期时间时 result.datetime
 */
export default function showDatePicter(params, success) {
    const options = params || {};
    
    if (window.mui && window.mui.DtPicker) {
        if (oldDtType !== options.type) {
            // 如果两次类别不一样,重新构造
            if (dtPicker) {
                // 如果存在,先dispose
                dtPicker.dispose();
                dtPicker = undefined;
            }
            oldDtType = options.type;
        }
        dtPicker = dtPicker || new mui.DtPicker(options);
        dtPicker.show((rs) => {
            const result = {};

            if (options.type === 'date') {
                result.date = `${rs.y.value}-${rs.m.value}-${rs.d.value}`;
            } else if (options.type === 'time') {
                result.time = `${rs.h.value}:${rs.i.value}`;
            } else if (options.type === 'month') {
                result.month = `${rs.y.value}-${rs.m.value}`;
            } else {
                // 日期时间
                result.datetime = `${rs.y.value}-${rs.m.value}-${rs.d.value} ${rs.h.value}:${rs.i.value}`;
            }
            
            success && success(result);
        });
    } else {
        console.error('错误,缺少引用的css或js,无法使用mui的dtpicker');
    }
}