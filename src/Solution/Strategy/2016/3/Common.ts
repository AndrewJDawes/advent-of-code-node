export function sideLengthsAreValid(sideLengths: number[]) {
    let possible = true;
    for (let index = 0; index < sideLengths.length; index++) {
        const val = sideLengths[index];
        if (
            val >=
            [
                ...sideLengths.slice(0, index),
                ...sideLengths.slice(index + 1),
            ].reduce((summed, toSum) => summed + toSum, 0)
        ) {
            possible = false;
            break;
        }
    }
    return possible;
}
