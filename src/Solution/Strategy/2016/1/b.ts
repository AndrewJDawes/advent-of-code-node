import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import Solution20161a, { Axis, CardinalDirection } from './a.js';
/*
--- Part Two ---
Then, you notice the instructions continue on the back of the Recruiting Document. Easter Bunny HQ is actually at the first location you visit twice.

For example, if your instructions are R8, R4, R4, R8, the first location you visit twice is 4 blocks away, due East.

How many blocks away is the first location you visit twice?
*/
export enum Orientation {
    Collinear = 0,
    Clockwise = 1,
    Counterclockwise = 2,
}
export interface Line {
    from: Point;
    to: Point;
}
export interface Point {
    [Axis.EastWest]: number;
    [Axis.NorthSouth]: number;
}
class Solution20161b implements InterfaceSolutionStrategy {
    inputFetcher: InterfaceInputFetcher;
    constructor(inputFetcher: InterfaceInputFetcher) {
        this.inputFetcher = inputFetcher;
    }
    async solve() {
        const iterator = await this.inputFetcher.getAsyncIterator();
        let currentCardinalDirection = CardinalDirection.North;
        const numberOfRotations = 1;
        let axesDifferences = {
            [Axis.NorthSouth]: 0,
            [Axis.EastWest]: 0,
        };
        for await (let line of iterator) {
            const splitIntoInstructions = line.split(', ');
            splitIntoInstructions.forEach((instruction) => {
                const { movement, handDirection } =
                    Solution20161a.parseInstruction(instruction);
                // Determine which direction
                currentCardinalDirection = Solution20161a.rotate(
                    currentCardinalDirection,
                    handDirection,
                    numberOfRotations
                );
                // Add to correct axis
                const axis = Solution20161a.cardinalDirectionToAxis(
                    currentCardinalDirection
                );
                // Determine whether positive or negative
                const factor = Solution20161a.cardinalDirectionToFactor(
                    currentCardinalDirection
                );
                axesDifferences[axis] += movement * factor;
            });
        }
        return Promise.resolve(
            Math.abs(
                Object.values(axesDifferences).reduce(
                    (prev, curr) => prev + curr,
                    0
                )
            ).toString()
        );
    }
    static doLinesIntersect(lineA: Line, lineB: Line): boolean {
        return false;
    }
    static calculatePointOfIntersection(lineA: Line, lineB: Line): Point {
        const lineASlope =
            (lineA.to[Axis.NorthSouth] - lineA.from[Axis.NorthSouth]) /
            (lineA.to[Axis.EastWest] - lineA.from[Axis.EastWest]);
        const lineBSlope =
            (lineB.to[Axis.NorthSouth] - lineB.from[Axis.NorthSouth]) /
            (lineB.to[Axis.EastWest] - lineB.from[Axis.EastWest]);
        const lineAIntercept =
            lineA.from[Axis.NorthSouth] -
            lineASlope * lineA.from[Axis.EastWest];
        const lineBIntercept =
            lineB.from[Axis.NorthSouth] -
            lineBSlope * lineB.from[Axis.EastWest];
        const pointX =
            (lineBIntercept - lineAIntercept) / (lineASlope - lineBSlope);
        const pointY = lineASlope * pointX + lineAIntercept;
        return {
            [Axis.EastWest]: pointX,
            [Axis.NorthSouth]: pointY,
        };
    }
    static calculateOrientation(
        pointA: Point,
        pointB: Point,
        pointC: Point
    ): Orientation {
        const value =
            (pointB[Axis.NorthSouth] - pointA[Axis.NorthSouth]) *
                (pointC[Axis.EastWest] - pointB[Axis.EastWest]) -
            (pointB[Axis.EastWest] - pointA[Axis.EastWest]) *
                (pointC[Axis.NorthSouth] - pointB[Axis.NorthSouth]);
        if (value === 0) {
            return Orientation.Collinear;
        }
        return value > 1 ? Orientation.Clockwise : Orientation.Counterclockwise;
    }
    static collinearPointsAreOnSameSegment(
        pointA: Point,
        pointB: Point,
        pointC: Point
    ): boolean {
        return (
            Math.min(pointA[Axis.EastWest], pointB[Axis.EastWest]) <=
                pointC[Axis.EastWest] &&
            pointC[Axis.EastWest] <=
                Math.max(pointA[Axis.EastWest], pointB[Axis.EastWest]) &&
            Math.min(pointA[Axis.NorthSouth], pointB[Axis.NorthSouth]) <=
                pointC[Axis.NorthSouth] &&
            pointC[Axis.NorthSouth] <=
                Math.max(pointA[Axis.NorthSouth], pointB[Axis.NorthSouth])
        );
    }
    static calculateDistanceBetweenTwoPoints(
        pointA: Point,
        pointB: Point
    ): number {
        return (
            Math.abs(pointA[Axis.EastWest] - pointB[Axis.EastWest]) +
            Math.abs(pointA[Axis.NorthSouth] - pointB[Axis.NorthSouth])
        );
    }
    static findClosestPoint(point: Point, points: Point[]): Point {
        if (!points.length) {
            throw new Error('points cannot be empty');
        }
        let closestPoint: Point | null = null;
        points.forEach((consideredPoint) => {
            if (
                closestPoint === null ||
                Solution20161b.calculateDistanceBetweenTwoPoints(
                    point,
                    consideredPoint
                ) <
                    Solution20161b.calculateDistanceBetweenTwoPoints(
                        point,
                        closestPoint
                    )
            ) {
                closestPoint = consideredPoint;
            }
        });
        if (closestPoint === null) {
            throw new Error('Unable to find a closest point');
        }
        return closestPoint;
    }
}
export default Solution20161b;
