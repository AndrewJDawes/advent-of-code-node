import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
use(sinonChai);
import {
    countOf1Bits,
    layoutLogic,
    pointIsWall,
    pointIsWallMemoized,
    calculateAdjacentPoints,
    pointToMapKey,
    pointInPath,
    pointOutOfBounds,
    createPathIsShortestKnownPathToPoint,
    findShortestSteps,
    execute,
} from './common.js';

describe('Solution201613', () => {
    describe('layoutLogic', () => {
        it('returns 17 for input of 1, 2, 3', () => {
            expect(layoutLogic([1, 2], 3)).to.equal(17);
        });
        it('returns 52 for input of 2, 4, 6', () => {
            expect(layoutLogic([2, 4], 6)).to.equal(52);
        });
    });
    describe('countOf1Bits', () => {
        it('returns 4 for binary string of 170', () => {
            expect(countOf1Bits((170).toString(2))).to.equal(4);
        });
        it('returns 5 for binary string of 157', () => {
            expect(countOf1Bits((157).toString(2))).to.equal(5);
        });
    });
    describe('pointIsWall', () => {
        it('returns false for input of 1, 2, 3', () => {
            expect(pointIsWall([1, 2], 3)).to.equal(false);
        });
        it('returns true for input of 2, 4, 6', () => {
            expect(pointIsWall([2, 4], 6)).to.equal(true);
        });
    });
    describe('pointIsWallMemoized', () => {
        it('should be memoized', () => {
            expect(pointIsWallMemoized([1, 2], 3)).to.equal(false);
            expect(pointIsWallMemoized([1, 2], 3)).to.equal(false);
            expect(pointIsWallMemoized([2, 4], 6)).to.equal(true);
        });
    });
    describe('calculateAdjacentPoints', () => {
        it('returns correct adjacent points for input of [1, 2]', () => {
            expect(calculateAdjacentPoints([1, 2])).to.deep.equal([
                [0, 2],
                [2, 2],
                [1, 1],
                [1, 3],
            ]);
        });
    });
    describe('pointToMapKey', () => {
        it('returns correct map key for input of [3, 2]', () => {
            expect(pointToMapKey([3, 2])).to.equal('3,2');
        });
    });
    describe('pointInPath', () => {
        it('returns true if point is in path', () => {
            expect(
                pointInPath(
                    [1, 2],
                    [
                        [0, 0],
                        [1, 2],
                        [3, 4],
                    ],
                ),
            ).to.equal(true);
        });
        it('returns false if point is not in path', () => {
            expect(
                pointInPath(
                    [1, 2],
                    [
                        [0, 0],
                        [3, 4],
                    ],
                ),
            ).to.equal(false);
        });
    });
    describe('pointOutOfBounds', () => {
        it('returns true if point is out of bounds', () => {
            expect(pointOutOfBounds([-1, 2])).to.equal(true);
            expect(pointOutOfBounds([1, -2])).to.equal(true);
            expect(pointOutOfBounds([-1, -2])).to.equal(true);
        });
        it('returns false if point is in bounds', () => {
            expect(pointOutOfBounds([1, 2])).to.equal(false);
            expect(pointOutOfBounds([0, 0])).to.equal(false);
        });
    });
    describe('createPathIsShortestKnownPathToPoint', () => {
        it('returns true on first visit to a point', () => {
            const { pathIsShortestKnownPathToPoint } =
                createPathIsShortestKnownPathToPoint();
            expect(pathIsShortestKnownPathToPoint([2, 1], [[1, 1]])).to.equal(
                true,
            );
        });
        it('returns false when a longer path reaches the same point', () => {
            const { pathIsShortestKnownPathToPoint } =
                createPathIsShortestKnownPathToPoint();
            expect(pathIsShortestKnownPathToPoint([2, 1], [[1, 1]])).to.equal(
                true,
            );
            expect(
                pathIsShortestKnownPathToPoint([2, 1], [
                    [1, 1],
                    [1, 2],
                    [2, 2],
                    [2, 1],
                ]),
            ).to.equal(false);
        });
        it('returns true when a shorter path reaches the same point', () => {
            const { pathIsShortestKnownPathToPoint } =
                createPathIsShortestKnownPathToPoint();
            expect(
                pathIsShortestKnownPathToPoint([2, 1], [
                    [1, 1],
                    [1, 2],
                    [2, 2],
                    [2, 1],
                ]),
            ).to.equal(true);
            expect(pathIsShortestKnownPathToPoint([2, 1], [[1, 1]])).to.equal(
                true,
            );
        });
    });
    describe('findShortestSteps', () => {
        it('returns 11 for AoC example (puzzle input 10, start [1,1], goal [7,4])', () => {
            expect(findShortestSteps(10, [1, 1], [7, 4])).to.equal(11);
        });
    });
    describe('execute', () => {
        it('returns the same result as findShortestSteps for the same arguments', () => {
            expect(execute(10, [1, 1], [7, 4])).to.equal(
                findShortestSteps(10, [1, 1], [7, 4]),
            );
        });
    });
});
