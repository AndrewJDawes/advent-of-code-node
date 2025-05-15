import {
    Controller,
    CommandParser as CommandParserInterface,
} from '../Interfaces.js';
export default class CommandParser<T, B>
    implements CommandParserInterface<T, B>
{
    private controller: Controller<T, B>;
    constructor(controller: Controller<T, B>) {
        this.controller = controller;
    }
    public execute(commandString: string, char: T) {
        const commandArray = commandString
            .split(/\s+/)
            .filter((word) => word !== '');
        const command = commandArray.shift();
        switch (command) {
            case 'rect': {
                const dimensions = commandArray.shift();
                if (dimensions === undefined) {
                    throw new Error(
                        `Command rect requires dimensions. Received: ${dimensions}. commandString: ${commandString}`
                    );
                }
                const dimensionsArray = dimensions.split('x');
                if (dimensionsArray.length !== 2) {
                    throw new Error(
                        `Command rect requires dimensions in format XxY. Received: ${dimensions}. commandString: ${commandString}`
                    );
                }
                const width = parseInt(dimensionsArray[0]);
                if (isNaN(width)) {
                    throw new Error(
                        `Command rect requires numeric dimensions in format XxY. Received: ${dimensions}. commandString: ${commandString}`
                    );
                }
                const height = parseInt(dimensionsArray[1]);
                if (isNaN(height)) {
                    throw new Error(
                        `Command rect requires numeric dimensions in format XxY. Received: ${dimensions}. commandString: ${commandString}`
                    );
                }
                this.controller.rect(0, 0, width, height, char);
                break;
            }
            case 'rotate': {
                const dimension = commandArray.shift();
                if (
                    undefined === dimension ||
                    !['row', 'column'].includes(dimension)
                ) {
                    throw new Error(
                        `Command rotate requires indicator of dimension row or column. Received: ${commandString}`
                    );
                }
                const planeIndicator = commandArray.shift();
                if (undefined === planeIndicator) {
                    throw new Error(
                        `Command rotate requires plane indicator in format x|y=n. Received: ${commandString}`
                    );
                }
                const planeArray = planeIndicator.split('=');
                const planeArrayPlane = planeArray[0];
                const planeArrayIndex = parseInt(planeArray[1]);
                if (isNaN(planeArrayIndex)) {
                    throw new Error(
                        `Command rotate requires numeric plane index indicator in format x|y=n. Received: ${commandString}`
                    );
                }
                const byThrowaway = commandArray.shift();
                const degree = commandArray.shift();
                if (undefined === degree) {
                    throw new Error(
                        `Command rotate requires degree. Received ${commandString}`
                    );
                }
                const degreeNumeric = parseInt(degree);
                if (isNaN(degreeNumeric)) {
                    throw new Error(
                        `Command rotate requires numeric degree. Received ${commandString}`
                    );
                }
                switch (dimension) {
                    case 'row': {
                        this.controller.rotateRow(
                            planeArrayIndex,
                            degreeNumeric
                        );
                        break;
                    }
                    case 'column': {
                        this.controller.rotateColumn(
                            planeArrayIndex,
                            degreeNumeric
                        );
                        break;
                    }
                    default: {
                        throw new Error(
                            `Command rotate requires dimension to be row or column. Received: ${commandString}`
                        );
                        break;
                    }
                }
                break;
            }
            default: {
                throw new Error(
                    `Unknown command: ${command}. commandString: ${commandString}`
                );
                break;
            }
        }
    }
}
