export function getNow() {
    return window.performance &&
        window.performance.now ?
        (window.performance.now() + window.performance.timing.navigationStart) :
        +new Date();
}

export const noop = () => {};

export function extend(target, ...rest) {
    const finalTarget = target;

    rest.forEach((source) => {
        Object.keys(source).forEach((key) => {
            finalTarget[key] = source[key];
        });
    });

    return finalTarget;
}

/**
 * 如果version1大于version2，返回1，如果小于，返回-1，否则返回0。
 * @param {string} version1 版本1
 * @param {string} version2 版本2
 * @return {number} 返回版本1和版本2的关系
 */
export function compareVersion(version1, version2) {
    if (typeof version1 !== 'string' || typeof version2 !== 'string') {
        throw new Error('version need to be string type');
    }

    const verArr1 = version1.split('.');
    const verArr2 = version2.split('.');
    const len = Math.max(verArr1.length, verArr2.length);

    // forin不推荐，foreach不能return与break
    for (let i = 0; i < len; i += 1) {
        let ver1 = verArr1[i] || 0;
        let ver2 = verArr2[i] || 0;

        // 隐式转化为数字
        ver1 -= 0;
        ver2 -= 0;

        if (ver1 > ver2) {
            return 1;
        } else if (ver1 < ver2) {
            return -1;
        }
    }

    return 0;
}

/**
 * 字符串超出截取
 * @param {string} str 目标字符串
 * @param {Number} count 字数，以英文为基数，如果是中文，会自动除2
 * @return {string} 返回截取后的字符串
 * 暂时不考虑只遍历一部分的性能问题，因为在应用场景内是微不足道的
 */
export function eclipseText(str = '', count = 6) {
    const LEN_CHINESE = 2;
    const LEN_ENGLISH = 1;
    let num = 0;
    
    return str.split('').filter((ch) => {
        num += /[\u4e00-\u9fa5]/.test(ch) ? LEN_CHINESE : LEN_ENGLISH;
        
        return num <= count;
    }).join('');
}