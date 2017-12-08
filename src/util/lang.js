export function getNow() {
    return window.performance &&
        window.performance.now ?
        (window.performance.now() + window.performance.timing.navigationStart) :
        +new Date();
}

export function isObject(object) {
    const classType = Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
    return classType !== 'String'
        && classType !== 'Number'
        && classType !== 'Boolean'
        && classType !== 'Undefined'
        && classType !== 'Null';
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

/**
 * 得到一个项目的根路径
 * h5模式下例如:http://id:端口/项目名/
 * @return {String} 项目的根路径
 */
export function getProjectBasePath() {
    const locObj = window.location;
    const patehName = locObj.pathname;
    const pathArray = patehName.split('/');
    // 如果是 host/xxx.html 则是/，如果是host/project/xxx.html,则是project/
    // pathName一般是 /context.html 或 /xxx/xx/content.html
    const hasProject = pathArray.length > 2;
    const contextPath = `${pathArray[Number(hasProject)]}/`;
    
    // 如果尾部有两个//替换成一个
    return `${locObj.protocol}//${locObj.host}/${contextPath}`.replace(/[/]{2}$/, '/');
}

/**
 * 将相对路径转为绝对路径 ./ ../ 开头的  为相对路径
 * 会基于对应调用js的html路径去计算
 * @param {String} path 需要转换的路径
 * @return {String} 返回转换后的路径
 */
export function changeRelativePathToAbsolute(path) {
    const locObj = window.location;
    const patehName = locObj.pathname;
    // 匹配相对路径返回父级的个数
    const relatives = path.match(/\.\.\//g);
    const count = (relatives && relatives.length) || 0;
    // 将patehName拆为数组，然后计算当前的父路径，需要去掉相应相对路径的层级
    const pathArray = patehName.split('/');
    const parentPath = pathArray.slice(0, pathArray.length - (count + 1)).join('/');
    const childPath = path.replace(/\.+\//g, '');
    // 找到最后的路径， 通过正则 去除 ./ 之前的所有路径
    let finalPath = `${parentPath}/${childPath}`;

    finalPath = `${locObj.protocol}//${locObj.host}${finalPath}`;

    return finalPath;
}

/**
 * 得到一个全路径
 * @param {String} path 路径
 * @return {String} 返回最终的路径
 */
export function getFullPath(path) {
    // 全路径
    if (/^(http|https|ftp|\/\/)/g.test(path)) {
        return path;
    }

    // 是否是相对路径
    const isRelative = /(\.\/)|(\.\.\/)/.test(path);

    if (isRelative) {
        return changeRelativePathToAbsolute(path);
    }

    return `${getProjectBasePath()}${path}`;
}

/**
 * 将json参数拼接到url中
 * @param {String} url url地址
 * @param {Object} data 需要添加的json数据
 * @return {String} 返回最终的url
 */
export function getFullUrlByParams(url = '', data) {
    let fullUrl = getFullPath(url);
    let extrasDataStr = '';
    
    if (data) {
        Object.keys(data).forEach((item) => {
            if (extrasDataStr.indexOf('?') === -1 && fullUrl.indexOf('?') === -1) {
                extrasDataStr += '?';
            } else {
                extrasDataStr += '&';
            }
            extrasDataStr += `${item}=${data[item]}`;
        });
    }

    fullUrl += extrasDataStr;

    return fullUrl;
}