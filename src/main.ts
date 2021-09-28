"use strict"

import fs = require("fs");
import { cwd } from 'process';


import temp = require("temp");
temp.track();

import path = require("path");

import saxes = require("saxes");

import stream = require("stream");

import readline = require('readline');

import { once, EventEmitter} from 'events';
import { parse } from "path/posix";
import { start } from "repl";
import assert = require("assert");
import { AssertionError } from "assert/strict";

type Query = fs.PathLike



class doc extends saxes.SaxesParser {
  Path: fs.PathLike
  writeStream: fs.WriteStream
  basePath: fs.PathLike
  classEmitter: EventEmitter
  constructor(Path = filePath) {
    super()
    this.classEmitter = new EventEmitter()
    this.Path = filePath
    this.basePath = path.basename(filePath)
    this.Path = cwd() + `/output/${this.basePath}`
    try{
      let a = fs.mkdirSync(this.Path, {recursive: true});
      assert((typeof a !== undefined))
    }
    catch (err) {
      console.error("could not create folder", 404)
      process.exit
    }
    this.writeStream = temp.createWriteStream()
    this.on('end', () => this.classEmitter.emit('end'))
    this.on('ready', () => this.classEmitter.emit('ready'))
    this.classEmitter.on('finish', () => this.finish())
  }
  public set queryPath(query: string) {
    this.queryPath = query
  }
  private finish() {
    if (this.queryPath == null) {
      console.error('malformed blast xml', 400)
      process.exit()
    }
    this.writeStream.end( () => {
      fs.copyFileSync(this.writeStream.path, cwd() + this.Path + this.queryPath + '.xml')
      this.close()
    }
    )
  }
  
}





const { argv } = process;

const filePath = argv[2];
try {
assert((typeof filePath === "string"))
if ((fs.existsSync(cwd() + filePath) || fs.existsSync(filePath) == false)) {
  throw new Error("does not exist");
  

}
}
catch (err) {
console.error("could not find input", 404)
process.exit
}
const basePath = path.basename(filePath);





async function processLineByLine() {
  try {
    var parser = new doc;
    var currentPipe = new stream.Duplex
    parser.on("opentag", function fx<TagForOptions> (tag: saxes.SaxesTag) {
      if (tag.name == "BlastOutput_query-def"  && typeof tag.attributes.value == "string") {
        parser.queryPath = (tag.attributes.value)
      }});
    
    parser.on("closetag", function fx<TagForOptions> (tag: saxes.SaxesTag) {
       if (tag.name == "BlastOutput" ) {
        parser.close()
    }});
    
    parser.on("error", function(e) {console.log(e)});
    
    

    const xmlrl = readline.createInterface({
      input: fs.createReadStream(filePath, "utf8"),
      output: currentPipe,
      crlfDelay: 100,
      terminal: false,

    });
    xmlrl.on('line', (line) => {
      let lineMod = line + '\u000A'
      if (line.startsWith('<?xml') == true) {
      once(parser.classEmitter, 'end').then( function fx(){
        once(parser.writeStream, "ready").then( function fx(){
        currentPipe.unpipe
        parser = new doc
        currentPipe.pipe(parser.writeStream)
        })
      })
    }
      
      
     
      parser.write(lineMod)
      xmlrl.write(lineMod)


    })


    await once(xmlrl, 'close');
    console.log('File processed.');
  
  } catch (err) {
    console.error(err);
  }  
}

processLineByLine()