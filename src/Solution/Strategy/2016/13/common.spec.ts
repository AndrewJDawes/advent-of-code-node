import sinon from 'sinon';
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
use(sinonChai);
import {
    countOf1Bits,
    isOddNumber,
    layoutLogic,
    pointIsWall,
} from './common.js';

describe('Solution201613', () => {
    describe('layoutLogic', () => {
        it('returns 17 for input of 1, 2, 3', () => {
            expect(layoutLogic(1, 2, 3)).to.equal(17);
        });
        it('returns 52 for input of 2, 4, 6', () => {
            expect(layoutLogic(2, 4, 6)).to.equal(52);
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
            expect(pointIsWall(1, 2, 3)).to.equal(false);
        });
        it('returns true for input of 2, 4, 6', () => {
            expect(pointIsWall(2, 4, 6)).to.equal(true);
        });
        it('calls layoutLogic and countOf1Bits and isOddNumber', () => {
            const layoutLogicSpy = sinon.spy(layoutLogic);
            const countOf1BitsSpy = sinon.spy(countOf1Bits);
            const isOddNumberSpy = sinon.spy(isOddNumber);
            pointIsWall(1, 2, 3);
            expect(layoutLogicSpy.called).to.be.true;
            expect(countOf1BitsSpy.called).to.be.true;
            expect(isOddNumberSpy.called).to.be.true;
        });
        it('should be memoized', () => {
            const layoutLogicSpy = sinon.spy(layoutLogic);
            const countOf1BitsSpy = sinon.spy(countOf1Bits);
            const isOddNumberSpy = sinon.spy(isOddNumber);
            pointIsWall(1, 2, 3);
            pointIsWall(1, 2, 3);
            expect(layoutLogicSpy.calledOnce).to.be.true;
            expect(countOf1BitsSpy.calledOnce).to.be.true;
            expect(isOddNumberSpy.calledOnce).to.be.true;
        });
    });
});
