#test case
#
#
#

should = require "should"
xls2json = require "./xls2json"



describe "xls should been converted",->

  it "should success",(done)->
    json = xls2json.make_dynamic_json("bookshop.xlsx","category")
    console.log "==================="
    console.dir json
    json.should.be.json
    done()
