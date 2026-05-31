import sinon from 'sinon';
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
use(sinonChai);
import {
    countOf1Bits,
    isOddNumber,
    layoutLogic,
    pointIsWall,
    pointIsWallMemoized,
    calculateAdjacentPoints,
    pointToMapKey,
    pointInPath,
    pointOutOfBounds,
    pathIsShortestKnownPathToPoint,
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
        it('returns 4 for input of "170"', () => {
            expect(countOf1Bits('170')).to.equal(4);
        });
        it('returns 5 for input of "157"', () => {
            expect(countOf1Bits('157')).to.equal(5);
        });
    });
    describe('pointIsWall', () => {
        it('returns false for input of 1, 2, 3', () => {
            expect(pointIsWall([1, 2], 3)).to.equal(false);
        });
        it('returns true for input of 2, 4, 6', () => {
            expect(pointIsWall([2, 4], 6)).to.equal(true);
        });
        it('calls layoutLogic and countOf1Bits and isOddNumber', () => {
            const layoutLogicSpy = sinon.spy(layoutLogic);
            const countOf1BitsSpy = sinon.spy(countOf1Bits);
            const isOddNumberSpy = sinon.spy(isOddNumber);
            pointIsWall([1, 2], 3);
            expect(layoutLogicSpy).to.have.been.called;
            expect(countOf1BitsSpy).to.have.been.called;
            expect(isOddNumberSpy).to.have.been.called;
        });
    });
    describe('pointIsWallMemoized', () => {
        it('should be memoized', () => {
            const layoutLogicSpy = sinon.spy(layoutLogic);
            const countOf1BitsSpy = sinon.spy(countOf1Bits);
            const isOddNumberSpy = sinon.spy(isOddNumber);
            pointIsWallMemoized([1, 2], 3);
            pointIsWallMemoized([1, 2], 3);
            expect(layoutLogicSpy).to.have.been.calledOnce;
            expect(countOf1BitsSpy).to.have.been.calledOnce;
            expect(isOddNumberSpy).to.have.been.calledOnce;
        });
        it('should call pointToMapKey to generate the cache key', () => {
            const pointToMapKeySpy = sinon.spy(pointToMapKey);
            pointIsWallMemoized([1, 2], 3);
            expect(pointToMapKeySpy).to.have.been.calledWith([1, 2], 3);
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
    describe('pathIsShortestKnownPathToPoint', () => {
        it('returns true', () => {
            expect(
                pathIsShortestKnownPathToPoint(
                    [1, 2],
                    [
                        [1, 1],
                        [1, 2],
                    ],
                ),
            ).to.equal(true);
        });
        it('should return true', () => {
            expect(pathIsShortestKnownPathToPoint([1, 2], [[1, 2]])).to.equal(
                true,
            );
        });
        it('returns false', () => {
            expect(
                pathIsShortestKnownPathToPoint(
                    [1, 2],
                    [
                        [1, 1],
                        [1, 2],
                    ],
                ),
            ).to.equal(false);
        });
    });
});
