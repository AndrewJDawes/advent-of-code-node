import AsyncIterator from './AsyncIterator.js';
interface Service {
    getAsyncIterator(): Promise<AsyncIterator>;
}

export default Service;
