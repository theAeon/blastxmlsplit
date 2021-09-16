"use strict"

import fs = require("fs");

import path = require("path");

import saxes = require("saxes");

import stream = require("stream");

import readline = require('readline');

import { once, EventEmitter, errorMonitor } from 'events';
import { parse } from "path/posix";
import { start } from "repl";

type query = string | null;



class doc extends saxes.SaxesParser {
  Path: fs.PathOrFileDescriptor
  writeStream: fs.WriteStream
  queryPath: query
  basePath: fs.PathOrFileDescriptor
  classEmitter: EventEmitter
  done: boolean
  constructor(Path = filePath) {
    super()
    this.classEmitter = new EventEmitter()
    this.queryPath = null
    let z = this.setQuery.bind(this)
    this.classEmitter.on('start', function f(arg1: string) {return z(arg1)} )
    let x = this.start.bind(this)
    this.classEmitter.on('start', function f() {return x()} )
    this.Path = filePath
    this.basePath =path.basename(filePath)
    fs.mkdir("./output", {recursive: true}, (err) => {console.trace(); process.exit(1)});
    fs.mkdir(`output/"${this.basePath}`, {recursive: true}, (err) => {console.trace(); process.exit(1)});
    this.writeStream = fs.createWriteStream(basePath + "tmp")
    let y = this.finish.bind(this)
    this.classEmitter.on('finish', function f() {return y()} )
    this.done = true
  }
  private setQuery(query: string) {
    this.queryPath = query
  }
  private start() {

    this.done = false
    
  }
  private finish() {
  /* wait for writestream to close, move file to query, kill close parse stream, die w signal 
  */
  }
}





const { argv } = process;

const filePath = argv[2];

const basePath = path.basename(filePath);





(async function processLineByLine() {
  try {
    var parser = new doc;
    var currentPipe = new stream.Duplex
    parser.on("opentag", function fx<TagForOptions> (tag: saxes.SaxesTag) {
      if (tag.name == "BlastOutput_query-def" ) {
        parser.classEmitter.emit("query", tag.attributes.value)
    }});
    
    parser.on("closetag", function fx<TagForOptions> (tag: saxes.SaxesTag) {
       if (tag.name == "BlastOutput" ) {
       parser.classEmitter.emit("finish")
    }});
    
    parser.on("error", function(e) {console.log(e)});
    
    

    const xmlrl = readline.createInterface({
      input: fs.createReadStream(filePath, "utf8"),
      output: currentPipe,
      crlfDelay: Infinity
    });

    xmlrl.on('line', (line) => {
      if (line.startsWith('<?xml') == true) {
      while (parser.done == false) {}
      currentPipe.unpipe
      parser = new doc
      currentPipe.pipe(parser.writeStream)
      }
      parser.write(line)
      xmlrl.write(line)


    });

    await once(xmlrl, 'close');
    console.log('File processed.');
  
  } catch (err) {
    console.error(err);
  
}});


