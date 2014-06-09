#!/usr/bin/env node
#

fs = require 'fs'

program = require 'commander'

xls2json = require './xls2json'


program
  .usage('[options] <file> <sheetname> <outputjsonfile>')
  .option('-f, --file <file>','workbook file')
  .option('-s, --sheet <sheet>','sheet anme')
  .option('-o, --output <file>','out put json')


program.parse(process.argv)

filename = program.file
sheetname = program.sheet
outputjsonfile = program.output

unless filename and sheetname and outputjsonfile
  filename = program.args[0]
  sheetname= program.args[1]
  outputjsonfile= program.args[2]

unless filename and sheetname and outputjsonfile
  console.error "args not right:filename:#{filename},sheetname:#{sheetname},output:#{outputjsonfile}"
  process.exit(1)


unless fs.existsSync(filename)
	console.error(n + ": " + filename + ": No such file or directory")
	process.exit(2)


try
  xls2json.make_dynamic_json(filename,sheetname,outputjsonfile)
catch err
  console.error err
  process.exit(3)
