import Strategy from './Strategy.js';
import Config from './Config.js';

interface Factory {
    create(config: Config): Strategy;
}

export default Factory;
