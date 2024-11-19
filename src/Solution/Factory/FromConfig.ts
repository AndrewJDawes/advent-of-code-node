import InterfaceSolutionFactory from '../Interface/Factory.js';
import InterfaceInputFetcherFactory from '../../InputFetcher/Interface/Factory.js';
import InterfaceConfig from '../Interface/Config.js';
import InterfaceSolutionStrategy from '../../Solution/Interface/Strategy.js';
import Solution20151a from '../Strategy/2015/1/a.js';
import Solution20155b from '../Strategy/2015/5/b.js';
import Solution20161a from '../Strategy/2016/1/a.js';
class FromConfig implements InterfaceSolutionFactory {
    inputFetcherFactory: InterfaceInputFetcherFactory;
    constructor(inputFetcherFactory: InterfaceInputFetcherFactory) {
        this.inputFetcherFactory = inputFetcherFactory;
    }
    create(config: InterfaceConfig): InterfaceSolutionStrategy {
        const { dataType, dataSource } = config;
        const service = this.inputFetcherFactory.getService(
            dataType,
            dataSource
        );
        switch (config.year + config.day + config.part) {
            case '20151a':
                return new Solution20151a(service);
            case '20155b':
                return new Solution20155b(service);
            case '20161a':
                return new Solution20161a(service);
            default:
                throw new Error(
                    'Unknown year and day: ' + config.year + config.day
                );
        }
    }
}
export default FromConfig;
