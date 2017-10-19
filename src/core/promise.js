/**
 * 不用pollyfill，避免体积增大
 */
export default function promiseMixin(hybrid) {
    const hybridJs = hybrid;
    
    hybridJs.Promise = window.Promise;
    
    hybridJs.getPromise = () => hybridJs.Promise;
    
    hybridJs.setPromise = (newPromise) => {
        hybridJs.Promise = newPromise;
    };
}