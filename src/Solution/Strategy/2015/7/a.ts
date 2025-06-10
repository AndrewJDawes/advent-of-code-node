import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
/*
--- Day 7: Some Assembly Required ---
This year, Santa brought little Bobby Tables a set of wires and bitwise logic gates! Unfortunately, little Bobby is a little under the recommended age range, and he needs help assembling the circuit.

Each wire has an identifier (some lowercase letters) and can carry a 16-bit signal (a number from 0 to 65535). A signal is provided to each wire by a gate, another wire, or some specific value. Each wire can only get a signal from one source, but can provide its signal to multiple destinations. A gate provides no signal until all of its inputs have a signal.

The included instructions booklet describes how to connect the parts together: x AND y -> z means to connect wires x and y to an AND gate, and then connect its output to wire z.

For example:

123 -> x means that the signal 123 is provided to wire x.
x AND y -> z means that the bitwise AND of wire x and wire y is provided to wire z.
p LSHIFT 2 -> q means that the value from wire p is left-shifted by 2 and then provided to wire q.
NOT e -> f means that the bitwise complement of the value from wire e is provided to wire f.
Other possible gates include OR (bitwise OR) and RSHIFT (right-shift). If, for some reason, you'd like to emulate the circuit instead, almost all programming languages (for example, C, JavaScript, or Python) provide operators for these gates.

For example, here is a simple circuit:

123 -> x
456 -> y
x AND y -> d
x OR y -> e
x LSHIFT 2 -> f
y RSHIFT 2 -> g
NOT x -> h
NOT y -> i
After it is run, these are the signals on the wires:

d: 72
e: 507
f: 492
g: 114
h: 65412
i: 65079
x: 123
y: 456

In little Bobby's kit's instructions booklet (provided as your puzzle input), what signal is ultimately provided to wire a?
*/

type Bit = 0 | 1;
type Binary16Tuple = [
    Bit,
    Bit,
    Bit,
    Bit,
    Bit,
    Bit,
    Bit,
    Bit,
    Bit,
    Bit,
    Bit,
    Bit,
    Bit,
    Bit,
    Bit,
    Bit
];

interface Vertex {
    name: string;
    edges?: Edge[];
}

interface Edge {
    from: Vertex;
    to: Vertex;
}

export class SimpleGraph {
    vertices: Vertex[];
    edges: Edge[];

    constructor() {
        this.vertices = [];
        this.edges = [];
    }

    addVertex(name: string) {
        if (this.getVertex(name)) {
            throw new Error(`Vertex already exists: ${name}`);
        }
        this.vertices.push({ name });
    }

    getVertex(name: string) {
        return this.vertices.find((v) => v.name === name);
    }

    getVertexEdges(name: string) {
        return this.edges.filter((edge) => {
            if (edge.from.name === name || edge.to.name == name) {
                return true;
            }
            return false;
        });
    }

    addEdge(fromName: string, toName: string) {
        const fromVertex = this.getVertex(fromName);
        const toVertex = this.getVertex(toName);
        if (!fromVertex || !toVertex) {
            throw new Error(
                `One or both vertices not found: ${fromName}, ${toName}`
            );
        }
        const edge: Edge = { from: fromVertex, to: toVertex };
        this.edges.push(edge);
        if (!fromVertex.edges) {
            fromVertex.edges = [];
        }
        fromVertex.edges.push(edge);
        if (!toVertex.edges) {
            toVertex.edges = [];
        }
        toVertex.edges.push(edge);
    }

    deleteVertex(name: string) {
        const vertex = this.getVertex(name);
        if (!vertex) {
            throw new Error(`Vertex not found: ${name}`);
        }
        this.vertices = this.vertices.filter((v) => v.name !== name);
        this.edges = this.edges.filter(
            (e) => e.from.name !== name && e.to.name !== name
        );
    }

    deleteEdge(fromName: string, toName: string) {
        this.edges = this.edges.filter(
            (e) => !(e.from.name === fromName && e.to.name === toName)
        );
    }
}

class Solution20157a implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    wires: Record<string, Binary16Tuple>;

    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
        this.wires = {};
    }

    async solve() {
        const iterator = await this.inputFetcher.getAsyncIterator();
        let lineId = 1;

        for await (let line of iterator) {
            // this.circuit.push(Solution20157a.buildParsedLine(line, lineId));
            lineId++;
        }

        const result = 'result';

        return result.toString();
    }

    // Parse line
}

export default Solution20157a;
