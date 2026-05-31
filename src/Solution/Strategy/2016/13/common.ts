export type Point = [number, number];
export type Path = Point[];

export function pointIsWall([x, y]: Point, puzzleInput: number): boolean {
    const value = layoutLogic([x, y], puzzleInput);
    return isOddNumber(countOf1Bits(value.toString(2)));
}

export const pointIsWallMemoized = (() => {
    const cache: Record<string, boolean> = {};
    return ([x, y]: Point, puzzleInput: number): boolean => {
        const key = pointToMapKey([x, y], puzzleInput);
        if (cache[key] !== undefined) {
            return cache[key];
        }
        const result = pointIsWall([x, y], puzzleInput);
        cache[key] = result;
        return result;
    };
})();

export function countOf1Bits(n: string): number {
    return n.split('').filter((bit) => bit === '1').length;
}

export function isOddNumber(n: number): boolean {
    return n % 2 === 1;
}

export function layoutLogic([x, y]: Point, puzzleInput: number): number {
    const value = x * x + 3 * x + 2 * x * y + y + y * y + puzzleInput;
    return value;
}

export function calculateAdjacentPoints([x, y]: Point): Point[] {
    return [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
    ];
}

export function pointToMapKey([x, y]: Point, puzzleInput?: number): string {
    const pointKey = `${x},${y}`;
    return puzzleInput === undefined ? pointKey : `${pointKey},${puzzleInput}`;
}

export function pointInPath(point: Point, path: Path): boolean {
    return path.some(([px, py]) => px === point[0] && py === point[1]);
}

export function pointOutOfBounds([x, y]: Point): boolean {
    return x < 0 || y < 0;
}

function pointsEqual([ax, ay]: Point, [bx, by]: Point): boolean {
    return ax === bx && ay === by;
}

export function createPathIsShortestKnownPathToPoint(): {
    pathIsShortestKnownPathToPoint: (point: Point, path: Path) => boolean;
    isStalePath: (path: Path) => boolean;
    seedStart: (point: Point) => void;
} {
    const shortestDistanceByPoint: Record<string, number> = {};
    const pathIsShortestKnownPathToPoint = (
        point: Point,
        path: Path,
    ): boolean => {
        const key = pointToMapKey(point);
        const steps = path.length;
        const known = shortestDistanceByPoint[key];
        if (known === undefined || steps < known) {
            shortestDistanceByPoint[key] = steps;
            return true;
        }
        return false;
    };
    const isStalePath = (path: Path): boolean => {
        const currentPoint = path[path.length - 1]!;
        const key = pointToMapKey(currentPoint);
        const stepsToCurrent = path.length - 1;
        const known = shortestDistanceByPoint[key];
        return known !== undefined && known < stepsToCurrent;
    };
    const seedStart = (point: Point): void => {
        shortestDistanceByPoint[pointToMapKey(point)] = 0;
    };
    return {
        pathIsShortestKnownPathToPoint,
        isStalePath,
        seedStart,
    };
}

export function findShortestSteps(
    puzzleInput: number,
    start: Point = [1, 1],
    goal: Point = [31, 39],
): number {
    let stepsToWin: number | null = null;
    const pathsToExplore: Path[] = [[start]];
    const {
        pathIsShortestKnownPathToPoint,
        isStalePath,
        seedStart,
    } = createPathIsShortestKnownPathToPoint();
    seedStart(start);

    while (stepsToWin === null && pathsToExplore.length > 0) {
        const pathToExplore = pathsToExplore.shift()!;
        if (isStalePath(pathToExplore)) {
            continue;
        }
        const currentPoint = pathToExplore[pathToExplore.length - 1]!;

        for (const adjacentPoint of calculateAdjacentPoints(currentPoint)) {
            if (pointsEqual(adjacentPoint, goal)) {
                stepsToWin = pathToExplore.length;
                break;
            }
            if (pointOutOfBounds(adjacentPoint)) {
                continue;
            }
            if (pointInPath(adjacentPoint, pathToExplore)) {
                continue;
            }
            if (
                !pathIsShortestKnownPathToPoint(adjacentPoint, pathToExplore)
            ) {
                continue;
            }
            if (pointIsWallMemoized(adjacentPoint, puzzleInput)) {
                continue;
            }
            pathsToExplore.push([...pathToExplore, adjacentPoint]);
        }
    }

    if (stepsToWin === null) {
        throw new Error(
            `Unable to find a path from ${start} to ${goal} with puzzle input ${puzzleInput}`,
        );
    }

    return stepsToWin;
}

export function execute(
    puzzleInput: number,
    start: Point = [1, 1],
    goal: Point = [31, 39],
): number {
    return findShortestSteps(puzzleInput, start, goal);
}
