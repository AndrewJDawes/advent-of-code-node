import InterfaceSolutionFactory from '../Interface/Factory.js';
import InterfaceInputFetcherFactory from '../../InputFetcher/Interface/Factory.js';
import InterfaceConfig from '../Interface/Config.js';
import InterfaceSolutionStrategy from '../../Solution/Interface/Strategy.js';
import Solution20151 from '../Strategy/2015/1.js';
class FromConfig implements InterfaceSolutionFactory {
    factory: InterfaceInputFetcherFactory;
    constructor(factory: InterfaceInputFetcherFactory) {
        this.factory = factory;
    }
    create(config: InterfaceConfig): InterfaceSolutionStrategy {
        const { dataType, dataSource } = config;
        const service = this.factory.getService(dataType, dataSource);
        return new Solution20151(service);
    }
}
export default FromConfig;
