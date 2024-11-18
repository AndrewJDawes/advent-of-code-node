import AsyncIterator from '../Interface/Iterator.js';
interface Service {
    getAsyncIterator(): Promise<AsyncIterator>;
}

export default Service;
