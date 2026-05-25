/*
--- Day 12: Leonardo da Vinci's Laboratory ---
You have the physical version of this problem, so you don't need to solve it.

However, for completeness, the puzzle is a register-based computer with instructions
cpy, inc, dec, and jnz. After executing the program, return the value in register a.
*/

type Registers = Map<string, number>;

export type ExecutionContext = {
    registers: Registers;
    programCounter: number;
};

function isLiteral(arg: string): boolean {
    return /^-?\d+$/.test(arg);
}

function getRegisterValue(registers: Registers, name: string): number {
    return registers.get(name) ?? 0;
}

function ensureRegister(registers: Registers, name: string): void {
    if (!registers.has(name)) {
        registers.set(name, 0);
    }
}

function getLiteralIntegerOrExistingRegisterValue(
    registers: Registers,
    arg: string,
    defaultValue: number = 0,
): number {
    if (isLiteral(arg)) {
        return parseInt(arg, 10);
    }
    if (!registers.has(arg)) {
        registers.set(arg, defaultValue);
    }
    return getRegisterValue(registers, arg);
}

function inc(registers: Registers, args: string[]): void {
    const x = args[0];
    ensureRegister(registers, x);
    registers.set(x, getRegisterValue(registers, x) + 1);
}

function dec(registers: Registers, args: string[]): void {
    const x = args[0];
    ensureRegister(registers, x);
    registers.set(x, getRegisterValue(registers, x) - 1);
}

function cpy(registers: Registers, args: string[]): void {
    const [x, y] = args;
    let newValue: number;
    newValue = getLiteralIntegerOrExistingRegisterValue(registers, x);
    registers.set(y, newValue);
}

export function jnz(
    registers: Registers,
    args: string[],
    context: ExecutionContext,
): void {
    const [x, y] = args;
    const xValue = getLiteralIntegerOrExistingRegisterValue(registers, x);
    if (xValue === 0) {
        return;
    }
    if (!isLiteral(y)) {
        throw new Error(`Jump offset must be an integer, got ${y}`);
    }
    const offset = parseInt(y, 10);
    context.programCounter = context.programCounter + offset - 1;
}

const instructionHandlers: Record<
    string,
    (registers: Registers, args: string[], context: ExecutionContext) => void
> = {
    inc: (registers, args) => inc(registers, args),
    dec: (registers, args) => dec(registers, args),
    cpy: (registers, args) => cpy(registers, args),
    jnz: (registers, args, context) => jnz(registers, args, context),
};

export function execute(
    instructions: string[],
    registers: Registers = new Map(),
): number {
    let programCounter = 0;

    while (programCounter < instructions.length) {
        const command = instructions[programCounter];
        const parts = command.split(' ');
        const instruction = parts[0];
        const args = parts.slice(1);
        const handler = instructionHandlers[instruction];
        if (!handler) {
            throw new Error(`Unknown instruction: ${instruction}`);
        }
        const context: ExecutionContext = { registers, programCounter };
        handler(registers, args, context);
        programCounter = context.programCounter + 1;
    }

    return getRegisterValue(registers, 'a');
}
