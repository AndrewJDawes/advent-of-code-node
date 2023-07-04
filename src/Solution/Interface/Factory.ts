import Strategy from "./Strategy.js";
("../Interface/Strategy.js");

interface Factory {
    create(year: string, day: string): Strategy;
}

export default Factory;
