import { expect } from 'chai';
import StringArray from '../../../../InputFetcher/Service/StringArray.js';
import Solution20161b, { Line, LineDirection, Orientation } from './b.js';
import { Axis } from './a.js';

describe('Solution20161b', () => {
    describe('solve', () => {
        it('interprets R8, R4, R4, R8 as 4', async () => {
            const arr = ['R8, R4, R4, R8'];
            const stringArr = new StringArray(arr);
            const solution = await new Solution20161b(stringArr).solve();
            expect(solution).to.equal('4');
        });
        it('interprets L8, L4, L4, L8 as 4', async () => {
            const arr = ['L8, L4, L4, L8'];
            const stringArr = new StringArray(arr);
            const solution = await new Solution20161b(stringArr).solve();
            expect(solution).to.equal('4');
        });
    });
    describe('doLinesIntersect', () => {
        it('interprets (-1,-1, 5,5) and (0,4, 1,3, 2,2, 3,1, 4,0) as intersect true', async () => {
            const lineA: Line = {
                from: {
                    [Axis.EastWest]: -1,
                    [Axis.NorthSouth]: -1,
                },
                to: {
                    [Axis.EastWest]: 5,
                    [Axis.NorthSouth]: 5,
                },
            };
            const lineB: Line = {
                from: {
                    [Axis.EastWest]: 0,
                    [Axis.NorthSouth]: 4,
                },
                to: {
                    [Axis.EastWest]: 4,
                    [Axis.NorthSouth]: 0,
                },
            };
            const solution = Solution20161b.doLinesIntersect(lineA, lineB);
            expect(solution).to.equal(true);
        });
    });
    describe('calculateOrientation', () => {
        it('calculates (0,0),(3,3),(3,2) as clockwise', () => {
            expect(
                Solution20161b.calculateOrientation(
                    {
                        [Axis.EastWest]: 0,
                        [Axis.NorthSouth]: 0,
                    },
                    {
                        [Axis.EastWest]: 3,
                        [Axis.NorthSouth]: 3,
                    },
                    {
                        [Axis.EastWest]: 3,
                        [Axis.NorthSouth]: 2,
                    }
                )
            ).to.equal(Orientation.Clockwise);
        });
        it('calculates (0,0),(3,3),(3,4) as counterclockwise', () => {
            expect(
                Solution20161b.calculateOrientation(
                    {
                        [Axis.EastWest]: 0,
                        [Axis.NorthSouth]: 0,
                    },
                    {
                        [Axis.EastWest]: 3,
                        [Axis.NorthSouth]: 3,
                    },
                    {
                        [Axis.EastWest]: 3,
                        [Axis.NorthSouth]: 4,
                    }
                )
            ).to.equal(Orientation.Counterclockwise);
        });
        it('calculates (0,0),(3,3),(5,5) as collinear', () => {
            expect(
                Solution20161b.calculateOrientation(
                    {
                        [Axis.EastWest]: 0,
                        [Axis.NorthSouth]: 0,
                    },
                    {
                        [Axis.EastWest]: 3,
                        [Axis.NorthSouth]: 3,
                    },
                    {
                        [Axis.EastWest]: 5,
                        [Axis.NorthSouth]: 5,
                    }
                )
            ).to.equal(Orientation.Collinear);
        });
    });
    describe('collinearPointsAreOnSameSegment', () => {
        it('determines (0,0),(3,3),(5,5) are NOT on the same segment', () => {
            expect(
                Solution20161b.collinearPointsAreOnSameSegment(
                    {
                        [Axis.EastWest]: 0,
                        [Axis.NorthSouth]: 0,
                    },
                    {
                        [Axis.EastWest]: 3,
                        [Axis.NorthSouth]: 3,
                    },
                    {
                        [Axis.EastWest]: 5,
                        [Axis.NorthSouth]: 5,
                    }
                )
            ).to.equal(false);
        });
        it('determines (0,0),(5,5),(3,3) ARE on the same segment', () => {
            expect(
                Solution20161b.collinearPointsAreOnSameSegment(
                    {
                        [Axis.EastWest]: 0,
                        [Axis.NorthSouth]: 0,
                    },
                    {
                        [Axis.EastWest]: 5,
                        [Axis.NorthSouth]: 5,
                    },
                    {
                        [Axis.EastWest]: 3,
                        [Axis.NorthSouth]: 3,
                    }
                )
            ).to.equal(true);
        });
    });
    describe('calculatePointOfIntersection', () => {
        it('determines ((1,1), (1,-5)) and ((-3,-2),(5,-2))  intersect at 1,-2', () => {
            expect(
                Solution20161b.calculatePointOfIntersection(
                    {
                        from: { [Axis.EastWest]: 1, [Axis.NorthSouth]: 1 },
                        to: { [Axis.EastWest]: 1, [Axis.NorthSouth]: -5 },
                    },
                    {
                        from: { [Axis.EastWest]: -3, [Axis.NorthSouth]: -2 },
                        to: { [Axis.EastWest]: 5, [Axis.NorthSouth]: -2 },
                    }
                )
            ).to.deep.equal({
                [Axis.EastWest]: 1,
                [Axis.NorthSouth]: -2,
            });
        });
    });
    describe('calculateDistanceBetweenTwoPoints', () => {
        it('calculates the distance between (0,0) and (2,1) as 3', () => {
            expect(
                Solution20161b.calculateDistanceBetweenTwoPoints(
                    {
                        [Axis.EastWest]: 0,
                        [Axis.NorthSouth]: 0,
                    },
                    {
                        [Axis.EastWest]: 2,
                        [Axis.NorthSouth]: 1,
                    }
                )
            ).to.equal(3);
        });
    });
    describe('findClosestPoint', () => {
        it('finds that out of [(3,5), (-2,4), (5,5)] that (-2,4) is closest to (0,0)', () => {
            expect(
                Solution20161b.findClosestPoint(
                    {
                        [Axis.EastWest]: 0,
                        [Axis.NorthSouth]: 0,
                    },
                    [
                        {
                            [Axis.EastWest]: 3,
                            [Axis.NorthSouth]: 5,
                        },
                        {
                            [Axis.EastWest]: -2,
                            [Axis.NorthSouth]: 4,
                        },
                        {
                            [Axis.EastWest]: 5,
                            [Axis.NorthSouth]: 5,
                        },
                    ]
                )
            ).to.deep.equal({
                [Axis.EastWest]: -2,
                [Axis.NorthSouth]: 4,
            });
        });
    });
    describe('calculateLineDirection', () => {
        it('determines that (0,1),(0,5) is vertical', () => {
            expect(
                Solution20161b.calculateLineDirection({
                    from: {
                        [Axis.EastWest]: 0,
                        [Axis.NorthSouth]: 1,
                    },
                    to: {
                        [Axis.EastWest]: 0,
                        [Axis.NorthSouth]: 5,
                    },
                })
            ).to.equal(LineDirection.Vertical);
        });
        it('determines that (1,0),(5,0) is horizontal', () => {
            expect(
                Solution20161b.calculateLineDirection({
                    from: {
                        [Axis.EastWest]: 1,
                        [Axis.NorthSouth]: 0,
                    },
                    to: {
                        [Axis.EastWest]: 5,
                        [Axis.NorthSouth]: 0,
                    },
                })
            ).to.equal(LineDirection.Horizontal);
        });
        it('determines that (1,0),(5,1) is sloped', () => {
            expect(
                Solution20161b.calculateLineDirection({
                    from: {
                        [Axis.EastWest]: 1,
                        [Axis.NorthSouth]: 0,
                    },
                    to: {
                        [Axis.EastWest]: 5,
                        [Axis.NorthSouth]: 1,
                    },
                })
            ).to.equal(LineDirection.Sloped);
        });
    });
});
