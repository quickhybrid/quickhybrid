import {
    isObject,
} from '../util/lang';

export default function innerUtilMixin(hybrid) {
    const hybridJs = hybrid;
    const innerUtil = {};
    
    hybridJs.innerUtil = innerUtil;
    
    innerUtil.isObject = isObject;
}