(function(exports) {
    function getExtraDataByKey(key) {
        if (!key) {
            return null;
        }
        // 获取url中的参数值
        var getUrlParamsValue = function(url, paramName) {
            var paraString = url.substring(url.indexOf('?') + 1, url.length).split('&');
            var paraObj = {};
            var i,
                j;

            for (i = 0;
                (j = paraString[i]); i++) {
                paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length);
            }
            var returnValue = paraObj[paramName.toLowerCase()];

            // 需要解码浏览器编码
            returnValue = decodeURIComponent(returnValue);
            if (typeof(returnValue) === 'undefined') {
                return undefined;
            } else {
                return returnValue;
            }
        };
        var value = getUrlParamsValue(window.location.href, key);

        if (value === 'undefined') {
            value = null;
        }

        return value;
    }

    function uuid(options) {
        options = options || {};

        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
            uuid = [],
            i;
        var radix = options.radix || chars.length;
        var len = options.len || 32;
        var type = options.type || 'default';

        len = Math.min(len, 36);
        len = Math.max(len, 4);
        radix = Math.min(radix, 62);
        radix = Math.max(radix, 2);

        if (len) {
            for (i = 0; i < len; i++) {
                uuid[i] = chars[0 | Math.random() * radix];
            }

            if (type === 'default') {
                len > 23 && (uuid[23] = '-');
                len > 18 && (uuid[18] = '-');
                len > 13 && (uuid[13] = '-');
                len > 8 && (uuid[8] = '-');
            }
        }

        return uuid.join('');
    }

    exports.getExtraDataByKey = getExtraDataByKey;
    exports.uuid = uuid;
})(window.Util = {});