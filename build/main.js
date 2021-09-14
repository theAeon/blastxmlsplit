"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const saxes = require("saxes");
const readline = require("readline");
let parser = new saxes.SaxesParser();
const { argv } = process;
const filePath = argv[2];
(async function processLineByLine() {
    try {
        const xmlrl = readline.createInterface({
            input: fs.createReadStream(filePath, "utf8"),
            crlfDelay: Infinity
        });
        xmlrl.on('line', (line) => {
            parser.write(line);
        });
        await new Promise((resolve) => { console.log('File processed.'); });
    }
    catch (err) {
        console.error(err);
    }
})();
parser.on("closetag", function fx(tag) {
    if (tag.name == "baBlastOutput") {
        Promise.resolve(tag.name);
    }
});
parser.on("error", function (e) { console.log(e); });
parser.on("closetag", function (ct) {
    if (ct.name == "BlastOutput") {
        console.log("match");
        parser.close();
    }
});
