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
import Solution20162b from '../Strategy/2016/2/b.js';
import Solution20163a from '../Strategy/2016/3/a.js';
import Solution20163b from '../Strategy/2016/3/b.js';
import Solution20164a from '../Strategy/2016/4/a.js';
import Solution20164b from '../Strategy/2016/4/b.js';
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
            case '20162b':
                return new Solution20162b(service);
            case '20163a':
                return new Solution20163a(service);
            case '20163b':
                return new Solution20163b(service);
            case '20164a':
                return new Solution20164a(service);
            case '20164b':
                return new Solution20164b(service, 'northpole object storage');
            default:
                throw new Error(
                    `Unknown year and day and part: ${yearDayPart}`
                );
        }
    }
}
export default FromConfig;
