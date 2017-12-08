/**
 * 将小于10的数字前面补齐0,然后变为字符串返回
 * @param {Number} number 需要不起的数字
 * @return {String} 补齐0后的字符串
 */
export default function paddingWith0(numberStr) {
    const DECIMAL_TEN = 10;
    let number = numberStr;

    if (typeof number === 'number' || typeof number === 'string') {
        number = parseInt(number, DECIMAL_TEN);
        if (number < DECIMAL_TEN) {
            number = `0${number}`;
        }

        return number;
    }
    
    return '';
}