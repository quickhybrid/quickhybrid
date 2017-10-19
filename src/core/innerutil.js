import {
    isObject,
} from '../util/lang';

export default function innerUtilMixin(hybridJs) {
    const quick = hybridJs;
    const innerUtil = {};
    
    quick.innerUtil = innerUtil;
    
    innerUtil.isObject = isObject;
}