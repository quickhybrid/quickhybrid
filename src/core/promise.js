/**
 * 不用pollyfill，避免体积增大
 */
export default function promiseMixin(hybridJs) {
    const quick = hybridJs;
    
    quick.Promise = window.Promise;
}