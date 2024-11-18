import SolutionFactory from './Solution/Factory/FromConfig.js';
import InputFetcherFactory from './InputFetcher/Factory/Default.js';
import Config from './Solution/Interface/Config.js';
let data = '';

const solutionFactory = new SolutionFactory(new InputFetcherFactory());

async function processInput(configs: Config[]) {
    process.stdout.write('[');
    for (let i = 0; i < configs.length; i++) {
        const config = configs[i];
        const { year, day, dataType, dataSource } = config;
        const solution = solutionFactory.create(config);
        const result = await solution.solve();
        process.stdout.write(
            JSON.stringify({
                year,
                day,
                dataType,
                dataSource,
                result,
            })
        );
        if (i < configs.length - 1) {
            process.stdout.write(',');
        }
    }
    process.stdout.write(']');
}

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
    }
});

process.stdin.on('end', () => {
    try {
        const input = JSON.parse(data);
        if (Array.isArray(input)) {
            processInput(input);
        } else {
            processInput([input]);
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
