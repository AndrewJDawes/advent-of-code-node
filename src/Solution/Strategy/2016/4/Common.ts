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
