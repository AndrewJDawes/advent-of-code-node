import { Direction } from '../../../../Library/Grid/Interfaces.js';

export function directionCharacterToDirection(directionString: string) {
    if (!(directionString in Direction)) {
        throw Error(`Invalid direction: ${directionString}`);
    }
    return Direction[directionString as keyof typeof Direction];
}
