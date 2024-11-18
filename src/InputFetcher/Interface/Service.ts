import AsyncIterator from '../Interface/Iterator.js';
interface Service {
    getIterator(): Promise<AsyncIterator>;
}

export default Service;
