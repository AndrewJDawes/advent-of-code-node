import InterfaceSolutionStrategy from '../../../Interface/Strategy.js';
import InterfaceInputFetcher from '../../../../InputFetcher/Interface/Service.js';
import Solution20161a, { Axis, CardinalDirection } from './a.js';
/*
--- Part Two ---
Then, you notice the instructions continue on the back of the Recruiting Document. Easter Bunny HQ is actually at the first location you visit twice.

For example, if your instructions are R8, R4, R4, R8, the first location you visit twice is 4 blocks away, due East.

How many blocks away is the first location you visit twice?
*/
export enum LineDirection {
    Horizontal = 0,
    Vertical = 1,
    Sloped = 2,
}
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
            for (const instruction of splitIntoInstructions) {
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
                    from: { ...currentPoint },
                    to: { ...currentPoint },
                };
                newLine.to[axis] += movement * factor;
                // exclude the most recent line, because it obviously shares a junction with newest line
                const consideredLines = lines.slice(0, lines.length - 1);
                const intersectingLines = consideredLines.filter((line) => {
                    return Solution20161b.linesIntersect(line, newLine);
                });
                const pointsOfIntersection = intersectingLines.map((line) => {
                    return Solution20161b.calculatePointOfIntersection(
                        line,
                        newLine
                    );
                });

                if (pointsOfIntersection.length) {
                    const closestPoint = Solution20161b.findClosestPoint(
                        newLine.from,
                        pointsOfIntersection
                    );
                    if (closestPoint) {
                        return Solution20161b.calculateDistanceBetweenTwoPoints(
                            originPoint,
                            closestPoint
                        ).toString();
                    }
                }
                lines.push(newLine);
                currentPoint = { ...newLine.to };
            }
        }
        return 'No intersection found!';
    }
    static linesIntersect(lineA: Line, lineB: Line): boolean {
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
        const lineADirection = Solution20161b.calculateLineDirection(lineA);
        if (lineADirection === LineDirection.Sloped) {
            throw new Error('Line is sloped!');
        }
        const lineBDirection = Solution20161b.calculateLineDirection(lineB);
        if (lineBDirection === LineDirection.Sloped) {
            throw new Error('Line is sloped!');
        }
        if (lineADirection === lineBDirection) {
            throw new Error('Lines do not intersect!');
        }
        // Find the two constants
        let pointX: number | null = null;
        let pointY: number | null = null;
        if (lineADirection === LineDirection.Vertical) {
            pointX = lineA.from[Axis.EastWest];
            pointY = lineB.from[Axis.NorthSouth];
        } else {
            pointX = lineB.from[Axis.EastWest];
            pointY = lineA.from[Axis.NorthSouth];
        }
        if (null === pointX || null === pointY) {
            throw new Error(
                'Unable to find the intersection of two non-sloped lines!'
            );
        }
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
    static calculateLineDirection(line: Line): LineDirection {
        if (line.from[Axis.NorthSouth] === line.to[Axis.NorthSouth]) {
            return LineDirection.Horizontal;
        }
        if (line.from[Axis.EastWest] === line.to[Axis.EastWest]) {
            return LineDirection.Vertical;
        }
        return LineDirection.Sloped;
    }
}
export default Solution20161b;
