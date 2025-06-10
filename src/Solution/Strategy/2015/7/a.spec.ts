import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
use(sinonChai);
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20157a, { SimpleGraph, Vertex } from './a.js';
import { Verify } from 'crypto';

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
                const vertexA = new Vertex('a');
                const vertexB = new Vertex('b');
                const vertexC = new Vertex('c');

                mySimpleGraph.addVertex(vertexA);
                mySimpleGraph.addVertex(vertexB);
                mySimpleGraph.addVertex(vertexC);
                mySimpleGraph.addEdge('a', 'b');
                mySimpleGraph.addEdge('c', 'a');

                const targetEdges = mySimpleGraph.getVertexEdges(vertexA);

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
    describe('Vertex class', () => {
        describe('onSetValue', () => {
            it('notifies of value change', () => {
                const myCallback = sinon.spy();
                const myVertex = new Vertex('a');
                myVertex.onSetValue(myCallback);
                myVertex.setValue(123);
                expect(myCallback).to.have.been.calledWith(myVertex);
            });
        });
    });
});
