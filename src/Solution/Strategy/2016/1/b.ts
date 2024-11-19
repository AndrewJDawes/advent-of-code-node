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
        const originPoint: Point = {
            [Axis.EastWest]: 0,
            [Axis.NorthSouth]: 0,
        };
        let currentPoint: Point = {
            [Axis.EastWest]: 0,
            [Axis.NorthSouth]: 0,
        };
        const numberOfRotations = 1;
        let axesDifferences = {
            [Axis.NorthSouth]: 0,
            [Axis.EastWest]: 0,
        };
        const lines: Line[] = [];
        for await (let inputLine of iterator) {
            const splitIntoInstructions = inputLine.split(', ');
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
                const newLine: Line = {
                    from: currentPoint,
                    to: currentPoint,
                };
                newLine.to[axis] += movement * factor;
                const intersectingLines = lines.filter((line) => {
                    return Solution20161b.doLinesIntersect(line, newLine);
                });
                const pointsOfIntersection = intersectingLines.map((line) => {
                    return Solution20161b.calculatePointOfIntersection(
                        newLine,
                        line
                    );
                });
                const closestPoint = Solution20161b.findClosestPoint(
                    newLine.from,
                    pointsOfIntersection
                );
                if (closestPoint) {
                    return Solution20161b.calculateDistanceBetweenTwoPoints(
                        originPoint,
                        closestPoint
                    );
                }
                lines.push(newLine);
                currentPoint = newLine.to;
                // -   On input
                //     -   Loop through other all prior added line segments, calculating whether they intersect with new line segment
                //     -   For all points of intersection, stash them in an array
                //         -   Of those items, find the one that is closest to the `from` of our new line (that will be the first intersection)
                //             -   abs(x1 - x2) + abs(y1 - y2)
                //     -   IF we found an intersection
                //         -   SUM up the difference between original location X (0) and intersection X (?) + difference between original location Y (0) and intersection Y (?)
                //             -   That will be the number of blocks
                //     -   ELSE
                //         -   Append the new line segment to list of line segments
                //         -   Update last known point
            });
        }
        throw new Error('No intersection found!');
        return 'No intersection found!';
    }
    static doLinesIntersect(lineA: Line, lineB: Line): boolean {
        const o1 = Solution20161b.calculateOrientation(
            lineA.from,
            lineA.to,
            lineB.from
        );
        const o2 = Solution20161b.calculateOrientation(
            lineA.from,
            lineA.to,
            lineB.to
        );
        const o3 = Solution20161b.calculateOrientation(
            lineB.from,
            lineB.to,
            lineA.from
        );
        const o4 = Solution20161b.calculateOrientation(
            lineB.from,
            lineB.to,
            lineA.to
        );

        // # General case
        if (o1 !== o2 && o3 !== o4) {
            return true;
        }

        if (
            o1 === Orientation.Collinear &&
            Solution20161b.collinearPointsAreOnSameSegment(
                lineA.from,
                lineA.to,
                lineB.from
            )
        ) {
            return true;
        }

        if (
            o2 === Orientation.Collinear &&
            Solution20161b.collinearPointsAreOnSameSegment(
                lineA.from,
                lineA.to,
                lineB.to
            )
        ) {
            return true;
        }

        if (
            o3 === Orientation.Collinear &&
            Solution20161b.collinearPointsAreOnSameSegment(
                lineB.from,
                lineB.to,
                lineA.from
            )
        ) {
            return true;
        }

        if (
            o4 === Orientation.Collinear &&
            Solution20161b.collinearPointsAreOnSameSegment(
                lineB.from,
                lineB.to,
                lineA.to
            )
        ) {
            return true;
        }
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
    static findClosestPoint(point: Point, points: Point[]): Point | null {
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
