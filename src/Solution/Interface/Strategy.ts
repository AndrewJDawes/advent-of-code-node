interface Strategy {
    execute(): Promise<string>;
}

export default Strategy;
