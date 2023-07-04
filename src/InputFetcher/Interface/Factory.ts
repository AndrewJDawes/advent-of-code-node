import Service from '../Interface/Service.js';
interface Factory {
    getService(
        dataType: 'url' | 'file' | 'array',
        dataSource: string | Array<string>
    ): Service;
}

export default Factory;
