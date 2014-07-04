#!/usr/bin/env node
(function() {
  var err, filename, fs, outputjsonfile, program, sheetname, xls2json;

  fs = require('fs');

  program = require('commander');

  xls2json = require('./xls2json');

  program.usage('[options] <file> <sheetname> <outputjsonfile>').option('-f, --file <file>', 'workbook file').option('-s, --sheet <sheet>', 'sheet anme').option('-o, --output <file>', 'out put json');

  program.parse(process.argv);

  filename = program.file;

  sheetname = program.sheet;

  outputjsonfile = program.output;

  if (!(filename && sheetname && outputjsonfile)) {
    filename = program.args[0];
    sheetname = program.args[1];
    outputjsonfile = program.args[2];
  }

  if (!(filename && sheetname && outputjsonfile)) {
    console.error("args not right:filename:" + filename + ",sheetname:" + sheetname + ",output:" + outputjsonfile);
    process.exit(1);
  }

  if (!fs.existsSync(filename)) {
    console.error(n + ": " + filename + ": No such file or directory");
    process.exit(2);
  }

  try {
    xls2json.make_dynamic_json(filename, sheetname, outputjsonfile);
  } catch (_error) {
    err = _error;
    console.error(err);
    process.exit(3);
  }

}).call(this);
