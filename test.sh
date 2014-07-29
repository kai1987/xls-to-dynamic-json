#!/bin/bash
coffee -o . src/xls2json.coffee
./x2j.njs bookshop.xlsx category category.json

#npm publish
