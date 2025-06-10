import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20157a, { SimpleGraph } from './a.js';
import exp from 'constants';

describe('Solution 20157a', () => {
    const sampleCircuit = [
        '123 -> x',
        '456 -> y',
        'x AND y -> d',
        'x OR y -> e',
        'x LSHIFT 2 -> f',
        'y RSHIFT 2 -> g',
        'NOT x -> h',
        'NOT y -> i',
    ];
    describe('SimpleGraph', () => {
        describe('getVertexEdges', () => {
            it('gets all edges of the given vertex', () => {
                const mySimpleGraph = new SimpleGraph();
                mySimpleGraph.addVertex('a');
                mySimpleGraph.addVertex('b');
                mySimpleGraph.addVertex('c');
                mySimpleGraph.addEdge('a', 'b');
                mySimpleGraph.addEdge('c', 'a');
                const targetEdges = mySimpleGraph.getVertexEdges('a');
                expect(targetEdges).to.eql([
                    {
                        from: mySimpleGraph.getVertex('a'),
                        to: mySimpleGraph.getVertex('b'),
                    },
                    {
                        from: mySimpleGraph.getVertex('c'),
                        to: mySimpleGraph.getVertex('a'),
                    },
                ]);
            });
        });
    });
    // describe('solve', () => {
    //     it('interprets sampleCircuit.d as 72', async () => {
    //         const stringArr = new StringArray(sampleCircuit);
    //         const solution = await new Solution20157a(stringArr).solve();
    //         expect(solution).to.equal('72');
    //     });
    //     it('interprets sampleCircuit.e as 507', async () => {
    //         const stringArr = new StringArray(sampleCircuit);
    //         const solution = await new Solution20157a(stringArr).solve();
    //         expect(solution).to.equal('507');
    //     });
    //     it('interprets sampleCircuit.f as 492', async () => {
    //         const stringArr = new StringArray(sampleCircuit);
    //         const solution = await new Solution20157a(stringArr).solve();
    //         expect(solution).to.equal('492');
    //     });
    //     it('interprets sampleCircuit.g as 114', async () => {
    //         const stringArr = new StringArray(sampleCircuit);
    //         const solution = await new Solution20157a(stringArr).solve();
    //         expect(solution).to.equal('114');
    //     });
    //     it('interprets sampleCircuit.h as 65412', async () => {
    //         const stringArr = new StringArray(sampleCircuit);
    //         const solution = await new Solution20157a(stringArr).solve();
    //         expect(solution).to.equal('65412');
    //     });
    //     it('interprets sampleCircuit.i as 65079', async () => {
    //         const stringArr = new StringArray(sampleCircuit);
    //         const solution = await new Solution20157a(stringArr).solve();
    //         expect(solution).to.equal('65079');
    //     });
    //     it('interprets sampleCircuit.x as 123', async () => {
    //         const stringArr = new StringArray(sampleCircuit);
    //         const solution = await new Solution20157a(stringArr).solve();
    //         expect(solution).to.equal('123');
    //     });
    //     it('interprets sampleCircuit.y as 456', async () => {
    //         const stringArr = new StringArray(sampleCircuit);
    //         const solution = await new Solution20157a(stringArr).solve();
    //         expect(solution).to.equal('456');
    //     });
    // });
});
