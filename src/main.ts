"use strict"

import fs = require("fs");

import path = require("path");

import saxes = require("saxes");

import readline = require('readline');

import { once, EventEmitter } from 'events';

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
      parser.write(line)

    });

    await once(xmlrl, 'close');
    {console.log('File processed.')};
  }
    catch (err) {
    console.error(err);
  
}
  })();


parser.on("closetag", function fx<TagForOptions> (tag: saxes.SaxesTag) {
   if (tag.name == "BlastOutput" ) {
   Promise.resolve(tag.name)
}});

parser.on("error", function(e) {console.log(e)});
