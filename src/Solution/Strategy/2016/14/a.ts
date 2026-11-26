import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import {
    findFirstLetterWithStreakOrLonger,
    generateHash,
    generateKey,
    getKeyByIndexOrGenerateMemoized,
    rangeContainsStreakOrLongerForLetter,
    StringCharacterizerFiniteStateMachineCollectionA,
    StringCharacterizerFiniteStateMachineCollectionInterface,
    StringCharacterizerFiniteStateMachineFactoryA,
} from './common.js';
class Solution implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    targetKeyIndex: number;
    constructor(inputFetcher: InterfaceInputFetcher, targetKeyIndex: number) {
        this.inputFetcher = inputFetcher;
        this.targetKeyIndex = targetKeyIndex;
    }
    async solve() {
        const inputArray: string[] = [];
        const iterator = await this.inputFetcher.getAsyncIterator();
        for await (let line of iterator) {
            inputArray.push(line);
        }
        const input = inputArray.join('');
        const collection: StringCharacterizerFiniteStateMachineCollectionInterface =
            new StringCharacterizerFiniteStateMachineCollectionA(
                input,
                generateHash,
                new StringCharacterizerFiniteStateMachineFactoryA(),
            );
        const keyGenerator = generateKey(
            collection,
            findFirstLetterWithStreakOrLonger,
            rangeContainsStreakOrLongerForLetter,
            0,
            3,
            5,
            1000,
        );
        const memoizedGenerator = getKeyByIndexOrGenerateMemoized(keyGenerator);
        const keyAndMeta = memoizedGenerator(this.targetKeyIndex);
        return keyAndMeta.index.toString();
    }
}
export default Solution;
