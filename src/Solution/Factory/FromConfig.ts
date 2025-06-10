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
import Solution20165a from '../Strategy/2016/5/a.js';
import Solution20165b from '../Strategy/2016/5/b.js';
import Solution20166a from '../Strategy/2016/6/a.js';
import Solution20166b from '../Strategy/2016/6/b.js';
import Solution20157a from '../Strategy/2015/7/a.js';

import Solution20167a from '../Strategy/2016/7/a.js';
import Solution20167b from '../Strategy/2016/7/b.js';
import Solution20168a from '../Strategy/2016/8/a.js';
import Solution20168b from '../Strategy/2016/8/b.js';
import Solution20169a from '../Strategy/2016/9/a.js';
import Solution20169b from '../Strategy/2016/9/b.js';
import Solution201610a from '../Strategy/2016/10/a.js';
import Solution201610b from '../Strategy/2016/10/b.js';
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
            case '20157a':
                return new Solution20157a(service);
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
            case '20165a':
                return new Solution20165a(service);
            case '20165b':
                return new Solution20165b(service);
            case '20166a':
                return new Solution20166a(service);
            case '20166b':
                return new Solution20166b(service);
            case '20167a':
                return new Solution20167a(service);
            case '20167b':
                return new Solution20167b(service);
            case '20168a':
                return new Solution20168a(service);
            case '20168b':
                return new Solution20168b(service);
            case '20169a':
                return new Solution20169a(service);
            case '20169b':
                return new Solution20169b(service);
            case '201610a':
                return new Solution201610a(service, new Set([17, 61]));
            case '201610b':
                return new Solution201610b(service, new Set([0, 1, 2]));
            default:
                throw new Error(
                    `Unknown year and day and part: ${yearDayPart}`
                );
        }
    }
}
export default FromConfig;
