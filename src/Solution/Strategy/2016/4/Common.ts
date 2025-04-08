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
