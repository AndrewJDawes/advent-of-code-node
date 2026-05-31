export function pointIsWall(
    x: number,
    y: number,
    puzzleInput: number,
): boolean {
    const value = layoutLogic(x, y, puzzleInput);
    return isOddNumber(countOf1Bits(value.toString()));
}

export function countOf1Bits(n: string): number {
    return n.split('').filter((bit) => bit === '1').length;
}

export function isOddNumber(n: number): boolean {
    return n % 2 === 1;
}

export function layoutLogic(x: number, y: number, puzzleInput: number): number {
    const value = x * x + 3 * x + 2 * x * y + y + y * y + puzzleInput;
    return value;
}
