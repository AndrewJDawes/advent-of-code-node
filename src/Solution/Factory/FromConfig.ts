import InterfaceSolutionFactory from '../Interface/Factory.js';
import InterfaceInputFetcherFactory from '../../InputFetcher/Interface/Factory.js';
import InterfaceConfig from '../Interface/Config.js';
import InterfaceSolutionStrategy from '../../Solution/Interface/Strategy.js';
import Solution20151a from '../Strategy/2015/1/a.js';
import Solution20155b from '../Strategy/2015/5/b.js';
import Solution20156a from '../Strategy/2015/6/a.js';
import Solution20161a from '../Strategy/2016/1/a.js';
import Solution20156b from '../Strategy/2015/6/b.js';
import Solution20161b from '../Strategy/2016/1/b.js';
import Solution20162a from '../Strategy/2016/2/a.js';
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
        const yearDayPart = config.year + config.day + config.part;
        switch (yearDayPart) {
            case '20151a':
                return new Solution20151a(service);
            case '20155b':
                return new Solution20155b(service);
            case '20156a':
                return new Solution20156a(service);
            case '20156b':
                return new Solution20156b(service);
            case '20161a':
                return new Solution20161a(service);
            case '20161b':
                return new Solution20161b(service);
            case '20162a':
                return new Solution20162a(service);
            default:
                throw new Error(
                    `Unknown year and day and part: ${yearDayPart}`
                );
        }
    }
}
export default FromConfig;
