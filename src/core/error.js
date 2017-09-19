import globalError from '../inner/globalerror';

export default function errorMixin(hybridJs) {
    const quick = hybridJs;
    
    quick.globalError = globalError;
}