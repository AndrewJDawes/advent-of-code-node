import InterfaceSolutionStrategy from '../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../InputFetcher/Interface/Service.js';
class Solution20151 implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
    }
    solve() {
        return Promise.resolve('0');
    }
}
export default Solution20151;
