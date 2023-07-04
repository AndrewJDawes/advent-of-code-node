import Factory from '../Interface/Factory.js';
import Service from '../Interface/Service.js';
import URL from '../Service/URL.js';
import FilePath from '../Service/FilePath.js';
import StringArray from '../Service/StringArray.js';
class Default implements Factory {
    getService(dataType: string, dataSource: string | Array<string>): Service {
        switch (dataType) {
            case 'url':
                if (!(typeof dataSource === 'string')) {
                    throw new Error(
                        'Default factory: URL dataSource must be a string'
                    );
                }
                return new URL(dataSource);
            case 'file':
                if (!(typeof dataSource === 'string')) {
                    throw new Error(
                        'Default factory: File dataSource must be a string'
                    );
                }
                return new FilePath(dataSource);
            case 'array':
                if (!(dataSource instanceof Array)) {
                    throw new Error(
                        'Default factory: Array dataSource must be an array'
                    );
                }
                return new StringArray(dataSource);
            default:
                throw new Error('Default factory: unknown dataType');
        }
    }
}

export default Default;
