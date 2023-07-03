import fs from "fs";

fs.stat("src/index.ts", (err, stats) => {
    if (err) {
        console.log(err);
        return;
        // test
        // test
    }
    console.log("testing");
    console.log(stats);
});
