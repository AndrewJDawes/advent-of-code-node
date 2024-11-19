interface Config {
    year: string;
    day: string;
    part: string;
    dataType: 'url' | 'file' | 'array';
    dataSource: string | Array<string>;
}
export default Config;
