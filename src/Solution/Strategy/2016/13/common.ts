export type Point = [number, number];
export type Path = Point[];

export function pointIsWall([x, y]: Point, puzzleInput: number): boolean {
    const value = layoutLogic([x, y], puzzleInput);
    return isOddNumber(countOf1Bits(value.toString()));
}

export function pointIsWallMemoized(
    [x, y]: Point,
    puzzleInput: number,
): boolean {
    const cache: Record<string, boolean> = {};
    const key = `${x},${y},${puzzleInput}`;
    if (cache[key] !== undefined) {
        return cache[key];
    }
    const result = pointIsWall([x, y], puzzleInput);
    cache[key] = result;
    return result;
}

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

export function pointToMapKey([x, y]: Point): string {
    return `${x},${y}`;
}

export function pointInPath(point: Point, path: Path): boolean {
    return path.some(([px, py]) => px === point[0] && py === point[1]);
}

export function pointOutOfBounds([x, y]: Point): boolean {
    return x < 0 || y < 0;
}

export function pathIsShortestKnownPathToPoint(
    point: Point,
    path: Path,
): boolean {
    return true; // Placeholder for actual implementation
}
