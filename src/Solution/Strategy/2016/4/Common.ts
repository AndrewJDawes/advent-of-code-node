export function parseRoomInputParts(line: string) {
    const lineTrimmed = line.trim();
    const expressionFull = /^([\w-]+)-(\d+)\[(\w{5})\]$/;
    const matchResults = expressionFull.exec(lineTrimmed);
    if (null === matchResults) {
        throw new Error(`Invalid input: ${line}`);
    }
    const [match, room, sector, checksum] = [...matchResults];
    return {
        room,
        sector,
        checksum,
    };
}
export function sanitizeRoom(room: string) {
    return room.replace(/[^A-Za-z]/g, '');
}
export function countCharacterOccurrences(input: string) {
    const counters = new Map<string, number>();
    Array.from(input).forEach((char) => {
        const currentCount = counters.get(char);
        if (undefined === currentCount) {
            counters.set(char, 1);
        } else {
            counters.set(char, currentCount + 1);
        }
    });
    return counters;
}
export function sortCharNumberMapDesc(input: Map<string, number>) {
    return Array.from(input).sort((a, b) => {
        if (a[1] === b[1]) {
            // Chars ascending
            return a[0].localeCompare(b[0]);
        }
        // Nums descending
        return b[1] - a[1];
    });
}
export function rotateLetterCaseInsensitive(letter: string, rotation: number) {
    if (!/^[A-Za-z]$/.test(letter)) {
        throw new Error(`Input is not a letter: ${letter}`);
    }
    const lowerCase = letter.toLowerCase();
    const isLower = letter === lowerCase;
    const lowerBound = 'a'.charCodeAt(0);
    const upperBound = 'z'.charCodeAt(0);
    const range = upperBound - lowerBound + 1;
    const currentCharCode = lowerCase.charCodeAt(0);
    const normalizedCurrentCharCode = currentCharCode - lowerBound;
    const rotated =
        (((normalizedCurrentCharCode + rotation) % range) + range) % range;
    const result = String.fromCharCode(rotated + lowerBound);
    return isLower ? result : result.toUpperCase();
}
