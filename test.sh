#!/bin/bash
coffee -o . src/xls2json.coffee
./x2j.njs bookshop.xls category category.json

#npm publish
